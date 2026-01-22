/**
 * Roverfox Client - Main entry point
 * Connects to distributed Roverfox servers via manager
 */

import { Browser, BrowserContext } from "playwright";
import { SupabaseClient } from "@supabase/supabase-js";
import WebSocket from "ws";
import { v4 as uuidv4 } from "uuid";
import { RoverFoxProfileData, RoverfoxProxyObject } from "./types";
import { logActionAudit } from "./audit-logger";
import { ConnectionPool } from "./connection-pool";
import { ManagerClient } from "./manager-client";
import { ReplayManager } from "./replay-manager";
import { StorageManager } from "./storage-manager";
import { DataUsageTracker } from "./data-usage-tracker";
import { formatProxyURL } from "./utils";

export class RoverfoxClient {
  private supabaseClient: SupabaseClient;
  private connectionPool: ConnectionPool;
  private managerClient: ManagerClient;
  private replayManager: ReplayManager;
  private storageManager: StorageManager;
  private dataUsageTrackers: Map<string, DataUsageTracker>;
  private debug: boolean;

  constructor(
    supabaseClient: SupabaseClient,
    wsAPIKey: string,
    managerUrl?: string,
    debug: boolean = false,
  ) {
    this.supabaseClient = supabaseClient;
    this.debug = debug;

    this.connectionPool = new ConnectionPool(wsAPIKey, debug);
    this.managerClient = new ManagerClient(managerUrl, debug);
    this.replayManager = new ReplayManager(debug);
    this.storageManager = new StorageManager(supabaseClient);
    this.dataUsageTrackers = new Map();

    // Set up streaming message handler
    this.connectionPool.setStreamingMessageHandler((message) => {
      this.replayManager.handleStreamingControlMessage(message);
    });
  }

  /**
   * Launch a browser profile - gets server assignment from manager
   */
  async launchProfile(browserId: string): Promise<BrowserContext> {
    // Get server assignment from manager
    const assignment = await this.managerClient.getServerAssignment();
    const { roverfoxWsUrl, replayWsUrl } = assignment;

    // Get or create browser connection (reuses if already connected)
    const browser =
      await this.connectionPool.getBrowserConnection(roverfoxWsUrl);

    // Get or create replay WebSocket (reuses if already connected)
    const replayWs = this.connectionPool.getReplayWebSocket(replayWsUrl);

    // Fetch profile data from Supabase
    const { data: profile } = await this.supabaseClient
      .from("redrover_profile_data")
      .select("*")
      .eq("browser_id", browserId)
      .single();

    if (!profile) {
      throw new Error("Profile not found");
    }

    // Fetch proxy data if needed
    const { data: proxyId } = await this.supabaseClient
      .from("accounts")
      .select("proxyId")
      .eq("browserId", browserId);

    let proxyObject: RoverfoxProxyObject = null;
    if (proxyId) {
      const { data: proxyData } = await this.supabaseClient
        .from("proxies")
        .select("entry, port, username, password")
        .eq("id", proxyId?.[0]?.proxyId)
        .single();

      if (proxyData) {
        const { entry, port, username, password } = proxyData;
        proxyObject = {
          server: `${entry}:${port}`,
          username,
          password,
        };
      }
    }

    // Create browser context with profile data
    return this.launchInstance(
      browser,
      replayWs,
      profile,
      proxyObject,
      browserId,
    );
  }

  /**
   * Launch a one-time browser without profile
   */
  async launchOneTimeBrowser(proxyUrl: string | null): Promise<BrowserContext> {
    // Get server assignment from manager
    const assignment = await this.managerClient.getServerAssignment();
    const { roverfoxWsUrl, replayWsUrl } = assignment;

    // Get or create connections
    const browser =
      await this.connectionPool.getBrowserConnection(roverfoxWsUrl);
    const replayWs = this.connectionPool.getReplayWebSocket(replayWsUrl);

    const proxyObject = proxyUrl ? formatProxyURL(proxyUrl) : null;
    const browserId = uuidv4();

    return this.launchInstance(
      browser,
      replayWs,
      {
        browser_id: browserId,
        data: {
          fontSpacingSeed: Math.floor(Math.random() * 100000000),
          storageState: {
            cookies: [],
            origins: [],
          },
          proxyUrl: proxyUrl,
        },
      },
      proxyObject,
      browserId,
      true, // skipAudit
    );
  }

  /**
   * Internal method to launch instance with profile data
   */
  private async launchInstance(
    browser: Browser,
    replayWs: WebSocket,
    profile: RoverFoxProfileData,
    proxyObject: RoverfoxProxyObject,
    browserId: string,
    skipAudit: boolean = false,
  ): Promise<BrowserContext> {
    // Strip IndexedDB from storage state to prevent restoration conflicts
    let storageStateToUse = profile.data.storageState;
    if (
      storageStateToUse &&
      typeof storageStateToUse === "object" &&
      Array.isArray(storageStateToUse.origins)
    ) {
      storageStateToUse = {
        ...storageStateToUse,
        origins: storageStateToUse.origins.map((origin: any) => ({
          ...origin,
          indexedDB: [],
        })),
      };
    }

    // Create browser context
    const context = await browser.newContext({
      ...(storageStateToUse ? { storageState: storageStateToUse } : {}),
      bypassCSP: true,
      ...(proxyObject
        ? {
            proxy: {
              server: proxyObject.server,
              username: proxyObject.username,
              password: proxyObject.password,
            },
          }
        : {}),
    });

    // Register profile with replay hub
    try {
      await this.connectionPool.safeSend(replayWs, {
        type: "register-profile",
        uuid: browserId,
      });
    } catch (error) {
      // Continue execution as this is not critical
    }

    if (!skipAudit)
      logActionAudit(this.supabaseClient, browserId, "openContext", {});

    // Initialize data usage tracker for this context
    const dataUsageTracker = new DataUsageTracker(browserId, this.debug);
    this.dataUsageTrackers.set(browserId, dataUsageTracker);

    // Set up page event handlers for replay
    context.on("page", async (page) => {
      await this.storageManager.setFingerprintingProperties(page, profile);

      const pageId = uuidv4();
      await this.replayManager.enableLiveReplay(
        page,
        pageId,
        browserId,
        replayWs,
        this.connectionPool,
      );

      this.storageManager.initStorageSaver(page, profile);

      // Attach data usage tracking to this page
      dataUsageTracker.attachToPage(page);

      page.on("close", () => {
        this.storageManager.saveStorage(page, profile);
      });
    });

    // Wrap context.close to clean up replay resources
    const closeContext = context.close.bind(context);
    context.close = async () => {
      if (!skipAudit)
        await logActionAudit(
          this.supabaseClient,
          browserId,
          "closeContext",
          {},
        );

      // Save data usage to database
      const tracker = this.dataUsageTrackers.get(browserId);
      if (tracker) {
        const usageData = tracker.getUsageData();
        try {
          const { error } = await this.supabaseClient
            .from("data_usage")
            .insert({
              browserId: usageData.browserId,
              start: usageData.timeStart,
              end: usageData.timeEnd,
              bytes: usageData.bytes,
            });

          if (error) {
            console.error("Failed to save data usage:", error);
          }
        } catch (error) {
          if (this.debug) {
            console.error("Failed to save data usage:", error);
          }
        }
        // Clean up tracker
        this.dataUsageTrackers.delete(browserId);
      }

      // Clean up streaming state
      this.replayManager.cleanup(browserId);

      // Send unregister message to replay hub
      try {
        await this.connectionPool.safeSend(replayWs, {
          type: "unregister-profile",
          uuid: browserId,
        });
      } catch (error) {
        // Silently ignore unregister errors
      }

      // Close the WebSocket specific to this browserId
      try {
        await this.replayManager.closeWebSocketForBrowser(browserId);
      } catch (error) {
        // Silently ignore close errors
      }

      await closeContext();

      // Close browser if no more contexts
      if (browser.contexts().length === 0) {
        browser.close();
      }
    };

    return context;
  }

  /**
   * Creates a new profile
   */
  async createProfile(
    proxyUrl: string,
    proxyState: string | null,
  ): Promise<RoverFoxProfileData> {
    let browserId = uuidv4();
    let profile: RoverFoxProfileData = {
      browser_id: browserId,
      data: {
        fontSpacingSeed: Math.floor(Math.random() * 100000000),
        storageState: {
          cookies: [],
          origins: [],
        },
        proxyUrl: proxyUrl,
      },
    };

    await this.supabaseClient.from("accounts").insert({
      browserId: browserId,
      platform: "roverfox",
      proxyState: proxyState,
    });

    await this.supabaseClient.from("redrover_profile_data").insert(profile);

    return profile;
  }

  /**
   * Deletes a profile
   */
  async deleteProfile(browserId: string): Promise<void> {
    await this.supabaseClient
      .from("accounts")
      .delete()
      .eq("browserId", browserId);
    await this.supabaseClient
      .from("redrover_profile_data")
      .delete()
      .eq("browser_id", browserId);
  }
}

export { RoverfoxClient as default };
