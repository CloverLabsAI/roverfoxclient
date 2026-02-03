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
export declare class IPGeolocationService {
    private cache;
    private ipCache;
    private lastRequestTime;
    getExitIP(proxy: ProxyConfig): Promise<string | null>;
    hasIPChanged(proxy: ProxyConfig, storedIP: string | null): Promise<{
        changed: boolean;
        currentIP: string | null;
    }>;
    lookupThroughProxy(proxy: ProxyConfig): Promise<{
        ip: string;
        geo: GeoLocationData;
    } | null>;
    lookup(ip: string): Promise<GeoLocationData | null>;
    private fetchFromAPI;
    static extractIPFromProxy(proxyUrl: string): string | null;
    clearCache(): void;
    clearIPCache(): void;
    clearAllCaches(): void;
    getCacheSize(): number;
    getIPCacheSize(): number;
}
export declare function getGeoService(): IPGeolocationService;
