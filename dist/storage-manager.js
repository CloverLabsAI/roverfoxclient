"use strict";
/**
 * Storage management for browser profiles
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.StorageManager = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const SAVE_STORAGE_EVERY_MS = 5000;
class StorageManager {
    constructor(managerClient) {
        this.managerClient = managerClient;
        this.scriptsCache = null;
    }
    /**
     * Saves storage state to Manager
     */
    saveStorage(page, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { localStorage, indexedDB, origin } = yield this.exportStorage(page);
                const cookies = yield page.context().cookies();
                yield this.managerClient.updateStorage(profile.browser_id, {
                    origin,
                    localStorage,
                    indexedDB,
                    cookies,
                });
            }
            catch (_e) { }
        });
    }
    /**
     * Initializes periodic storage saver
     */
    initStorageSaver(page, profile) {
        const storageSaverInterval = setInterval(() => {
            this.saveStorage(page, profile);
        }, SAVE_STORAGE_EVERY_MS);
        page.once("close", () => {
            clearInterval(storageSaverInterval);
        });
    }
    /**
     * Sets fingerprinting properties on a page
     */
    setFingerprintingProperties(page, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            yield page.mainFrame().evaluate(({ fontSpacingSeed, audioFingerprintSeed, screenDimensions, geolocation, timezone, }) => {
                try {
                    const _window = window;
                    _window.setFontSpacingSeed(fontSpacingSeed);
                    // WebRTC IP disabled for now (patch is disabled in Camoufox)
                    _window.setWebRTCIPv4("");
                    if (audioFingerprintSeed && _window.setAudioFingerprintSeed) {
                        _window.setAudioFingerprintSeed(audioFingerprintSeed);
                    }
                    if (screenDimensions && _window.setScreenDimensions) {
                        _window.setScreenDimensions(screenDimensions.width, screenDimensions.height);
                        if (screenDimensions.colorDepth && _window.setScreenColorDepth) {
                            _window.setScreenColorDepth(screenDimensions.colorDepth);
                        }
                    }
                    if (geolocation && _window.setGeolocation) {
                        _window.setGeolocation(geolocation.lat, geolocation.lon);
                    }
                    if (timezone && _window.setTimezone) {
                        _window.setTimezone(timezone);
                    }
                }
                catch (_e) { }
            }, {
                fontSpacingSeed: profile.data.fontSpacingSeed,
                audioFingerprintSeed: profile.data.audioFingerprintSeed,
                screenDimensions: profile.data.screenDimensions,
                geolocation: profile.data.geolocation,
                timezone: profile.data.timezone,
            });
        });
    }
    /**
     * Exports storage from a page
     */
    exportStorage(page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page.isClosed()) {
                return;
            }
            const { localStorage, indexedDB } = yield page.evaluate(`(async () => {
        ${this.scripts()}
        return { localStorage: await exportLocalStorage(), indexedDB: await exportIndexedDB() }
      })()`);
            const url = new URL(page.url());
            const origin = url.origin;
            return { localStorage, indexedDB, origin };
        });
    }
    /**
     * Loads browser scripts for storage export
     */
    scripts() {
        if (this.scriptsCache) {
            return this.scriptsCache;
        }
        const candidates = [
            path.join(__dirname, "../scripts"),
            path.join(__dirname, "../../scripts"),
        ];
        const scriptsDir = candidates.find((p) => fs.existsSync(p));
        if (!scriptsDir) {
            throw new Error("Unable to locate scripts directory. Ensure src/scripts is copied to dist/scripts or available at runtime.");
        }
        const files = fs.readdirSync(scriptsDir).filter((f) => f.endsWith(".js"));
        this.scriptsCache = files
            .map((f) => fs.readFileSync(path.join(scriptsDir, f), "utf-8"))
            .join("\n");
        return this.scriptsCache;
    }
}
exports.StorageManager = StorageManager;
