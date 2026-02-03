# Roverfox

A browser automation client built on Playwright for Firefox.

## Installation

Roverfox client can be installed with npm:

```bash
npm install github:CloverLabsAI/roverfoxclient
```

## Usage

```typescript
import { RoverfoxClient } from 'roverfoxclient';

// Option 1: With Supabase client (backward compatible)
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const client = new RoverfoxClient(supabase, wsAPIKey, managerUrl);

// Option 2: Using environment variables (standalone)
// Set SUPABASE_URL and SUPABASE_KEY in environment
const client = new RoverfoxClient(undefined, wsAPIKey, managerUrl);

// Option 3: With Supabase URL directly
const client = new RoverfoxClient(SUPABASE_URL, SUPABASE_KEY, managerUrl);

// Launch a browser profile
// Playwright compatible API
const context = await client.launchProfile('browser-id');
```

## Development

All development happens in the private `roverfox` repo. If you're a Clover employee, see there for more.
