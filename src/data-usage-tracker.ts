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

export class DataUsageTracker {
    private browserId: string;
    private startTime: Date;
    private bytes: number = 0;
    private requests: NetworkRequestLog[] = [];
    private debug: boolean;

    constructor(browserId: string, debug: boolean = false) {
        this.browserId = browserId;
        this.startTime = new Date();
        this.debug = debug;
    }

    /**
     * Attach network listeners to a page to track data usage
     */
    attachToPage(page: Page): void {
        // Track request sizes
        page.on("request", (request) => {
            const postData = request.postData();
            const requestSize = postData ? Buffer.from(postData).length : 0;

            // Store request data temporarily
            (request as any)._trackedRequestSize = requestSize;
        });

        // Track response sizes
        page.on("response", async (response) => {
            const request = response.request();
            const requestSize = (request as any)._trackedRequestSize || 0;

            let responseSize = 0;
            try {
                const body = await response.body();
                responseSize = body.length;
            } catch (error) {
                // Some responses can't be read (e.g., 204 No Content)
                responseSize = 0;
            }

            const totalSize = requestSize + responseSize;
            this.bytes += totalSize;

            const logEntry: NetworkRequestLog = {
                url: request.url(),
                method: request.method(),
                resourceType: request.resourceType(),
                requestSize,
                responseSize,
                status: response.status(),
                timestamp: new Date(),
            };

            this.requests.push(logEntry);

            if (this.debug) {
                this.logToConsole(logEntry, totalSize);
            }
        });

        // Also track failed requests
        page.on("requestfailed", (request) => {
            const requestSize = (request as any)._trackedRequestSize || 0;
            this.bytes += requestSize;

            const logEntry: NetworkRequestLog = {
                url: request.url(),
                method: request.method(),
                resourceType: request.resourceType(),
                requestSize,
                responseSize: 0,
                status: null,
                timestamp: new Date(),
            };

            this.requests.push(logEntry);

            if (this.debug) {
                this.logToConsole(logEntry, requestSize);
            }
        });
    }

    /**
     * Log a single request to console in table format
     */
    private logToConsole(entry: NetworkRequestLog, totalSize: number): void {
        console.table([
            {
                Time: entry.timestamp.toISOString(),
                Method: entry.method,
                Status: entry.status || "FAILED",
                Type: entry.resourceType,
                "Request (bytes)": entry.requestSize,
                "Response (bytes)": entry.responseSize,
                "Total (bytes)": totalSize,
                URL: entry.url.length > 60 ? entry.url.substring(0, 57) + "..." : entry.url,
            },
        ]);
        console.log(`Cumulative usage: ${this.formatBytes(this.bytes)}\n`);
    }

    /**
     * Format bytes to human-readable string
     */
    private formatBytes(bytes: number): string {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    }

    /**
     * Get current usage data for saving to database
     */
    getUsageData(): {
        browserId: string;
        timeStart: string;
        timeEnd: string;
        bytes: number;
    } {
        return {
            browserId: this.browserId,
            timeStart: this.startTime.toISOString(),
            timeEnd: new Date().toISOString(),
            bytes: this.bytes,
        };
    }

    /**
     * Get all logged requests (for debugging/analysis)
     */
    getRequests(): NetworkRequestLog[] {
        return this.requests;
    }

    /**
     * Get total bytes transferred
     */
    getTotalBytes(): number {
        return this.bytes;
    }
}
