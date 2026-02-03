/**
 * Type definitions for Roverfox Client
 */

export type RoverfoxProxyObject = {
  server: string;
  username: string;
  password: string;
} | null;

export interface ServerAssignment {
  roverfoxWsUrl: string;
  replayWsUrl: string;
  serverId: string;
  serverIp: string;
}

// Profile and storage types

export type LoggedActivityType =
  | "scroll"
  | "upvote"
  | "comment"
  | "post"
  | "openContext"
  | "closeContext"
  | "joinSubreddit";

export interface Cookie {
  name: string;
  path: string;
  value: string;
  domain: string;
  secure: boolean;
  expires: number;
  httpOnly: boolean;
  sameSite: "Strict" | "Lax" | "None";
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

export interface ProfileStorageData {
  proxyUrl: string | null;
  storageState: StorageState;
  fontSpacingSeed: number;
  audioFingerprintSeed?: number;
  screenDimensions?: {
    width: number;
    height: number;
    colorDepth?: number;
  };
  timezone?: string;
  geolocation?: {
    lat: number;
    lon: number;
  };
  countryCode?: string;
  lastKnownIP?: string;
}

export type RoverFoxProfileData = {
  browser_id: string;
  data: ProfileStorageData;
};
