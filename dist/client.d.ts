/**
 * Roverfox Client - Main entry point
 * Connects to distributed Roverfox servers via manager
 */
import { BrowserContext } from "playwright";
import { SupabaseClient } from "@supabase/supabase-js";
import { RoverFoxProfileData } from "./types";
export declare class RoverfoxClient {
    private supabaseClient;
    private connectionPool;
    private managerClient;
    private replayManager;
    private storageManager;
    private dataUsageTrackers;
    private debug;
    constructor(supabaseClient: SupabaseClient, wsAPIKey: string, managerUrl?: string, debug?: boolean);
    /**
     * Launch a browser profile - gets server assignment from manager
     */
    launchProfile(browserId: string): Promise<BrowserContext>;
    /**
     * Launch a one-time browser without profile
     */
    launchOneTimeBrowser(proxyUrl: string | null): Promise<BrowserContext>;
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
}
export { RoverfoxClient as default };
