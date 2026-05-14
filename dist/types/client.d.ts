export type LoggedActivityType = 'scroll' | 'upvote' | 'comment' | 'post' | 'openContext' | 'closeContext' | 'joinSubreddit';
export interface Cookie {
    name: string;
    path: string;
    value: string;
    domain: string;
    secure: boolean;
    expires: number;
    httpOnly: boolean;
    sameSite: 'Strict' | 'Lax' | 'None';
}
export interface IndexedDBRecord {
    key?: string;
    value: any;
}
export interface IndexedDBStore {
    name: string;
    indexes: string[];
    records: IndexedDBRecord[];
    keyPathArray?: string[];
    autoIncrement?: boolean;
}
export interface IndexedDBDatabase {
    name: string;
    stores: IndexedDBStore[];
    version: number;
}
export interface LocalStorageItem {
    name: string;
    value: string;
}
export interface OriginStorage {
    origin: string;
    indexedDB: IndexedDBDatabase[];
    localStorage: LocalStorageItem[];
}
export interface StorageState {
    cookies: Cookie[];
    origins: OriginStorage[];
}
export type { BrowserType } from '@roverfox/types';
interface BaseProfileData {
    proxyUrl?: string | null;
    storageState: StorageState;
    fingerprintId?: string;
    userAgent?: string;
    screenDimensions?: {
        width: number;
        height: number;
        colorDepth?: number;
    };
    viewport?: {
        width: number;
        height: number;
    };
    devicePixelRatio?: number;
    timezone?: string;
    geolocation?: {
        lat: number;
        lon: number;
    };
    countryCode?: string;
    lastKnownIP?: string;
    navigatorPlatform?: string;
    navigatorOscpu?: string;
    hardwareConcurrency?: number;
    webglVendor?: string;
    webglRenderer?: string;
    canvasSeed?: number;
    fontList?: string[];
    speechVoices?: string[];
    /**
     * @deprecated Recording activation is now per-launch via launchProfile({ recording: true }).
     * This field is retained for backward compatibility with existing profile records but is no longer read by the client.
     */
    recording_enabled?: boolean;
}
export interface CamoufoxProfileData extends BaseProfileData {
    browserType: 'camoufox';
    fontSpacingSeed: number;
    audioFingerprintSeed?: number;
}
export interface BraveProfileData extends BaseProfileData {
    browserType: 'brave';
    fingerprintingSeed: number;
}
export type ProfileStorageData = CamoufoxProfileData | BraveProfileData;
export type RoverFoxProfileData = {
    browser_id: string;
    data: ProfileStorageData;
};
