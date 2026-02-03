// IP Geolocation Service
// Looks up geographic info for proxy IPs using ip-api.com
import { HttpsProxyAgent } from "https-proxy-agent";

const IP_API_KEY = process.env.IP_API_KEY;
const USE_PRO_API = !!IP_API_KEY;
const IP_API_BASE = USE_PRO_API
  ? "https://pro.ip-api.com"
  : "http://ip-api.com"; // Free API for backup

export interface GeoLocationData {
  countryCode: string;
  timezone: string;
  lat: number;
  lon: number;
  city?: string;
  region?: string;
}

export interface ProxyConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
}

interface CacheEntry {
  data: GeoLocationData;
  timestamp: number;
}

interface IPCacheEntry {
  ip: string;
  timestamp: number;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const IP_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const IPIFY_TIMEOUT_MS = 7000;
const FREE_API_RATE_LIMIT_MS = 1500; // ~40 req/min to stay under free tier 45/min limit

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class IPGeolocationService {
  private cache: Map<string, CacheEntry> = new Map();
  private ipCache: Map<string, IPCacheEntry> = new Map();
  private lastRequestTime: number = 0; // For free API rate limiting

  // Get the actual exit IP by making a request through the proxy to ipify.org
  async getExitIP(proxy: ProxyConfig): Promise<string | null> {
    const cacheKey = `${proxy.host}:${proxy.port}`;

    // Check IP cache (shorter TTL since IPs can rotate)
    const cached = this.ipCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < IP_CACHE_TTL_MS) {
      return cached.ip;
    }

    try {
      // Build proxy URL for the agent
      const auth =
        proxy.username && proxy.password
          ? `${proxy.username}:${proxy.password}@`
          : "";
      const proxyUrl = `http://${auth}${proxy.host}:${proxy.port}`;
      const agent = new HttpsProxyAgent(proxyUrl);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), IPIFY_TIMEOUT_MS);

      const response = await fetch("https://api.ipify.org?format=json", {
        // @ts-ignore - Node.js fetch supports agent
        agent,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        console.warn(`ipify request failed: ${response.status}`);
        return null;
      }

      const data = await response.json();
      const ip = data.ip;

      if (ip) {
        this.ipCache.set(cacheKey, { ip, timestamp: Date.now() });
      }

      return ip || null;
    } catch (error) {
      console.error(`Failed to get exit IP through proxy:`, error);
      return null;
    }
  }

  // Check if proxy IP has changed compared to stored IP
  async hasIPChanged(
    proxy: ProxyConfig,
    storedIP: string | null,
  ): Promise<{ changed: boolean; currentIP: string | null }> {
    const currentIP = await this.getExitIP(proxy);

    if (!currentIP) {
      return { changed: false, currentIP: null };
    }

    if (!storedIP) {
      return { changed: true, currentIP };
    }

    return { changed: currentIP !== storedIP, currentIP };
  }

  // Get geolocation by first getting the exit IP through the proxy
  async lookupThroughProxy(
    proxy: ProxyConfig,
  ): Promise<{ ip: string; geo: GeoLocationData } | null> {
    const ip = await this.getExitIP(proxy);
    if (!ip) return null;

    const geo = await this.lookup(ip);
    if (!geo) return null;

    return { ip, geo };
  }

  // Lookup geolocation for an IP address
  async lookup(ip: string): Promise<GeoLocationData | null> {
    // Check cache first
    const cached = this.cache.get(ip);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    // Fetch from API
    const data = await this.fetchFromAPI(ip);
    if (data) {
      this.cache.set(ip, { data, timestamp: Date.now() });
    }
    return data;
  }

  // Fetch from ip-api.com (Uses Free API if the key isn't set)
  private async fetchFromAPI(ip: string): Promise<GeoLocationData | null> {
    // Rate limit only for free API
    if (!USE_PRO_API) {
      const elapsed = Date.now() - this.lastRequestTime;
      if (elapsed < FREE_API_RATE_LIMIT_MS) {
        await sleep(FREE_API_RATE_LIMIT_MS - elapsed);
      }
      this.lastRequestTime = Date.now();
    }

    try {
      // Build URL based on API tier
      const url = USE_PRO_API
        ? `${IP_API_BASE}/json/${ip}?key=${IP_API_KEY}&fields=status,message,countryCode,timezone,lat,lon,city,region`
        : `${IP_API_BASE}/json/${ip}?fields=status,message,countryCode,timezone,lat,lon,city,region`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== "success") {
        console.warn(
          `Geo lookup failed for ${ip}: ${data.message || "unknown error"}`,
        );
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
    } catch (error) {
      console.error(`Geo lookup error for ${ip}:`, error);
      return null;
    }
  }

  // Extract IP address from a proxy URL
  static extractIPFromProxy(proxyUrl: string): string | null {
    if (!proxyUrl) return null;

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
    } catch {
      return null;
    }
  }

  // Clear the geolocation cache
  clearCache(): void {
    this.cache.clear();
  }

  // Clear the IP cache (forces fresh IP lookup on next call)
  clearIPCache(): void {
    this.ipCache.clear();
  }

  // Clear all caches
  clearAllCaches(): void {
    this.cache.clear();
    this.ipCache.clear();
  }

  // Get cache size (useful for debugging)
  getCacheSize(): number {
    return this.cache.size;
  }

  // Get IP cache size
  getIPCacheSize(): number {
    return this.ipCache.size;
  }
}

// Singleton instance for shared use
let geoServiceInstance: IPGeolocationService | null = null;

export function getGeoService(): IPGeolocationService {
  if (!geoServiceInstance) {
    geoServiceInstance = new IPGeolocationService();
  }
  return geoServiceInstance;
}
