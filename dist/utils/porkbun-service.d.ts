/**
 * Porkbun DNS management service
 */
export declare class PorkbunService {
    private apiKey;
    private secretKey;
    private domain;
    constructor();
    /**
     * Converts an IP address to an alphanumeric subdomain ID
     */
    private ipToSubdomain;
    /**
     * Retrieves existing DNS records for a subdomain
     */
    private getRecordsByName;
    /**
     * Updates an existing DNS record
     */
    private updateRecord;
    /**
     * Creates or updates an A record subdomain for an IP address
     */
    createSubdomainForIp(ip: string, ttl?: number): Promise<string | null>;
    /**
     * Deletes an A record subdomain by IP address
     */
    deleteSubdomainForIp(ip: string): Promise<boolean>;
    /**
     * Gets the full subdomain URL for an IP address
     */
    getSubdomainUrl(ip: string): string;
}
