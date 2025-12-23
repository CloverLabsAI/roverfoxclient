/**
 * Replay and screenshot streaming management
 */
import { Page } from "playwright";
import WebSocket from "ws";
import type { ConnectionPool } from "./connection-pool";
export declare class ReplayManager {
    private mousePositions;
    private streamingEnabled;
    private screenshotIntervals;
    private browserPages;
    private pageContexts;
    private static wsInstances;
    private static wsClosePromises;
    private debug;
    constructor(debug?: boolean);
    /**
     * Enables live replay for a page
     */
    enableLiveReplay(page: Page, page_id: string, browser_id: string, replayWs: WebSocket, connectionPool: ConnectionPool): Promise<void>;
    /**
     * Handles streaming control messages
     */
    handleStreamingControlMessage(message: any): void;
    /**
     * Starts screenshot streaming for a page
     */
    private startScreenshotStreaming;
    /**
     * Sends page state (screenshot) to replay hub
     */
    private sendPageStateLiveReplay;
    /**
     * Stops screenshot streaming for a page
     */
    private stopScreenshotStreaming;
    /**
     * Stops all screenshot streaming for a browser
     */
    private stopAllScreenshotStreaming;
    /**
     * Cleans up resources for a browser
     */
    cleanup(browserId: string): void;
    /**
     * Safely closes a WebSocket for a specific browserId
     */
    closeWebSocketForBrowser(browserId: string): Promise<void>;
}
