/**
 * Shared fingerprint module - applies per-context fingerprints via Playwright's addInitScript
 * and sets up per-page fingerprinting fallback handlers.
 *
 * The init script runs BEFORE any page scripts, ensuring fingerprint values are set immediately
 * and custom window functions self-destruct before detection.
 *
 * The page event handler provides a fallback that re-applies fingerprinting properties
 * after navigation, covering edge cases the init script may miss.
 */
import type { Page } from 'playwright';
import type { RoverFoxProfileData } from './types/client.js';
interface FingerprintContext {
    addInitScript(script: (arg: any) => void, arg?: any): Promise<unknown>;
    on(event: 'page', listener: (page: Page) => void): void;
}
export interface FingerprintInitValues {
    fontSpacingSeed?: number;
    audioFingerprintSeed?: number;
    screenWidth?: number;
    screenHeight?: number;
    screenColorDepth?: number;
    timezone?: string;
    lastKnownIP?: string;
    navigatorPlatform?: string;
    navigatorOscpu?: string;
    hardwareConcurrency?: number;
    webglVendor?: string;
    webglRenderer?: string;
    canvasSeed?: number;
    fontList?: string[];
    speechVoices?: string[];
}
/**
 * Applies fingerprinting to a browser context.
 *
 * 1. Registers an init script that runs before any page scripts on every page/navigation,
 *    calling the Camoufox window.setXxx() functions which then self-destruct.
 * 2. Sets up a page event handler as a fallback that re-applies fingerprinting properties
 *    after navigation for edge cases the init script may miss.
 */
export declare function applyFingerprint(context: FingerprintContext, values: FingerprintInitValues, profile: RoverFoxProfileData): Promise<void>;
export {};
