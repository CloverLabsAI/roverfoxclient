"use strict";
/**
 * Roverfox Client - Main entry point
 * Connects to distributed Roverfox servers via manager
 */
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
exports.default = exports.RoverfoxClient = void 0;
const uuid_1 = require("uuid");
const audit_logger_1 = require("./audit-logger");
const connection_pool_1 = require("./connection-pool");
const manager_client_1 = require("./manager-client");
const replay_manager_1 = require("./replay-manager");
const storage_manager_1 = require("./storage-manager");
const data_usage_tracker_1 = require("./data-usage-tracker");
const utils_1 = require("./utils");
class RoverfoxClient {
    constructor(supabaseClient, wsAPIKey, managerUrl, debug = false) {
        this.supabaseClient = supabaseClient;
        this.debug = debug;
        this.connectionPool = new connection_pool_1.ConnectionPool(wsAPIKey, debug);
        this.managerClient = new manager_client_1.ManagerClient(managerUrl, debug);
        this.replayManager = new replay_manager_1.ReplayManager(debug);
        this.storageManager = new storage_manager_1.StorageManager(supabaseClient);
        this.dataUsageTrackers = new Map();
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
            var _a;
            // Get server assignment from manager
            const assignment = yield this.managerClient.getServerAssignment();
            const { roverfoxWsUrl, replayWsUrl } = assignment;
            // Get or create browser connection (reuses if already connected)
            const browser = yield this.connectionPool.getBrowserConnection(roverfoxWsUrl);
            // Get or create replay WebSocket (reuses if already connected)
            const replayWs = this.connectionPool.getReplayWebSocket(replayWsUrl);
            // Fetch profile data from Supabase
            const { data: profile } = yield this.supabaseClient
                .from("redrover_profile_data")
                .select("*")
                .eq("browser_id", browserId)
                .single();
            if (!profile) {
                throw new Error("Profile not found");
            }
            // Fetch proxy data if needed
            const { data: proxyId } = yield this.supabaseClient
                .from("accounts")
                .select("proxyId")
                .eq("browserId", browserId);
            let proxyObject = null;
            if (proxyId) {
                const { data: proxyData } = yield this.supabaseClient
                    .from("proxies")
                    .select("entry, port, username, password")
                    .eq("id", (_a = proxyId === null || proxyId === void 0 ? void 0 : proxyId[0]) === null || _a === void 0 ? void 0 : _a.proxyId)
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
            const proxyObject = proxyUrl ? (0, utils_1.formatProxyURL)(proxyUrl) : null;
            const browserId = (0, uuid_1.v4)();
            return this.launchInstance(browser, replayWs, {
                browser_id: browserId,
                data: {
                    fontSpacingSeed: Math.floor(Math.random() * 100000000),
                    storageState: {
                        cookies: [],
                        origins: [],
                    },
                    proxyUrl: proxyUrl,
                },
            }, proxyObject, browserId, true // skipAudit
            );
        });
    }
    /**
     * Internal method to launch instance with profile data
     */
    launchInstance(browser_1, replayWs_1, profile_1, proxyObject_1, browserId_1) {
        return __awaiter(this, arguments, void 0, function* (browser, replayWs, profile, proxyObject, browserId, skipAudit = false) {
            // Strip IndexedDB from storage state to prevent restoration conflicts
            let storageStateToUse = profile.data.storageState;
            if (storageStateToUse && typeof storageStateToUse === 'object' && Array.isArray(storageStateToUse.origins)) {
                storageStateToUse = Object.assign(Object.assign({}, storageStateToUse), { origins: storageStateToUse.origins.map((origin) => (Object.assign(Object.assign({}, origin), { indexedDB: [] }))) });
            }
            // Create browser context
            const context = yield browser.newContext(Object.assign(Object.assign(Object.assign({}, (storageStateToUse ? { storageState: storageStateToUse } : {})), { bypassCSP: true }), (proxyObject ? {
                proxy: {
                    server: proxyObject.server,
                    username: proxyObject.username,
                    password: proxyObject.password,
                },
            } : {})));
            // Register profile with replay hub
            try {
                yield this.connectionPool.safeSend(replayWs, { type: "register-profile", uuid: browserId });
            }
            catch (error) {
                // Continue execution as this is not critical
            }
            if (!skipAudit)
                (0, audit_logger_1.logActionAudit)(this.supabaseClient, browserId, "openContext", {});
            // Initialize data usage tracker for this context
            const dataUsageTracker = new data_usage_tracker_1.DataUsageTracker(browserId, this.debug);
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
                    yield (0, audit_logger_1.logActionAudit)(this.supabaseClient, browserId, "closeContext", {});
                // Save data usage to database
                const tracker = this.dataUsageTrackers.get(browserId);
                if (tracker) {
                    const usageData = tracker.getUsageData();
                    try {
                        const { error } = yield this.supabaseClient.from("data_usage").insert({
                            browserId: usageData.browserId,
                            start: usageData.timeStart,
                            end: usageData.timeEnd,
                            bytes: usageData.bytes,
                        });
                        if (error) {
                            console.error("Failed to save data usage:", error);
                        }
                    }
                    catch (error) {
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
                    yield this.connectionPool.safeSend(replayWs, { type: "unregister-profile", uuid: browserId });
                }
                catch (error) {
                    // Silently ignore unregister errors
                }
                // Close the WebSocket specific to this browserId
                try {
                    yield this.replayManager.closeWebSocketForBrowser(browserId);
                }
                catch (error) {
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
            let browserId = (0, uuid_1.v4)();
            let profile = {
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
            yield this.supabaseClient.from("accounts").insert({
                browserId: browserId,
                platform: "roverfox",
                proxyId: proxyId,
            });
            yield this.supabaseClient.from("redrover_profile_data").insert(profile);
            return profile;
        });
    }
    /**
     * Deletes a profile
     */
    deleteProfile(browserId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.supabaseClient
                .from("accounts")
                .delete()
                .eq("browserId", browserId);
            yield this.supabaseClient
                .from("redrover_profile_data")
                .delete()
                .eq("browser_id", browserId);
        });
    }
}
exports.RoverfoxClient = RoverfoxClient;
exports.default = RoverfoxClient;
