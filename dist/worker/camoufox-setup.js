"use strict";
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
exports.CamoufoxSetup = void 0;
const axios_1 = __importDefault(require("axios"));
const extract_zip_1 = __importDefault(require("extract-zip"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
class CamoufoxSetup {
    constructor() {
        this.downloadUrl = process.env.CAMOUFOX_DOWNLOAD_URL || "";
        if (!this.downloadUrl) {
            throw new Error("CAMOUFOX_DOWNLOAD_URL environment variable is not set");
        }
    }
    getZipFileName() {
        const url = new URL(this.downloadUrl);
        const pathSegments = url.pathname.split("/");
        return pathSegments[pathSegments.length - 1];
    }
    downloadFile(url, dest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(url, {
                    responseType: "arraybuffer",
                    maxRedirects: 10,
                });
                fs_1.default.writeFileSync(dest, Buffer.from(response.data));
            }
            catch (error) {
                // Clean up partial download if it exists
                if (fs_1.default.existsSync(dest)) {
                    fs_1.default.unlinkSync(dest);
                }
                throw error;
            }
        });
    }
    unzipFile(zipPath, extractDir) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs_1.default.existsSync(extractDir)) {
                fs_1.default.mkdirSync(extractDir, { recursive: true });
            }
            try {
                yield (0, extract_zip_1.default)(zipPath, { dir: extractDir });
            }
            catch (error) {
                throw new Error(`Failed to unzip file: ${error}`);
            }
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const zipFileName = this.getZipFileName();
            const zipFolderName = zipFileName.replace(".zip", "");
            const cacheDir = path_1.default.join(os_1.default.homedir(), "Library", "Caches");
            if (!fs_1.default.existsSync(cacheDir)) {
                fs_1.default.mkdirSync(cacheDir, { recursive: true });
            }
            const zipFolderPath = path_1.default.join(cacheDir, zipFolderName);
            const CAMOUFOX_PATH = zipFolderPath + "/Camoufox.app/Contents/MacOS/camoufox";
            if (fs_1.default.existsSync(CAMOUFOX_PATH)) {
                return CAMOUFOX_PATH;
            }
            if (!fs_1.default.existsSync(`${cacheDir}/${zipFileName}`)) {
                console.log("[browser] Downloading Camoufox...");
                yield this.downloadFile(this.downloadUrl, `${cacheDir}/${zipFileName}`);
            }
            if (!fs_1.default.existsSync(CAMOUFOX_PATH)) {
                yield this.unzipFile(`${cacheDir}/${zipFileName}`, zipFolderPath);
                fs_1.default.unlinkSync(`${cacheDir}/${zipFileName}`);
            }
            return CAMOUFOX_PATH;
        });
    }
}
exports.CamoufoxSetup = CamoufoxSetup;
