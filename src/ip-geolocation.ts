// IP Geolocation Service
// Looks up geographic info for proxy IPs using ip-api.com

export interface GeoLocationData {
  countryCode: string;
  timezone: string;
  lat: number;
  lon: number;
  city?: string;
  region?: string;
}

interface CacheEntry {
  data: GeoLocationData;
  timestamp: number;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const MIN_REQUEST_INTERVAL_MS = 1500; // ~40 req/min to stay under 45/min limit

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class IPGeolocationService {
  private cache: Map<string, CacheEntry> = new Map();
  private lastRequestTime: number = 0;

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

  // Fetch from ip-api.com with rate limiting
  private async fetchFromAPI(ip: string): Promise<GeoLocationData | null> {
    await this.waitForRateLimit();

    try {
      const response = await fetch(
        `http://ip-api.com/json/${ip}?fields=status,message,countryCode,timezone,lat,lon,city,region`
      );
      const data = await response.json();

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
    } catch (error) {
      console.error(`Geo lookup error for ${ip}:`, error);
      return null;
    }
  }

  // Rate limiter to stay under 45 req/min
  private async waitForRateLimit(): Promise<void> {
    const elapsed = Date.now() - this.lastRequestTime;
    if (elapsed < MIN_REQUEST_INTERVAL_MS) {
      await sleep(MIN_REQUEST_INTERVAL_MS - elapsed);
    }
    this.lastRequestTime = Date.now();
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

  // Clear the cache (useful for testing)
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache size (useful for debugging)
  getCacheSize(): number {
    return this.cache.size;
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
