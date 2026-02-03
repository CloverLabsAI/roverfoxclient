import type { IncomingMessage } from "http";
import type { Server as HttpsServer } from "https";

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
  skipAuth?: boolean; // Skip authentication for local development
  numBrowserServers?: number; // Number of browser servers to launch (default: 3)
  headless?: boolean; // Run browser in headless mode (default: true)
  quiet?: boolean; // Suppress verbose logs (default: false)
}

export class AuthManager {
  constructor(private config: ServerConfig) {}

  /**
   * Parses Basic authentication header
   */
  public parseBasicAuth(authHeader: string): AuthCredentials | null {
    const match = authHeader.match(/^Basic\s+(.+)$/i);
    if (!match || !match[1]) return null;

    try {
      const decoded = Buffer.from(match[1], "base64").toString("utf8");
      const colonIndex = decoded.indexOf(":");

      if (colonIndex === -1) return null;

      return {
        user: decoded.slice(0, colonIndex),
        pass: decoded.slice(colonIndex + 1),
      };
    } catch {
      return null;
    }
  }

  /**
   * Validates Bearer token
   */
  public validateBearerToken(authHeader: string): boolean {
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!match || !match[1]) return false;

    const token = match[1].trim();
    return this.config.authTokens.includes(token);
  }

  /**
   * Checks if request is authorized
   */
  public isRequestAuthorized(req: IncomingMessage): boolean {
    // Skip authentication if flag is set (for local development)
    if (this.config.skipAuth) {
      return true;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) return false;

    // Check Bearer token authentication
    if (
      this.config.authTokens.length > 0 &&
      this.validateBearerToken(authHeader)
    ) {
      return true;
    }

    // Check Basic authentication
    if (this.config.basicAuth.user && this.config.basicAuth.pass) {
      const credentials = this.parseBasicAuth(authHeader);
      if (
        credentials &&
        credentials.user === this.config.basicAuth.user &&
        credentials.pass === this.config.basicAuth.pass
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Logs authentication configuration status
   */
  public logAuthStatus(): void {
    if (this.config.quiet) {
      return; // Suppress all auth logs in quiet mode
    }

    if (this.config.skipAuth) {
      console.log("[auth] ⚠️  Authentication disabled (local mode)");
    } else if (this.config.authTokens.length > 0) {
      console.log("[auth] ✓ ROVERFOX_API_KEY configured");
    } else {
      console.warn(
        "[auth] ⚠️  WARNING: No authentication configured! Set ROVERFOX_API_KEY environment variable.",
      );
    }
  }
}
