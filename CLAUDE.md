# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

roverfox-client is a TypeScript library for browser automation built on Playwright (Firefox). It operates in two modes:
- **Distributed mode**: Connects to a Roverfox manager server to get browser server assignments, manage profiles, and enable live replay/streaming
- **Local mode**: Runs a self-contained proxy server (`RoverfoxClient.launchLocalContext()`) with no manager dependency

## Build

```bash
npm run build        # Compiles TypeScript (tsc) and copies src/scripts/ to dist/scripts/
```

No linter or test runner is currently configured. The `prepare` hook runs `npm run build` on install.

## Architecture

**Entry point**: `src/index.ts` — exports `RoverfoxClient` as the main class.

**Core modules** (all in `src/`):
- `connection-pool.ts` — Reuses Playwright browser connections per endpoint via WebSocket
- `manager-client.ts` — HTTP client for the manager API (server assignment, profile CRUD, audit logging, data usage reporting)
- `replay-manager.ts` — Live replay streaming and screenshot capture over WebSocket
- `storage-manager.ts` — Persists and restores browser profile state (cookies, localStorage, IndexedDB)
- `data-usage-tracker.ts` — Tracks network request/response sizes per session

**Worker** (`src/worker/`): Bundled server code for local mode — runs an HTTP/WebSocket server on port 9001 with browser proxying, replay hub, and Camoufox browser setup.

**Client-side scripts** (`src/scripts/`): JavaScript files injected into pages to export localStorage and IndexedDB data. These are copied (not compiled) to `dist/scripts/` during build.

**Types**: `src/types.ts` for core types, `src/types/client.ts` for profile/storage types, `src/types/replay-protocol.ts` for WebSocket message protocol types.

**External services**: Manager API (`manager.roverfox.monitico.com`), Supabase (audit logs/profile storage), BetterStack (logging), Porkbun (DNS).

## Key Conventions

- CommonJS output (ES2016 target) with TypeScript strict mode
- Import paths use `.js` extensions (for CommonJS compatibility with declaration files)
- Logger prefixes: `[client]`, `[proxy]`, `[auth]`, `[worker]`
- Non-critical failures (audit logging, storage saves) are silently caught; connection failures throw
- Debug mode (`debug: true` flag) enables verbose logging
- Browser fingerprinting config lives in `src/browserConfig.json`
