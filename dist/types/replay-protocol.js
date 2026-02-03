"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRegisterProfileMessage = isRegisterProfileMessage;
exports.isUnregisterProfileMessage = isUnregisterProfileMessage;
exports.isScreenshotMessage = isScreenshotMessage;
exports.isSubscribeMessage = isSubscribeMessage;
exports.isSubscribePageMessage = isSubscribePageMessage;
exports.isPageOpenedMessage = isPageOpenedMessage;
exports.isPageClosedMessage = isPageClosedMessage;
exports.isStartStreamingMessage = isStartStreamingMessage;
exports.isStopStreamingMessage = isStopStreamingMessage;
exports.isMouseMoveCommand = isMouseMoveCommand;
exports.isMouseClickCommand = isMouseClickCommand;
exports.isKeyboardTypeCommand = isKeyboardTypeCommand;
exports.isKeyboardPressCommand = isKeyboardPressCommand;
exports.isScrollCommand = isScrollCommand;
exports.isInputCommand = isInputCommand;
exports.validateInboundMessage = validateInboundMessage;
exports.dispatchMessage = dispatchMessage;
// Type guards for inbound messages
function isRegisterProfileMessage(msg) {
    return (msg.type === "register-profile" &&
        typeof msg.uuid === "string");
}
function isUnregisterProfileMessage(msg) {
    return (msg.type === "unregister-profile" &&
        typeof msg.uuid === "string");
}
function isScreenshotMessage(msg) {
    const m = msg;
    return (msg.type === "screenshot" &&
        typeof m.uuid === "string" &&
        typeof m.pageId === "string" &&
        typeof m.pageTitle === "string" &&
        typeof m.base64 === "string");
}
function isSubscribeMessage(msg) {
    return (msg.type === "subscribe" &&
        typeof msg.uuid === "string");
}
function isSubscribePageMessage(msg) {
    const m = msg;
    return (msg.type === "subscribe-page" &&
        typeof m.uuid === "string" &&
        typeof m.pageId === "string");
}
function isPageOpenedMessage(msg) {
    const m = msg;
    return (msg.type === "page-opened" &&
        typeof m.uuid === "string" &&
        typeof m.pageId === "string" &&
        typeof m.pageTitle === "string");
}
function isPageClosedMessage(msg) {
    const m = msg;
    return (msg.type === "page-closed" &&
        typeof m.uuid === "string" &&
        typeof m.pageId === "string");
}
function isStartStreamingMessage(msg) {
    return (msg.type === "start-streaming" &&
        typeof msg.uuid === "string");
}
function isStopStreamingMessage(msg) {
    return (msg.type === "stop-streaming" &&
        typeof msg.uuid === "string");
}
// Type guards for input commands
function isMouseMoveCommand(msg) {
    const m = msg;
    return (msg.type === "mouse-move" &&
        typeof m.uuid === "string" &&
        typeof m.pageId === "string" &&
        typeof m.x === "number" &&
        typeof m.y === "number");
}
function isMouseClickCommand(msg) {
    const m = msg;
    return (msg.type === "mouse-click" &&
        typeof m.uuid === "string" &&
        typeof m.pageId === "string" &&
        typeof m.x === "number" &&
        typeof m.y === "number" &&
        ["left", "right", "middle"].includes(m.button) &&
        [1, 2].includes(m.clickCount));
}
function isKeyboardTypeCommand(msg) {
    const m = msg;
    return (msg.type === "keyboard-type" &&
        typeof m.uuid === "string" &&
        typeof m.pageId === "string" &&
        typeof m.text === "string");
}
function isKeyboardPressCommand(msg) {
    const m = msg;
    return (msg.type === "keyboard-press" &&
        typeof m.uuid === "string" &&
        typeof m.pageId === "string" &&
        typeof m.key === "string");
}
function isScrollCommand(msg) {
    const m = msg;
    return (msg.type === "scroll" &&
        typeof m.uuid === "string" &&
        typeof m.pageId === "string" &&
        typeof m.deltaX === "number" &&
        typeof m.deltaY === "number");
}
function isInputCommand(msg) {
    return (isMouseMoveCommand(msg) ||
        isMouseClickCommand(msg) ||
        isKeyboardTypeCommand(msg) ||
        isKeyboardPressCommand(msg) ||
        isScrollCommand(msg));
}
// Runtime validation function
function validateInboundMessage(data) {
    if (!data || typeof data !== "object" || !("type" in data)) {
        return null;
    }
    const msg = data;
    if (isRegisterProfileMessage(msg))
        return msg;
    if (isUnregisterProfileMessage(msg))
        return msg;
    if (isScreenshotMessage(msg))
        return msg;
    if (isSubscribeMessage(msg))
        return msg;
    if (isSubscribePageMessage(msg))
        return msg;
    if (isPageOpenedMessage(msg))
        return msg;
    if (isPageClosedMessage(msg))
        return msg;
    if (isStartStreamingMessage(msg))
        return msg;
    if (isStopStreamingMessage(msg))
        return msg;
    if (isMouseMoveCommand(msg))
        return msg;
    if (isMouseClickCommand(msg))
        return msg;
    if (isKeyboardTypeCommand(msg))
        return msg;
    if (isKeyboardPressCommand(msg))
        return msg;
    if (isScrollCommand(msg))
        return msg;
    return null;
}
// Helper function to safely handle message dispatching
function dispatchMessage(hub, ws, message, handlers) {
    const handler = handlers[message.type];
    if (handler) {
        // Use type assertion to work around TypeScript's limitation with mapped types
        handler(hub, ws, message);
    }
    else {
        console.warn(`[screenshot] Unknown message type: ${message.type}`);
    }
}
