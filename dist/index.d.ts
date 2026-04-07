/**
 * Roverfox Client - Main entry point
 * Connects to distributed Roverfox servers via manager
 */
import type { BrowserContext } from 'playwright';
import type { BrowserType, NewProfileOptions } from './types.js';
import type { RoverFoxProfileData } from './types/client.js';
export interface RoverfoxCloseOptions {
    isOneTime?: boolean;
}
export interface RoverfoxBrowserContext extends BrowserContext {
    close(options?: Parameters<BrowserContext['close']>[0] & RoverfoxCloseOptions): Promise<void>;
}
export declare class RoverfoxClient {
    private connectionPool;
    private managerClient;
    private replayManager;
    private storageManager;
    private dataUsageTrackers;
    private geoService;
    private debug;
    private workerWsUrl;
    private static localServer;
    private static localServerConfig;
    private static localPort;
    constructor(wsAPIKey: string, managerUrl?: string, debug?: boolean, options?: {
        workerWsUrl?: string;
    });
    /**
     * Launch a browser profile - gets server assignment from manager.
     * Optionally pass a proxyUrl to override dynamic proxy selection.
     */
    launchProfile(browserId: string, options?: {
        proxyUrl?: string;
        service?: string;
    }): Promise<RoverfoxBrowserContext>;
    /**
     * Launch a one-time browser without profile
     */
    launchOneTimeBrowser(proxyUrl: string | null, options?: NewProfileOptions): Promise<RoverfoxBrowserContext>;
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
    static launchLocalContext(proxyUrl?: string, browserType?: BrowserType): Promise<RoverfoxBrowserContext>;
    /**
     * Starts the local roverfox server
     */
    private static startLocalServer;
    /**
     * Internal method to launch instance with profile data
     */
    private launchInstance;
    /**
     * Creates a new profile with auto-assigned geo state and fingerprint.
     * Geo is assigned proportionally based on proxy capacity per state.
     * Override with options.geoState/latitude/longitude if needed.
     */
    createProfile(options?: NewProfileOptions): Promise<RoverFoxProfileData>;
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
export type { GeoLocationData, ProxyConfig, } from '@roverfox/geolocation-service';
export { getGeoService, IPGeolocationService, } from '@roverfox/geolocation-service';
export type { FingerprintInitValues } from './fingerprint-init-script.js';
export { applyFingerprint } from './fingerprint-init-script.js';
export { generateRandomLinuxFontSubset, LINUX_FONTS } from './linux-fonts.js';
export { generateRandomFontSubset, MAC_FONTS } from './mac-fonts.js';
export type { BrowserType, Platform } from './types.js';
