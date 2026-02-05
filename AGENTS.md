# Agent Documentation (AGENTS.md)

## Project Overview: NovaBuilder
NovaBuilder is an open-source AI-powered application builder. It allows users to prompt an LLM to generate full-stack (HTML/JS/CSS) applications, which are then hosted on subdomains.

## Current Technical State (Pre-Migration)
- **Frontend:** Vite + React + TypeScript.
- **AI:** Google Gemini SDK integration.
- **Storage:** Currently mock/local, moving to Supabase.

## Architecture Vision (Next.js Monolith)
The project is migrating to a **Single Next.js Monolith** to handle both the Builder and the Viewer infrastructure.

### 1. Subdomain Handling (Rewrites)
Requests to `*.novabuilder.app` are handled via middleware rewrites:
- `abc.novabuilder.app` -> Internally rewrites to `/sites/abc`.
- The user URL **never** changes (No redirects).

### 2. File System (JSONB)
Project source code is stored as a **VFS (Virtual File System)** inside a Supabase Postgres **JSONB** column.
- Schema: `{ "index.html": { "content": "..." }, "styles.css": { "content": "..." } }`
- This allows the AI to patch/edit multiple files efficiently in a single DB operation.

## Key Goals for Future Agents
1.  **Maintain the Monolith:** Do not split the Builder and Viewer into separate apps; share the infrastructure logic.
2.  **VFS Priority:** Always treat project code as a JSONB object in the database for performance.
3.  **SEO & Middleware:** Marketing site, Dashboard, and User sites all coexist in `/src/app`.

## Documentation Reference
Full details available in `/docs/decisions/`.
