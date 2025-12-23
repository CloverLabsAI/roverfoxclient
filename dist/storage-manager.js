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
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const SAVE_STORAGE_EVERY_MS = 5000;
class StorageManager {
    constructor(supabaseClient) {
        this.supabaseClient = supabaseClient;
        this.scriptsCache = null;
    }
    /**
     * Saves storage state to Supabase
     */
    saveStorage(page, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { localStorage, indexedDB, origin } = yield this.exportStorage(page);
                let cookies = yield page.context().cookies();
                const { error } = yield this.supabaseClient.rpc("update_profile_storage_state", {
                    p_browser_id: profile.browser_id,
                    p_origin: origin,
                    p_local_storage: localStorage,
                    p_indexed_db: indexedDB,
                    p_cookies: cookies,
                });
                if (error) {
                    // Silently ignore storage update errors
                }
            }
            catch (e) { }
        });
    }
    /**
     * Initializes periodic storage saver
     */
    initStorageSaver(page, profile) {
        let storageSaverInterval = setInterval(() => {
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
            let ipv4 = "";
            yield page.mainFrame().evaluate(({ fontSpacingSeed, ipv4, }) => {
                try {
                    let _window = window;
                    _window.setFontSpacingSeed(fontSpacingSeed);
                    _window.setWebRTCIPv4("");
                }
                catch (e) { }
            }, {
                fontSpacingSeed: profile.data.fontSpacingSeed,
                ipv4,
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
            let { localStorage, indexedDB } = yield page.evaluate(`(async () => {
        ${this.scripts()}
        return { localStorage: await exportLocalStorage(), indexedDB: await exportIndexedDB() }
      })()`);
            let url = new URL(page.url());
            let origin = url.origin;
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
            path.join(__dirname, "./scripts"),
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
