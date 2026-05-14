/**
 * rrweb session-recording init script.
 *
 * Returns a string of JS code intended to be injected via Playwright's
 * `addInitScript`. Assumes the rrweb library bundle has already been injected
 * (in a prior `addInitScript` call) and exposes a global `rrweb` object.
 *
 * Events are buffered in-page and flushed to the Node side via the
 * `window.rfRecordEvent` binding (set up via `context.exposeBinding` before
 * this script runs). Flush triggers: buffer reaches 50 events, 1s timer, or
 * page lifecycle (`beforeunload` / `pagehide`).
 */
export declare function buildRrwebInitScript(): string;
