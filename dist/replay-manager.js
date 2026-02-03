"use strict";
/**
 * Replay and screenshot streaming management
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplayManager = void 0;
const ws_1 = __importDefault(require("ws"));
function sendPageClosedNotification(ws, browserId, pageId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (ws.readyState === ws_1.default.OPEN) {
                ws.send(JSON.stringify({
                    type: "page-closed",
                    uuid: browserId,
                    pageId,
                }));
            }
        }
        catch (_error) {
            // Silently ignore errors
        }
    });
}
class ReplayManager {
    constructor() {
        this.mousePositions = new Map();
        this.streamingEnabled = new Map(); // browserId -> streaming enabled
        this.screenshotIntervals = new Map(); // pageId -> interval
        this.browserPages = new Map(); // browserId -> Map<pageId, Page>
        this.pageContexts = new Map(); // pageId -> streaming context
    }
    /**
     * Enables live replay for a page
     */
    enableLiveReplay(page, page_id, browser_id, replayWs, connectionPool) {
        return __awaiter(this, void 0, void 0, function* () {
            // Track this page for the browser
            if (!this.browserPages.has(browser_id)) {
                this.browserPages.set(browser_id, new Map());
            }
            // Check if this Page object is already tracked (prevent duplicates)
            const existingPages = this.browserPages.get(browser_id);
            for (const [_existingPageId, existingPage] of existingPages.entries()) {
                if (existingPage === page) {
                    return; // Page already tracked, don't add it again
                }
            }
            this.browserPages.get(browser_id).set(page_id, page);
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
            page.mouse.move = (x, y) => __awaiter(this, void 0, void 0, function* () {
                this.mousePositions.set(page_id, { x, y });
                yield originalMove(x, y);
            });
            // Announce the new page as soon as live replay starts
            try {
                const pageTitle = yield page.title();
                yield connectionPool.safeSend(replayWs, {
                    type: "page-opened",
                    uuid: browser_id,
                    pageId: page_id,
                    pageTitle,
                });
            }
            catch (_e) { }
            // Start streaming only if already enabled (viewer is watching)
            if (this.streamingEnabled.get(browser_id)) {
                this.startScreenshotStreaming(page, page_id, browser_id, replayWs, connectionPool);
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
        });
    }
    /**
     * Handles streaming control messages
     */
    handleStreamingControlMessage(message) {
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
                            this.startScreenshotStreaming(context.page, context.pageId, context.browserId, context.replayWs, context.connectionPool);
                        }
                    }
                }
            }
        }
        else if (message.type === "stop-streaming" && message.uuid) {
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
        }
        else if (this.isInputCommand(message)) {
            // Handle input commands from viewers
            this.handleInputCommand(message);
        }
    }
    /**
     * Checks if a message is an input command
     */
    isInputCommand(message) {
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
    handleInputCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
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
                        yield this.executeMouseMove(page, message);
                        break;
                    case "mouse-click":
                        yield this.executeMouseClick(page, message);
                        break;
                    case "keyboard-type":
                        yield this.executeKeyboardType(page, message);
                        break;
                    case "keyboard-press":
                        yield this.executeKeyboardPress(page, message);
                        break;
                    case "scroll":
                        yield this.executeScroll(page, message);
                        break;
                }
            }
            catch (_error) {
                // Silently ignore input command errors (page may be navigating)
            }
        });
    }
    executeMouseMove(page, cmd) {
        return __awaiter(this, void 0, void 0, function* () {
            yield page.mouse.move(cmd.x, cmd.y);
            this.mousePositions.set(cmd.pageId, { x: cmd.x, y: cmd.y });
        });
    }
    executeMouseClick(page, cmd) {
        return __awaiter(this, void 0, void 0, function* () {
            yield page.mouse.click(cmd.x, cmd.y, {
                button: cmd.button,
                clickCount: cmd.clickCount,
            });
            this.mousePositions.set(cmd.pageId, { x: cmd.x, y: cmd.y });
        });
    }
    executeKeyboardType(page, cmd) {
        return __awaiter(this, void 0, void 0, function* () {
            yield page.keyboard.type(cmd.text);
        });
    }
    executeKeyboardPress(page, cmd) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            // Build key combination string for modifiers
            const modifiers = [];
            if ((_a = cmd.modifiers) === null || _a === void 0 ? void 0 : _a.ctrl)
                modifiers.push("Control");
            if ((_b = cmd.modifiers) === null || _b === void 0 ? void 0 : _b.shift)
                modifiers.push("Shift");
            if ((_c = cmd.modifiers) === null || _c === void 0 ? void 0 : _c.alt)
                modifiers.push("Alt");
            if ((_d = cmd.modifiers) === null || _d === void 0 ? void 0 : _d.meta)
                modifiers.push("Meta");
            if (modifiers.length > 0) {
                yield page.keyboard.press(`${modifiers.join("+")}+${cmd.key}`);
            }
            else {
                yield page.keyboard.press(cmd.key);
            }
        });
    }
    executeScroll(page, cmd) {
        return __awaiter(this, void 0, void 0, function* () {
            yield page.mouse.wheel(cmd.deltaX, cmd.deltaY);
        });
    }
    /**
     * Starts screenshot streaming for a page
     */
    startScreenshotStreaming(page, pageId, browserId, replayWs, connectionPool) {
        // Don't start if already streaming
        if (this.screenshotIntervals.has(pageId)) {
            return;
        }
        const FPS = 10;
        const interval = setInterval(() => {
            this.sendPageStateLiveReplay(page, browserId, pageId, replayWs, connectionPool);
        }, 1000 / FPS);
        this.screenshotIntervals.set(pageId, interval);
    }
    /**
     * Sends page state (screenshot) to replay hub
     */
    sendPageStateLiveReplay(page, browserId, pageId, replayWs, connectionPool) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
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
                const screenshot = yield page.screenshot({
                    type: "jpeg",
                    quality: 70,
                    timeout: 1000, // 1 second timeout for screenshot
                });
                const pageTitle = yield page.title();
                try {
                    yield connectionPool.safeSend(replayWs, {
                        type: "screenshot",
                        uuid: browserId,
                        pageId,
                        pageTitle,
                        base64: screenshot.toString("base64"),
                        mouseX: (_a = this.mousePositions.get(pageId)) === null || _a === void 0 ? void 0 : _a.x,
                        mouseY: (_b = this.mousePositions.get(pageId)) === null || _b === void 0 ? void 0 : _b.y,
                    });
                }
                catch (_error) {
                    // Continue execution as screenshot streaming is not critical
                }
            }
            catch (_e) {
                // Silently ignore screenshot errors (page may be closing)
            }
        });
    }
    /**
     * Stops screenshot streaming for a page
     */
    stopScreenshotStreaming(pageId) {
        const interval = this.screenshotIntervals.get(pageId);
        if (interval) {
            clearInterval(interval);
            this.screenshotIntervals.delete(pageId);
        }
    }
    /**
     * Stops all screenshot streaming for a browser
     */
    stopAllScreenshotStreaming() {
        // Stop all intervals for this browser's pages
        for (const [pageId, interval] of this.screenshotIntervals.entries()) {
            clearInterval(interval);
            this.screenshotIntervals.delete(pageId);
        }
    }
    /**
     * Cleans up resources for a browser
     */
    cleanup(browserId) {
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
    closeWebSocketForBrowser(browserId) {
        return __awaiter(this, void 0, void 0, function* () {
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
            if (ws.readyState === ws_1.default.CLOSED) {
                ReplayManager.wsInstances.delete(browserId);
                return;
            }
            // If WebSocket is already closing, wait for it
            if (ws.readyState === ws_1.default.CLOSING) {
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
            }
            catch (_error) {
                // Clean up even if close() throws
                ReplayManager.wsInstances.delete(browserId);
                ReplayManager.wsClosePromises.delete(browserId);
            }
            return closePromise;
        });
    }
}
exports.ReplayManager = ReplayManager;
ReplayManager.wsInstances = new Map();
ReplayManager.wsClosePromises = new Map();
