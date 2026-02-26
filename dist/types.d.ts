/**
 * Type definitions for Roverfox Client
 */
export type RoverfoxProxyObject = {
    server: string;
    username: string;
    password: string;
} | null;
import type { BrowserType, Platform } from '@roverfox/types';
export type { BrowserType, Platform };
export interface NewProfileOptions {
    platform?: Platform;
    browserType?: BrowserType;
    geoState?: string;
    latitude?: number;
    longitude?: number;
}
export interface ServerAssignmentOptions {
    browserId?: string;
    platform?: Platform;
    browserType?: BrowserType;
}
export interface ServerAssignment {
    roverfoxWsUrl: string;
    replayWsUrl: string;
    serverId: string;
    serverIp: string;
}
