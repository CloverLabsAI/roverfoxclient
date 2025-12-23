/**
 * Audit logging for browser actions
 */
import { SupabaseClient } from "@supabase/supabase-js";
import { LoggedActivityType } from "./types";
export declare function logActionAudit(supabaseClient: SupabaseClient, accountId: string, actionType: LoggedActivityType, metadata: Record<string, unknown>): Promise<void>;
