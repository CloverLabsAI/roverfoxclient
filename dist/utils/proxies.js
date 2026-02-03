"use strict";
/**
 * Utility functions for Roverfox Client
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatProxyURL = formatProxyURL;
/**
 * Formats a proxy URL string into a proxy object
 */
function formatProxyURL(proxyUrl) {
    if (!proxyUrl)
        return null;
    try {
        const url = new URL(proxyUrl);
        return {
            server: `${url.protocol}//${url.host}`,
            username: url.username || "",
            password: url.password || "",
        };
    }
    catch (_error) {
        // Silently return null on parse error - caller should handle validation
        return null;
    }
}
