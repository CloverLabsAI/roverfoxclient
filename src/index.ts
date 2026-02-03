/**
 * Roverfox Client - Main entry point
 * Connects to distributed Roverfox servers via manager
 */

import * as http from "http";
import * as net from "net";
import { Browser, BrowserContext } from "playwright";
import { v4 as uuidv4 } from "uuid";
import WebSocket from "ws";

import { ConnectionPool } from "./connection-pool.js";
import { DataUsageTracker } from "./data-usage-tracker.js";
import { IPGeolocationService, ProxyConfig } from "./ip-geolocation.js";
import { ManagerClient } from "./manager-client.js";
import { ReplayManager } from "./replay-manager.js";
import { StorageManager } from "./storage-manager.js";
import type { RoverfoxProxyObject } from "./types.js";
import type { RoverFoxProfileData } from "./types/client.js";
import { logDataUsage } from "./utils/betterstack-logger.js";
import { formatProxyURL } from "./utils/proxies.js";
import type { ServerConfig } from "./worker/auth.js";
import { RoverFoxProxyServer } from "./worker/index.js";

// macOS-compatible screen resolutions for realistic fingerprinting
const COMMON_SCREEN_RESOLUTIONS = [
  { width: 1920, height: 1080 }, // External monitor (very common)
  { width: 1440, height: 900 }, // 15" MacBook Pro default
  { width: 2560, height: 1440 }, // External monitor QHD
  { width: 1680, height: 1050 }, // Older MacBook Pro
  { width: 2560, height: 1600 }, // 16" MacBook Pro
  { width: 3024, height: 1964 }, // 14" MacBook Pro
  { width: 2880, height: 1800 }, // 15" Retina MacBook Pro
];

function generateScreenDimensions(): {
  width: number;
  height: number;
  colorDepth: number;
} {
  const resolution =
    COMMON_SCREEN_RESOLUTIONS[
      Math.floor(Math.random() * COMMON_SCREEN_RESOLUTIONS.length)
    ];
  return {
    width: resolution.width,
    height: resolution.height,
    colorDepth: 24,
  };
}

export class RoverfoxClient {
  private connectionPool: ConnectionPool;
  private managerClient: ManagerClient;
  private replayManager: ReplayManager;
  private storageManager: StorageManager;
  private dataUsageTrackers: Map<string, DataUsageTracker>;
  private geoService: IPGeolocationService;
  private debug: boolean;

  // Local server management
  private static localServer: RoverFoxProxyServer | null = null;
  private static localServerConfig: {
    roverfoxWsUrl: string;
    replayWsUrl: string;
  } | null = null;
  private static localPort: number = 9001;

  constructor(
    _supabase: unknown,
    wsAPIKey: string,
    managerUrl?: string,
    debug: boolean = false,
  ) {
    this.debug = debug;
    this.connectionPool = new ConnectionPool(wsAPIKey, debug);
    this.managerClient = new ManagerClient(managerUrl, debug);
    this.replayManager = new ReplayManager();
    this.storageManager = new StorageManager(this.managerClient);
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

    // Fetch profile and proxy data from Manager API
    const { profile, proxy: proxyObject } =
      await this.managerClient.getProfile(browserId);

    // Check if geolocation needs updating based on proxy exit IP
    if (proxyObject) {
      try {
        const serverUrl = new URL(proxyObject.server);
        const proxyConfig: ProxyConfig = {
          host: serverUrl.hostname,
          port: parseInt(serverUrl.port) || 80,
          username: proxyObject.username || undefined,
          password: proxyObject.password || undefined,
        };

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

            // Persist updated geolocation to manager
            await this.managerClient.updateProfileData(
              browserId,
              profile.data,
            );

            if (this.debug) {
              if (changed) {
                console.log(
                  `[client] IP changed for ${browserId}: ${profile.data.lastKnownIP} -> ${currentIP}, updated geolocation to ${geoData.timezone}`,
                );
              } else {
                console.log(
                  `[client] Geolocation set for ${browserId}: ${geoData.timezone}`,
                );
              }
            }
          }
        }
      } catch (_e) {
        // Non-critical: continue without geolocation update
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
          audioFingerprintSeed: Math.floor(Math.random() * 0xffffffff) + 1,
          screenDimensions: generateScreenDimensions(),
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
   * Check if a port is in use
   */
  private static async isPortInUse(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const server = net.createServer();

      server.once("error", (err: NodeJS.ErrnoException) => {
        if (err.code === "EADDRINUSE") {
          resolve(true);
        } else {
          resolve(false);
        }
      });

      server.once("listening", () => {
        server.close();
        resolve(false);
      });

      server.listen(port, "localhost");
    });
  }

  /**
   * Health check for existing server
   */
  private static async healthCheckServer(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const req = http.get(
        `http://localhost:${port}/health`,
        { timeout: 2000 },
        (res) => {
          resolve(res.statusCode === 200);
        },
      );

      req.on("error", () => {
        resolve(false);
      });

      req.on("timeout", () => {
        req.destroy();
        resolve(false);
      });
    });
  }

  /**
   * Launch a local context using on-demand local roverfox server
   * Checks if server is already running on port 9001 and connects to it,
   * or spins up a new server if not. This check happens every time.
   * Server runs persistently across multiple processes - no automatic shutdown.
   * Note: Local contexts don't use streaming/replay functionality
   * This is a static method - no client instance required
   */
  static async launchLocalContext(proxyUrl?: string): Promise<BrowserContext> {
    // Check if port is in use every time
    const portInUse = await RoverfoxClient.isPortInUse(
      RoverfoxClient.localPort,
    );

    if (portInUse) {
      // Port is in use - verify server is healthy
      const isHealthy = await RoverfoxClient.healthCheckServer(
        RoverfoxClient.localPort,
      );

      if (!isHealthy) {
        throw new Error(
          `Port ${RoverfoxClient.localPort} is occupied but server is not responding. ` +
            `Please kill the process on port ${RoverfoxClient.localPort} and try again.`,
        );
      }

      // Set up config to connect to existing healthy server
      if (!RoverfoxClient.localServerConfig) {
        RoverfoxClient.localServerConfig = {
          roverfoxWsUrl: `ws://localhost:${RoverfoxClient.localPort}/roverfox`,
          replayWsUrl: "",
        };
      }
    } else {
      // Port is free - start new server if we don't have one
      if (!RoverfoxClient.localServer) {
        await RoverfoxClient.startLocalServer();
      }
    }

    if (!RoverfoxClient.localServerConfig) {
      throw new Error("Failed to start or connect to local server");
    }

    const { roverfoxWsUrl } = RoverfoxClient.localServerConfig;

    // Create a temporary connection pool for local server (no auth needed)
    const tempConnectionPool = new ConnectionPool("", false);

    // Get or create connection to local server (no replay needed)
    const browser =
      await tempConnectionPool.getBrowserConnection(roverfoxWsUrl);

    const proxyObject = proxyUrl ? formatProxyURL(proxyUrl) : null;
    const browserId = uuidv4();

    const profile: RoverFoxProfileData = {
      browser_id: browserId,
      data: {
        fontSpacingSeed: Math.floor(Math.random() * 100000000),
        audioFingerprintSeed: Math.floor(Math.random() * 0xffffffff) + 1,
        screenDimensions: generateScreenDimensions(),
        storageState: {
          cookies: [],
          origins: [],
        },
        proxyUrl: proxyUrl || null,
      },
    };

    // Create browser context without streaming
    const context = await browser.newContext({
      bypassCSP: false,
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

    // Set up page event handlers (fingerprinting only)
    context.on("page", async (page) => {
      // Apply fingerprinting properties
      await page.mainFrame().evaluate(
        ({ fontSpacingSeed }: { fontSpacingSeed: number }) => {
          try {
            const _window = window as typeof window & {
              setFontSpacingSeed: (seed: number) => void;
              setWebRTCIPv4: (ipv4: string) => void;
            };
            _window.setFontSpacingSeed(fontSpacingSeed);
            _window.setWebRTCIPv4("");
          } catch (_e) {}
        },
        { fontSpacingSeed: profile.data.fontSpacingSeed },
      );
    });

    // Wrap context.close to handle cleanup
    const originalClose = context.close.bind(context);
    context.close = async () => {
      await originalClose();
      // Note: Browser and server are shared across processes
      // Don't close them here - they'll persist for reuse
    };

    return context;
  }

  /**
   * Starts the local roverfox server
   */
  private static async startLocalServer(): Promise<void> {
    if (RoverfoxClient.localServer) {
      return;
    }

    // Create a simple HTTP server for local use (no HTTPS needed)
    const httpServer = http.createServer((req, res) => {
      if (req.url === "/" || req.url === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", service: "roverfox-local" }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not found" }));
      }
    });

    // Create server config for local use
    const config: ServerConfig = {
      port: RoverfoxClient.localPort,
      host: "localhost",
      authTokens: [],
      basicAuth: {
        user: "",
        pass: "",
      },
      proxyPath: "/roverfox",
      replayPath: "/replay",
      httpsServer: httpServer as any, // Type cast since we're using http, not https
      skipAuth: true, // Skip authentication for local development
      numBrowserServers: 1, // Only need 1 browser server for local development
      headless: false, // Always show browser in local mode
      quiet: true, // Suppress verbose logs in local mode
    };

    RoverfoxClient.localServer = new RoverFoxProxyServer(config);
    await RoverfoxClient.localServer.start();

    // Store connection URLs (no replay needed for local contexts)
    RoverfoxClient.localServerConfig = {
      roverfoxWsUrl: `ws://localhost:${RoverfoxClient.localPort}${config.proxyPath}`,
      replayWsUrl: "", // Not used for local contexts
    };
  }

  /**
   * Shuts down the local roverfox server
   */
  private static async shutdownLocalServer(): Promise<void> {
    if (!RoverfoxClient.localServer) {
      return;
    }

    await RoverfoxClient.localServer.shutdown();
    RoverfoxClient.localServer = null;
    RoverfoxClient.localServerConfig = null;
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
      bypassCSP: false,
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
    } catch (_error) {
      // Continue execution as this is not critical
    }

    if (!skipAudit)
      await this.managerClient.logAudit(browserId, "openContext", {});

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
        await this.managerClient.logAudit(browserId, "closeContext", {});

      // Save data usage to database and BetterStack
      const tracker = this.dataUsageTrackers.get(browserId);
      if (tracker) {
        const usageData = tracker.getUsageData();
        const durationMs =
          new Date(usageData.timeEnd).getTime() -
          new Date(usageData.timeStart).getTime();

        // Save to Manager API
        await this.managerClient.logUsage(
          usageData.browserId,
          usageData.timeStart,
          usageData.timeEnd,
          usageData.bytes,
        );

        // Send to BetterStack
        logDataUsage({
          browserId: usageData.browserId,
          start: usageData.timeStart,
          end: usageData.timeEnd,
          bytes: usageData.bytes,
          durationMs,
        });

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
      } catch (_error) {
        // Silently ignore unregister errors
      }

      // Close the WebSocket specific to this browserId
      try {
        await this.replayManager.closeWebSocketForBrowser(browserId);
      } catch (_error) {
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
    geoState: string | null = null,
  ): Promise<RoverFoxProfileData> {
    const browserId = uuidv4();
    const profile: RoverFoxProfileData = {
      browser_id: browserId,
      data: {
        fontSpacingSeed: Math.floor(Math.random() * 100000000),
        audioFingerprintSeed: Math.floor(Math.random() * 0xffffffff) + 1,
        screenDimensions: generateScreenDimensions(),
        storageState: {
          cookies: [],
          origins: [],
        },
        proxyUrl: proxyUrl,
      },
    };

    // Lookup geolocation via the proxy's actual exit IP
    try {
      const parsed = new URL(proxyUrl);
      const proxyConfig: ProxyConfig = {
        host: parsed.hostname,
        port: parseInt(parsed.port) || 80,
        username: parsed.username || undefined,
        password: parsed.password || undefined,
      };

      const result = await this.geoService.lookupThroughProxy(proxyConfig);
      if (result) {
        profile.data.timezone = result.geo.timezone;
        profile.data.geolocation = { lat: result.geo.lat, lon: result.geo.lon };
        profile.data.countryCode = result.geo.countryCode;
        profile.data.lastKnownIP = result.ip;

        if (this.debug) {
          console.log(
            `[client] Profile ${browserId} created with IP ${result.ip}, timezone ${result.geo.timezone}`,
          );
        }
      }
    } catch (_e) {
      // Non-critical: continue without geolocation
    }

    await this.managerClient.createProfile(browserId, profile.data, proxyId);

    return profile;
  }

  /**
   * Deletes a profile
   */
  async deleteProfile(browserId: string): Promise<void> {
    await this.managerClient.deleteProfile(browserId);
  }

  /**
   * Lists all profiles
   */
  async listProfiles(): Promise<{ browser_id: string; data: any }[]> {
    return await this.managerClient.listProfiles();
  }

  /**
   * Updates profile data for a specific browser
   */
  async updateProfileData(
    browserId: string,
    newData: { [k: string]: any },
  ): Promise<void> {
    await this.managerClient.updateProfileData(browserId, newData);
  }

  /**
   * Gets profile data for a specific browser
   */
  async getProfileData(browserId: string): Promise<any> {
    const { profile } = await this.managerClient.getProfile(browserId);
    return profile.data;
  }
}

export { RoverfoxClient as default };

// Re-export geolocation service
export { IPGeolocationService, getGeoService } from "./ip-geolocation.js";
export type { GeoLocationData, ProxyConfig } from "./ip-geolocation.js";
