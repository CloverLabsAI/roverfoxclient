"use strict";
/**
 * Client for communicating with Roverfox Manager
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerClient = void 0;
class ManagerClient {
    constructor(managerUrl, debug = false) {
        this.managerUrl = managerUrl || process.env.ROVERFOX_MANAGER_URL || 'https://manager.roverfox.monitico.com';
        this.debug = debug;
    }
    /**
     * Gets server assignment from manager
     */
    getServerAssignment() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${this.managerUrl}/api/assign-server`);
                if (!response.ok) {
                    throw new Error(`Manager returned ${response.status}`);
                }
                const assignment = yield response.json();
                if (this.debug)
                    console.log(`[client] Assigned to server ${assignment.serverIp}`);
                return assignment;
            }
            catch (error) {
                if (this.debug)
                    console.error('[client] Failed to get server assignment:', error);
                throw error;
            }
        });
    }
}
exports.ManagerClient = ManagerClient;
