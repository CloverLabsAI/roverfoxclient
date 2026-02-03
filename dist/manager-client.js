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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerClient = void 0;
const axios_1 = __importDefault(require("axios"));
class ManagerClient {
    constructor(managerUrl, debug = false) {
        this.managerUrl =
            managerUrl ||
                process.env.ROVERFOX_MANAGER_URL ||
                "https://manager.roverfox.monitico.com";
        this.debug = debug;
    }
    /**
     * Gets server assignment from manager
     */
    getServerAssignment() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data: assignment } = yield axios_1.default.get(`${this.managerUrl}/api/assign-server`);
                if (this.debug)
                    console.log(`[client] Assigned to server ${assignment.serverIp}`);
                return assignment;
            }
            catch (error) {
                if (this.debug)
                    console.error("[client] Failed to get server assignment:", error);
                throw error;
            }
        });
    }
    /**
     * Lists all profiles via manager
     */
    listProfiles() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield axios_1.default.get(`${this.managerUrl}/api/profiles`);
                return data;
            }
            catch (error) {
                if (this.debug)
                    console.error("[client] Failed to list profiles:", error);
                throw error;
            }
        });
    }
    /**
     * Gets profile and proxy data from manager
     */
    getProfile(browserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield axios_1.default.get(`${this.managerUrl}/api/profiles/${browserId}`);
                return data;
            }
            catch (error) {
                if (this.debug)
                    console.error("[client] Failed to get profile:", error);
                throw error;
            }
        });
    }
    /**
     * Creates a new profile via manager
     */
    createProfile(browserId, profileData, proxyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.post(`${this.managerUrl}/api/profiles`, {
                    browserId,
                    profileData,
                    proxyId,
                });
            }
            catch (error) {
                if (this.debug)
                    console.error("[client] Failed to create profile:", error);
                throw error;
            }
        });
    }
    /**
     * Updates profile data via manager
     */
    updateProfileData(browserId, profileData, proxyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.patch(`${this.managerUrl}/api/profiles/${browserId}`, {
                    profileData,
                    proxyId,
                });
            }
            catch (error) {
                if (this.debug)
                    console.error("[client] Failed to update profile data:", error);
                throw error;
            }
        });
    }
    /**
     * Deletes a profile via manager
     */
    deleteProfile(browserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.delete(`${this.managerUrl}/api/profiles/${browserId}`);
            }
            catch (error) {
                if (this.debug)
                    console.error("[client] Failed to delete profile:", error);
                throw error;
            }
        });
    }
    /**
     * Updates storage state via manager
     */
    updateStorage(browserId, storageData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.post(`${this.managerUrl}/api/profiles/${browserId}/storage`, storageData);
            }
            catch (error) {
                // Silently ignore storage update errors as they aren't critical
                if (this.debug)
                    console.error("[client] Failed to update storage:", error);
            }
        });
    }
    /**
     * Logs an action audit via manager
     */
    logAudit(browserId, actionType, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.post(`${this.managerUrl}/api/audit`, {
                    browserId,
                    actionType,
                    metadata,
                });
            }
            catch (error) {
                if (this.debug)
                    console.error("[client] Failed to log audit:", error);
            }
        });
    }
    /**
     * Logs data usage via manager
     */
    logUsage(browserId, start, end, bytes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.post(`${this.managerUrl}/api/usage`, {
                    browserId,
                    start,
                    end,
                    bytes,
                });
            }
            catch (error) {
                if (this.debug)
                    console.error("[client] Failed to log usage:", error);
            }
        });
    }
}
exports.ManagerClient = ManagerClient;
