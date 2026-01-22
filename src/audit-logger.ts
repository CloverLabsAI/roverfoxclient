/**
 * Audit logging for browser actions
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { LoggedActivityType } from "./types";

export async function logActionAudit(
  supabaseClient: SupabaseClient,
  accountId: string,
  actionType: LoggedActivityType,
  metadata: Record<string, unknown>,
) {
  try {
    const { error } = await supabaseClient.from("accountAuditLogs").insert({
      browserId: accountId,
      actionType: actionType,
      metadata: metadata,
    });

    if (error) {
      console.error(
        `Failed to log action audit for account ${accountId}:`,
        error,
      );
    }
  } catch (error) {
    console.error(
      `Error logging action audit for account ${accountId}:`,
      error,
    );
  }
}
