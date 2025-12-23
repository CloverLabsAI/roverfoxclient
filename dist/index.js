"use strict";
/**
 * Roverfox Client - Browser automation client built on Playwright for Firefox
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProxyUrl = exports.formatProxyURL = exports.default = exports.RoverfoxClient = void 0;
var client_1 = require("./client");
Object.defineProperty(exports, "RoverfoxClient", { enumerable: true, get: function () { return client_1.RoverfoxClient; } });
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return client_1.RoverfoxClient; } });
// Re-export utilities
var utils_1 = require("./utils");
Object.defineProperty(exports, "formatProxyURL", { enumerable: true, get: function () { return utils_1.formatProxyURL; } });
Object.defineProperty(exports, "createProxyUrl", { enumerable: true, get: function () { return utils_1.createProxyUrl; } });
