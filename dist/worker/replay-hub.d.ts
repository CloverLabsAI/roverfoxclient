import WebSocket from "ws";
import { type InputCommand, type OutboundMessage, type PageClosedMessage, type PageOpenedMessage, type RegisterProfileMessage, type ScreenshotMessage, type SubscribeMessage, type SubscribePageMessage, type UnregisterProfileMessage } from "../types/replay-protocol.js";
export interface ClientMeta {
    type: "producer" | "viewer" | "proxy";
    uuid?: string;
}
export interface PageInfo {
    pageId: string;
    pageTitle: string;
}
declare const handleRegisterProfile: (hub: ReplayHub, ws: WebSocket, message: RegisterProfileMessage) => void;
declare const handleUnregisterProfile: (hub: ReplayHub, ws: WebSocket, message: UnregisterProfileMessage) => void;
declare const handleScreenshot: (hub: ReplayHub, _ws: WebSocket, message: ScreenshotMessage) => void;
declare const handleSubscribe: (hub: ReplayHub, ws: WebSocket, message: SubscribeMessage) => void;
declare const handleSubscribePage: (hub: ReplayHub, ws: WebSocket, message: SubscribePageMessage) => void;
declare const handlePageOpened: (hub: ReplayHub, _ws: WebSocket, message: PageOpenedMessage) => void;
declare const handlePageClosed: (hub: ReplayHub, _ws: WebSocket, message: PageClosedMessage) => void;
declare const handleInputCommand: (hub: ReplayHub, ws: WebSocket, message: InputCommand) => void;
export { handleInputCommand, handlePageClosed, handlePageOpened, handleRegisterProfile, handleScreenshot, handleSubscribe, handleSubscribePage, handleUnregisterProfile, };
export declare class ReplayHub {
    clients: Map<WebSocket, ClientMeta>;
    activeProfiles: Map<string, WebSocket>;
    wsProfiles: Map<WebSocket, Set<string>>;
    lastScreenshots: Map<string, string>;
    profilePages: Map<string, Map<string, PageInfo>>;
    profileCleanupTimers: Map<string, NodeJS.Timeout>;
    profileViewers: Map<string, Set<WebSocket>>;
    /**
     * Broadcasts message to all connected clients
     */
    broadcastAll<T extends OutboundMessage>(msg: T): void;
    /**
     * Broadcasts message to viewers of a specific profile
     */
    broadcastToProfile<T extends OutboundMessage>(uuid: string, msg: T): void;
    /**
     * Adds a viewer to a profile and starts streaming if this is the first viewer
     */
    addViewer(uuid: string, ws: WebSocket): void;
    /**
     * Removes a viewer from a profile and stops streaming if this was the last viewer
     */
    removeViewer(uuid: string, ws: WebSocket): void;
    /**
     * Gets the number of active viewers for a profile
     */
    getViewerCount(uuid: string): number;
    /**
     * Handles screenshot streaming messages with type-safe dispatch
     */
    handleScreenshotMessage(ws: WebSocket, data: unknown): void;
    /**
     * Cancels cleanup timer for a profile (legacy - kept for compatibility)
     * NOTE: Profile cleanup timers are disabled. Profiles are only cleaned up when:
     * 1. Producer explicitly sends unregister-profile message
     * 2. Producer WebSocket disconnects
     */
    cancelProfileCleanupTimer(uuid: string): void;
    /**
     * Cleans up a profile completely
     */
    cleanupProfile(uuid: string): void;
    /**
     * Handles client disconnection cleanup
     */
    handleClientDisconnect(ws: WebSocket): void;
    /**
     * Initializes a new client connection for replay functionality
     */
    initializeReplayClient(ws: WebSocket): void;
}
