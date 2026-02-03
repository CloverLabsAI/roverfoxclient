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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketManager = void 0;
const ws_1 = require("ws");
class WebSocketManager {
    constructor(config, replayHub, browserProxy, authManager) {
        this.config = config;
        this.replayHub = replayHub;
        this.browserProxy = browserProxy;
        this.authManager = authManager;
        this.wsServer = null;
        this.wsServerUrl = null;
    }
    /**
     * Creates and configures the WebSocket server with path-based routing
     */
    createWebSocketServer() {
        return __awaiter(this, void 0, void 0, function* () {
            const wsOptions = {
                verifyClient: (info) => {
                    return this.verifyClient(info);
                },
            };
            // Use HTTPS server if provided, otherwise use port/host
            if (this.config.httpsServer) {
                wsOptions.server = this.config.httpsServer;
                this.config.httpsServer.listen(this.config.port, this.config.host);
            }
            else {
                wsOptions.port = this.config.port;
                wsOptions.host = this.config.host;
            }
            this.wsServer = new ws_1.WebSocketServer(wsOptions);
            this.wsServer.on("connection", (clientWs, req) => {
                this.handleConnection(clientWs, req);
            });
            const protocol = this.config.httpsServer ? "wss" : "ws";
            this.wsServerUrl = `${protocol}://${this.config.host}:${this.config.port}`;
            this.logServerInfo();
            this.authManager.logAuthStatus();
        });
    }
    /**
     * Verifies client connections based on path and authentication
     */
    verifyClient(info) {
        const url = info.req.url;
        // Allow connections to both /roverfox and /replay paths
        if (url !== this.config.proxyPath && url !== this.config.replayPath) {
            return false;
        }
        // /replay path doesn't require authentication
        if (url === this.config.replayPath) {
            return true;
        }
        // /roverfox path requires authentication
        return this.authManager.isRequestAuthorized(info.req);
    }
    /**
     * Handles new WebSocket connections based on path
     */
    handleConnection(clientWs, req) {
        const url = req.url;
        if (url === this.config.proxyPath) {
            this.handleProxyConnection(clientWs);
        }
        else if (url === this.config.replayPath) {
            this.handleReplayConnection(clientWs);
        }
    }
    /**
     * Handles browser proxy connections
     */
    handleProxyConnection(clientWs) {
        this.browserProxy.registerClient(clientWs);
        clientWs.on("message", (msg) => {
            this.browserProxy.handleBrowserProxyMessage(clientWs, msg);
        });
        clientWs.on("close", () => {
            this.browserProxy.handleClientDisconnect(clientWs);
        });
        clientWs.on("error", (error) => {
            console.error("[proxy] Client WebSocket error:", error);
            this.browserProxy.handleClientDisconnect(clientWs);
        });
    }
    /**
     * Handles screenshot streaming connections
     */
    handleReplayConnection(clientWs) {
        this.replayHub.initializeReplayClient(clientWs);
        clientWs.on("message", (msg) => {
            let data;
            try {
                data = JSON.parse(msg.toString());
            }
            catch (_a) {
                console.warn("[replay] Received non-JSON message, ignoring");
                return;
            }
            this.replayHub.handleScreenshotMessage(clientWs, data);
        });
        clientWs.on("close", () => {
            this.replayHub.handleClientDisconnect(clientWs);
        });
        clientWs.on("error", (error) => {
            console.error("[replay] Client WebSocket error:", error);
            this.replayHub.handleClientDisconnect(clientWs);
        });
    }
    /**
     * Logs server information
     */
    logServerInfo() {
        if (!this.config.quiet) {
            console.log(`[wss] WebSocket server listening on ${this.wsServerUrl}`);
            console.log(`[wss] Browser proxy endpoint: ${this.wsServerUrl}${this.config.proxyPath}`);
            console.log(`[wss] Screenshot streaming endpoint: ${this.wsServerUrl}${this.config.replayPath}`);
        }
    }
    /**
     * Closes the WebSocket server
     */
    close() {
        if (this.wsServer) {
            this.wsServer.close();
            this.wsServer = null;
        }
    }
    /**
     * Gets the WebSocket server URL endpoints
     */
    getWsProxyLocalEndpoint() {
        return `${this.wsServerUrl}${this.config.proxyPath}`;
    }
    getWsReplayLocalEndpoint() {
        return `${this.wsServerUrl}${this.config.replayPath}`;
    }
}
exports.WebSocketManager = WebSocketManager;
