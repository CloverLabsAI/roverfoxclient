import type { IncomingMessage } from "http";
import WebSocket, { type RawData, WebSocketServer } from "ws";

import { AuthManager, type ServerConfig } from "./auth.js";
import { BrowserProxy } from "./browser-proxy.js";
import { ReplayHub } from "./replay-hub.js";

export class WebSocketManager {
  private wsServer: WebSocketServer | null = null;
  private wsServerUrl: string | null = null;

  constructor(
    private config: ServerConfig,
    private replayHub: ReplayHub,
    private browserProxy: BrowserProxy,
    private authManager: AuthManager,
  ) {}

  /**
   * Creates and configures the WebSocket server with path-based routing
   */
  public async createWebSocketServer(): Promise<void> {
    const wsOptions: any = {
      verifyClient: (info: { req: IncomingMessage }) => {
        return this.verifyClient(info);
      },
    };

    // Use HTTPS server if provided, otherwise use port/host
    if (this.config.httpsServer) {
      wsOptions.server = this.config.httpsServer;
      this.config.httpsServer.listen(this.config.port, this.config.host);
    } else {
      wsOptions.port = this.config.port;
      wsOptions.host = this.config.host;
    }

    this.wsServer = new WebSocketServer(wsOptions);

    this.wsServer.on(
      "connection",
      (clientWs: WebSocket, req: IncomingMessage) => {
        this.handleConnection(clientWs, req);
      },
    );

    const protocol = this.config.httpsServer ? "wss" : "ws";
    this.wsServerUrl = `${protocol}://${this.config.host}:${this.config.port}`;
    this.logServerInfo();
    this.authManager.logAuthStatus();
  }

  /**
   * Verifies client connections based on path and authentication
   */
  private verifyClient(info: { req: IncomingMessage }): boolean {
    const url = info.req.url;
    // Allow connections to both /roverfox and /replay paths
    if (url !== this.config.proxyPath && url !== this.config.replayPath) {
      return false;
    }
    // /replay path doesn't require authentication
    if (url === this.config.replayPath) {
      return true;
    }
    // /roverfox path requires authentication
    return this.authManager.isRequestAuthorized(info.req);
  }

  /**
   * Handles new WebSocket connections based on path
   */
  private handleConnection(clientWs: WebSocket, req: IncomingMessage): void {
    const url = req.url;

    if (url === this.config.proxyPath) {
      this.handleProxyConnection(clientWs);
    } else if (url === this.config.replayPath) {
      this.handleReplayConnection(clientWs);
    }
  }

  /**
   * Handles browser proxy connections
   */
  private handleProxyConnection(clientWs: WebSocket): void {
    this.browserProxy.registerClient(clientWs);

    clientWs.on("message", (msg: RawData) => {
      this.browserProxy.handleBrowserProxyMessage(clientWs, msg);
    });

    clientWs.on("close", () => {
      this.browserProxy.handleClientDisconnect(clientWs);
    });

    clientWs.on("error", (error: Error) => {
      console.error("[proxy] Client WebSocket error:", error);
      this.browserProxy.handleClientDisconnect(clientWs);
    });
  }

  /**
   * Handles screenshot streaming connections
   */
  private handleReplayConnection(clientWs: WebSocket): void {
    this.replayHub.initializeReplayClient(clientWs);

    clientWs.on("message", (msg) => {
      let data;
      try {
        data = JSON.parse(msg.toString());
      } catch {
        console.warn("[replay] Received non-JSON message, ignoring");
        return;
      }

      this.replayHub.handleScreenshotMessage(clientWs, data);
    });

    clientWs.on("close", () => {
      this.replayHub.handleClientDisconnect(clientWs);
    });

    clientWs.on("error", (error: Error) => {
      console.error("[replay] Client WebSocket error:", error);
      this.replayHub.handleClientDisconnect(clientWs);
    });
  }

  /**
   * Logs server information
   */
  private logServerInfo(): void {
    if (!this.config.quiet) {
      console.log(`[wss] WebSocket server listening on ${this.wsServerUrl}`);
      console.log(
        `[wss] Browser proxy endpoint: ${this.wsServerUrl}${this.config.proxyPath}`,
      );
      console.log(
        `[wss] Screenshot streaming endpoint: ${this.wsServerUrl}${this.config.replayPath}`,
      );
    }
  }

  /**
   * Closes the WebSocket server
   */
  public close(): void {
    if (this.wsServer) {
      this.wsServer.close();
      this.wsServer = null;
    }
  }

  /**
   * Gets the WebSocket server URL endpoints
   */
  public getWsProxyLocalEndpoint(): string {
    return `${this.wsServerUrl}${this.config.proxyPath}`;
  }

  public getWsReplayLocalEndpoint(): string {
    return `${this.wsServerUrl}${this.config.replayPath}`;
  }
}
