/**
 * Client for communicating with Roverfox Manager
 */
import type { ServerAssignment } from "./types.js";
export declare class ManagerClient {
    private managerUrl;
    private debug;
    constructor(managerUrl?: string, debug?: boolean);
    /**
     * Gets server assignment from manager
     */
    getServerAssignment(): Promise<ServerAssignment>;
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
    createProfile(browserId: string, profileData: any, proxyId: number): Promise<void>;
    /**
     * Updates profile data via manager
     */
    updateProfileData(browserId: string, profileData: any, proxyId?: number): Promise<void>;
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
    logUsage(browserId: string, start: string, end: string, bytes: number): Promise<void>;
}
