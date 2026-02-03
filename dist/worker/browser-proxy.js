"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserProxy = void 0;
const ws_1 = __importDefault(require("ws"));
class BrowserProxy {
    constructor(browserServers = [], quiet = false) {
        this.clients = new Map();
        this.browserServers = [];
        this.currentServerIndex = 0;
        this.quiet = false;
        this.browserServers = browserServers;
        this.quiet = quiet;
    }
    /**
     * Registers a new proxy client
     */
    registerClient(ws) {
        this.clients.set(ws, {
            meta: { type: "proxy" },
            browserWs: null,
            isConnecting: false,
            messageQueue: [],
        });
        if (!this.quiet) {
            console.log("[proxy] Browser proxy client connected");
        }
        // Set up client-side cleanup handlers
        ws.on("close", () => this.handleClientDisconnect(ws));
        ws.on("error", (error) => {
            console.error("[proxy] Client WebSocket error:", error);
            this.handleClientDisconnect(ws);
        });
    }
    /**
     * Handles client disconnection
     */
    handleClientDisconnect(ws) {
        const connection = this.clients.get(ws);
        if (connection === null || connection === void 0 ? void 0 : connection.browserWs) {
            if (!this.quiet) {
                console.log("[proxy] Closing browser WebSocket due to client disconnect");
            }
            connection.browserWs.close();
        }
        this.clients.delete(ws);
    }
    /**
     * Handles browser proxy messages (existing functionality)
     */
    handleBrowserProxyMessage(clientWs, msg) {
        if (this.browserServers.length === 0) {
            clientWs.close(1011, "Browser server not available");
            return;
        }
        const connection = this.clients.get(clientWs);
        if (!connection) {
            console.error("[proxy] Client connection not found");
            clientWs.close(1011, "Client not registered");
            return;
        }
        // If browser WebSocket already exists and is open, just forward the message
        if (connection.browserWs &&
            connection.browserWs.readyState === ws_1.default.OPEN) {
            connection.browserWs.send(msg);
            return;
        }
        // If already connecting, queue the message
        if (connection.isConnecting) {
            if (!this.quiet) {
                console.log("[proxy] Browser WebSocket still connecting, queuing message");
            }
            connection.messageQueue.push(msg);
            return;
        }
        // Create browser WebSocket connection only once
        this.createBrowserConnection(clientWs, connection, msg);
    }
    /**
     * Creates a browser WebSocket connection for a client (once per client)
     */
    createBrowserConnection(clientWs, connection, initialMsg) {
        if (this.browserServers.length === 0) {
            clientWs.close(1011, "Browser server not available");
            return;
        }
        // Round-robin: select next browser server
        const browserServer = this.browserServers[this.currentServerIndex];
        if (!browserServer) {
            throw new Error(`[proxy] Expected a browser server with index ${this.currentServerIndex} to exist, there are currently ${this.browserServers.length} browserServers registered`);
        }
        this.currentServerIndex =
            (this.currentServerIndex + 1) % this.browserServers.length;
        connection.isConnecting = true;
        const wsEndpoint = browserServer.wsEndpoint();
        if (!this.quiet) {
            console.log(`[proxy] Creating browser WebSocket connection to server ${this.currentServerIndex}/${this.browserServers.length}: ${wsEndpoint}`);
        }
        const browserWs = new ws_1.default(wsEndpoint, {
            handshakeTimeout: 30000,
            perMessageDeflate: false,
        });
        connection.browserWs = browserWs;
        browserWs.on("open", () => {
            if (!this.quiet) {
                console.log("[proxy] Browser WebSocket connected");
            }
            connection.isConnecting = false;
            // Send the initial message that triggered this connection
            if (browserWs.readyState === ws_1.default.OPEN) {
                browserWs.send(initialMsg);
                // Send all queued messages
                while (connection.messageQueue.length > 0) {
                    const queuedMsg = connection.messageQueue.shift();
                    if (queuedMsg && browserWs.readyState === ws_1.default.OPEN) {
                        browserWs.send(queuedMsg);
                    }
                }
            }
            // Set up one-time bidirectional message forwarding
            this.setupMessageForwarding(clientWs, browserWs);
        });
        browserWs.on("error", (error) => {
            console.error("[proxy] Browser WebSocket error:", error);
            connection.isConnecting = false;
            connection.browserWs = null;
            connection.messageQueue = []; // Clear queue on error
            if (clientWs.readyState === ws_1.default.OPEN) {
                clientWs.close(1011, "Browser connection error");
            }
        });
        browserWs.on("close", (code, reason) => {
            if (!this.quiet) {
                console.log(`[proxy] Browser WebSocket closed: ${code} ${reason}`);
            }
            connection.isConnecting = false;
            connection.browserWs = null;
            connection.messageQueue = []; // Clear queue on close
            if (clientWs.readyState === ws_1.default.OPEN) {
                // Convert Buffer reason to UTF-8 string and truncate to 123 bytes max
                let closeReason;
                if (reason && Buffer.isBuffer(reason)) {
                    // Slice to max 123 bytes and convert to UTF-8 string
                    const truncatedBuffer = reason.subarray(0, 123);
                    closeReason = truncatedBuffer.toString("utf8");
                }
                else if (reason) {
                    // Handle case where reason is already a string
                    closeReason = String(reason).slice(0, 123);
                }
                clientWs.close(code, closeReason);
            }
        });
        browserWs.on("unexpected-response", (_req, res) => {
            console.error(`[proxy] Unexpected response from browser WebSocket: ${res.statusCode}`);
            connection.isConnecting = false;
            connection.browserWs = null;
            connection.messageQueue = []; // Clear queue on failure
            if (clientWs.readyState === ws_1.default.OPEN) {
                clientWs.close(1011, "Browser connection failed");
            }
        });
    }
    /**
     * Sets up bidirectional message forwarding between client and browser WebSockets (once per connection)
     */
    setupMessageForwarding(clientWs, browserWs) {
        // Forward messages from browser to client
        browserWs.on("message", (data, isBinary) => {
            if (clientWs.readyState === ws_1.default.OPEN) {
                clientWs.send(data, { binary: isBinary });
            }
        });
        // Note: We don't set up clientWs.on("message") here because that's handled
        // by the WebSocketManager calling handleBrowserProxyMessage for each message
    }
    /**
     * Updates the browser servers array
     */
    setBrowserServers(browserServers) {
        this.browserServers = browserServers;
        this.currentServerIndex = 0;
    }
}
exports.BrowserProxy = BrowserProxy;
