/**
 * Porkbun DNS management service
 */

import axios from "axios";

interface PorkbunCreateResponse {
  status: string;
  id?: string;
  message?: string;
}

interface PorkbunDeleteResponse {
  status: string;
  message?: string;
}

interface PorkbunRecord {
  id: string;
  name: string;
  type: string;
  content: string;
  ttl: string;
}

interface PorkbunRetrieveResponse {
  status: string;
  records?: PorkbunRecord[];
  message?: string;
}

interface PorkbunEditResponse {
  status: string;
  message?: string;
}

export class PorkbunService {
  private apiKey: string;
  private secretKey: string;
  private domain: string;

  constructor() {
    this.apiKey = process.env.PORKBUN_API_KEY!;
    this.secretKey = process.env.PORKBUN_SECRET_KEY!;
    this.domain = process.env.PORKBUN_DOMAIN || "monitico.com";

    if (!this.apiKey || !this.secretKey) {
      throw new Error("PORKBUN_API_KEY and PORKBUN_SECRET_KEY must be set");
    }
  }

  /**
   * Converts an IP address to an alphanumeric subdomain ID
   */
  private ipToSubdomain(ip: string): string {
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
  private async getRecordsByName(subdomain: string): Promise<PorkbunRecord[]> {
    try {
      const response = await axios.post<PorkbunRetrieveResponse>(
        `https://api.porkbun.com/api/json/v3/dns/retrieveByNameType/${this.domain}/A/${subdomain}`,
        {
          secretapikey: this.secretKey,
          apikey: this.apiKey,
        },
      );

      if (response.data.status === "SUCCESS" && response.data.records) {
        return response.data.records;
      }
      return [];
    } catch {
      // Record doesn't exist or API error
      return [];
    }
  }

  /**
   * Updates an existing DNS record
   */
  private async updateRecord(
    recordId: string,
    ip: string,
    ttl: number = 600,
  ): Promise<boolean> {
    try {
      const response = await axios.post<PorkbunEditResponse>(
        `https://api.porkbun.com/api/json/v3/dns/edit/${this.domain}/${recordId}`,
        {
          secretapikey: this.secretKey,
          apikey: this.apiKey,
          type: "A",
          content: ip,
          ttl: ttl.toString(),
        },
      );

      return response.data.status === "SUCCESS";
    } catch {
      return false;
    }
  }

  /**
   * Creates or updates an A record subdomain for an IP address
   */
  async createSubdomainForIp(
    ip: string,
    ttl: number = 600,
  ): Promise<string | null> {
    try {
      const subdomain = this.ipToSubdomain(ip);

      // Check if record already exists
      const existingRecords = await this.getRecordsByName(subdomain);

      if (existingRecords.length > 0) {
        const existingRecord = existingRecords[0];

        // If IP matches, no action needed
        if (existingRecord.content === ip) {
          console.log(
            `[porkbun] ✓ Subdomain already exists with correct IP: ${subdomain}.${this.domain} -> ${ip}`,
          );
          return subdomain;
        }

        // IP changed, update the record
        console.log(
          `[porkbun] Updating A record: ${subdomain}.${this.domain} -> ${ip} (was ${existingRecord.content})`,
        );
        const updated = await this.updateRecord(existingRecord.id, ip, ttl);

        if (updated) {
          console.log(
            `[porkbun] ✓ Updated subdomain: ${subdomain}.${this.domain}`,
          );
          return subdomain;
        } else {
          console.error(`[porkbun] ✗ Failed to update subdomain`);
          return null;
        }
      }

      // Record doesn't exist, create it
      console.log(
        `[porkbun] Creating A record: ${subdomain}.${this.domain} -> ${ip}`,
      );

      const response = await axios.post<PorkbunCreateResponse>(
        `https://api.porkbun.com/api/json/v3/dns/create/${this.domain}`,
        {
          secretapikey: this.secretKey,
          apikey: this.apiKey,
          name: subdomain,
          type: "A",
          content: ip,
          ttl: ttl.toString(),
        },
      );

      if (response.data.status === "SUCCESS") {
        console.log(
          `[porkbun] ✓ Created subdomain: ${subdomain}.${this.domain} (ID: ${response.data.id})`,
        );
        return subdomain;
      } else {
        console.error(
          `[porkbun] ✗ Failed to create subdomain:`,
          response.data.message || response.data,
        );
        return null;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "[porkbun] API Error:",
          error.response?.data || error.message,
        );
      } else {
        console.error("[porkbun] Error:", error);
      }
      return null;
    }
  }

  /**
   * Deletes an A record subdomain by IP address
   */
  async deleteSubdomainForIp(ip: string): Promise<boolean> {
    try {
      const subdomain = this.ipToSubdomain(ip);

      console.log(`[porkbun] Deleting A record: ${subdomain}.${this.domain}`);

      const response = await axios.post<PorkbunDeleteResponse>(
        `https://api.porkbun.com/api/json/v3/dns/deleteByNameType/${this.domain}/A/${subdomain}`,
        {
          secretapikey: this.secretKey,
          apikey: this.apiKey,
        },
      );

      if (response.data.status === "SUCCESS") {
        console.log(
          `[porkbun] ✓ Deleted subdomain: ${subdomain}.${this.domain}`,
        );
        return true;
      } else {
        console.error(
          `[porkbun] ✗ Failed to delete subdomain:`,
          response.data.message || response.data,
        );
        return false;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "[porkbun] API Error:",
          error.response?.data || error.message,
        );
      } else {
        console.error("[porkbun] Error:", error);
      }
      return false;
    }
  }

  /**
   * Gets the full subdomain URL for an IP address
   */
  getSubdomainUrl(ip: string): string {
    const subdomain = this.ipToSubdomain(ip);
    return `${subdomain}.${this.domain}`;
  }
}
