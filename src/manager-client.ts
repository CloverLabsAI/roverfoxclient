/**
 * Client for communicating with Roverfox Manager
 */

import type { ServerAssignment } from "./types";

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
      const response = await fetch(`${this.managerUrl}/api/assign-server`);
      if (!response.ok) {
        throw new Error(`Manager returned ${response.status}`);
      }

      const assignment = await response.json();
      if (this.debug)
        console.log(`[client] Assigned to server ${assignment.serverIp}`);
      return assignment;
    } catch (error) {
      if (this.debug)
        console.error("[client] Failed to get server assignment:", error);
      throw error;
    }
  }
}
