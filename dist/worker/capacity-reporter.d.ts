import type { SupabaseClient } from '@supabase/supabase-js';
export interface WorkerCapacityMetrics {
    workerId: string;
    instanceId: string | null;
    activeSessions: number;
    maxSessions: number;
    availableCapacity: number;
    cpuPercent: number;
    memoryPercent: number;
}
export declare class CapacityReporter {
    private workerId;
    private workerIp;
    private instanceId;
    private maxSessions;
    private activeSessions;
    private supabase;
    private cloudwatch;
    private lastUpdateTime;
    private updateThrottleMs;
    private quiet;
    constructor(workerId: string, workerIp: string, maxSessions?: number, instanceId?: string | null, quiet?: boolean);
    /**
     * Initialize the reporter with Supabase and CloudWatch clients
     */
    initialize(supabase: SupabaseClient | null, region?: string): Promise<void>;
    /**
     * Called when a new WebSocket connection is opened
     */
    onConnectionOpen(): Promise<void>;
    /**
     * Called when a WebSocket connection is closed
     */
    onConnectionClose(): Promise<void>;
    /**
     * Get current capacity metrics
     */
    getMetrics(): WorkerCapacityMetrics;
    /**
     * Update capacity in both Supabase and CloudWatch
     */
    private updateCapacity;
    /**
     * Update worker capacity in Supabase
     */
    private updateSupabase;
    /**
     * Publish capacity metrics to CloudWatch
     */
    private publishToCloudWatch;
    /**
     * Force an immediate capacity update
     */
    forceUpdate(): Promise<void>;
}
