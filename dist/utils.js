"use strict";
/**
 * Utility functions for Roverfox Client
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatProxyURL = formatProxyURL;
exports.createProxyUrl = createProxyUrl;
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
            username: url.username || '',
            password: url.password || '',
        };
    }
    catch (error) {
        // Silently return null on parse error - caller should handle validation
        return null;
    }
}
/**
 * Creates a proxy URL from individual components
 */
function createProxyUrl({ entry, port, username, password, }) {
    const proxyUrl = `http://${username}:${password}@${entry}:${port}`;
    return proxyUrl;
}
