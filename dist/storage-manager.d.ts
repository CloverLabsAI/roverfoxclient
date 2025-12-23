/**
 * Storage management for browser profiles
 */
import { Page } from "playwright";
import { SupabaseClient } from "@supabase/supabase-js";
import { RoverFoxProfileData } from "./types";
export declare class StorageManager {
    private supabaseClient;
    private scriptsCache;
    constructor(supabaseClient: SupabaseClient);
    /**
     * Saves storage state to Supabase
     */
    saveStorage(page: Page, profile: RoverFoxProfileData): Promise<void>;
    /**
     * Initializes periodic storage saver
     */
    initStorageSaver(page: Page, profile: RoverFoxProfileData): void;
    /**
     * Sets fingerprinting properties on a page
     */
    setFingerprintingProperties(page: Page, profile: RoverFoxProfileData): Promise<void>;
    /**
     * Exports storage from a page
     */
    private exportStorage;
    /**
     * Loads browser scripts for storage export
     */
    private scripts;
}
