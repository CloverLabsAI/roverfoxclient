/**
 * Roverfox Client - Main entry point
 * Connects to distributed Roverfox servers via manager
 */
import { BrowserContext } from "playwright";
import type { RoverFoxProfileData } from "./types/client.js";
export declare class RoverfoxClient {
    private connectionPool;
    private managerClient;
    private replayManager;
    private storageManager;
    private dataUsageTrackers;
    private geoService;
    private debug;
    private static localServer;
    private static localServerConfig;
    private static localPort;
    constructor(wsAPIKey: string, managerUrl?: string, debug?: boolean);
    /**
     * Launch a browser profile - gets server assignment from manager
     */
    launchProfile(browserId: string): Promise<BrowserContext>;
    /**
     * Launch a one-time browser without profile
     */
    launchOneTimeBrowser(proxyUrl: string | null): Promise<BrowserContext>;
    /**
     * Check if a port is in use
     */
    private static isPortInUse;
    /**
     * Health check for existing server
     */
    private static healthCheckServer;
    /**
     * Launch a local context using on-demand local roverfox server
     * Checks if server is already running on port 9001 and connects to it,
     * or spins up a new server if not. This check happens every time.
     * Server runs persistently across multiple processes - no automatic shutdown.
     * Note: Local contexts don't use streaming/replay functionality
     * This is a static method - no client instance required
     */
    static launchLocalContext(proxyUrl?: string): Promise<BrowserContext>;
    /**
     * Starts the local roverfox server
     */
    private static startLocalServer;
    /**
     * Shuts down the local roverfox server
     */
    private static shutdownLocalServer;
    /**
     * Internal method to launch instance with profile data
     */
    private launchInstance;
    /**
     * Creates a new profile
     */
    createProfile(proxyUrl: string, proxyId: number): Promise<RoverFoxProfileData>;
    /**
     * Deletes a profile
     */
    deleteProfile(browserId: string): Promise<void>;
    /**
     * Lists all profiles
     */
    listProfiles(): Promise<{
        browser_id: string;
        data: any;
    }[]>;
    /**
     * Updates profile data for a specific browser
     */
    updateProfileData(browserId: string, newData: {
        [k: string]: any;
    }): Promise<void>;
    /**
     * Gets profile data for a specific browser
     */
    getProfileData(browserId: string): Promise<any>;
}
export { RoverfoxClient as default };
export type { GeoLocationData, ProxyConfig } from "./ip-geolocation.js";
export { getGeoService, IPGeolocationService } from "./ip-geolocation.js";
