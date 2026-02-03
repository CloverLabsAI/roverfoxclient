"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthManager = void 0;
class AuthManager {
    constructor(config) {
        this.config = config;
    }
    /**
     * Parses Basic authentication header
     */
    parseBasicAuth(authHeader) {
        const match = authHeader.match(/^Basic\s+(.+)$/i);
        if (!match || !match[1])
            return null;
        try {
            const decoded = Buffer.from(match[1], "base64").toString("utf8");
            const colonIndex = decoded.indexOf(":");
            if (colonIndex === -1)
                return null;
            return {
                user: decoded.slice(0, colonIndex),
                pass: decoded.slice(colonIndex + 1),
            };
        }
        catch (_a) {
            return null;
        }
    }
    /**
     * Validates Bearer token
     */
    validateBearerToken(authHeader) {
        const match = authHeader.match(/^Bearer\s+(.+)$/i);
        if (!match || !match[1])
            return false;
        const token = match[1].trim();
        return this.config.authTokens.includes(token);
    }
    /**
     * Checks if request is authorized
     */
    isRequestAuthorized(req) {
        // Skip authentication if flag is set (for local development)
        if (this.config.skipAuth) {
            return true;
        }
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return false;
        // Check Bearer token authentication
        if (this.config.authTokens.length > 0 &&
            this.validateBearerToken(authHeader)) {
            return true;
        }
        // Check Basic authentication
        if (this.config.basicAuth.user && this.config.basicAuth.pass) {
            const credentials = this.parseBasicAuth(authHeader);
            if (credentials &&
                credentials.user === this.config.basicAuth.user &&
                credentials.pass === this.config.basicAuth.pass) {
                return true;
            }
        }
        return false;
    }
    /**
     * Logs authentication configuration status
     */
    logAuthStatus() {
        if (this.config.quiet) {
            return; // Suppress all auth logs in quiet mode
        }
        if (this.config.skipAuth) {
            console.log("[auth] ⚠️  Authentication disabled (local mode)");
        }
        else if (this.config.authTokens.length > 0) {
            console.log("[auth] ✓ ROVERFOX_API_KEY configured");
        }
        else {
            console.warn("[auth] ⚠️  WARNING: No authentication configured! Set ROVERFOX_API_KEY environment variable.");
        }
    }
}
exports.AuthManager = AuthManager;
