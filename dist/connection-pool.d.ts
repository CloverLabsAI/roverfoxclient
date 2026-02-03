/**
 * Connection pool manager for multiple Roverfox servers
 */
import { Browser } from "playwright";
import WebSocket from "ws";
export declare class ConnectionPool {
    private browsers;
    private replayWebSockets;
    private connectionLocks;
    private wsAPIKey;
    private streamingMessageHandler?;
    private debug;
    constructor(wsAPIKey: string, debug?: boolean);
    /**
     * Sets the handler for streaming control messages
     */
    setStreamingMessageHandler(handler: (message: any) => void): void;
    /**
     * Gets or creates a browser connection for the given endpoint
     */
    getBrowserConnection(wsEndpoint: string): Promise<Browser>;
    /**
     * Connects to a browser server
     */
    private connectToBrowser;
    /**
     * Gets or creates a replay WebSocket connection
     */
    getReplayWebSocket(replayEndpoint: string): WebSocket;
    /**
     * Ensures a WebSocket is open before use
     */
    ensureWsOpen(ws: WebSocket): Promise<void>;
    /**
     * Safely sends a message through WebSocket after ensuring it's open
     */
    safeSend(ws: WebSocket, message: any): Promise<void>;
}
