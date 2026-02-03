import { SupabaseClient } from "@supabase/supabase-js";

import { LoggedActivityType } from "../types/client";

export async function logActionAudit(
  supabaseClient: SupabaseClient,
  accountId: string,
  actionType: LoggedActivityType,
  metadata: Record<string, unknown>,
) {
  try {
    const { error } = await supabaseClient.from("roverfox_audit_logs").insert({
      browser_id: accountId,
      action_type: actionType,
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
