/**
 * Lightweight local proxy server for launching browser contexts locally.
 * Uses @roverfox/worker-core components but omits production infrastructure
 * (AWS registration, capacity reporting, metrics, HTTPS certificates).
 */
import { type ServerConfig } from '@roverfox/worker-core';
export { type ServerConfig } from '@roverfox/worker-core';
export declare class LocalProxyServer {
    private config;
    private browserServers;
    private browserProxy;
    private authManager;
    private wsManager;
    private readonly numBrowserServers;
    constructor(config: ServerConfig);
    /**
     * Starts the local proxy server
     */
    start(): Promise<void>;
    /**
     * Gracefully shuts down the server
     */
    shutdown(): Promise<void>;
}
