/**
 * Client for communicating with Roverfox Manager
 */
import type { ServerAssignment } from './types';
export declare class ManagerClient {
    private managerUrl;
    private debug;
    constructor(managerUrl?: string, debug?: boolean);
    /**
     * Gets server assignment from manager
     */
    getServerAssignment(): Promise<ServerAssignment>;
}
