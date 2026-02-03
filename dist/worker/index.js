"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoverFoxProxyServer = void 0;
/**
 * This file is a copy of the worker entrypoint at `apps/worker/src/index.ts`. Normally I wouldn't
 * duplicate code like this, but the client depends on the worker and I want to get this merged, so
 * for now we're going to make a copy and then clean this up later.
 */
const auto_encrypt_1 = __importDefault(require("@small-tech/auto-encrypt"));
const axios_1 = __importDefault(require("axios"));
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const playwright_1 = require("playwright");
const util_1 = require("util");
const auth_js_1 = require("./auth.js");
const browser_proxy_js_1 = require("./browser-proxy.js");
const camoufox_setup_js_1 = require("./camoufox-setup.js");
const replay_hub_js_1 = require("./replay-hub.js");
const websocket_manager_js_1 = require("./websocket-manager.js");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
/**
 * Gets the current git commit hash
 */
function getGitCommitHash() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { stdout } = yield execAsync("git rev-parse --short HEAD");
            return stdout.trim();
        }
        catch (_a) {
            return null;
        }
    });
}
/**
 * Gets public IP address
 */
function getPublicIP() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data } = yield axios_1.default.get("https://api.ipify.org?format=json");
            return data.ip;
        }
        catch (error) {
            console.error("[worker] Failed to get public IP:", error);
            throw error;
        }
    });
}
/**
 * Gets EC2 metadata if running on AWS
 */
function getEC2Metadata() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Try to get IMDSv2 token (2s timeout to avoid hanging on non-EC2)
            const tokenResponse = yield axios_1.default.put("http://169.254.169.254/latest/api/token", undefined, {
                headers: { "X-aws-ec2-metadata-token-ttl-seconds": "21600" },
                timeout: 2000,
                responseType: "text",
            });
            const token = tokenResponse.data;
            const [idRes, hostRes] = yield Promise.allSettled([
                axios_1.default.get("http://169.254.169.254/latest/meta-data/instance-id", {
                    headers: { "X-aws-ec2-metadata-token": token },
                    timeout: 2000,
                    responseType: "text",
                }),
                axios_1.default.get("http://169.254.169.254/latest/meta-data/placement/host-id", {
                    headers: { "X-aws-ec2-metadata-token": token },
                    timeout: 2000,
                    responseType: "text",
                }),
            ]);
            const instanceId = idRes.status === "fulfilled" ? idRes.value.data : null;
            const hostId = hostRes.status === "fulfilled" ? hostRes.value.data : null;
            return { instanceId, hostId };
        }
        catch (_a) {
            return { instanceId: null, hostId: null };
        }
    });
}
/**
 * Fetches environment variables from manager via SSH
 */
function fetchEnvFromManager() {
    return __awaiter(this, void 0, void 0, function* () {
        const mainDomain = process.env.MAIN_DOMAIN || "monitico.com";
        const managerDomain = process.env.MANAGER_DOMAIN || `manager.roverfox.${mainDomain}`;
        if (!managerDomain) {
            console.warn("[worker] MANAGER_DOMAIN not set, skipping env fetch");
            return;
        }
        try {
            console.log(`[worker] Fetching environment from manager at ${managerDomain}...`);
            const sshCommand = `ssh -i ~/.ssh/roverfox-automation.pem -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ubuntu@${managerDomain} "cat /home/ubuntu/roverfox.env"`;
            const { stdout } = yield execAsync(sshCommand);
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
        }
        catch (error) {
            console.warn("[worker] Failed to fetch environment from manager, continuing with existing env:", (error === null || error === void 0 ? void 0 : error.message) || error);
            // Don't throw - allow server to run with existing environment (for local use)
        }
    });
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
class RoverFoxProxyServer {
    constructor(config) {
        var _a, _b;
        this.config = config;
        this.browserServers = [];
        this.isShuttingDown = false;
        this.restartAttempts = 0;
        this.maxRestartAttempts = 3;
        // Distributed architecture properties
        this.serverId = null;
        this.serverIp = null;
        this.metricsInterval = null;
        this.numBrowserServers = (_a = config.numBrowserServers) !== null && _a !== void 0 ? _a : 3; // Default to 3 if not specified
        this.replayHub = new replay_hub_js_1.ReplayHub();
        this.browserProxy = new browser_proxy_js_1.BrowserProxy([], (_b = config.quiet) !== null && _b !== void 0 ? _b : false);
        this.authManager = new auth_js_1.AuthManager(config);
        this.wsManager = new websocket_manager_js_1.WebSocketManager(config, this.replayHub, this.browserProxy, this.authManager);
    }
    /**
     * Starts the proxy server
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.config.quiet) {
                    const commitHash = yield getGitCommitHash();
                    const version = commitHash ? ` (${commitHash})` : "";
                    console.log(`[wss] Starting RoverFox Websocket Server${version}...`);
                }
                // Launch Camoufox browser servers
                yield this.launchBrowserServers();
                // Update browser proxy with server references
                this.browserProxy.setBrowserServers(this.browserServers);
                // Create and start WebSocket server
                yield this.wsManager.createWebSocketServer();
                // Skip production infrastructure in local mode
                if (!this.config.skipAuth) {
                    // Register server in database (distributed architecture)
                    yield this.registerServer();
                    // Start metrics reporting
                    this.startMetricsReporting();
                }
                if (!this.config.quiet) {
                    console.log("[wss] RoverFox Websocket Server started successfully");
                }
            }
            catch (error) {
                console.error("[wss] Failed to start server:", error);
                yield this.shutdown();
                throw error;
            }
        });
    }
    /**
     * Launches multiple Camoufox browser servers for load distribution
     */
    launchBrowserServers() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.config.quiet) {
                console.log(`[browser] Launching ${this.numBrowserServers} Camoufox browser servers...`);
            }
            const setup = new camoufox_setup_js_1.CamoufoxSetup();
            const camoufoxPath = yield setup.init();
            // Load browser configuration
            const browserConfig = this.loadBrowserConfig();
            // Prepare environment variables
            const env = {};
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
                    console.log("[browser] Loaded browser configuration for CAMOU_CONFIG_1");
                }
            }
            else if (!this.config.quiet) {
                console.warn("[browser] No browser configuration loaded - continuing without CAMOU_CONFIG_1");
            }
            // Determine headless mode: use config value if set, otherwise default to true
            const headlessMode = this.config.headless !== undefined ? this.config.headless : true;
            // Launch multiple browser servers
            for (let i = 0; i < this.numBrowserServers; i++) {
                const browserServer = yield playwright_1.firefox.launchServer({
                    headless: headlessMode,
                    executablePath: camoufoxPath,
                    env,
                });
                this.browserServers.push(browserServer);
                if (!this.config.quiet) {
                    const wsEndpoint = browserServer.wsEndpoint();
                    console.log(`[browser] Server ${i + 1}/${this.numBrowserServers} started: ${wsEndpoint}`);
                }
                // Set up monitoring for this server
                this.setupBrowserServerMonitoring(browserServer, i);
            }
            if (!this.config.quiet) {
                console.log(`[browser] All ${this.numBrowserServers} servers launched in ${headlessMode ? "headless" : "headful"} mode.`);
            }
        });
    }
    /**
     * Sets up monitoring for browser server crashes and disconnections
     */
    setupBrowserServerMonitoring(browserServer, index) {
        // Monitor browser process close event
        browserServer.on("close", () => {
            if (!this.config.quiet) {
                console.error(`[browser] Browser server ${index + 1} closed unexpectedly!`);
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
    handleBrowserServerCrash(index) {
        return __awaiter(this, void 0, void 0, function* () {
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
                console.error(`[browser] Max restart attempts (${this.maxRestartAttempts}) reached. Manual intervention required.`);
                return;
            }
            this.restartAttempts++;
            console.log(`[browser] Attempting to restart browser server ${index + 1} (attempt ${this.restartAttempts}/${this.maxRestartAttempts})...`);
            try {
                // Wait a bit before restarting to avoid rapid restart loops
                yield new Promise((resolve) => setTimeout(resolve, 2000));
                // Restart single server
                const setup = new camoufox_setup_js_1.CamoufoxSetup();
                const camoufoxPath = yield setup.init();
                const browserConfig = this.loadBrowserConfig();
                const env = {};
                Object.entries(process.env).forEach(([key, value]) => {
                    if (value !== undefined) {
                        env[key] = value;
                    }
                });
                if (browserConfig) {
                    env.CAMOU_CONFIG_1 = browserConfig;
                }
                const headlessMode = this.config.headless !== undefined ? this.config.headless : true;
                const browserServer = yield playwright_1.firefox.launchServer({
                    headless: headlessMode,
                    executablePath: camoufoxPath,
                    env,
                });
                this.browserServers.push(browserServer);
                this.browserProxy.setBrowserServers(this.browserServers);
                this.setupBrowserServerMonitoring(browserServer, this.browserServers.length - 1);
                console.log(`[browser] Browser server ${index + 1} restarted successfully`);
                this.restartAttempts = 0; // Reset counter on successful restart
            }
            catch (error) {
                console.error(`[browser] Failed to restart browser server ${index + 1}:`, error);
                // Will retry on next crash if under max attempts
            }
        });
    }
    /**
     * Gracefully shuts down the server
     */
    shutdown() {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield browserServer.close();
            }
            this.browserServers = [];
            if (!this.config.quiet) {
                console.log("[wss] Websocket Server shutdown complete");
            }
        });
    }
    /**
     * Loads browser configuration from JSON file
     */
    loadBrowserConfig() {
        try {
            const configPath = path_1.default.join(__dirname, "../browserConfig.json");
            const configData = fs_1.default.readFileSync(configPath, "utf8");
            // Parse the JSON to modify it
            const config = JSON.parse(configData);
            // Return the modified configuration as JSON string
            return JSON.stringify(config);
        }
        catch (error) {
            console.error("[browser] Failed to load browser config:", error);
            return null;
        }
    }
    getBrowserWsEndpoints() {
        return this.browserServers.map((s) => s.wsEndpoint());
    }
    getWsProxyLocalEndpoint() {
        return this.wsManager.getWsProxyLocalEndpoint();
    }
    getWsReplayLocalEndpoint() {
        return this.wsManager.getWsReplayLocalEndpoint();
    }
    /**
     * Gets actual memory usage from system (matches htop)
     */
    getSystemMemoryUsage() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const platform = os_1.default.platform();
                if (platform === "darwin") {
                    // macOS: Parse vm_stat output
                    const { stdout } = yield execAsync("vm_stat");
                    const lines = stdout.split("\n");
                    if (!lines.length || !lines[0]) {
                        throw new Error("[metrics] Expected command 'vm_stat' to produce output but none received");
                    }
                    // Parse page size
                    const pageSizeMatch = lines[0].match(/page size of (\d+) bytes/);
                    const pageSize = pageSizeMatch && pageSizeMatch[1] ? parseInt(pageSizeMatch[1]) : 4096;
                    // Parse memory stats
                    const getPages = (label) => {
                        const line = lines.find((l) => l.includes(label));
                        if (!line)
                            return 0;
                        const match = line.match(/:\s*(\d+)/);
                        return match && match[1] ? parseInt(match[1]) : 0;
                    };
                    const wired = getPages("Pages wired down");
                    const active = getPages("Pages active");
                    const compressed = getPages("Pages occupied by compressor");
                    const totalMemory = os_1.default.totalmem();
                    const usedMemory = (wired + active + compressed) * pageSize;
                    return {
                        usedMB: usedMemory / 1024 / 1024,
                        totalMB: totalMemory / 1024 / 1024,
                        percent: (usedMemory / totalMemory) * 100,
                    };
                }
                else if (platform === "linux") {
                    // Linux: Parse /proc/meminfo
                    const { stdout } = yield execAsync("cat /proc/meminfo");
                    const lines = stdout.split("\n");
                    const getValue = (label) => {
                        const line = lines.find((l) => l.startsWith(label));
                        if (!line)
                            return 0;
                        const match = line.match(/:\s*(\d+)/);
                        return match && match[1] ? parseInt(match[1]) * 1024 : 0; // Convert KB to bytes
                    };
                    const totalMemory = getValue("MemTotal");
                    const freeMemory = getValue("MemFree");
                    const buffers = getValue("Buffers");
                    const cached = getValue("Cached");
                    const sReclaimable = getValue("SReclaimable");
                    // htop calculation: used = total - free - buffers - cached - sReclaimable
                    const usedMemory = totalMemory - freeMemory - buffers - cached - sReclaimable;
                    return {
                        usedMB: usedMemory / 1024 / 1024,
                        totalMB: totalMemory / 1024 / 1024,
                        percent: (usedMemory / totalMemory) * 100,
                    };
                }
                else {
                    // Fallback for other platforms
                    const totalMemory = os_1.default.totalmem();
                    const freeMemory = os_1.default.freemem();
                    const usedMemory = totalMemory - freeMemory;
                    return {
                        usedMB: usedMemory / 1024 / 1024,
                        totalMB: totalMemory / 1024 / 1024,
                        percent: (usedMemory / totalMemory) * 100,
                    };
                }
            }
            catch (error) {
                console.error("[metrics] Failed to get system memory, using fallback:", error);
                // Fallback
                const totalMemory = os_1.default.totalmem();
                const freeMemory = os_1.default.freemem();
                const usedMemory = totalMemory - freeMemory;
                return {
                    usedMB: usedMemory / 1024 / 1024,
                    totalMB: totalMemory / 1024 / 1024,
                    percent: (usedMemory / totalMemory) * 100,
                };
            }
        });
    }
    /**
     * Gets current server metrics using existing ReplayHub tracking
     */
    getMetrics() {
        return __awaiter(this, void 0, void 0, function* () {
            const memoryUsage = process.memoryUsage();
            const systemMemory = yield this.getSystemMemoryUsage();
            return {
                // Use ReplayHub's existing tracking!
                activeContexts: this.replayHub.activeProfiles.size,
                activeProfileIds: Array.from(this.replayHub.activeProfiles.keys()),
                totalPages: Array.from(this.replayHub.profilePages.values()).reduce((sum, pages) => sum + pages.size, 0),
                // System memory usage (matches htop exactly)
                memoryUsagePercent: systemMemory.percent,
                memoryUsedMB: systemMemory.usedMB,
                memoryTotalMB: systemMemory.totalMB,
                // Node.js heap usage (for debugging)
                heapUsedMB: memoryUsage.heapUsed / 1024 / 1024,
                heapTotalMB: memoryUsage.heapTotal / 1024 / 1024,
            };
        });
    }
    /**
     * Gets the manager URL from environment or default
     */
    getManagerUrl() {
        return (process.env.ROVERFOX_MANAGER_URL ||
            (process.env.MANAGER_DOMAIN
                ? `https://${process.env.MANAGER_DOMAIN}`
                : null));
    }
    /**
     * Builds authorization headers for manager API calls
     */
    getAuthHeaders() {
        const apiKey = process.env.ROVERFOX_API_KEY;
        return apiKey ? { Authorization: `Bearer ${apiKey}` } : {};
    }
    /**
     * Registers server in database via manager API
     */
    registerServer() {
        return __awaiter(this, void 0, void 0, function* () {
            const managerUrl = this.getManagerUrl();
            if (!managerUrl) {
                console.log("[server] Skipping registration - no manager URL configured (running in standalone mode)");
                return;
            }
            try {
                this.serverIp = yield this.getPublicIP();
                const { instanceId, hostId } = yield getEC2Metadata();
                const { data } = yield axios_1.default.post(`${managerUrl}/api/servers/register`, {
                    ip: this.serverIp,
                    proxyPath: this.config.proxyPath,
                    replayPath: this.config.replayPath,
                    instanceId,
                    hostId,
                }, { headers: this.getAuthHeaders() });
                this.serverId = data.serverId;
                console.log(`[server] Registered with ID: ${this.serverId}, IP: ${this.serverIp}`);
            }
            catch (error) {
                console.error("[server] Failed to register server:", error);
                // Don't throw - allow server to run in standalone mode
            }
        });
    }
    /**
     * Activates the server by setting state to 'active' via manager API
     */
    activateServer() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.serverId)
                return;
            const managerUrl = this.getManagerUrl();
            if (!managerUrl)
                return;
            try {
                yield axios_1.default.post(`${managerUrl}/api/servers/${this.serverId}/activate`, undefined, { headers: this.getAuthHeaders() });
                console.log(`[server] Server activated (ID: ${this.serverId})`);
            }
            catch (error) {
                console.error("[server] Failed to activate server:", error);
            }
        });
    }
    /**
     * Gets public IP address
     */
    getPublicIP() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield axios_1.default.get("https://api.ipify.org?format=json");
                return data.ip;
            }
            catch (error) {
                console.error("[server] Failed to get public IP:", error);
                throw error;
            }
        });
    }
    /**
     * Starts periodic metrics reporting to database
     */
    startMetricsReporting() {
        // Skip if not registered
        if (!this.serverId) {
            return;
        }
        // Report metrics every 30 seconds
        this.metricsInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            yield this.reportMetrics();
        }), 30000);
        console.log("[server] Started metrics reporting (30s interval)");
    }
    /**
     * Reports current metrics via manager API
     */
    reportMetrics() {
        return __awaiter(this, void 0, void 0, function* () {
            const managerUrl = this.getManagerUrl();
            if (!this.serverId || !managerUrl) {
                return;
            }
            try {
                const metrics = yield this.getMetrics();
                yield axios_1.default.post(`${managerUrl}/api/servers/${this.serverId}/metrics`, {
                    memoryUsage: metrics.memoryUsagePercent,
                    activeContexts: metrics.activeContexts,
                }, { headers: this.getAuthHeaders() });
                console.log(`[server] Metrics reported: ${metrics.activeContexts} contexts, ` +
                    `${metrics.memoryUsagePercent.toFixed(1)}% system RAM ` +
                    `(${metrics.memoryUsedMB.toFixed(0)}/${metrics.memoryTotalMB.toFixed(0)} MB), ` +
                    `heap: ${metrics.heapUsedMB.toFixed(0)}/${metrics.heapTotalMB.toFixed(0)} MB`);
            }
            catch (error) {
                console.error("[server] Failed to report metrics:", error);
            }
        });
    }
}
exports.RoverFoxProxyServer = RoverFoxProxyServer;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Fetch environment from manager via SSH before starting
        yield fetchEnvFromManager();
        // Get worker's subdomain based on IP
        const publicIp = yield getPublicIP();
        const ipParts = publicIp.split(".");
        const ipAsNumber = ipParts.reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
        const base36Id = ipAsNumber.toString(36);
        const workerDomain = `${base36Id}.macm2.${process.env.PORKBUN_DOMAIN || "monitico.com"}`;
        console.log(`[worker] Initializing Auto Encrypt for domain: ${workerDomain}`);
        // Create auto-encrypted HTTPS server with request handler
        const httpsServer = auto_encrypt_1.default.https.createServer({ domains: [workerDomain] }, (req, res) => {
            // Handle HTTP requests
            if (req.url === "/" || req.url === "/health") {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ status: "ok", service: "roverfox-worker" }));
            }
            else {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Not found" }));
            }
        });
        // Create config after environment variables are loaded
        const config = {
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
        yield server.start();
        // Wait for HTTPS endpoint to become reachable, then activate
        console.log("[worker] Waiting for HTTPS endpoint to become reachable...");
        const activationInterval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.get(`https://${workerDomain}/`, {
                    timeout: 5000,
                });
                // If we get here, the endpoint is reachable
                clearInterval(activationInterval);
                console.log("[worker] ✓ HTTPS endpoint is reachable");
                console.log("[worker] ✓ Certificate provisioned successfully");
                // Activate the server in the database
                yield server.activateServer();
            }
            catch (_a) {
                // Still waiting for certificate provisioning
                console.log("[worker] Waiting for certificate provisioning...");
            }
        }), 10000); // Check every 10 seconds
        // Set up graceful shutdown handlers
        const shutdown = (signal) => __awaiter(this, void 0, void 0, function* () {
            console.log(`\n[wss] Received ${signal}, shutting down gracefully...`);
            yield server.shutdown();
            process.exit(0);
        });
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
    });
}
// Only run main() if this file is executed directly, not when imported
if (require.main === module) {
    main();
}
