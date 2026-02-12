import { type ServerConfig } from './auth.js';
export declare class RoverFoxProxyServer {
    private config;
    private browserServers;
    private replayHub;
    private browserProxy;
    private authManager;
    private wsManager;
    private capacityReporter;
    private isShuttingDown;
    private restartAttempts;
    private maxRestartAttempts;
    private readonly numBrowserServers;
    private serverId;
    private serverIp;
    private instanceId;
    private metricsInterval;
    private isDraining;
    constructor(config: ServerConfig);
    /**
     * Starts the proxy server
     */
    start(): Promise<void>;
    /**
     * Launches multiple Camoufox browser servers for load distribution
     */
    private launchBrowserServers;
    /**
     * Sets up monitoring for browser server crashes and disconnections
     */
    private setupBrowserServerMonitoring;
    /**
     * Handles browser server crashes with automatic restart
     */
    private handleBrowserServerCrash;
    /**
     * Gracefully shuts down the server
     */
    shutdown(): Promise<void>;
    /**
     * Loads browser configuration from JSON file
     */
    private loadBrowserConfig;
    getBrowserWsEndpoints(): string[];
    getWsProxyLocalEndpoint(): string;
    getWsReplayLocalEndpoint(): string;
    /**
     * Gets actual memory usage from system (matches htop)
     */
    private getSystemMemoryUsage;
    /**
     * Sets the server to draining mode
     */
    setDraining(draining: boolean): void;
    /**
     * Gets current server metrics using existing ReplayHub tracking
     */
    getMetrics(): Promise<{
        activeContexts: number;
        activeProfileIds: string[];
        totalPages: number;
        memoryUsagePercent: number;
        memoryUsedMB: number;
        memoryTotalMB: number;
        heapUsedMB: number;
        heapTotalMB: number;
    }>;
    /**
     * Gets the manager URL from environment or default
     */
    private getManagerUrl;
    /**
     * Builds authorization headers for manager API calls
     */
    private getAuthHeaders;
    /**
     * Initializes the capacity reporter for tracking WebSocket connections
     */
    private initializeCapacityReporter;
    /**
     * Registers server via manager API so manager can monitor
     */
    private registerServer;
    /**
     * Activates the server by setting state to 'active' via manager API
     */
    activateServer(): Promise<void>;
    /**
     * Gets public IP address
     */
    private getPublicIP;
    /**
     * Starts periodic metrics reporting to database
     */
    private startMetricsReporting;
    /**
     * Reports current metrics via manager API
     */
    private reportMetrics;
}
