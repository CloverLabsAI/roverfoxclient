/**
 * RecordingManager — receives rrweb event batches from the browser via a
 * Playwright `exposeBinding` channel, tracks per-session stats, and forwards
 * each batch over the existing replay WebSocket as a `recording-chunk`
 * message. Sends a `recording-finalize` message on session end.
 *
 * In-memory only on this side; durable persistence is the worker's job.
 */
import type { RrwebEvent } from '@roverfox/types';
import type { BrowserContext } from 'playwright';
import type WebSocket from 'ws';
import type { ConnectionPool } from './connection-pool.js';
export type { RrwebEvent };
export interface RecordingSession {
    browserId: string;
    recordingId: string;
    startedAt: number;
    lastEventAt: number;
    eventCount: number;
    approxBytes: number;
    batchCount: number;
    seq: number;
    replayWs: WebSocket;
    connectionPool: ConnectionPool;
}
export declare class RecordingManager {
    private sessions;
    private boundContexts;
    /**
     * Set up the exposed binding on a context. Must be called BEFORE addInitScript
     * for any script that references `window.rfRecordEvent`.
     * Idempotent for a given context.
     */
    attachToContext(context: BrowserContext, browserId: string, replayWs: WebSocket, connectionPool: ConnectionPool): Promise<void>;
    /**
     * Flush a finalize message and stop tracking the session. Returns the final
     * session state for callers that want to log additional context.
     */
    finalize(browserId: string): Promise<RecordingSession | null>;
    private handleBatch;
}
