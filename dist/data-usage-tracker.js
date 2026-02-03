"use strict";
/**
 * DataUsageTracker - Tracks network data usage per browser context
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataUsageTracker = void 0;
class DataUsageTracker {
    constructor(browserId, debug = false) {
        this.bytes = 0;
        this.requests = [];
        this.browserId = browserId;
        this.startTime = new Date();
        this.debug = debug;
    }
    /**
     * Attach network listeners to a page to track data usage
     */
    attachToPage(page) {
        // Track request sizes
        page.on("request", (request) => {
            const postData = request.postData();
            const requestSize = postData ? Buffer.from(postData).length : 0;
            // Store request data temporarily
            request._trackedRequestSize = requestSize;
        });
        // Track response sizes
        page.on("response", (response) => __awaiter(this, void 0, void 0, function* () {
            const request = response.request();
            const requestSize = request._trackedRequestSize || 0;
            let responseSize = 0;
            try {
                const body = yield response.body();
                responseSize = body.length;
            }
            catch (_error) {
                // Some responses can't be read (e.g., 204 No Content)
                responseSize = 0;
            }
            const totalSize = requestSize + responseSize;
            this.bytes += totalSize;
            const logEntry = {
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
        }));
        // Also track failed requests
        page.on("requestfailed", (request) => {
            const requestSize = request._trackedRequestSize || 0;
            this.bytes += requestSize;
            const logEntry = {
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
    logToConsole(entry, totalSize) {
        console.table([
            {
                Time: entry.timestamp.toISOString(),
                Method: entry.method,
                Status: entry.status || "FAILED",
                Type: entry.resourceType,
                "Request (bytes)": entry.requestSize,
                "Response (bytes)": entry.responseSize,
                "Total (bytes)": totalSize,
                URL: entry.url.length > 60
                    ? entry.url.substring(0, 57) + "..."
                    : entry.url,
            },
        ]);
        console.log(`Cumulative usage: ${this.formatBytes(this.bytes)}\n`);
    }
    /**
     * Format bytes to human-readable string
     */
    formatBytes(bytes) {
        if (bytes === 0)
            return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    }
    /**
     * Get current usage data for saving to database
     */
    getUsageData() {
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
    getRequests() {
        return this.requests;
    }
    /**
     * Get total bytes transferred
     */
    getTotalBytes() {
        return this.bytes;
    }
}
exports.DataUsageTracker = DataUsageTracker;
