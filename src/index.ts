/**
 * Roverfox Client - Browser automation client built on Playwright for Firefox
 */

export { RoverfoxClient, RoverfoxClient as default } from "./client";

// Re-export types for consumers
export type {
    RoverFoxProfileData,
    RoverfoxProxyObject,
    ServerAssignment,
    StorageState,
    Cookie,
    ProfileStorageData,
} from "./types";

// Re-export utilities
export { formatProxyURL, createProxyUrl } from "./utils";
