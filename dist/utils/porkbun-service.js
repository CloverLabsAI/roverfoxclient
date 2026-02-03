"use strict";
/**
 * Porkbun DNS management service
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
exports.PorkbunService = void 0;
const axios_1 = __importDefault(require("axios"));
class PorkbunService {
    constructor() {
        this.apiKey = process.env.PORKBUN_API_KEY;
        this.secretKey = process.env.PORKBUN_SECRET_KEY;
        this.domain = process.env.PORKBUN_DOMAIN || "monitico.com";
        if (!this.apiKey || !this.secretKey) {
            throw new Error("PORKBUN_API_KEY and PORKBUN_SECRET_KEY must be set");
        }
    }
    /**
     * Converts an IP address to an alphanumeric subdomain ID
     */
    ipToSubdomain(ip) {
        const parts = ip.split(".");
        if (parts.length !== 4) {
            throw new Error("Invalid IP address format");
        }
        // Convert IP to a single number (IPv4 as 32-bit integer)
        const ipAsNumber = parts.reduce((acc, octet) => {
            return (acc << 8) + parseInt(octet, 10);
        }, 0);
        // Convert to base36 for compact alphanumeric representation
        const base36Id = ipAsNumber.toString(36);
        return `${base36Id}.macm2`;
    }
    /**
     * Retrieves existing DNS records for a subdomain
     */
    getRecordsByName(subdomain) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(`https://api.porkbun.com/api/json/v3/dns/retrieveByNameType/${this.domain}/A/${subdomain}`, {
                    secretapikey: this.secretKey,
                    apikey: this.apiKey,
                });
                if (response.data.status === "SUCCESS" && response.data.records) {
                    return response.data.records;
                }
                return [];
            }
            catch (_a) {
                // Record doesn't exist or API error
                return [];
            }
        });
    }
    /**
     * Updates an existing DNS record
     */
    updateRecord(recordId_1, ip_1) {
        return __awaiter(this, arguments, void 0, function* (recordId, ip, ttl = 600) {
            try {
                const response = yield axios_1.default.post(`https://api.porkbun.com/api/json/v3/dns/edit/${this.domain}/${recordId}`, {
                    secretapikey: this.secretKey,
                    apikey: this.apiKey,
                    type: "A",
                    content: ip,
                    ttl: ttl.toString(),
                });
                return response.data.status === "SUCCESS";
            }
            catch (_a) {
                return false;
            }
        });
    }
    /**
     * Creates or updates an A record subdomain for an IP address
     */
    createSubdomainForIp(ip_1) {
        return __awaiter(this, arguments, void 0, function* (ip, ttl = 600) {
            var _a;
            try {
                const subdomain = this.ipToSubdomain(ip);
                // Check if record already exists
                const existingRecords = yield this.getRecordsByName(subdomain);
                if (existingRecords.length > 0) {
                    const existingRecord = existingRecords[0];
                    // If IP matches, no action needed
                    if (existingRecord.content === ip) {
                        console.log(`[porkbun] ✓ Subdomain already exists with correct IP: ${subdomain}.${this.domain} -> ${ip}`);
                        return subdomain;
                    }
                    // IP changed, update the record
                    console.log(`[porkbun] Updating A record: ${subdomain}.${this.domain} -> ${ip} (was ${existingRecord.content})`);
                    const updated = yield this.updateRecord(existingRecord.id, ip, ttl);
                    if (updated) {
                        console.log(`[porkbun] ✓ Updated subdomain: ${subdomain}.${this.domain}`);
                        return subdomain;
                    }
                    else {
                        console.error(`[porkbun] ✗ Failed to update subdomain`);
                        return null;
                    }
                }
                // Record doesn't exist, create it
                console.log(`[porkbun] Creating A record: ${subdomain}.${this.domain} -> ${ip}`);
                const response = yield axios_1.default.post(`https://api.porkbun.com/api/json/v3/dns/create/${this.domain}`, {
                    secretapikey: this.secretKey,
                    apikey: this.apiKey,
                    name: subdomain,
                    type: "A",
                    content: ip,
                    ttl: ttl.toString(),
                });
                if (response.data.status === "SUCCESS") {
                    console.log(`[porkbun] ✓ Created subdomain: ${subdomain}.${this.domain} (ID: ${response.data.id})`);
                    return subdomain;
                }
                else {
                    console.error(`[porkbun] ✗ Failed to create subdomain:`, response.data.message || response.data);
                    return null;
                }
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    console.error("[porkbun] API Error:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                }
                else {
                    console.error("[porkbun] Error:", error);
                }
                return null;
            }
        });
    }
    /**
     * Deletes an A record subdomain by IP address
     */
    deleteSubdomainForIp(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const subdomain = this.ipToSubdomain(ip);
                console.log(`[porkbun] Deleting A record: ${subdomain}.${this.domain}`);
                const response = yield axios_1.default.post(`https://api.porkbun.com/api/json/v3/dns/deleteByNameType/${this.domain}/A/${subdomain}`, {
                    secretapikey: this.secretKey,
                    apikey: this.apiKey,
                });
                if (response.data.status === "SUCCESS") {
                    console.log(`[porkbun] ✓ Deleted subdomain: ${subdomain}.${this.domain}`);
                    return true;
                }
                else {
                    console.error(`[porkbun] ✗ Failed to delete subdomain:`, response.data.message || response.data);
                    return false;
                }
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    console.error("[porkbun] API Error:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                }
                else {
                    console.error("[porkbun] Error:", error);
                }
                return false;
            }
        });
    }
    /**
     * Gets the full subdomain URL for an IP address
     */
    getSubdomainUrl(ip) {
        const subdomain = this.ipToSubdomain(ip);
        return `${subdomain}.${this.domain}`;
    }
}
exports.PorkbunService = PorkbunService;
