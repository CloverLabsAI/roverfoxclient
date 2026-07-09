/**
 * Client for communicating with Roverfox Manager
 */
import type { BrowserType, Platform, ServerAssignment, ServerAssignmentOptions } from './types.js';
export interface ManagerProxySelectParams {
    allowNeighborFallback?: boolean;
    browserId?: string;
    geoState?: string;
    latitude?: number;
    longitude?: number;
    maxDistanceKm?: number;
    requireExactState?: boolean;
    sessionLengthSeconds?: number;
    service?: string;
}
export interface ManagerRequestOptions {
    timeoutMs?: number;
}
export interface ManagerProxySelection {
    proxyId: number | null;
    leaseId: string | null;
    expiresAt: string | null;
    proxyUrl: string;
    exitIp: string | null;
    geoState: string | null;
    latitude?: number | null;
    longitude?: number | null;
    provider?: string;
    plan?: string | null;
}
export interface ManagerProxyReleaseOptions extends ManagerRequestOptions {
    throwOnError?: boolean;
}
export declare class ManagerClient {
    private manager;
    private debug;
    constructor(apiKey: string, managerUrl?: string, debug?: boolean);
    /**
     * Gets server assignment from manager
     */
    getServerAssignment(options?: ServerAssignmentOptions): Promise<ServerAssignment>;
    /**
     * Assigns the least-used Firefox fingerprint from the pool.
     * Returns fingerprint data mapped to ProfileStorageData fields.
     */
    assignFingerprint(platform?: Platform, browserType?: BrowserType): Promise<{
        fingerprintId: string;
        userAgent: string | null;
        navigatorPlatform: string;
        navigatorOscpu: string;
        hardwareConcurrency: number;
        webglVendor: string | null;
        webglRenderer: string | null;
        screenDimensions: {
            width: number;
            height: number;
            colorDepth: number;
        };
        devicePixelRatio: number;
        fontList: string[];
        speechVoices: string[];
    }>;
    /**
     * Fetches a specific fingerprint by ID (for backfill of missing fields).
     * Returns the same format as assignFingerprint() but does NOT increment times_assigned.
     */
    getFingerprint(fingerprintId: string): Promise<{
        fingerprintId: string;
        userAgent: string | null;
        navigatorPlatform: string;
        navigatorOscpu: string;
        hardwareConcurrency: number;
        webglVendor: string | null;
        webglRenderer: string | null;
        screenDimensions: {
            width: number;
            height: number;
            colorDepth: number;
        };
        devicePixelRatio: number;
        fontList: string[];
        speechVoices: string[];
    }>;
    /**
     * Selects a geo-matched proxy for a browser profile.
     * Manager handles the DB lookup, health check, and reservation.
     */
    selectProxy(params: ManagerProxySelectParams, options?: ManagerRequestOptions): Promise<ManagerProxySelection>;
    /**
     * Releases a proxy back to the pool after session ends.
     */
    releaseProxy(proxyId: number | null | undefined, rotate?: boolean, browserId?: string, leaseId?: string | null, options?: ManagerProxyReleaseOptions): Promise<boolean>;
    /**
     * Assigns a geo state to a profile proportionally based on proxy availability.
     */
    assignGeo(browserId: string): Promise<{
        geoState: string;
        latitude: number;
        longitude: number;
    }>;
    /**
     * Lists all profiles via manager
     */
    listProfiles(): Promise<{
        browser_id: string;
        data: any;
    }[]>;
    /**
     * Gets profile and proxy data from manager
     */
    getProfile(browserId: string): Promise<any>;
    /**
     * Creates a new profile via manager
     */
    createProfile(browserId: string, profileData: any, platform?: Platform, browserType?: BrowserType): Promise<void>;
    /**
     * Updates profile data via manager
     */
    updateProfileData(browserId: string, profileData: any): Promise<void>;
    /**
     * Deletes a profile via manager
     */
    deleteProfile(browserId: string): Promise<void>;
    /**
     * Updates storage state via manager
     */
    updateStorage(browserId: string, storageData: any): Promise<void>;
    /**
     * Logs an action audit via manager
     */
    logAudit(browserId: string, actionType: string, metadata: any): Promise<void>;
    /**
     * Logs data usage via manager
     */
    logUsage(browserId: string, start: string, end: string, bytes: number, isOneTime?: boolean, serverId?: string, leaseId?: string | null): Promise<void>;
}
