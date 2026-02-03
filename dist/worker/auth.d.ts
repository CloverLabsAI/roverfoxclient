import type { IncomingMessage } from 'http';
import type { Server as HttpsServer } from 'https';
export interface AuthCredentials {
    user: string;
    pass: string;
}
export interface ServerConfig {
    port: number;
    host: string;
    authTokens: string[];
    basicAuth: {
        user: string;
        pass: string;
    };
    proxyPath: string;
    replayPath: string;
    httpsServer?: HttpsServer;
    skipAuth?: boolean;
    numBrowserServers?: number;
    headless?: boolean;
    quiet?: boolean;
}
export declare class AuthManager {
    private config;
    constructor(config: ServerConfig);
    /**
     * Parses Basic authentication header
     */
    parseBasicAuth(authHeader: string): AuthCredentials | null;
    /**
     * Validates Bearer token
     */
    validateBearerToken(authHeader: string): boolean;
    /**
     * Checks if request is authorized
     */
    isRequestAuthorized(req: IncomingMessage): boolean;
    /**
     * Logs authentication configuration status
     */
    logAuthStatus(): void;
}
