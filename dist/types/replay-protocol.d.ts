export interface BaseMessage {
    type: string;
}
export interface RegisterProfileMessage extends BaseMessage {
    type: "register-profile";
    uuid: string;
}
export interface UnregisterProfileMessage extends BaseMessage {
    type: "unregister-profile";
    uuid: string;
}
export interface ScreenshotMessage extends BaseMessage {
    type: "screenshot";
    uuid: string;
    pageId: string;
    pageTitle: string;
    base64: string;
    mouseX?: number;
    mouseY?: number;
}
export interface SubscribeMessage extends BaseMessage {
    type: "subscribe";
    uuid: string;
}
export interface SubscribePageMessage extends BaseMessage {
    type: "subscribe-page";
    uuid: string;
    pageId: string;
}
export interface PageOpenedMessage extends BaseMessage {
    type: "page-opened";
    uuid: string;
    pageId: string;
    pageTitle: string;
}
export interface PageClosedMessage extends BaseMessage {
    type: "page-closed";
    uuid: string;
    pageId: string;
}
export interface StartStreamingMessage extends BaseMessage {
    type: "start-streaming";
    uuid: string;
}
export interface StopStreamingMessage extends BaseMessage {
    type: "stop-streaming";
    uuid: string;
}
export interface MouseMoveCommand extends BaseMessage {
    type: "mouse-move";
    uuid: string;
    pageId: string;
    x: number;
    y: number;
}
export interface MouseClickCommand extends BaseMessage {
    type: "mouse-click";
    uuid: string;
    pageId: string;
    x: number;
    y: number;
    button: "left" | "right" | "middle";
    clickCount: 1 | 2;
}
export interface KeyboardTypeCommand extends BaseMessage {
    type: "keyboard-type";
    uuid: string;
    pageId: string;
    text: string;
}
export interface KeyboardPressCommand extends BaseMessage {
    type: "keyboard-press";
    uuid: string;
    pageId: string;
    key: string;
    modifiers?: {
        ctrl?: boolean;
        shift?: boolean;
        alt?: boolean;
        meta?: boolean;
    };
}
export interface ScrollCommand extends BaseMessage {
    type: "scroll";
    uuid: string;
    pageId: string;
    deltaX: number;
    deltaY: number;
}
export type InputCommand = MouseMoveCommand | MouseClickCommand | KeyboardTypeCommand | KeyboardPressCommand | ScrollCommand;
export type InboundMessage = RegisterProfileMessage | UnregisterProfileMessage | ScreenshotMessage | SubscribeMessage | SubscribePageMessage | PageOpenedMessage | PageClosedMessage | StartStreamingMessage | StopStreamingMessage | MouseMoveCommand | MouseClickCommand | KeyboardTypeCommand | KeyboardPressCommand | ScrollCommand;
export interface ProfilesUpdatedMessage extends BaseMessage {
    type: "profiles-updated";
    profiles: string[];
}
export interface NewScreenshotMessage extends BaseMessage {
    type: "new-screenshot";
    uuid: string;
    pageId: string;
    pageTitle?: string;
    base64: string;
    mouseX?: number;
    mouseY?: number;
}
export interface PagesUpdatedMessage extends BaseMessage {
    type: "pages-updated";
    uuid: string;
    pages: Array<{
        pageId: string;
        pageTitle: string;
    }>;
}
export interface StreamEndedMessage extends BaseMessage {
    type: "stream-ended";
    uuid: string;
}
export interface PageOpenedNotificationMessage extends BaseMessage {
    type: "page-opened";
    uuid: string;
    pageId: string;
    pageTitle: string;
}
export interface PageClosedNotificationMessage extends BaseMessage {
    type: "page-closed";
    uuid: string;
    pageId: string;
}
export type OutboundMessage = ProfilesUpdatedMessage | NewScreenshotMessage | PagesUpdatedMessage | StreamEndedMessage | PageOpenedNotificationMessage | PageClosedNotificationMessage;
export declare function isRegisterProfileMessage(msg: BaseMessage): msg is RegisterProfileMessage;
export declare function isUnregisterProfileMessage(msg: BaseMessage): msg is UnregisterProfileMessage;
export declare function isScreenshotMessage(msg: BaseMessage): msg is ScreenshotMessage;
export declare function isSubscribeMessage(msg: BaseMessage): msg is SubscribeMessage;
export declare function isSubscribePageMessage(msg: BaseMessage): msg is SubscribePageMessage;
export declare function isPageOpenedMessage(msg: BaseMessage): msg is PageOpenedMessage;
export declare function isPageClosedMessage(msg: BaseMessage): msg is PageClosedMessage;
export declare function isStartStreamingMessage(msg: BaseMessage): msg is StartStreamingMessage;
export declare function isStopStreamingMessage(msg: BaseMessage): msg is StopStreamingMessage;
export declare function isMouseMoveCommand(msg: BaseMessage): msg is MouseMoveCommand;
export declare function isMouseClickCommand(msg: BaseMessage): msg is MouseClickCommand;
export declare function isKeyboardTypeCommand(msg: BaseMessage): msg is KeyboardTypeCommand;
export declare function isKeyboardPressCommand(msg: BaseMessage): msg is KeyboardPressCommand;
export declare function isScrollCommand(msg: BaseMessage): msg is ScrollCommand;
export declare function isInputCommand(msg: BaseMessage): msg is InputCommand;
export declare function validateInboundMessage(data: unknown): InboundMessage | null;
export declare function dispatchMessage(hub: IReplayHub, ws: any, message: InboundMessage, handlers: MessageHandlerMap): void;
export interface IReplayHub {
    clients: Map<any, any>;
    activeProfiles: Map<string, any>;
    lastScreenshots: Map<string, string>;
    profilePages: Map<string, Map<string, {
        pageId: string;
        pageTitle: string;
    }>>;
    profileCleanupTimers: Map<string, NodeJS.Timeout>;
    broadcastAll<T extends OutboundMessage>(msg: T): void;
    broadcastToProfile<T extends OutboundMessage>(uuid: string, msg: T): void;
    cancelProfileCleanupTimer(uuid: string): void;
}
export type MessageHandler<T extends InboundMessage> = (hub: IReplayHub, ws: any, // WebSocket import would create circular dependency
message: T) => void;
export type MessageHandlerMap = {
    [K in InboundMessage["type"]]: MessageHandler<Extract<InboundMessage, {
        type: K;
    }>>;
};
