/**
 * Type definitions for Roverfox Client
 */
export type RoverfoxProxyObject = {
    server: string;
    username: string;
    password: string;
} | null;
export type Platform = 'mac' | 'linux';
export interface NewProfileOptions {
    platform?: Platform;
}
export interface ServerAssignmentOptions {
    browserId?: string;
    platform?: Platform;
}
export interface ServerAssignment {
    roverfoxWsUrl: string;
    replayWsUrl: string;
    serverId: string;
    serverIp: string;
}
