"use strict";
/**
 * Roverfox Client - Main entry point
 * Connects to distributed Roverfox servers via manager
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPGeolocationService = exports.getGeoService = exports.default = exports.RoverfoxClient = void 0;
const http = __importStar(require("http"));
const net = __importStar(require("net"));
const uuid_1 = require("uuid");
const connection_pool_js_1 = require("./connection-pool.js");
const data_usage_tracker_js_1 = require("./data-usage-tracker.js");
const ip_geolocation_js_1 = require("./ip-geolocation.js");
const manager_client_js_1 = require("./manager-client.js");
const replay_manager_js_1 = require("./replay-manager.js");
const storage_manager_js_1 = require("./storage-manager.js");
const betterstack_logger_js_1 = require("./utils/betterstack-logger.js");
const proxies_js_1 = require("./utils/proxies.js");
const index_js_1 = require("./worker/index.js");
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
function generateScreenDimensions() {
    const resolution = COMMON_SCREEN_RESOLUTIONS[Math.floor(Math.random() * COMMON_SCREEN_RESOLUTIONS.length)];
    return {
        width: resolution.width,
        height: resolution.height,
        colorDepth: 24,
    };
}
class RoverfoxClient {
    constructor(wsAPIKey, managerUrl, debug = false) {
        this.debug = debug;
        this.connectionPool = new connection_pool_js_1.ConnectionPool(wsAPIKey, debug);
        this.managerClient = new manager_client_js_1.ManagerClient(managerUrl, debug);
        this.replayManager = new replay_manager_js_1.ReplayManager();
        this.storageManager = new storage_manager_js_1.StorageManager(this.managerClient);
        this.dataUsageTrackers = new Map();
        this.geoService = new ip_geolocation_js_1.IPGeolocationService();
        // Set up streaming message handler
        this.connectionPool.setStreamingMessageHandler((message) => {
            this.replayManager.handleStreamingControlMessage(message);
        });
    }
    /**
     * Launch a browser profile - gets server assignment from manager
     */
    launchProfile(browserId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get server assignment from manager
            const assignment = yield this.managerClient.getServerAssignment();
            const { roverfoxWsUrl, replayWsUrl } = assignment;
            // Get or create browser connection (reuses if already connected)
            const browser = yield this.connectionPool.getBrowserConnection(roverfoxWsUrl);
            // Get or create replay WebSocket (reuses if already connected)
            const replayWs = this.connectionPool.getReplayWebSocket(replayWsUrl);
            // Fetch profile and proxy data from Manager API
            const { profile, proxy: proxyObject } = yield this.managerClient.getProfile(browserId);
            // Check if geolocation needs updating based on proxy exit IP
            if (proxyObject) {
                try {
                    const serverUrl = new URL(proxyObject.server);
                    const proxyConfig = {
                        host: serverUrl.hostname,
                        port: parseInt(serverUrl.port) || 80,
                        username: proxyObject.username || undefined,
                        password: proxyObject.password || undefined,
                    };
                    const { changed, currentIP } = yield this.geoService.hasIPChanged(proxyConfig, profile.data.lastKnownIP || null);
                    if (currentIP && (changed || !profile.data.timezone)) {
                        const geoData = yield this.geoService.lookup(currentIP);
                        if (geoData) {
                            profile.data.timezone = geoData.timezone;
                            profile.data.geolocation = { lat: geoData.lat, lon: geoData.lon };
                            profile.data.countryCode = geoData.countryCode;
                            profile.data.lastKnownIP = currentIP;
                            // Persist updated geolocation to manager
                            yield this.managerClient.updateProfileData(browserId, profile.data);
                            if (this.debug) {
                                if (changed) {
                                    console.log(`[client] IP changed for ${browserId}: ${profile.data.lastKnownIP} -> ${currentIP}, updated geolocation to ${geoData.timezone}`);
                                }
                                else {
                                    console.log(`[client] Geolocation set for ${browserId}: ${geoData.timezone}`);
                                }
                            }
                        }
                    }
                }
                catch (_e) {
                    // Non-critical: continue without geolocation update
                }
            }
            // Create browser context with profile data
            return this.launchInstance(browser, replayWs, profile, proxyObject, browserId);
        });
    }
    /**
     * Launch a one-time browser without profile
     */
    launchOneTimeBrowser(proxyUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get server assignment from manager
            const assignment = yield this.managerClient.getServerAssignment();
            const { roverfoxWsUrl, replayWsUrl } = assignment;
            // Get or create connections
            const browser = yield this.connectionPool.getBrowserConnection(roverfoxWsUrl);
            const replayWs = this.connectionPool.getReplayWebSocket(replayWsUrl);
            const proxyObject = proxyUrl ? (0, proxies_js_1.formatProxyURL)(proxyUrl) : null;
            const browserId = (0, uuid_1.v4)();
            return this.launchInstance(browser, replayWs, {
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
            }, proxyObject, browserId, true);
        });
    }
    /**
     * Check if a port is in use
     */
    static isPortInUse(port) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const server = net.createServer();
                server.once("error", (err) => {
                    if (err.code === "EADDRINUSE") {
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                });
                server.once("listening", () => {
                    server.close();
                    resolve(false);
                });
                server.listen(port, "localhost");
            });
        });
    }
    /**
     * Health check for existing server
     */
    static healthCheckServer(port) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const req = http.get(`http://localhost:${port}/health`, { timeout: 2000 }, (res) => {
                    resolve(res.statusCode === 200);
                });
                req.on("error", () => {
                    resolve(false);
                });
                req.on("timeout", () => {
                    req.destroy();
                    resolve(false);
                });
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
    static launchLocalContext(proxyUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if port is in use every time
            const portInUse = yield RoverfoxClient.isPortInUse(RoverfoxClient.localPort);
            if (portInUse) {
                // Port is in use - verify server is healthy
                const isHealthy = yield RoverfoxClient.healthCheckServer(RoverfoxClient.localPort);
                if (!isHealthy) {
                    throw new Error(`Port ${RoverfoxClient.localPort} is occupied but server is not responding. ` +
                        `Please kill the process on port ${RoverfoxClient.localPort} and try again.`);
                }
                // Set up config to connect to existing healthy server
                if (!RoverfoxClient.localServerConfig) {
                    RoverfoxClient.localServerConfig = {
                        roverfoxWsUrl: `ws://localhost:${RoverfoxClient.localPort}/roverfox`,
                        replayWsUrl: "",
                    };
                }
            }
            else {
                // Port is free - start new server if we don't have one
                if (!RoverfoxClient.localServer) {
                    yield RoverfoxClient.startLocalServer();
                }
            }
            if (!RoverfoxClient.localServerConfig) {
                throw new Error("Failed to start or connect to local server");
            }
            const { roverfoxWsUrl } = RoverfoxClient.localServerConfig;
            // Create a temporary connection pool for local server (no auth needed)
            const tempConnectionPool = new connection_pool_js_1.ConnectionPool("", false);
            // Get or create connection to local server (no replay needed)
            const browser = yield tempConnectionPool.getBrowserConnection(roverfoxWsUrl);
            const proxyObject = proxyUrl ? (0, proxies_js_1.formatProxyURL)(proxyUrl) : null;
            const browserId = (0, uuid_1.v4)();
            const profile = {
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
            const context = yield browser.newContext(Object.assign({ bypassCSP: false }, (proxyObject
                ? {
                    proxy: {
                        server: proxyObject.server,
                        username: proxyObject.username,
                        password: proxyObject.password,
                    },
                }
                : {})));
            // Set up page event handlers (fingerprinting only)
            context.on("page", (page) => __awaiter(this, void 0, void 0, function* () {
                // Apply fingerprinting properties
                yield page.mainFrame().evaluate(({ fontSpacingSeed }) => {
                    try {
                        const _window = window;
                        _window.setFontSpacingSeed(fontSpacingSeed);
                        _window.setWebRTCIPv4("");
                    }
                    catch (_e) { }
                }, { fontSpacingSeed: profile.data.fontSpacingSeed });
            }));
            // Wrap context.close to handle cleanup
            const originalClose = context.close.bind(context);
            context.close = () => __awaiter(this, void 0, void 0, function* () {
                yield originalClose();
                // Note: Browser and server are shared across processes
                // Don't close them here - they'll persist for reuse
            });
            return context;
        });
    }
    /**
     * Starts the local roverfox server
     */
    static startLocalServer() {
        return __awaiter(this, void 0, void 0, function* () {
            if (RoverfoxClient.localServer) {
                return;
            }
            // Create a simple HTTP server for local use (no HTTPS needed)
            const httpServer = http.createServer((req, res) => {
                if (req.url === "/" || req.url === "/health") {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ status: "ok", service: "roverfox-local" }));
                }
                else {
                    res.writeHead(404, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Not found" }));
                }
            });
            // Create server config for local use
            const config = {
                port: RoverfoxClient.localPort,
                host: "localhost",
                authTokens: [],
                basicAuth: {
                    user: "",
                    pass: "",
                },
                proxyPath: "/roverfox",
                replayPath: "/replay",
                httpsServer: httpServer, // Type cast since we're using http, not https
                skipAuth: true, // Skip authentication for local development
                numBrowserServers: 1, // Only need 1 browser server for local development
                headless: false, // Always show browser in local mode
                quiet: true, // Suppress verbose logs in local mode
            };
            RoverfoxClient.localServer = new index_js_1.RoverFoxProxyServer(config);
            yield RoverfoxClient.localServer.start();
            // Store connection URLs (no replay needed for local contexts)
            RoverfoxClient.localServerConfig = {
                roverfoxWsUrl: `ws://localhost:${RoverfoxClient.localPort}${config.proxyPath}`,
                replayWsUrl: "", // Not used for local contexts
            };
        });
    }
    /**
     * Shuts down the local roverfox server
     */
    static shutdownLocalServer() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!RoverfoxClient.localServer) {
                return;
            }
            yield RoverfoxClient.localServer.shutdown();
            RoverfoxClient.localServer = null;
            RoverfoxClient.localServerConfig = null;
        });
    }
    /**
     * Internal method to launch instance with profile data
     */
    launchInstance(browser_1, replayWs_1, profile_1, proxyObject_1, browserId_1) {
        return __awaiter(this, arguments, void 0, function* (browser, replayWs, profile, proxyObject, browserId, skipAudit = false) {
            // Strip IndexedDB from storage state to prevent restoration conflicts
            let storageStateToUse = profile.data.storageState;
            if (storageStateToUse &&
                typeof storageStateToUse === "object" &&
                Array.isArray(storageStateToUse.origins)) {
                storageStateToUse = Object.assign(Object.assign({}, storageStateToUse), { origins: storageStateToUse.origins.map((origin) => (Object.assign(Object.assign({}, origin), { indexedDB: [] }))) });
            }
            // Create browser context
            const context = yield browser.newContext(Object.assign(Object.assign(Object.assign({}, (storageStateToUse ? { storageState: storageStateToUse } : {})), { bypassCSP: false }), (proxyObject
                ? {
                    proxy: {
                        server: proxyObject.server,
                        username: proxyObject.username,
                        password: proxyObject.password,
                    },
                }
                : {})));
            // Register profile with replay hub
            try {
                yield this.connectionPool.safeSend(replayWs, {
                    type: "register-profile",
                    uuid: browserId,
                });
            }
            catch (_error) {
                // Continue execution as this is not critical
            }
            if (!skipAudit)
                yield this.managerClient.logAudit(browserId, "openContext", {});
            // Initialize data usage tracker for this context
            const dataUsageTracker = new data_usage_tracker_js_1.DataUsageTracker(browserId, this.debug);
            this.dataUsageTrackers.set(browserId, dataUsageTracker);
            // Set up page event handlers for replay
            context.on("page", (page) => __awaiter(this, void 0, void 0, function* () {
                yield this.storageManager.setFingerprintingProperties(page, profile);
                const pageId = (0, uuid_1.v4)();
                yield this.replayManager.enableLiveReplay(page, pageId, browserId, replayWs, this.connectionPool);
                this.storageManager.initStorageSaver(page, profile);
                // Attach data usage tracking to this page
                dataUsageTracker.attachToPage(page);
                page.on("close", () => {
                    this.storageManager.saveStorage(page, profile);
                });
            }));
            // Wrap context.close to clean up replay resources
            const closeContext = context.close.bind(context);
            context.close = () => __awaiter(this, void 0, void 0, function* () {
                if (!skipAudit)
                    yield this.managerClient.logAudit(browserId, "closeContext", {});
                // Save data usage to database and BetterStack
                const tracker = this.dataUsageTrackers.get(browserId);
                if (tracker) {
                    const usageData = tracker.getUsageData();
                    const durationMs = new Date(usageData.timeEnd).getTime() -
                        new Date(usageData.timeStart).getTime();
                    // Save to Manager API
                    yield this.managerClient.logUsage(usageData.browserId, usageData.timeStart, usageData.timeEnd, usageData.bytes);
                    // Send to BetterStack
                    (0, betterstack_logger_js_1.logDataUsage)({
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
                    yield this.connectionPool.safeSend(replayWs, {
                        type: "unregister-profile",
                        uuid: browserId,
                    });
                }
                catch (_error) {
                    // Silently ignore unregister errors
                }
                // Close the WebSocket specific to this browserId
                try {
                    yield this.replayManager.closeWebSocketForBrowser(browserId);
                }
                catch (_error) {
                    // Silently ignore close errors
                }
                yield closeContext();
                // Close browser if no more contexts
                if (browser.contexts().length === 0) {
                    browser.close();
                }
            });
            return context;
        });
    }
    /**
     * Creates a new profile
     */
    createProfile(proxyUrl, proxyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const browserId = (0, uuid_1.v4)();
            const profile = {
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
                const proxyConfig = {
                    host: parsed.hostname,
                    port: parseInt(parsed.port) || 80,
                    username: parsed.username || undefined,
                    password: parsed.password || undefined,
                };
                const result = yield this.geoService.lookupThroughProxy(proxyConfig);
                if (result) {
                    profile.data.timezone = result.geo.timezone;
                    profile.data.geolocation = { lat: result.geo.lat, lon: result.geo.lon };
                    profile.data.countryCode = result.geo.countryCode;
                    profile.data.lastKnownIP = result.ip;
                    if (this.debug) {
                        console.log(`[client] Profile ${browserId} created with IP ${result.ip}, timezone ${result.geo.timezone}`);
                    }
                }
            }
            catch (_e) {
                // Non-critical: continue without geolocation
            }
            yield this.managerClient.createProfile(browserId, profile.data, proxyId);
            return profile;
        });
    }
    /**
     * Deletes a profile
     */
    deleteProfile(browserId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.managerClient.deleteProfile(browserId);
        });
    }
    /**
     * Lists all profiles
     */
    listProfiles() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.managerClient.listProfiles();
        });
    }
    /**
     * Updates profile data for a specific browser
     */
    updateProfileData(browserId, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.managerClient.updateProfileData(browserId, newData);
        });
    }
    /**
     * Gets profile data for a specific browser
     */
    getProfileData(browserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { profile } = yield this.managerClient.getProfile(browserId);
            return profile.data;
        });
    }
}
exports.RoverfoxClient = RoverfoxClient;
exports.default = RoverfoxClient;
// Local server management
RoverfoxClient.localServer = null;
RoverfoxClient.localServerConfig = null;
RoverfoxClient.localPort = 9001;
var ip_geolocation_js_2 = require("./ip-geolocation.js");
Object.defineProperty(exports, "getGeoService", { enumerable: true, get: function () { return ip_geolocation_js_2.getGeoService; } });
Object.defineProperty(exports, "IPGeolocationService", { enumerable: true, get: function () { return ip_geolocation_js_2.IPGeolocationService; } });
