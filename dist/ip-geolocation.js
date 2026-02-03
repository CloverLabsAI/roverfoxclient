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
exports.IPGeolocationService = void 0;
exports.getGeoService = getGeoService;
// IP Geolocation Service
// Looks up geographic info for proxy IPs using ip-api.com
const axios_1 = __importDefault(require("axios"));
const https_proxy_agent_1 = require("https-proxy-agent");
const IP_API_KEY = process.env.IP_API_KEY;
const USE_PRO_API = !!IP_API_KEY;
const IP_API_BASE = USE_PRO_API
    ? "https://pro.ip-api.com"
    : "http://ip-api.com"; // Free API for backup
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const IP_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const IPIFY_TIMEOUT_MS = 7000;
const FREE_API_RATE_LIMIT_MS = 1500; // ~40 req/min to stay under free tier 45/min limit
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
class IPGeolocationService {
    constructor() {
        this.cache = new Map();
        this.ipCache = new Map();
        this.lastRequestTime = 0; // For free API rate limiting
    }
    // Get the actual exit IP by making a request through the proxy to ipify.org
    getExitIP(proxy) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = `${proxy.host}:${proxy.port}`;
            // Check IP cache (shorter TTL since IPs can rotate)
            const cached = this.ipCache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < IP_CACHE_TTL_MS) {
                return cached.ip;
            }
            try {
                // Build proxy URL for the agent
                const auth = proxy.username && proxy.password
                    ? `${proxy.username}:${proxy.password}@`
                    : "";
                const proxyUrl = `http://${auth}${proxy.host}:${proxy.port}`;
                const agent = new https_proxy_agent_1.HttpsProxyAgent(proxyUrl);
                const { data } = yield axios_1.default.get("https://api.ipify.org?format=json", {
                    httpsAgent: agent,
                    timeout: IPIFY_TIMEOUT_MS,
                });
                const ip = data.ip;
                if (ip) {
                    this.ipCache.set(cacheKey, { ip, timestamp: Date.now() });
                }
                return ip || null;
            }
            catch (error) {
                console.error(`Failed to get exit IP through proxy:`, error);
                return null;
            }
        });
    }
    // Check if proxy IP has changed compared to stored IP
    hasIPChanged(proxy, storedIP) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentIP = yield this.getExitIP(proxy);
            if (!currentIP) {
                return { changed: false, currentIP: null };
            }
            if (!storedIP) {
                return { changed: true, currentIP };
            }
            return { changed: currentIP !== storedIP, currentIP };
        });
    }
    // Get geolocation by first getting the exit IP through the proxy
    lookupThroughProxy(proxy) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = yield this.getExitIP(proxy);
            if (!ip)
                return null;
            const geo = yield this.lookup(ip);
            if (!geo)
                return null;
            return { ip, geo };
        });
    }
    // Lookup geolocation for an IP address
    lookup(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check cache first
            const cached = this.cache.get(ip);
            if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
                return cached.data;
            }
            // Fetch from API
            const data = yield this.fetchFromAPI(ip);
            if (data) {
                this.cache.set(ip, { data, timestamp: Date.now() });
            }
            return data;
        });
    }
    // Fetch from ip-api.com (Uses Free API if the key isn't set)
    fetchFromAPI(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            // Rate limit only for free API
            if (!USE_PRO_API) {
                const elapsed = Date.now() - this.lastRequestTime;
                if (elapsed < FREE_API_RATE_LIMIT_MS) {
                    yield sleep(FREE_API_RATE_LIMIT_MS - elapsed);
                }
                this.lastRequestTime = Date.now();
            }
            try {
                // Build URL based on API tier
                const url = USE_PRO_API
                    ? `${IP_API_BASE}/json/${ip}?key=${IP_API_KEY}&fields=status,message,countryCode,timezone,lat,lon,city,region`
                    : `${IP_API_BASE}/json/${ip}?fields=status,message,countryCode,timezone,lat,lon,city,region`;
                const { data } = yield axios_1.default.get(url);
                if (data.status !== "success") {
                    console.warn(`Geo lookup failed for ${ip}: ${data.message || "unknown error"}`);
                    return null;
                }
                return {
                    countryCode: data.countryCode,
                    timezone: data.timezone,
                    lat: data.lat,
                    lon: data.lon,
                    city: data.city,
                    region: data.region,
                };
            }
            catch (error) {
                console.error(`Geo lookup error for ${ip}:`, error);
                return null;
            }
        });
    }
    // Extract IP address from a proxy URL
    static extractIPFromProxy(proxyUrl) {
        if (!proxyUrl)
            return null;
        try {
            const url = new URL(proxyUrl);
            const host = url.hostname;
            // Check if it's an IPv4 address
            const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
            if (ipv4Regex.test(host)) {
                return host;
            }
            // If it's a hostname (not an IP), return null
            // DNS resolution would be needed to get the IP
            return null;
        }
        catch (_a) {
            return null;
        }
    }
    // Clear the geolocation cache
    clearCache() {
        this.cache.clear();
    }
    // Clear the IP cache (forces fresh IP lookup on next call)
    clearIPCache() {
        this.ipCache.clear();
    }
    // Clear all caches
    clearAllCaches() {
        this.cache.clear();
        this.ipCache.clear();
    }
    // Get cache size (useful for debugging)
    getCacheSize() {
        return this.cache.size;
    }
    // Get IP cache size
    getIPCacheSize() {
        return this.ipCache.size;
    }
}
exports.IPGeolocationService = IPGeolocationService;
// Singleton instance for shared use
let geoServiceInstance = null;
function getGeoService() {
    if (!geoServiceInstance) {
        geoServiceInstance = new IPGeolocationService();
    }
    return geoServiceInstance;
}
