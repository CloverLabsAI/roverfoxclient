/**
 * Utility functions for Roverfox Client
 */
import type { RoverfoxProxyObject } from './types';
/**
 * Formats a proxy URL string into a proxy object
 */
export declare function formatProxyURL(proxyUrl: string): RoverfoxProxyObject;
/**
 * Creates a proxy URL from individual components
 */
export declare function createProxyUrl({ entry, port, username, password, }: {
    entry: string;
    port: number;
    username: string;
    password: string;
}): string;
