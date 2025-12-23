/**
 * DataUsageTracker - Tracks network data usage per browser context
 */
import { Page } from "playwright";
interface NetworkRequestLog {
    url: string;
    method: string;
    resourceType: string;
    requestSize: number;
    responseSize: number;
    status: number | null;
    timestamp: Date;
}
export declare class DataUsageTracker {
    private browserId;
    private startTime;
    private bytes;
    private requests;
    private debug;
    constructor(browserId: string, debug?: boolean);
    /**
     * Attach network listeners to a page to track data usage
     */
    attachToPage(page: Page): void;
    /**
     * Log a single request to console in table format
     */
    private logToConsole;
    /**
     * Format bytes to human-readable string
     */
    private formatBytes;
    /**
     * Get current usage data for saving to database
     */
    getUsageData(): {
        browserId: string;
        timeStart: string;
        timeEnd: string;
        bytes: number;
    };
    /**
     * Get all logged requests (for debugging/analysis)
     */
    getRequests(): NetworkRequestLog[];
    /**
     * Get total bytes transferred
     */
    getTotalBytes(): number;
}
export {};
