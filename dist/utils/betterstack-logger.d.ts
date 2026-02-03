/**
 * BetterStack Logger - Sends logs to BetterStack via Logtail
 */
export interface DataUsageLog {
    browserId: string;
    start: string;
    end: string;
    bytes: number;
    durationMs: number;
}
/**
 * Log data usage to BetterStack when a profile session ends
 */
export declare function logDataUsage(data: DataUsageLog): Promise<void>;
/**
 * Flush pending logs (call before process exit)
 */
export declare function flushLogs(): Promise<void>;
