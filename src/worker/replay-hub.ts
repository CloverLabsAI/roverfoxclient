import WebSocket from "ws";

import {
  type InputCommand,
  type OutboundMessage,
  type PageClosedMessage,
  type PageOpenedMessage,
  type RegisterProfileMessage,
  type ScreenshotMessage,
  type SubscribeMessage,
  type SubscribePageMessage,
  type UnregisterProfileMessage,
  validateInboundMessage,
} from "../types/replay-protocol.js";

export interface ClientMeta {
  type: "producer" | "viewer" | "proxy";
  uuid?: string;
}

export interface PageInfo {
  pageId: string;
  pageTitle: string;
}

// Note: Page cleanup timers were removed as they are redundant.
// Pages are cleaned up via:
// 1. Explicit page-closed messages from the producer
// 2. Profile cleanup when producer disconnects

// Message handler functions keyed by message type
const handleRegisterProfile = (
  hub: ReplayHub,
  ws: WebSocket,
  message: RegisterProfileMessage,
): void => {
  const { uuid } = message;

  // If this profile is already registered with a different WebSocket, clean it up first
  if (hub.activeProfiles.has(uuid)) {
    const oldWs = hub.activeProfiles.get(uuid);
    if (oldWs && oldWs !== ws) {
      console.log(
        `[screenshot] Profile ${uuid} re-registering, cleaning up old connection`,
      );
      // Remove from old WebSocket's profile tracking
      if (hub.wsProfiles.has(oldWs)) {
        hub.wsProfiles.get(oldWs)!.delete(uuid);
        if (hub.wsProfiles.get(oldWs)!.size === 0) {
          hub.wsProfiles.delete(oldWs);
        }
      }
    }
  }

  hub.clients.set(ws, { type: "producer", uuid });
  hub.activeProfiles.set(uuid, ws);

  // Track this profile for this WebSocket
  if (!hub.wsProfiles.has(ws)) {
    hub.wsProfiles.set(ws, new Set());
  }
  hub.wsProfiles.get(ws)!.add(uuid);

  // Log WebSocket identity for debugging
  const wsId = (ws as any).__wsId || "unknown";
  console.log(`[screenshot] Profile registered: ${uuid} (wsId: ${wsId})`);
  hub.broadcastAll({
    type: "profiles-updated",
    profiles: [...hub.activeProfiles.keys()],
  });
};

const handleUnregisterProfile = (
  hub: ReplayHub,
  ws: WebSocket,
  message: UnregisterProfileMessage,
): void => {
  const { uuid } = message;
  console.log(`[screenshot] Profile unregistered: ${uuid}`);

  // Cancel any pending cleanup timer for this profile
  hub.cancelProfileCleanupTimer(uuid);

  // Remove from wsProfiles tracking
  if (hub.wsProfiles.has(ws)) {
    hub.wsProfiles.get(ws)!.delete(uuid);
    if (hub.wsProfiles.get(ws)!.size === 0) {
      hub.wsProfiles.delete(ws);
    }
  }

  hub.cleanupProfile(uuid);
};

const handleScreenshot = (
  hub: ReplayHub,
  _ws: WebSocket,
  message: ScreenshotMessage,
): void => {
  const { uuid, pageId, pageTitle, base64, mouseX, mouseY } = message;
  if (hub.activeProfiles.has(uuid)) {
    // Update page information
    if (!hub.profilePages.has(uuid)) {
      hub.profilePages.set(uuid, new Map());
    }
    const pagesMap = hub.profilePages.get(uuid);
    if (!pagesMap) {
      console.error(`[ReplayHub] Failed to get pages map for profile ${uuid}`);
      return;
    }
    const isNewPage = !pagesMap.has(pageId);
    pagesMap.set(pageId, { pageId, pageTitle });

    // Note: Profile cleanup only happens when producer disconnects

    // Cache the latest screenshot by pageId
    hub.lastScreenshots.set(pageId, base64);

    // If this is the first time we see this page, notify all viewers (lightweight)
    if (isNewPage) {
      hub.broadcastAll({
        type: "page-opened",
        uuid,
        pageId,
        pageTitle,
      });
    }

    // Send screenshot to subscribed viewers only (bandwidth intensive)
    hub.broadcastToProfile(uuid, {
      type: "new-screenshot",
      uuid,
      pageId,
      pageTitle,
      base64,
      mouseX: mouseX!,
      mouseY: mouseY!,
    });

    // Broadcast updated pages list to all viewers (lightweight)
    hub.broadcastAll({
      type: "pages-updated",
      uuid,
      pages: Array.from(pagesMap.values()),
    });
  }
};

const handleSubscribe = (
  hub: ReplayHub,
  ws: WebSocket,
  message: SubscribeMessage,
): void => {
  const { uuid } = message;

  // Check if viewer was previously subscribed to a different profile
  const oldMeta = hub.clients.get(ws);
  if (oldMeta?.type === "viewer" && oldMeta.uuid && oldMeta.uuid !== uuid) {
    // Remove from old profile's viewer set
    hub.removeViewer(oldMeta.uuid, ws);
  }

  // If uuid is empty, viewer is unsubscribing from all profiles
  if (!uuid) {
    hub.clients.set(ws, { type: "viewer" }); // Clear uuid
    return;
  }

  hub.clients.set(ws, { type: "viewer", uuid });

  // Add viewer and potentially start streaming
  hub.addViewer(uuid, ws);

  // Send available pages for this profile
  if (hub.profilePages.has(uuid)) {
    const pages = Array.from(hub.profilePages.get(uuid)!.values());
    ws.send(
      JSON.stringify({
        type: "pages-updated",
        uuid,
        pages: pages,
      }),
    );
  }
};

const handleSubscribePage = (
  hub: ReplayHub,
  ws: WebSocket,
  message: SubscribePageMessage,
): void => {
  const { uuid, pageId } = message;

  // Check if viewer was previously subscribed to a different profile
  const oldMeta = hub.clients.get(ws);
  if (oldMeta?.type === "viewer" && oldMeta.uuid && oldMeta.uuid !== uuid) {
    // Remove from old profile's viewer set
    hub.removeViewer(oldMeta.uuid, ws);
    console.log(
      `[screenshot] Viewer unsubscribed from ${oldMeta.uuid} (switching to ${uuid})`,
    );
  }

  hub.clients.set(ws, { type: "viewer", uuid });
  console.log(
    `[screenshot] Viewer subscribed to page ${pageId} in profile ${uuid}`,
  );

  // Add viewer and potentially start streaming
  hub.addViewer(uuid, ws);

  // Send the last available screenshot for this specific page
  const lastScreenshot = hub.lastScreenshots.get(pageId);
  if (lastScreenshot && ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        type: "new-screenshot",
        uuid,
        pageId,
        base64: lastScreenshot,
      }),
    );
    console.log(
      `[screenshot] Sent cached screenshot to viewer for page ${pageId}`,
    );
  }
};

const handlePageOpened = (
  hub: ReplayHub,
  _ws: WebSocket,
  message: PageOpenedMessage,
): void => {
  const { uuid, pageId, pageTitle } = message;
  if (hub.activeProfiles.has(uuid)) {
    // Update page information
    if (!hub.profilePages.has(uuid)) {
      hub.profilePages.set(uuid, new Map());
    }
    hub.profilePages.get(uuid)!.set(pageId, { pageId, pageTitle });

    console.log(
      `[page-lifecycle] Page opened: ${pageId} (${pageTitle}) in profile ${uuid}`,
    );

    // Broadcast page-opened event to all viewers (lightweight notification)
    hub.broadcastAll({
      type: "page-opened",
      uuid,
      pageId,
      pageTitle,
    });

    // Broadcast updated pages list to all viewers (lightweight)
    hub.broadcastAll({
      type: "pages-updated",
      uuid,
      pages: Array.from(hub.profilePages.get(uuid)!.values()),
    });
  }
};

const handlePageClosed = (
  hub: ReplayHub,
  _ws: WebSocket,
  message: PageClosedMessage,
): void => {
  const { uuid, pageId } = message;
  if (hub.activeProfiles.has(uuid) && hub.profilePages.has(uuid)) {
    // Remove page from profile pages
    const pages = hub.profilePages.get(uuid)!;
    pages.delete(pageId);

    // Clean up cached screenshot for this page
    hub.lastScreenshots.delete(pageId);

    console.log(`[page-lifecycle] Page closed: ${pageId} in profile ${uuid}`);

    // Always broadcast updated pages (possibly empty) to keep UI in sync
    hub.broadcastAll({
      type: "pages-updated",
      uuid,
      pages: Array.from(pages.values()),
    });

    // Notify all viewers that this specific page was closed
    hub.broadcastAll({
      type: "page-closed",
      uuid,
      pageId,
    });

    // Note: Profile cleanup only happens when producer disconnects, not when pages close
  }
};

const handleInputCommand = (
  hub: ReplayHub,
  ws: WebSocket,
  message: InputCommand,
): void => {
  const { uuid } = message;

  // Verify sender is a viewer subscribed to this profile
  const clientMeta = hub.clients.get(ws);
  if (clientMeta?.type !== "viewer" || clientMeta.uuid !== uuid) {
    return;
  }

  // Find the producer WebSocket for this profile
  const producerWs = hub.activeProfiles.get(uuid);
  if (!producerWs || producerWs.readyState !== WebSocket.OPEN) {
    return;
  }

  // Forward the command to the producer
  producerWs.send(JSON.stringify(message));
};

// Export handlers for testing
export {
  handleInputCommand,
  handlePageClosed,
  handlePageOpened,
  handleRegisterProfile,
  handleScreenshot,
  handleSubscribe,
  handleSubscribePage,
  handleUnregisterProfile,
};

export class ReplayHub {
  public clients = new Map<WebSocket, ClientMeta>();
  public activeProfiles = new Map<string, WebSocket>(); // uuid -> producer socket
  public wsProfiles = new Map<WebSocket, Set<string>>(); // WebSocket -> Set of profile uuids
  public lastScreenshots = new Map<string, string>(); // pageId -> base64 screenshot
  public profilePages = new Map<string, Map<string, PageInfo>>(); // profileId -> Map<pageId, pageInfo>
  public profileCleanupTimers = new Map<string, NodeJS.Timeout>(); // uuid -> cleanup timer (disabled)
  public profileViewers = new Map<string, Set<WebSocket>>(); // uuid -> Set of viewer sockets

  /**
   * Broadcasts message to all connected clients
   */
  public broadcastAll<T extends OutboundMessage>(msg: T): void {
    const data = JSON.stringify(msg);
    for (const ws of this.clients.keys()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    }
  }

  /**
   * Broadcasts message to viewers of a specific profile
   */
  public broadcastToProfile<T extends OutboundMessage>(
    uuid: string,
    msg: T,
  ): void {
    const data = JSON.stringify(msg);
    let sentCount = 0;
    for (const [ws, meta] of this.clients.entries()) {
      if (
        meta.type === "viewer" &&
        meta.uuid === uuid &&
        ws.readyState === WebSocket.OPEN
      ) {
        ws.send(data);
        sentCount++;
      }
    }
    if (sentCount === 0 && msg.type === "new-screenshot") {
      console.log(
        `[broadcast] No viewers subscribed to profile ${uuid} for screenshot. Total clients: ${this.clients.size}`,
      );
    }
  }

  /**
   * Adds a viewer to a profile and starts streaming if this is the first viewer
   */
  public addViewer(uuid: string, ws: WebSocket): void {
    if (!this.profileViewers.has(uuid)) {
      this.profileViewers.set(uuid, new Set());
    }

    const viewers = this.profileViewers.get(uuid)!;
    const wasEmpty = viewers.size === 0;
    viewers.add(ws);

    // If this is the first viewer, tell the producer to start streaming
    if (wasEmpty && this.activeProfiles.has(uuid)) {
      const producerWs = this.activeProfiles.get(uuid)!;
      if (producerWs.readyState === WebSocket.OPEN) {
        producerWs.send(
          JSON.stringify({
            type: "start-streaming",
            uuid,
          }),
        );
        console.log(
          `[screenshot] Started streaming for profile ${uuid} (first viewer)`,
        );
      }
    }
  }

  /**
   * Removes a viewer from a profile and stops streaming if this was the last viewer
   */
  public removeViewer(uuid: string, ws: WebSocket): void {
    if (!this.profileViewers.has(uuid)) {
      console.log(`[removeViewer] Profile ${uuid} not in profileViewers map`);
      return;
    }

    const viewers = this.profileViewers.get(uuid)!;
    const hadViewer = viewers.has(ws);
    viewers.delete(ws);
    console.log(
      `[removeViewer] Removed viewer from ${uuid}, had viewer: ${hadViewer}, remaining: ${viewers.size}`,
    );

    // If no more viewers, tell the producer to stop streaming
    if (viewers.size === 0) {
      if (!this.activeProfiles.has(uuid)) {
        console.log(
          `[removeViewer] Profile ${uuid} not in activeProfiles, cannot send stop-streaming`,
        );
      } else {
        const producerWs = this.activeProfiles.get(uuid)!;
        if (producerWs.readyState !== WebSocket.OPEN) {
          console.log(
            `[removeViewer] Producer WebSocket for ${uuid} not open (state: ${producerWs.readyState})`,
          );
        } else {
          producerWs.send(
            JSON.stringify({
              type: "stop-streaming",
              uuid,
            }),
          );
          console.log(
            `[screenshot] Stopped streaming for profile ${uuid} (no viewers)`,
          );
        }
      }
      this.profileViewers.delete(uuid);
    }
  }

  /**
   * Gets the number of active viewers for a profile
   */
  public getViewerCount(uuid: string): number {
    return this.profileViewers.get(uuid)?.size || 0;
  }

  /**
   * Handles screenshot streaming messages with type-safe dispatch
   */
  public handleScreenshotMessage(ws: WebSocket, data: unknown): void {
    // Validate and narrow the message type
    const validatedMessage = validateInboundMessage(data);
    if (!validatedMessage) {
      console.warn(`[screenshot] Invalid message received:`, data);
      return;
    }

    // Type-safe message dispatch using switch statement
    switch (validatedMessage.type) {
      case "register-profile":
        handleRegisterProfile(this, ws, validatedMessage);
        break;
      case "unregister-profile":
        handleUnregisterProfile(this, ws, validatedMessage);
        break;
      case "screenshot":
        handleScreenshot(this, ws, validatedMessage);
        break;
      case "subscribe":
        handleSubscribe(this, ws, validatedMessage);
        break;
      case "subscribe-page":
        handleSubscribePage(this, ws, validatedMessage);
        break;
      case "page-opened":
        handlePageOpened(this, ws, validatedMessage);
        break;
      case "page-closed":
        handlePageClosed(this, ws, validatedMessage);
        break;
      case "mouse-move":
      case "mouse-click":
      case "keyboard-type":
      case "keyboard-press":
      case "scroll":
        handleInputCommand(this, ws, validatedMessage);
        break;
      default:
        console.warn(
          `[screenshot] Unknown message type: ${(validatedMessage as any).type}`,
        );
    }
  }

  /**
   * Cancels cleanup timer for a profile (legacy - kept for compatibility)
   * NOTE: Profile cleanup timers are disabled. Profiles are only cleaned up when:
   * 1. Producer explicitly sends unregister-profile message
   * 2. Producer WebSocket disconnects
   */
  public cancelProfileCleanupTimer(uuid: string): void {
    if (this.profileCleanupTimers.has(uuid)) {
      clearTimeout(this.profileCleanupTimers.get(uuid)!);
      this.profileCleanupTimers.delete(uuid);
      console.log(`[cleanup] Cancelled cleanup timer for profile ${uuid}`);
    }
  }

  /**
   * Cleans up a profile completely
   */
  public cleanupProfile(uuid: string): void {
    console.log(`[cleanup] Cleaning up profile ${uuid}`);

    this.activeProfiles.delete(uuid);

    // Clean up cached screenshots for all pages in this profile
    if (this.profilePages.has(uuid)) {
      const pages = this.profilePages.get(uuid)!;
      for (const pageInfo of pages.values()) {
        this.lastScreenshots.delete(pageInfo.pageId);
      }
      this.profilePages.delete(uuid);
    }

    // Clear cleanup timer
    this.profileCleanupTimers.delete(uuid);

    // Notify all viewers that this stream has ended
    this.broadcastAll({
      type: "stream-ended",
      uuid: uuid,
    });
    this.broadcastAll({
      type: "profiles-updated",
      profiles: [...this.activeProfiles.keys()],
    });
  }

  /**
   * Handles client disconnection cleanup
   */
  public handleClientDisconnect(ws: WebSocket): void {
    const meta = this.clients.get(ws);

    // If this is a producer, clean up ALL profiles registered by this WebSocket
    if (meta?.type === "producer") {
      const profiles = this.wsProfiles.get(ws);
      if (profiles && profiles.size > 0) {
        console.log(
          `[screenshot] Producer disconnected, cleaning up ${profiles.size} profile(s)`,
        );
        for (const uuid of profiles) {
          // Cancel any pending cleanup timers before cleaning up
          this.cancelProfileCleanupTimer(uuid);
          this.cleanupProfile(uuid);
        }
        this.wsProfiles.delete(ws);
      }
    } else if (meta?.type === "viewer" && meta.uuid) {
      // Remove viewer and potentially stop streaming
      this.removeViewer(meta.uuid, ws);
      console.log(`[screenshot] Viewer disconnected from ${meta.uuid}`);
    }
    this.clients.delete(ws);
  }

  /**
   * Initializes a new client connection for replay functionality
   */
  public initializeReplayClient(ws: WebSocket): void {
    this.clients.set(ws, { type: "viewer" }); // default to viewer
    console.log("[replay] Screenshot streaming client connected");

    // Send current available profiles to the newly connected viewer
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "profiles-updated",
          profiles: [...this.activeProfiles.keys()],
        }),
      );

      // Send cached pages-updated for all active profiles
      for (const [uuid, pagesMap] of this.profilePages.entries()) {
        if (pagesMap.size > 0) {
          ws.send(
            JSON.stringify({
              type: "pages-updated",
              uuid,
              pages: Array.from(pagesMap.values()),
            }),
          );
        }
      }
    }
  }
}
