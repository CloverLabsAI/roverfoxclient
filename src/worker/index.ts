/**
 * This file is a copy of the worker entrypoint at `apps/worker/src/index.ts`. Normally I wouldn't
 * duplicate code like this, but the client depends on the worker and I want to get this merged, so
 * for now we're going to make a copy and then clean this up later.
 */
import AutoEncrypt from "@small-tech/auto-encrypt";
import { createClient } from "@supabase/supabase-js";
import { exec } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { type BrowserServer, firefox } from "playwright";
import { fileURLToPath } from "url";
import { promisify } from "util";

import { PorkbunService } from "../utils/porkbun-service.js";
import { AuthManager, type ServerConfig } from "./auth.js";
import { BrowserProxy } from "./browser-proxy.js";
import { CamoufoxSetup } from "./camoufox-setup.js";
import { ReplayHub } from "./replay-hub.js";
import { WebSocketManager } from "./websocket-manager.js";

const execAsync = promisify(exec);

/**
 * Gets the current git commit hash
 */
async function getGitCommitHash(): Promise<string | null> {
  try {
    const { stdout } = await execAsync("git rev-parse --short HEAD");
    return stdout.trim();
  } catch {
    return null;
  }
}

/**
 * Gets public IP address
 */
async function getPublicIP(): Promise<string> {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return (data as { ip: string }).ip;
  } catch (error) {
    console.error("[worker] Failed to get public IP:", error);
    throw error;
  }
}

/**
 * Gets EC2 metadata if running on AWS
 */
async function getEC2Metadata(): Promise<{
  instanceId: string | null;
  hostId: string | null;
}> {
  try {
    // Try to get IMDSv2 token (2s timeout to avoid hanging on non-EC2)
    const tokenResponse = await fetch(
      "http://169.254.169.254/latest/api/token",
      {
        method: "PUT",
        headers: { "X-aws-ec2-metadata-token-ttl-seconds": "21600" },
        signal: AbortSignal.timeout(2000),
      },
    );

    if (!tokenResponse.ok) return { instanceId: null, hostId: null };
    const token = await tokenResponse.text();

    const [idRes, hostRes] = await Promise.all([
      fetch("http://169.254.169.254/latest/meta-data/instance-id", {
        headers: { "X-aws-ec2-metadata-token": token },
        signal: AbortSignal.timeout(2000),
      }),
      fetch("http://169.254.169.254/latest/meta-data/placement/host-id", {
        headers: { "X-aws-ec2-metadata-token": token },
        signal: AbortSignal.timeout(2000),
      }),
    ]);

    const instanceId = idRes.ok ? await idRes.text() : null;
    const hostId = hostRes.ok ? await hostRes.text() : null;

    return { instanceId, hostId };
  } catch {
    return { instanceId: null, hostId: null };
  }
}

/**
 * Fetches environment variables from manager via SSH
 */
async function fetchEnvFromManager(): Promise<void> {
  const mainDomain = process.env.MAIN_DOMAIN || "monitico.com";
  const managerDomain =
    process.env.MANAGER_DOMAIN || `manager.roverfox.${mainDomain}`;

  if (!managerDomain) {
    console.warn("[worker] MANAGER_DOMAIN not set, skipping env fetch");
    return;
  }

  try {
    console.log(
      `[worker] Fetching environment from manager at ${managerDomain}...`,
    );

    const sshCommand = `ssh -i ~/.ssh/roverfox-automation.pem -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ubuntu@${managerDomain} "cat /home/ubuntu/roverfox.env"`;
    const { stdout } = await execAsync(sshCommand);

    // Parse env file and set environment variables
    const lines = stdout.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        if (key && valueParts.length > 0) {
          const value = valueParts.join("=").replace(/^["']|["']$/g, ""); // Remove quotes
          process.env[key] = value;
        }
      }
    }

    console.log("[worker] Successfully loaded environment from manager");
  } catch (error: any) {
    console.warn(
      "[worker] Failed to fetch environment from manager, continuing with existing env:",
      error?.message || error,
    );
    // Don't throw - allow server to run with existing environment (for local use)
  }
}

// Parse --headless arg (default true)
let HEADLESS = true;
for (const arg of process.argv.slice(2)) {
  if (arg.startsWith("--headless=")) {
    const val = arg.split("=")[1];
    HEADLESS = val !== "false";
  }
}

// If running in headful mode, use a different port to avoid conflicts
const DEFAULT_PORT = 443;
const HEADFUL_PORT = 9001;
let selectedPort = DEFAULT_PORT;
if (!HEADLESS) {
  selectedPort = HEADFUL_PORT;
}

export class RoverFoxProxyServer {
  private browserServers: BrowserServer[] = [];
  private replayHub: ReplayHub;
  private browserProxy: BrowserProxy;
  private authManager: AuthManager;
  private wsManager: WebSocketManager;
  private isShuttingDown: boolean = false;
  private restartAttempts: number = 0;
  private maxRestartAttempts: number = 3;
  private readonly numBrowserServers: number;

  // Distributed architecture properties
  private serverId: string | null = null;
  private serverIp: string | null = null;
  private metricsInterval: NodeJS.Timeout | null = null;

  constructor(private config: ServerConfig) {
    this.numBrowserServers = config.numBrowserServers ?? 3; // Default to 3 if not specified
    this.replayHub = new ReplayHub();
    this.browserProxy = new BrowserProxy([], config.quiet ?? false);
    this.authManager = new AuthManager(config);
    this.wsManager = new WebSocketManager(
      config,
      this.replayHub,
      this.browserProxy,
      this.authManager,
    );
  }

  /**
   * Starts the proxy server
   */
  async start(): Promise<void> {
    try {
      if (!this.config.quiet) {
        const commitHash = await getGitCommitHash();
        const version = commitHash ? ` (${commitHash})` : "";
        console.log(`[wss] Starting RoverFox Websocket Server${version}...`);
      }

      // Launch Camoufox browser servers
      await this.launchBrowserServers();

      // Update browser proxy with server references
      this.browserProxy.setBrowserServers(this.browserServers);

      // Create and start WebSocket server
      await this.wsManager.createWebSocketServer();

      // Skip production infrastructure in local mode
      if (!this.config.skipAuth) {
        // Register server in database (distributed architecture)
        await this.registerServer();

        // Start metrics reporting
        this.startMetricsReporting();
      }

      if (!this.config.quiet) {
        console.log("[wss] RoverFox Websocket Server started successfully");
      }
    } catch (error) {
      console.error("[wss] Failed to start server:", error);
      await this.shutdown();
      throw error;
    }
  }

  /**
   * Launches multiple Camoufox browser servers for load distribution
   */
  private async launchBrowserServers(): Promise<void> {
    if (!this.config.quiet) {
      console.log(
        `[browser] Launching ${this.numBrowserServers} Camoufox browser servers...`,
      );
    }

    const setup = new CamoufoxSetup();
    const camoufoxPath = await setup.init();

    // Load browser configuration
    const browserConfig = this.loadBrowserConfig();

    // Prepare environment variables
    const env: { [key: string]: string } = {};

    // Copy existing environment variables (filtering out undefined values)
    Object.entries(process.env).forEach(([key, value]) => {
      if (value !== undefined) {
        env[key] = value;
      }
    });

    // Add browser configuration if available
    if (browserConfig) {
      env.CAMOU_CONFIG_1 = browserConfig;
      if (!this.config.quiet) {
        console.log(
          "[browser] Loaded browser configuration for CAMOU_CONFIG_1",
        );
      }
    } else if (!this.config.quiet) {
      console.warn(
        "[browser] No browser configuration loaded - continuing without CAMOU_CONFIG_1",
      );
    }

    // Determine headless mode: use config value if set, otherwise default to true
    const headlessMode =
      this.config.headless !== undefined ? this.config.headless : true;

    // Launch multiple browser servers
    for (let i = 0; i < this.numBrowserServers; i++) {
      const browserServer = await firefox.launchServer({
        headless: headlessMode,
        executablePath: camoufoxPath,
        env,
      });
      this.browserServers.push(browserServer);

      if (!this.config.quiet) {
        const wsEndpoint = browserServer.wsEndpoint();
        console.log(
          `[browser] Server ${i + 1}/${this.numBrowserServers} started: ${wsEndpoint}`,
        );
      }

      // Set up monitoring for this server
      this.setupBrowserServerMonitoring(browserServer, i);
    }

    if (!this.config.quiet) {
      console.log(
        `[browser] All ${this.numBrowserServers} servers launched in ${headlessMode ? "headless" : "headful"} mode.`,
      );
    }
  }

  /**
   * Sets up monitoring for browser server crashes and disconnections
   */
  private setupBrowserServerMonitoring(
    browserServer: BrowserServer,
    index: number,
  ): void {
    // Monitor browser process close event
    browserServer.on("close", () => {
      if (!this.config.quiet) {
        console.error(
          `[browser] Browser server ${index + 1} closed unexpectedly!`,
        );
      }
      this.handleBrowserServerCrash(index);
    });

    if (!this.config.quiet) {
      console.log(`[browser] Browser server ${index + 1} monitoring enabled`);
    }
  }

  /**
   * Handles browser server crashes with automatic restart
   */
  private async handleBrowserServerCrash(index: number): Promise<void> {
    if (this.isShuttingDown) {
      if (!this.config.quiet) {
        console.log("[browser] Server is shutting down, skipping restart");
      }
      return;
    }

    // Remove crashed server from array
    this.browserServers.splice(index, 1);
    this.browserProxy.setBrowserServers(this.browserServers);

    if (this.restartAttempts >= this.maxRestartAttempts) {
      console.error(
        `[browser] Max restart attempts (${this.maxRestartAttempts}) reached. Manual intervention required.`,
      );
      return;
    }

    this.restartAttempts++;
    console.log(
      `[browser] Attempting to restart browser server ${index + 1} (attempt ${this.restartAttempts}/${this.maxRestartAttempts})...`,
    );

    try {
      // Wait a bit before restarting to avoid rapid restart loops
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Restart single server
      const setup = new CamoufoxSetup();
      const camoufoxPath = await setup.init();
      const browserConfig = this.loadBrowserConfig();
      const env: { [key: string]: string } = {};
      Object.entries(process.env).forEach(([key, value]) => {
        if (value !== undefined) {
          env[key] = value;
        }
      });
      if (browserConfig) {
        env.CAMOU_CONFIG_1 = browserConfig;
      }

      const headlessMode =
        this.config.headless !== undefined ? this.config.headless : true;
      const browserServer = await firefox.launchServer({
        headless: headlessMode,
        executablePath: camoufoxPath,
        env,
      });

      this.browserServers.push(browserServer);
      this.browserProxy.setBrowserServers(this.browserServers);
      this.setupBrowserServerMonitoring(
        browserServer,
        this.browserServers.length - 1,
      );

      console.log(
        `[browser] Browser server ${index + 1} restarted successfully`,
      );
      this.restartAttempts = 0; // Reset counter on successful restart
    } catch (error) {
      console.error(
        `[browser] Failed to restart browser server ${index + 1}:`,
        error,
      );
      // Will retry on next crash if under max attempts
    }
  }

  /**
   * Gracefully shuts down the server
   */
  async shutdown(): Promise<void> {
    this.isShuttingDown = true;
    if (!this.config.quiet) {
      console.log("[wss] Shutting down RoverFox Websocket Server...");
    }

    // Stop metrics reporting
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }

    // Close WebSocket server
    this.wsManager.close();

    // Close all browser servers
    for (const browserServer of this.browserServers) {
      await browserServer.close();
    }
    this.browserServers = [];

    if (!this.config.quiet) {
      console.log("[wss] Websocket Server shutdown complete");
    }
  }

  /**
   * Loads browser configuration from JSON file
   */
  private loadBrowserConfig(): string | null {
    try {
      const configPath = path.join(__dirname, "../browserConfig.json");
      const configData = fs.readFileSync(configPath, "utf8");

      // Parse the JSON to modify it
      const config = JSON.parse(configData);

      // Return the modified configuration as JSON string
      return JSON.stringify(config);
    } catch (error) {
      console.error("[browser] Failed to load browser config:", error);
      return null;
    }
  }

  public getBrowserWsEndpoints(): string[] {
    return this.browserServers.map((s) => s.wsEndpoint());
  }

  public getWsProxyLocalEndpoint(): string {
    return this.wsManager.getWsProxyLocalEndpoint();
  }

  public getWsReplayLocalEndpoint(): string {
    return this.wsManager.getWsReplayLocalEndpoint();
  }

  /**
   * Gets actual memory usage from system (matches htop)
   */
  private async getSystemMemoryUsage(): Promise<{
    usedMB: number;
    totalMB: number;
    percent: number;
  }> {
    try {
      const platform = os.platform();

      if (platform === "darwin") {
        // macOS: Parse vm_stat output
        const { stdout } = await execAsync("vm_stat");
        const lines = stdout.split("\n");
        if (!lines.length || !lines[0]) {
          throw new Error(
            "[metrics] Expected command 'vm_stat' to produce output but none received",
          );
        }

        // Parse page size
        const pageSizeMatch = lines[0].match(/page size of (\d+) bytes/);
        const pageSize =
          pageSizeMatch && pageSizeMatch[1] ? parseInt(pageSizeMatch[1]) : 4096;

        // Parse memory stats
        const getPages = (label: string): number => {
          const line = lines.find((l) => l.includes(label));
          if (!line) return 0;
          const match = line.match(/:\s*(\d+)/);
          return match && match[1] ? parseInt(match[1]) : 0;
        };

        const wired = getPages("Pages wired down");
        const active = getPages("Pages active");
        const compressed = getPages("Pages occupied by compressor");

        const totalMemory = os.totalmem();
        const usedMemory = (wired + active + compressed) * pageSize;

        return {
          usedMB: usedMemory / 1024 / 1024,
          totalMB: totalMemory / 1024 / 1024,
          percent: (usedMemory / totalMemory) * 100,
        };
      } else if (platform === "linux") {
        // Linux: Parse /proc/meminfo
        const { stdout } = await execAsync("cat /proc/meminfo");
        const lines = stdout.split("\n");

        const getValue = (label: string): number => {
          const line = lines.find((l) => l.startsWith(label));
          if (!line) return 0;
          const match = line.match(/:\s*(\d+)/);
          return match && match[1] ? parseInt(match[1]) * 1024 : 0; // Convert KB to bytes
        };

        const totalMemory = getValue("MemTotal");
        const freeMemory = getValue("MemFree");
        const buffers = getValue("Buffers");
        const cached = getValue("Cached");
        const sReclaimable = getValue("SReclaimable");

        // htop calculation: used = total - free - buffers - cached - sReclaimable
        const usedMemory =
          totalMemory - freeMemory - buffers - cached - sReclaimable;

        return {
          usedMB: usedMemory / 1024 / 1024,
          totalMB: totalMemory / 1024 / 1024,
          percent: (usedMemory / totalMemory) * 100,
        };
      } else {
        // Fallback for other platforms
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = totalMemory - freeMemory;

        return {
          usedMB: usedMemory / 1024 / 1024,
          totalMB: totalMemory / 1024 / 1024,
          percent: (usedMemory / totalMemory) * 100,
        };
      }
    } catch (error) {
      console.error(
        "[metrics] Failed to get system memory, using fallback:",
        error,
      );
      // Fallback
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const usedMemory = totalMemory - freeMemory;

      return {
        usedMB: usedMemory / 1024 / 1024,
        totalMB: totalMemory / 1024 / 1024,
        percent: (usedMemory / totalMemory) * 100,
      };
    }
  }

  /**
   * Gets current server metrics using existing ReplayHub tracking
   */
  public async getMetrics() {
    const memoryUsage = process.memoryUsage();
    const systemMemory = await this.getSystemMemoryUsage();

    return {
      // Use ReplayHub's existing tracking!
      activeContexts: this.replayHub.activeProfiles.size,
      activeProfileIds: Array.from(this.replayHub.activeProfiles.keys()),
      totalPages: Array.from(this.replayHub.profilePages.values()).reduce(
        (sum, pages) => sum + pages.size,
        0,
      ),
      // System memory usage (matches htop exactly)
      memoryUsagePercent: systemMemory.percent,
      memoryUsedMB: systemMemory.usedMB,
      memoryTotalMB: systemMemory.totalMB,
      // Node.js heap usage (for debugging)
      heapUsedMB: memoryUsage.heapUsed / 1024 / 1024,
      heapTotalMB: memoryUsage.heapTotal / 1024 / 1024,
    };
  }

  /**
   * Converts IP address to subdomain using same logic as Porkbun service
   */
  private ipToSubdomain(ip: string): string {
    const parts = ip.split(".");

    if (parts.length !== 4) {
      throw new Error("Invalid IP address format");
    }

    // Convert IP to a single number (IPv4 as 32-bit integer)
    const ipAsNumber = parts.reduce((acc, octet) => {
      return (acc << 8) + parseInt(octet, 10);
    }, 0);

    // Convert to base36 for compact alphanumeric representation
    const base36Id = ipAsNumber.toString(36);

    return `${base36Id}.macm2`;
  }

  /**
   * Registers server in database for distributed architecture
   */
  private async registerServer(): Promise<void> {
    // Skip registration if SUPABASE_URL is not configured
    if (!process.env.SUPABASE_URL) {
      console.log(
        "[server] Skipping registration - SUPABASE_URL not configured (running in standalone mode)",
      );
      return;
    }

    try {
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_KEY!,
      );

      this.serverIp = await this.getPublicIP();
      const { instanceId, hostId } = await getEC2Metadata();
      const subdomain = this.ipToSubdomain(this.serverIp);
      const domain = process.env.PORKBUN_DOMAIN || "monitico.com";

      // Create DNS subdomain for this worker using Porkbun API
      const porkbunService = new PorkbunService();
      const createdSubdomain = await porkbunService.createSubdomainForIp(
        this.serverIp,
      );
      if (createdSubdomain) {
        console.log(
          `[server] DNS subdomain created: ${createdSubdomain}.${domain}`,
        );
      } else {
        console.warn(
          `[server] Failed to create DNS subdomain, continuing anyway...`,
        );
      }

      // Check if server with this IP already exists
      const { data: existing } = await supabase
        .from("roverfox_servers")
        .select("id")
        .eq("ip", this.serverIp)
        .single();

      if (existing) {
        // Server already exists, reuse the record
        this.serverId = existing.id;

        // Reset metrics but preserve state (don't override 'terminating')
        await supabase
          .from("roverfox_servers")
          .update({
            memory_usage: 0,
            active_contexts: 0,
            instance_id: instanceId,
            host_id: hostId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", this.serverId);

        console.log(
          `[server] Reusing existing record with ID: ${this.serverId}, IP: ${this.serverIp}`,
        );
      } else {
        // Insert new server record with 'pending' state
        const { data, error } = await supabase
          .from("roverfox_servers")
          .insert({
            ip: this.serverIp,
            roverfox_websocket_url: `wss://${subdomain}.${domain}${this.config.proxyPath}`,
            replay_websocket_url: `wss://${subdomain}.${domain}${this.config.replayPath}`,
            state: "pending",
            memory_usage: 0,
            active_contexts: 0,
            instance_id: instanceId,
            host_id: hostId,
          })
          .select("id")
          .single();

        if (error) throw error;
        this.serverId = data.id;
        console.log(
          `[server] Registered with ID: ${this.serverId}, IP: ${this.serverIp} (state: pending)`,
        );
        console.log(`[server] Subdomain: ${subdomain}.${domain}`);
      }
    } catch (error) {
      console.error("[server] Failed to register server:", error);
      // Don't throw - allow server to run in standalone mode
    }
  }

  /**
   * Activates the server by setting state to 'active'
   */
  async activateServer(): Promise<void> {
    if (!this.serverId) return;

    try {
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_KEY!,
      );

      await supabase
        .from("roverfox_servers")
        .update({ state: "active" })
        .eq("id", this.serverId);

      console.log(`[server] ✓ Server activated (ID: ${this.serverId})`);
    } catch (error) {
      console.error("[server] Failed to activate server:", error);
    }
  }

  /**
   * Gets public IP address
   */
  private async getPublicIP(): Promise<string> {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return (data as { ip: string }).ip;
    } catch (error) {
      console.error("[server] Failed to get public IP:", error);
      throw error;
    }
  }

  /**
   * Starts periodic metrics reporting to database
   */
  private startMetricsReporting(): void {
    // Skip if not registered
    if (!this.serverId) {
      return;
    }

    // Report metrics every 30 seconds
    this.metricsInterval = setInterval(async () => {
      await this.reportMetrics();
    }, 30000);

    console.log("[server] Started metrics reporting (30s interval)");
  }

  /**
   * Reports current metrics to database
   */
  private async reportMetrics(): Promise<void> {
    if (!this.serverId || !process.env.SUPABASE_URL) {
      return;
    }

    try {
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_KEY!,
      );

      const metrics = await this.getMetrics();

      await supabase
        .from("roverfox_servers")
        .update({
          memory_usage: metrics.memoryUsagePercent,
          active_contexts: metrics.activeContexts,
          updated_at: new Date().toISOString(),
        })
        .eq("id", this.serverId);

      console.log(
        `[server] Metrics reported: ${metrics.activeContexts} contexts, ` +
          `${metrics.memoryUsagePercent.toFixed(1)}% system RAM ` +
          `(${metrics.memoryUsedMB.toFixed(0)}/${metrics.memoryTotalMB.toFixed(0)} MB), ` +
          `heap: ${metrics.heapUsedMB.toFixed(0)}/${metrics.heapTotalMB.toFixed(0)} MB`,
      );
    } catch (error) {
      console.error("[server] Failed to report metrics:", error);
    }
  }
}

async function main() {
  // Fetch environment from manager via SSH before starting
  await fetchEnvFromManager();

  // Get worker's subdomain based on IP
  const publicIp = await getPublicIP();
  const ipParts = publicIp.split(".");
  const ipAsNumber = ipParts.reduce(
    (acc: number, octet: string) => (acc << 8) + parseInt(octet, 10),
    0,
  );
  const base36Id = ipAsNumber.toString(36);
  const workerDomain = `${base36Id}.macm2.${process.env.PORKBUN_DOMAIN || "monitico.com"}`;

  console.log(`[worker] Initializing Auto Encrypt for domain: ${workerDomain}`);

  // Create auto-encrypted HTTPS server with request handler
  const httpsServer = AutoEncrypt.https.createServer(
    { domains: [workerDomain] },
    (req, res) => {
      // Handle HTTP requests
      if (req.url === "/" || req.url === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", service: "roverfox-worker" }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not found" }));
      }
    },
  );

  // Create config after environment variables are loaded
  const config: ServerConfig = {
    port: selectedPort,
    host: "0.0.0.0",
    authTokens: process.env.ROVERFOX_API_KEY
      ? [process.env.ROVERFOX_API_KEY]
      : [],
    basicAuth: {
      user: "",
      pass: "",
    },
    proxyPath: "/roverfox",
    replayPath: "/replay",
    httpsServer: httpsServer,
  };

  const server = new RoverFoxProxyServer(config);
  await server.start();

  // Wait for HTTPS endpoint to become reachable, then activate
  console.log("[worker] Waiting for HTTPS endpoint to become reachable...");
  const activationInterval = setInterval(async () => {
    try {
      await fetch(`https://${workerDomain}/`, {
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      // If we get here, the endpoint is reachable
      clearInterval(activationInterval);
      console.log("[worker] ✓ HTTPS endpoint is reachable");
      console.log("[worker] ✓ Certificate provisioned successfully");

      // Activate the server in the database
      await server.activateServer();
    } catch {
      // Still waiting for certificate provisioning
      console.log("[worker] Waiting for certificate provisioning...");
    }
  }, 10000); // Check every 10 seconds

  // Set up graceful shutdown handlers
  const shutdown = async (signal: string) => {
    console.log(`\n[wss] Received ${signal}, shutting down gracefully...`);
    await server.shutdown();
    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Handle uncaught errors
  process.on("uncaughtException", (error) => {
    console.error("[wss] Uncaught exception:", error);
    shutdown("uncaughtException");
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("[wss] Unhandled rejection at:", promise, "reason:", reason);
    shutdown("unhandledRejection");
  });
}

// Only run main() if this file is executed directly, not when imported
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
