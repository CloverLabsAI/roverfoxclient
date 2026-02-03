/**
 * Client for communicating with Roverfox Manager
 */

import axios from "axios";

import type { ServerAssignment } from "./types.js";

export class ManagerClient {
  private managerUrl: string;
  private debug: boolean;

  constructor(managerUrl?: string, debug: boolean = false) {
    this.managerUrl =
      managerUrl ||
      process.env.ROVERFOX_MANAGER_URL ||
      "https://manager.roverfox.monitico.com";
    this.debug = debug;
  }

  /**
   * Gets server assignment from manager
   */
  async getServerAssignment(): Promise<ServerAssignment> {
    try {
      const { data: assignment } = await axios.get(
        `${this.managerUrl}/api/assign-server`,
      );
      if (this.debug)
        console.log(`[client] Assigned to server ${assignment.serverIp}`);
      return assignment;
    } catch (error) {
      if (this.debug)
        console.error("[client] Failed to get server assignment:", error);
      throw error;
    }
  }
  /**
   * Lists all profiles via manager
   */
  async listProfiles(): Promise<{ browser_id: string; data: any }[]> {
    try {
      const { data } = await axios.get(`${this.managerUrl}/api/profiles`);
      return data;
    } catch (error) {
      if (this.debug) console.error("[client] Failed to list profiles:", error);
      throw error;
    }
  }

  /**
   * Gets profile and proxy data from manager
   */
  async getProfile(browserId: string): Promise<any> {
    try {
      const { data } = await axios.get(
        `${this.managerUrl}/api/profiles/${browserId}`,
      );
      return data;
    } catch (error) {
      if (this.debug) console.error("[client] Failed to get profile:", error);
      throw error;
    }
  }

  /**
   * Creates a new profile via manager
   */
  async createProfile(
    browserId: string,
    profileData: any,
    proxyId: number,
  ): Promise<void> {
    try {
      await axios.post(`${this.managerUrl}/api/profiles`, {
        browserId,
        profileData,
        proxyId,
      });
    } catch (error) {
      if (this.debug)
        console.error("[client] Failed to create profile:", error);
      throw error;
    }
  }

  /**
   * Updates profile data via manager
   */
  async updateProfileData(
    browserId: string,
    profileData: any,
    proxyId?: number,
  ): Promise<void> {
    try {
      await axios.patch(`${this.managerUrl}/api/profiles/${browserId}`, {
        profileData,
        proxyId,
      });
    } catch (error) {
      if (this.debug)
        console.error("[client] Failed to update profile data:", error);
      throw error;
    }
  }

  /**
   * Deletes a profile via manager
   */
  async deleteProfile(browserId: string): Promise<void> {
    try {
      await axios.delete(`${this.managerUrl}/api/profiles/${browserId}`);
    } catch (error) {
      if (this.debug)
        console.error("[client] Failed to delete profile:", error);
      throw error;
    }
  }

  /**
   * Updates storage state via manager
   */
  async updateStorage(browserId: string, storageData: any): Promise<void> {
    try {
      await axios.post(
        `${this.managerUrl}/api/profiles/${browserId}/storage`,
        storageData,
      );
    } catch (error) {
      // Silently ignore storage update errors as they aren't critical
      if (this.debug)
        console.error("[client] Failed to update storage:", error);
    }
  }

  /**
   * Logs an action audit via manager
   */
  async logAudit(
    browserId: string,
    actionType: string,
    metadata: any,
  ): Promise<void> {
    try {
      await axios.post(`${this.managerUrl}/api/audit`, {
        browserId,
        actionType,
        metadata,
      });
    } catch (error) {
      if (this.debug) console.error("[client] Failed to log audit:", error);
    }
  }

  /**
   * Logs data usage via manager
   */
  async logUsage(
    browserId: string,
    start: string,
    end: string,
    bytes: number,
  ): Promise<void> {
    try {
      await axios.post(`${this.managerUrl}/api/usage`, {
        browserId,
        start,
        end,
        bytes,
      });
    } catch (error) {
      if (this.debug) console.error("[client] Failed to log usage:", error);
    }
  }
}
