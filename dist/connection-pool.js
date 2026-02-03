"use strict";
/**
 * Connection pool manager for multiple Roverfox servers
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionPool = void 0;
const playwright_1 = require("playwright");
const ws_1 = __importDefault(require("ws"));
class ConnectionPool {
    constructor(wsAPIKey, debug = false) {
        this.browsers = new Map(); // wsEndpoint -> Browser
        this.replayWebSockets = new Map(); // replayEndpoint -> WebSocket
        this.connectionLocks = new Map(); // wsEndpoint -> lock
        this.wsAPIKey = wsAPIKey;
        this.debug = debug;
    }
    /**
     * Sets the handler for streaming control messages
     */
    setStreamingMessageHandler(handler) {
        this.streamingMessageHandler = handler;
    }
    /**
     * Gets or creates a browser connection for the given endpoint
     */
    getBrowserConnection(wsEndpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if we already have a valid connection
            const existingBrowser = this.browsers.get(wsEndpoint);
            if (existingBrowser && existingBrowser.isConnected()) {
                if (this.debug)
                    console.log(`[client] Reusing existing connection to ${wsEndpoint}`);
                return existingBrowser;
            }
            // Use per-endpoint lock to prevent concurrent connections to same server
            let lock = this.connectionLocks.get(wsEndpoint);
            if (!lock) {
                lock = this.connectToBrowser(wsEndpoint);
                this.connectionLocks.set(wsEndpoint, lock);
            }
            yield lock;
            const browser = this.browsers.get(wsEndpoint);
            if (!browser) {
                throw new Error(`Failed to establish connection to ${wsEndpoint}`);
            }
            return browser;
        });
    }
    /**
     * Connects to a browser server
     */
    connectToBrowser(wsEndpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.debug)
                console.log(`[client] Connecting to browser server: ${wsEndpoint}`);
            // Connect to browser server
            const browser = yield playwright_1.firefox.connect(wsEndpoint, {
                headers: {
                    Authorization: `Bearer ${this.wsAPIKey}`,
                },
            });
            // Store the connection
            this.browsers.set(wsEndpoint, browser);
            // Set up disconnected event listener
            browser.on("disconnected", () => {
                if (this.debug)
                    console.log(`[client] Browser disconnected: ${wsEndpoint}`);
                this.browsers.delete(wsEndpoint);
                this.connectionLocks.delete(wsEndpoint);
            });
            // Clear the lock after successful connection
            this.connectionLocks.delete(wsEndpoint);
        });
    }
    /**
     * Gets or creates a replay WebSocket connection
     */
    getReplayWebSocket(replayEndpoint) {
        // Check if we already have a connection
        let ws = this.replayWebSockets.get(replayEndpoint);
        // Reuse if OPEN or CONNECTING (avoid creating duplicate connections)
        if (ws &&
            (ws.readyState === ws_1.default.OPEN ||
                ws.readyState === ws_1.default.CONNECTING)) {
            if (this.debug)
                console.log(`[client] Reusing existing replay WebSocket: ${replayEndpoint} (state: ${ws.readyState})`);
            // Note: Message handler is already attached when WebSocket was created
            return ws;
        }
        // Create new WebSocket connection
        console.log(`[client] Creating new replay WebSocket: ${replayEndpoint}`);
        ws = new ws_1.default(replayEndpoint);
        this.replayWebSockets.set(replayEndpoint, ws);
        ws.on("error", (err) => {
            console.error(`[connection-pool] WebSocket error:`, err);
        });
        // Set up message listener for streaming control
        ws.on("message", (data) => {
            try {
                const message = JSON.parse(data.toString());
                if (this.streamingMessageHandler) {
                    this.streamingMessageHandler(message);
                }
            }
            catch (error) {
                console.error(`[connection-pool] Failed to parse message:`, error);
            }
        });
        // Clean up on close
        ws.on("close", () => {
            if (this.debug)
                console.log(`[client] Replay WebSocket closed: ${replayEndpoint}`);
            this.replayWebSockets.delete(replayEndpoint);
        });
        return ws;
    }
    /**
     * Ensures a WebSocket is open before use
     */
    ensureWsOpen(ws) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (ws.readyState === ws_1.default.OPEN) {
                    resolve();
                    return;
                }
                // WebSocket is CONNECTING, wait for open event
                const onOpen = () => {
                    ws.removeEventListener("open", onOpen);
                    ws.removeEventListener("error", onError);
                    resolve();
                };
                const onError = (error) => {
                    ws.removeEventListener("open", onOpen);
                    ws.removeEventListener("error", onError);
                    reject(new Error(`WebSocket connection failed: ${error.message || error}`));
                };
                ws.addEventListener("open", onOpen);
                ws.addEventListener("error", onError);
            });
        });
    }
    /**
     * Safely sends a message through WebSocket after ensuring it's open
     */
    safeSend(ws, message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureWsOpen(ws);
            ws.send(JSON.stringify(message));
        });
    }
}
exports.ConnectionPool = ConnectionPool;
