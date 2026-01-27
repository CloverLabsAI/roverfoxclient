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
import { IPGeolocationService, ProxyConfig } from "./ip-geolocation";

export class RoverfoxClient {
  private supabaseClient: SupabaseClient;
  private connectionPool: ConnectionPool;
  private managerClient: ManagerClient;
  private replayManager: ReplayManager;
  private storageManager: StorageManager;
  private dataUsageTrackers: Map<string, DataUsageTracker>;
  private geoService: IPGeolocationService;
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
    this.geoService = new IPGeolocationService();

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

    // Fetch proxy data from database
    const { data: proxyId } = await this.supabaseClient
      .from("accounts")
      .select("proxyId")
      .eq("browserId", browserId);

    let proxyObject: RoverfoxProxyObject = null;
    let proxyConfig: ProxyConfig | null = null;

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
        proxyConfig = { host: entry, port, username, password };
      }
    }

    // Get current exit IP and check if geolocation needs updating
    // This handles both hostname proxies (gw.dataimpulse.com) and IP rotation
    if (proxyConfig) {
      const { changed, currentIP } = await this.geoService.hasIPChanged(
        proxyConfig,
        profile.data.lastKnownIP || null,
      );

      if (currentIP && (changed || !profile.data.timezone)) {
        const geoData = await this.geoService.lookup(currentIP);
        if (geoData) {
          profile.data.timezone = geoData.timezone;
          profile.data.geolocation = { lat: geoData.lat, lon: geoData.lon };
          profile.data.countryCode = geoData.countryCode;
          profile.data.lastKnownIP = currentIP;

          // Persist to database
          await this.supabaseClient
            .from("redrover_profile_data")
            .update({ data: profile.data })
            .eq("browser_id", browserId);

          if (this.debug) {
            if (changed) {
              console.log(
                `IP changed for ${browserId}: ${profile.data.lastKnownIP} -> ${currentIP}, updated geolocation to ${geoData.timezone}`,
              );
            } else {
              console.log(
                `Geolocation set for ${browserId}: ${geoData.timezone}`,
              );
            }
          }
        }
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
    proxyId: number,
    proxyState: string | null = null,
  ): Promise<RoverFoxProfileData> {
    const browserId = uuidv4();
    const profile: RoverFoxProfileData = {
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

    // Get proxy credentials to lookup geolocation via actual exit IP
    const { data: proxyData } = await this.supabaseClient
      .from("proxies")
      .select("entry, port, username, password")
      .eq("id", proxyId)
      .single();

    if (proxyData) {
      const proxyConfig: ProxyConfig = {
        host: proxyData.entry,
        port: proxyData.port,
        username: proxyData.username,
        password: proxyData.password,
      };

      // Get real exit IP through the proxy
      const result = await this.geoService.lookupThroughProxy(proxyConfig);
      if (result) {
        profile.data.timezone = result.geo.timezone;
        profile.data.geolocation = { lat: result.geo.lat, lon: result.geo.lon };
        profile.data.countryCode = result.geo.countryCode;
        profile.data.lastKnownIP = result.ip;

        if (this.debug) {
          console.log(
            `Profile ${browserId} created with IP ${result.ip}, timezone ${result.geo.timezone}`,
          );
        }
      }
    }

    await this.supabaseClient.from("accounts").insert({
      browserId: browserId,
      platform: "roverfox",
      proxyId: proxyId,
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
