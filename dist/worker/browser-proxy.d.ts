import type { BrowserServer } from "playwright";
import WebSocket, { type RawData } from "ws";
export declare class BrowserProxy {
    private clients;
    private browserServers;
    private currentServerIndex;
    private quiet;
    constructor(browserServers?: BrowserServer[], quiet?: boolean);
    /**
     * Registers a new proxy client
     */
    registerClient(ws: WebSocket): void;
    /**
     * Handles client disconnection
     */
    handleClientDisconnect(ws: WebSocket): void;
    /**
     * Handles browser proxy messages (existing functionality)
     */
    handleBrowserProxyMessage(clientWs: WebSocket, msg: RawData): void;
    /**
     * Creates a browser WebSocket connection for a client (once per client)
     */
    private createBrowserConnection;
    /**
     * Sets up bidirectional message forwarding between client and browser WebSockets (once per connection)
     */
    private setupMessageForwarding;
    /**
     * Updates the browser servers array
     */
    setBrowserServers(browserServers: BrowserServer[]): void;
}
