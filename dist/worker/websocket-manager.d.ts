import { AuthManager, type ServerConfig } from './auth.js';
import { BrowserProxy } from './browser-proxy.js';
import { ReplayHub } from './replay-hub.js';
export declare class WebSocketManager {
    private config;
    private replayHub;
    private browserProxy;
    private authManager;
    private wsServer;
    private wsServerUrl;
    constructor(config: ServerConfig, replayHub: ReplayHub, browserProxy: BrowserProxy, authManager: AuthManager);
    /**
     * Creates and configures the WebSocket server with path-based routing
     */
    createWebSocketServer(): Promise<void>;
    /**
     * Verifies client connections based on path and authentication
     */
    private verifyClient;
    /**
     * Handles new WebSocket connections based on path
     */
    private handleConnection;
    /**
     * Handles browser proxy connections
     */
    private handleProxyConnection;
    /**
     * Handles screenshot streaming connections
     */
    private handleReplayConnection;
    /**
     * Logs server information
     */
    private logServerInfo;
    /**
     * Closes the WebSocket server
     */
    close(): void;
    /**
     * Gets the WebSocket server URL endpoints
     */
    getWsProxyLocalEndpoint(): string;
    getWsReplayLocalEndpoint(): string;
}
