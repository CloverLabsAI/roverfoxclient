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
