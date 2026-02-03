/**
 * Utility functions for Roverfox Client
 */

import type { RoverfoxProxyObject } from "../types.js";

/**
 * Formats a proxy URL string into a proxy object
 */
export function formatProxyURL(proxyUrl: string): RoverfoxProxyObject {
  if (!proxyUrl) return null;

  try {
    const url = new URL(proxyUrl);
    return {
      server: `${url.protocol}//${url.host}`,
      username: url.username || "",
      password: url.password || "",
    };
  } catch (_error) {
    // Silently return null on parse error - caller should handle validation
    return null;
  }
}
