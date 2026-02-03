/**
 * Replay and screenshot streaming management
 */

import { Page } from "playwright";
import WebSocket from "ws";

import type { ConnectionPool } from "./connection-pool.js";
import type {
  KeyboardPressCommand,
  KeyboardTypeCommand,
  MouseClickCommand,
  MouseMoveCommand,
  ScrollCommand,
} from "./types/replay-protocol.js";

async function sendPageClosedNotification(
  ws: WebSocket,
  browserId: string,
  pageId: string,
) {
  try {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "page-closed",
          uuid: browserId,
          pageId,
        }),
      );
    }
  } catch (_error) {
    // Silently ignore errors
  }
}

interface PageStreamingContext {
  page: Page;
  pageId: string;
  browserId: string;
  replayWs: WebSocket;
  connectionPool: ConnectionPool;
}

export class ReplayManager {
  private mousePositions: Map<string, { x: number; y: number }> = new Map();
  private streamingEnabled: Map<string, boolean> = new Map(); // browserId -> streaming enabled
  private screenshotIntervals: Map<string, NodeJS.Timeout> = new Map(); // pageId -> interval
  private browserPages: Map<string, Map<string, Page>> = new Map(); // browserId -> Map<pageId, Page>
  private pageContexts: Map<string, PageStreamingContext> = new Map(); // pageId -> streaming context
  private static wsInstances: Map<string, WebSocket> = new Map();
  private static wsClosePromises: Map<string, Promise<void>> = new Map();

  /**
   * Enables live replay for a page
   */
  async enableLiveReplay(
    page: Page,
    page_id: string,
    browser_id: string,
    replayWs: WebSocket,
    connectionPool: ConnectionPool,
  ): Promise<void> {
    // Track this page for the browser
    if (!this.browserPages.has(browser_id)) {
      this.browserPages.set(browser_id, new Map());
    }

    // Check if this Page object is already tracked (prevent duplicates)
    const existingPages = this.browserPages.get(browser_id)!;
    for (const [_existingPageId, existingPage] of existingPages.entries()) {
      if (existingPage === page) {
        return; // Page already tracked, don't add it again
      }
    }

    this.browserPages.get(browser_id)!.set(page_id, page);

    // Store streaming context for this page
    this.pageContexts.set(page_id, {
      page,
      pageId: page_id,
      browserId: browser_id,
      replayWs,
      connectionPool,
    });

    // monkey patch page.mouse.move to send mouse position to ws
    const originalMove = page.mouse.move;
    page.mouse.move = async (x: number, y: number) => {
      this.mousePositions.set(page_id, { x, y });
      await originalMove(x, y);
    };

    // Announce the new page as soon as live replay starts
    try {
      const pageTitle = await page.title();
      await connectionPool.safeSend(replayWs, {
        type: "page-opened",
        uuid: browser_id,
        pageId: page_id,
        pageTitle,
      });
    } catch (_e) {}

    // Start streaming only if already enabled (viewer is watching)
    if (this.streamingEnabled.get(browser_id)) {
      this.startScreenshotStreaming(
        page,
        page_id,
        browser_id,
        replayWs,
        connectionPool,
      );
    }

    page.on("close", () => {
      this.stopScreenshotStreaming(page_id);
      // Remove page from tracking
      const pages = this.browserPages.get(browser_id);
      if (pages) {
        pages.delete(page_id);
        if (pages.size === 0) {
          this.browserPages.delete(browser_id);
        }
      }
      // Remove streaming context
      this.pageContexts.delete(page_id);
      // Notify that just this page closed
      sendPageClosedNotification(replayWs, browser_id, page_id);
    });
  }

  /**
   * Handles streaming control messages
   */
  handleStreamingControlMessage(message: any): void {
    if (message.type === "start-streaming" && message.uuid) {
      const browserId = message.uuid;

      // Enable streaming for this browser
      this.streamingEnabled.set(browserId, true);

      // Start streaming for all existing pages of this browser
      const pages = this.browserPages.get(browserId);
      if (pages) {
        for (const [pageId, page] of pages.entries()) {
          if (!page.isClosed()) {
            const context = this.pageContexts.get(pageId);
            if (context) {
              this.startScreenshotStreaming(
                context.page,
                context.pageId,
                context.browserId,
                context.replayWs,
                context.connectionPool,
              );
            }
          }
        }
      }
    } else if (message.type === "stop-streaming" && message.uuid) {
      const browserId = message.uuid;

      // Disable streaming for this browser
      this.streamingEnabled.set(browserId, false);

      // Stop streaming for all pages of this browser
      const pages = this.browserPages.get(browserId);
      if (pages) {
        for (const pageId of pages.keys()) {
          this.stopScreenshotStreaming(pageId);
        }
      }
    } else if (this.isInputCommand(message)) {
      // Handle input commands from viewers
      this.handleInputCommand(message);
    }
  }

  /**
   * Checks if a message is an input command
   */
  private isInputCommand(message: any): boolean {
    return [
      "mouse-move",
      "mouse-click",
      "keyboard-type",
      "keyboard-press",
      "scroll",
    ].includes(message.type);
  }

  /**
   * Handles input commands from viewers
   */
  async handleInputCommand(message: any): Promise<void> {
    const { type, uuid, pageId } = message;

    // Find the page by browserId and pageId
    const pages = this.browserPages.get(uuid);
    if (!pages) {
      console.warn(`[replay-manager] No pages found for browser ${uuid}`);
      return;
    }

    const page = pages.get(pageId);
    if (!page || page.isClosed()) {
      console.warn(`[replay-manager] Page ${pageId} not found or closed`);
      return;
    }

    try {
      switch (type) {
        case "mouse-move":
          await this.executeMouseMove(page, message as MouseMoveCommand);
          break;
        case "mouse-click":
          await this.executeMouseClick(page, message as MouseClickCommand);
          break;
        case "keyboard-type":
          await this.executeKeyboardType(page, message as KeyboardTypeCommand);
          break;
        case "keyboard-press":
          await this.executeKeyboardPress(
            page,
            message as KeyboardPressCommand,
          );
          break;
        case "scroll":
          await this.executeScroll(page, message as ScrollCommand);
          break;
      }
    } catch (_error) {
      // Silently ignore input command errors (page may be navigating)
    }
  }

  private async executeMouseMove(
    page: Page,
    cmd: MouseMoveCommand,
  ): Promise<void> {
    await page.mouse.move(cmd.x, cmd.y);
    this.mousePositions.set(cmd.pageId, { x: cmd.x, y: cmd.y });
  }

  private async executeMouseClick(
    page: Page,
    cmd: MouseClickCommand,
  ): Promise<void> {
    await page.mouse.click(cmd.x, cmd.y, {
      button: cmd.button,
      clickCount: cmd.clickCount,
    });
    this.mousePositions.set(cmd.pageId, { x: cmd.x, y: cmd.y });
  }

  private async executeKeyboardType(
    page: Page,
    cmd: KeyboardTypeCommand,
  ): Promise<void> {
    await page.keyboard.type(cmd.text);
  }

  private async executeKeyboardPress(
    page: Page,
    cmd: KeyboardPressCommand,
  ): Promise<void> {
    // Build key combination string for modifiers
    const modifiers: string[] = [];
    if (cmd.modifiers?.ctrl) modifiers.push("Control");
    if (cmd.modifiers?.shift) modifiers.push("Shift");
    if (cmd.modifiers?.alt) modifiers.push("Alt");
    if (cmd.modifiers?.meta) modifiers.push("Meta");

    if (modifiers.length > 0) {
      await page.keyboard.press(`${modifiers.join("+")}+${cmd.key}`);
    } else {
      await page.keyboard.press(cmd.key);
    }
  }

  private async executeScroll(page: Page, cmd: ScrollCommand): Promise<void> {
    await page.mouse.wheel(cmd.deltaX, cmd.deltaY);
  }

  /**
   * Starts screenshot streaming for a page
   */
  private startScreenshotStreaming(
    page: Page,
    pageId: string,
    browserId: string,
    replayWs: WebSocket,
    connectionPool: ConnectionPool,
  ): void {
    // Don't start if already streaming
    if (this.screenshotIntervals.has(pageId)) {
      return;
    }

    const FPS = 10;
    const interval = setInterval(() => {
      this.sendPageStateLiveReplay(
        page,
        browserId,
        pageId,
        replayWs,
        connectionPool,
      );
    }, 1000 / FPS);

    this.screenshotIntervals.set(pageId, interval);
  }

  /**
   * Sends page state (screenshot) to replay hub
   */
  private async sendPageStateLiveReplay(
    page: Page,
    browserId: string,
    pageId: string,
    replayWs: WebSocket,
    connectionPool: ConnectionPool,
  ): Promise<void> {
    try {
      // Check if streaming is enabled for this browser
      if (!this.streamingEnabled.get(browserId)) {
        return;
      }

      // Check if page is closed before taking screenshot
      if (page.isClosed()) {
        return;
      }

      // Double-check the page context is still valid
      if (!page.context() || page.context().pages().indexOf(page) === -1) {
        return;
      }

      const screenshot = await page.screenshot({
        type: "jpeg",
        quality: 70,
        timeout: 1000, // 1 second timeout for screenshot
      });

      const pageTitle = await page.title();

      try {
        await connectionPool.safeSend(replayWs, {
          type: "screenshot",
          uuid: browserId,
          pageId,
          pageTitle,
          base64: screenshot.toString("base64"),
          mouseX: this.mousePositions.get(pageId)?.x,
          mouseY: this.mousePositions.get(pageId)?.y,
        });
      } catch (_error) {
        // Continue execution as screenshot streaming is not critical
      }
    } catch (_e) {
      // Silently ignore screenshot errors (page may be closing)
    }
  }

  /**
   * Stops screenshot streaming for a page
   */
  private stopScreenshotStreaming(pageId: string): void {
    const interval = this.screenshotIntervals.get(pageId);
    if (interval) {
      clearInterval(interval);
      this.screenshotIntervals.delete(pageId);
    }
  }

  /**
   * Stops all screenshot streaming for a browser
   */
  private stopAllScreenshotStreaming(): void {
    // Stop all intervals for this browser's pages
    for (const [pageId, interval] of this.screenshotIntervals.entries()) {
      clearInterval(interval);
      this.screenshotIntervals.delete(pageId);
    }
  }

  /**
   * Cleans up resources for a browser
   */
  cleanup(browserId: string): void {
    this.streamingEnabled.delete(browserId);

    // Clean up page contexts for this browser
    const pages = this.browserPages.get(browserId);
    if (pages) {
      for (const pageId of pages.keys()) {
        this.pageContexts.delete(pageId);
      }
    }

    this.browserPages.delete(browserId);
    this.stopAllScreenshotStreaming();
  }

  /**
   * Safely closes a WebSocket for a specific browserId
   */
  async closeWebSocketForBrowser(browserId: string): Promise<void> {
    const ws = ReplayManager.wsInstances.get(browserId);
    if (!ws) {
      return;
    }

    // Check if there's already a close promise for this browser
    let closePromise = ReplayManager.wsClosePromises.get(browserId);
    if (closePromise) {
      return closePromise;
    }

    // If WebSocket is already closed, just clean up
    if (ws.readyState === WebSocket.CLOSED) {
      ReplayManager.wsInstances.delete(browserId);
      return;
    }

    // If WebSocket is already closing, wait for it
    if (ws.readyState === WebSocket.CLOSING) {
      closePromise = new Promise((resolve) => {
        ws.addEventListener("close", () => {
          ReplayManager.wsInstances.delete(browserId);
          ReplayManager.wsClosePromises.delete(browserId);
          resolve();
        });
      });
      ReplayManager.wsClosePromises.set(browserId, closePromise);
      return closePromise;
    }

    // Create close promise and initiate close
    closePromise = new Promise((resolve) => {
      const timeout = setTimeout(() => {
        ReplayManager.wsInstances.delete(browserId);
        ReplayManager.wsClosePromises.delete(browserId);
        resolve();
      }, 5000); // 5 second timeout

      ws.addEventListener("close", () => {
        clearTimeout(timeout);
        ReplayManager.wsInstances.delete(browserId);
        ReplayManager.wsClosePromises.delete(browserId);
        resolve();
      });

      ws.addEventListener("error", () => {
        clearTimeout(timeout);
        ReplayManager.wsInstances.delete(browserId);
        ReplayManager.wsClosePromises.delete(browserId);
        resolve(); // Resolve even on error to prevent hanging
      });
    });

    ReplayManager.wsClosePromises.set(browserId, closePromise);

    try {
      ws.close();
    } catch (_error) {
      // Clean up even if close() throws
      ReplayManager.wsInstances.delete(browserId);
      ReplayManager.wsClosePromises.delete(browserId);
    }

    return closePromise;
  }
}
