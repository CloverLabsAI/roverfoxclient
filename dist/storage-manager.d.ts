/**
 * Storage management for browser profiles
 */
import { Page } from 'playwright';
import { ManagerClient } from './manager-client.js';
import type { RoverFoxProfileData } from './types/client.js';
export declare class StorageManager {
    private managerClient;
    private scriptsCache;
    constructor(managerClient: ManagerClient | null);
    /**
     * Saves storage state to Manager
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
     * Sets Camoufox-specific fingerprinting properties
     */
    private setCamoufoxFingerprintingProperties;
    /**
     * Sets Brave-specific fingerprinting properties
     */
    private setBraveFingerprintingProperties;
    /**
     * Exports storage from a page
     */
    private exportStorage;
    /**
     * Loads browser scripts for storage export
     */
    private scripts;
}
