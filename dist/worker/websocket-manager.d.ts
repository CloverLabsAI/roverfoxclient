import { AuthManager, type ServerConfig } from './auth.js';
import { BrowserProxy } from './browser-proxy.js';
import { CapacityReporter } from './capacity-reporter.js';
import { ReplayHub } from './replay-hub.js';
export declare class WebSocketManager {
    private config;
    private replayHub;
    private browserProxy;
    private authManager;
    private wsServer;
    private wsServerUrl;
    private capacityReporter;
    private isDraining;
    constructor(config: ServerConfig, replayHub: ReplayHub, browserProxy: BrowserProxy, authManager: AuthManager);
    /**
     * Creates and configures the WebSocket server with path-based routing
     */
    createWebSocketServer(): Promise<void>;
    /**
     * Sets the server to draining mode
     */
    setDraining(draining: boolean): void;
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
    /**
     * Sets the capacity reporter for tracking connections
     */
    setCapacityReporter(reporter: CapacityReporter): void;
}
