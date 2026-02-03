import { SupabaseClient } from "@supabase/supabase-js";
import { LoggedActivityType } from "../types/client";
export declare function logActionAudit(supabaseClient: SupabaseClient, accountId: string, actionType: LoggedActivityType, metadata: Record<string, unknown>): Promise<void>;
