"use strict";
/**
 * BetterStack Logger - Sends logs to BetterStack via Logtail
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.logDataUsage = logDataUsage;
exports.flushLogs = flushLogs;
const node_1 = require("@logtail/node");
let logtailInstance = null;
function getLogtail() {
    if (logtailInstance) {
        return logtailInstance;
    }
    const sourceToken = "marj3QZXewhz37ZDVBqhZZDK";
    if (!sourceToken) {
        return null;
    }
    logtailInstance = new node_1.Logtail(sourceToken, {
        endpoint: "https://s1689731.us-east-9.betterstackdata.com",
        batchInterval: 1000,
    });
    return logtailInstance;
}
/**
 * Log data usage to BetterStack when a profile session ends
 */
function logDataUsage(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const logtail = getLogtail();
        if (!logtail) {
            return;
        }
        try {
            yield logtail.info("Profile session data usage", {
                event: "data_usage",
                browserId: data.browserId,
                sessionStart: data.start,
                sessionEnd: data.end,
                bytesTransferred: data.bytes,
                durationMs: data.durationMs,
                bytesFormatted: formatBytes(data.bytes),
            });
        }
        catch (error) {
            console.error("[betterstack] Failed to log data usage:", error);
        }
    });
}
/**
 * Flush pending logs (call before process exit)
 */
function flushLogs() {
    return __awaiter(this, void 0, void 0, function* () {
        const logtail = getLogtail();
        if (logtail) {
            yield logtail.flush();
        }
    });
}
function formatBytes(bytes) {
    if (bytes === 0)
        return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
