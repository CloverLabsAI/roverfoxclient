/**
 * Connection pool manager for multiple Roverfox servers
 */

import { Browser, firefox } from "playwright";
import WebSocket from "ws";

export class ConnectionPool {
  private browsers: Map<string, Browser> = new Map(); // wsEndpoint -> Browser
  private replayWebSockets: Map<string, WebSocket> = new Map(); // replayEndpoint -> WebSocket
  private connectionLocks: Map<string, Promise<void>> = new Map(); // wsEndpoint -> lock
  private wsAPIKey: string;
  private streamingMessageHandler?: (message: any) => void;
  private debug: boolean;

  constructor(wsAPIKey: string, debug: boolean = false) {
    this.wsAPIKey = wsAPIKey;
    this.debug = debug;
  }

  /**
   * Sets the handler for streaming control messages
   */
  setStreamingMessageHandler(handler: (message: any) => void): void {
    this.streamingMessageHandler = handler;
  }

  /**
   * Gets or creates a browser connection for the given endpoint
   */
  async getBrowserConnection(wsEndpoint: string): Promise<Browser> {
    // Check if we already have a valid connection
    const existingBrowser = this.browsers.get(wsEndpoint);
    if (existingBrowser && existingBrowser.isConnected()) {
      if (this.debug)
        console.log(`[client] Reusing existing connection to ${wsEndpoint}`);
      return existingBrowser;
    }

    // Use per-endpoint lock to prevent concurrent connections to same server
    let lock = this.connectionLocks.get(wsEndpoint);
    if (!lock) {
      lock = this.connectToBrowser(wsEndpoint);
      this.connectionLocks.set(wsEndpoint, lock);
    }

    await lock;

    const browser = this.browsers.get(wsEndpoint);
    if (!browser) {
      throw new Error(`Failed to establish connection to ${wsEndpoint}`);
    }

    return browser;
  }

  /**
   * Connects to a browser server
   */
  private async connectToBrowser(wsEndpoint: string): Promise<void> {
    if (this.debug)
      console.log(`[client] Connecting to browser server: ${wsEndpoint}`);

    // Connect to browser server
    const browser = await firefox.connect(wsEndpoint, {
      headers: {
        Authorization: `Bearer ${this.wsAPIKey}`,
      },
    });

    // Store the connection
    this.browsers.set(wsEndpoint, browser);

    // Set up disconnected event listener
    browser.on("disconnected", () => {
      if (this.debug)
        console.log(`[client] Browser disconnected: ${wsEndpoint}`);
      this.browsers.delete(wsEndpoint);
      this.connectionLocks.delete(wsEndpoint);
    });

    // Clear the lock after successful connection
    this.connectionLocks.delete(wsEndpoint);
  }

  /**
   * Gets or creates a replay WebSocket connection
   */
  getReplayWebSocket(replayEndpoint: string): WebSocket {
    // Check if we already have a connection
    let ws = this.replayWebSockets.get(replayEndpoint);

    // Reuse if OPEN or CONNECTING (avoid creating duplicate connections)
    if (
      ws &&
      (ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING)
    ) {
      if (this.debug)
        console.log(
          `[client] Reusing existing replay WebSocket: ${replayEndpoint} (state: ${ws.readyState})`,
        );
      // Note: Message handler is already attached when WebSocket was created
      return ws;
    }

    // Create new WebSocket connection
    console.log(`[client] Creating new replay WebSocket: ${replayEndpoint}`);
    ws = new WebSocket(replayEndpoint);
    this.replayWebSockets.set(replayEndpoint, ws);

    ws.on("error", (err) => {
      console.error(`[connection-pool] WebSocket error:`, err);
    });

    // Set up message listener for streaming control
    ws.on("message", (data: WebSocket.Data) => {
      try {
        const message = JSON.parse(data.toString());
        if (this.streamingMessageHandler) {
          this.streamingMessageHandler(message);
        }
      } catch (error) {
        console.error(`[connection-pool] Failed to parse message:`, error);
      }
    });

    // Clean up on close
    ws.on("close", () => {
      if (this.debug)
        console.log(`[client] Replay WebSocket closed: ${replayEndpoint}`);
      this.replayWebSockets.delete(replayEndpoint);
    });

    return ws;
  }

  /**
   * Ensures a WebSocket is open before use
   */
  async ensureWsOpen(ws: WebSocket): Promise<void> {
    return new Promise((resolve, reject) => {
      if (ws.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      // WebSocket is CONNECTING, wait for open event
      const onOpen = () => {
        ws.removeEventListener("open", onOpen);
        ws.removeEventListener("error", onError);
        resolve();
      };

      const onError = (error: any) => {
        ws.removeEventListener("open", onOpen);
        ws.removeEventListener("error", onError);
        reject(
          new Error(`WebSocket connection failed: ${error.message || error}`),
        );
      };

      ws.addEventListener("open", onOpen);
      ws.addEventListener("error", onError);
    });
  }

  /**
   * Safely sends a message through WebSocket after ensuring it's open
   */
  async safeSend(ws: WebSocket, message: any): Promise<void> {
    await this.ensureWsOpen(ws);
    ws.send(JSON.stringify(message));
  }
}
