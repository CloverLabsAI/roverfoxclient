/**
 * Utility functions for Roverfox Client
 */

import type { RoverfoxProxyObject } from './types';

/**
 * Formats a proxy URL string into a proxy object
 */
export function formatProxyURL(proxyUrl: string): RoverfoxProxyObject {
  if (!proxyUrl) return null;

  try {
    const url = new URL(proxyUrl);
    return {
      server: `${url.protocol}//${url.host}`,
      username: url.username || '',
      password: url.password || '',
    };
  } catch (error) {
    // Silently return null on parse error - caller should handle validation
    return null;
  }
}

/**
 * Creates a proxy URL from individual components
 */
export function createProxyUrl({
  entry,
  port,
  username,
  password,
}: {
  entry: string;
  port: number;
  username: string;
  password: string;
}): string {
  const proxyUrl = `http://${username}:${password}@${entry}:${port}`;
  return proxyUrl;
}
