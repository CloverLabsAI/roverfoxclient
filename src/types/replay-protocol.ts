// Base message interface with discriminant
export interface BaseMessage {
  type: string;
}

// Inbound message types (from clients to server)
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

// Input command messages (from viewers to producers via hub)
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

// Union of all input commands
export type InputCommand =
  | MouseMoveCommand
  | MouseClickCommand
  | KeyboardTypeCommand
  | KeyboardPressCommand
  | ScrollCommand;

// Discriminated union of all inbound messages
export type InboundMessage =
  | RegisterProfileMessage
  | UnregisterProfileMessage
  | ScreenshotMessage
  | SubscribeMessage
  | SubscribePageMessage
  | PageOpenedMessage
  | PageClosedMessage
  | StartStreamingMessage
  | StopStreamingMessage
  | MouseMoveCommand
  | MouseClickCommand
  | KeyboardTypeCommand
  | KeyboardPressCommand
  | ScrollCommand;

// Outbound message types (from server to clients)
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
  pages: Array<{ pageId: string; pageTitle: string }>;
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

// Discriminated union of all outbound messages
export type OutboundMessage =
  | ProfilesUpdatedMessage
  | NewScreenshotMessage
  | PagesUpdatedMessage
  | StreamEndedMessage
  | PageOpenedNotificationMessage
  | PageClosedNotificationMessage;

// Type guards for inbound messages
export function isRegisterProfileMessage(
  msg: BaseMessage,
): msg is RegisterProfileMessage {
  return (
    msg.type === "register-profile" &&
    typeof (msg as RegisterProfileMessage).uuid === "string"
  );
}

export function isUnregisterProfileMessage(
  msg: BaseMessage,
): msg is UnregisterProfileMessage {
  return (
    msg.type === "unregister-profile" &&
    typeof (msg as UnregisterProfileMessage).uuid === "string"
  );
}

export function isScreenshotMessage(
  msg: BaseMessage,
): msg is ScreenshotMessage {
  const m = msg as ScreenshotMessage;
  return (
    msg.type === "screenshot" &&
    typeof m.uuid === "string" &&
    typeof m.pageId === "string" &&
    typeof m.pageTitle === "string" &&
    typeof m.base64 === "string"
  );
}

export function isSubscribeMessage(msg: BaseMessage): msg is SubscribeMessage {
  return (
    msg.type === "subscribe" &&
    typeof (msg as SubscribeMessage).uuid === "string"
  );
}

export function isSubscribePageMessage(
  msg: BaseMessage,
): msg is SubscribePageMessage {
  const m = msg as SubscribePageMessage;
  return (
    msg.type === "subscribe-page" &&
    typeof m.uuid === "string" &&
    typeof m.pageId === "string"
  );
}

export function isPageOpenedMessage(
  msg: BaseMessage,
): msg is PageOpenedMessage {
  const m = msg as PageOpenedMessage;
  return (
    msg.type === "page-opened" &&
    typeof m.uuid === "string" &&
    typeof m.pageId === "string" &&
    typeof m.pageTitle === "string"
  );
}

export function isPageClosedMessage(
  msg: BaseMessage,
): msg is PageClosedMessage {
  const m = msg as PageClosedMessage;
  return (
    msg.type === "page-closed" &&
    typeof m.uuid === "string" &&
    typeof m.pageId === "string"
  );
}

export function isStartStreamingMessage(
  msg: BaseMessage,
): msg is StartStreamingMessage {
  return (
    msg.type === "start-streaming" &&
    typeof (msg as StartStreamingMessage).uuid === "string"
  );
}

export function isStopStreamingMessage(
  msg: BaseMessage,
): msg is StopStreamingMessage {
  return (
    msg.type === "stop-streaming" &&
    typeof (msg as StopStreamingMessage).uuid === "string"
  );
}

// Type guards for input commands
export function isMouseMoveCommand(msg: BaseMessage): msg is MouseMoveCommand {
  const m = msg as MouseMoveCommand;
  return (
    msg.type === "mouse-move" &&
    typeof m.uuid === "string" &&
    typeof m.pageId === "string" &&
    typeof m.x === "number" &&
    typeof m.y === "number"
  );
}

export function isMouseClickCommand(
  msg: BaseMessage,
): msg is MouseClickCommand {
  const m = msg as MouseClickCommand;
  return (
    msg.type === "mouse-click" &&
    typeof m.uuid === "string" &&
    typeof m.pageId === "string" &&
    typeof m.x === "number" &&
    typeof m.y === "number" &&
    ["left", "right", "middle"].includes(m.button) &&
    [1, 2].includes(m.clickCount)
  );
}

export function isKeyboardTypeCommand(
  msg: BaseMessage,
): msg is KeyboardTypeCommand {
  const m = msg as KeyboardTypeCommand;
  return (
    msg.type === "keyboard-type" &&
    typeof m.uuid === "string" &&
    typeof m.pageId === "string" &&
    typeof m.text === "string"
  );
}

export function isKeyboardPressCommand(
  msg: BaseMessage,
): msg is KeyboardPressCommand {
  const m = msg as KeyboardPressCommand;
  return (
    msg.type === "keyboard-press" &&
    typeof m.uuid === "string" &&
    typeof m.pageId === "string" &&
    typeof m.key === "string"
  );
}

export function isScrollCommand(msg: BaseMessage): msg is ScrollCommand {
  const m = msg as ScrollCommand;
  return (
    msg.type === "scroll" &&
    typeof m.uuid === "string" &&
    typeof m.pageId === "string" &&
    typeof m.deltaX === "number" &&
    typeof m.deltaY === "number"
  );
}

export function isInputCommand(msg: BaseMessage): msg is InputCommand {
  return (
    isMouseMoveCommand(msg) ||
    isMouseClickCommand(msg) ||
    isKeyboardTypeCommand(msg) ||
    isKeyboardPressCommand(msg) ||
    isScrollCommand(msg)
  );
}

// Runtime validation function
export function validateInboundMessage(data: unknown): InboundMessage | null {
  if (!data || typeof data !== "object" || !("type" in data)) {
    return null;
  }

  const msg = data as BaseMessage;

  if (isRegisterProfileMessage(msg)) return msg;
  if (isUnregisterProfileMessage(msg)) return msg;
  if (isScreenshotMessage(msg)) return msg;
  if (isSubscribeMessage(msg)) return msg;
  if (isSubscribePageMessage(msg)) return msg;
  if (isPageOpenedMessage(msg)) return msg;
  if (isPageClosedMessage(msg)) return msg;
  if (isStartStreamingMessage(msg)) return msg;
  if (isStopStreamingMessage(msg)) return msg;
  if (isMouseMoveCommand(msg)) return msg;
  if (isMouseClickCommand(msg)) return msg;
  if (isKeyboardTypeCommand(msg)) return msg;
  if (isKeyboardPressCommand(msg)) return msg;
  if (isScrollCommand(msg)) return msg;

  return null;
}

// Helper function to safely handle message dispatching
export function dispatchMessage(
  hub: IReplayHub,
  ws: any,
  message: InboundMessage,
  handlers: MessageHandlerMap,
): void {
  const handler = handlers[message.type];
  if (handler) {
    // Use type assertion to work around TypeScript's limitation with mapped types
    (handler as any)(hub, ws, message);
  } else {
    console.warn(`[screenshot] Unknown message type: ${message.type}`);
  }
}

// Forward declaration for ReplayHub to avoid circular dependency
export interface IReplayHub {
  clients: Map<any, any>;
  activeProfiles: Map<string, any>;
  lastScreenshots: Map<string, string>;
  profilePages: Map<string, Map<string, { pageId: string; pageTitle: string }>>;
  profileCleanupTimers: Map<string, NodeJS.Timeout>;
  broadcastAll<T extends OutboundMessage>(msg: T): void;
  broadcastToProfile<T extends OutboundMessage>(uuid: string, msg: T): void;
  cancelProfileCleanupTimer(uuid: string): void;
}

// Message handler type
export type MessageHandler<T extends InboundMessage> = (
  hub: IReplayHub,
  ws: any, // WebSocket import would create circular dependency
  message: T,
) => void;

// Message handler map type
export type MessageHandlerMap = {
  [K in InboundMessage["type"]]: MessageHandler<
    Extract<InboundMessage, { type: K }>
  >;
};
