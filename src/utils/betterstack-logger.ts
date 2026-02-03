/**
 * BetterStack Logger - Sends logs to BetterStack via Logtail
 */

import { Logtail } from "@logtail/node";

let logtailInstance: Logtail | null = null;

function getLogtail(): Logtail | null {
  if (logtailInstance) {
    return logtailInstance;
  }

  const sourceToken = "marj3QZXewhz37ZDVBqhZZDK";
  if (!sourceToken) {
    return null;
  }

  logtailInstance = new Logtail(sourceToken, {
    endpoint: "https://s1689731.us-east-9.betterstackdata.com",
    batchInterval: 1000,
  });
  return logtailInstance;
}

export interface DataUsageLog {
  browserId: string;
  start: string;
  end: string;
  bytes: number;
  durationMs: number;
}

/**
 * Log data usage to BetterStack when a profile session ends
 */
export async function logDataUsage(data: DataUsageLog): Promise<void> {
  const logtail = getLogtail();
  if (!logtail) {
    return;
  }

  try {
    await logtail.info("Profile session data usage", {
      event: "data_usage",
      browserId: data.browserId,
      sessionStart: data.start,
      sessionEnd: data.end,
      bytesTransferred: data.bytes,
      durationMs: data.durationMs,
      bytesFormatted: formatBytes(data.bytes),
    });
  } catch (error) {
    console.error("[betterstack] Failed to log data usage:", error);
  }
}

/**
 * Flush pending logs (call before process exit)
 */
export async function flushLogs(): Promise<void> {
  const logtail = getLogtail();
  if (logtail) {
    await logtail.flush();
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
