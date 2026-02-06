# Agent Documentation (AGENTS.md)

## Project Overview: NovaBuilder
NovaBuilder is an open-source AI-powered application builder. It allows users to prompt an LLM to generate full-stack (HTML/JS/CSS) applications, which are then hosted on subdomains.

## Current Technical State
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **AI:** Google Gemini AI integration (`@google/genai`).
- **Database & Auth:** Supabase (PostgreSQL with JSONB for VFS).
- **State Management:** Zustand.
- **Icons:** Lucide React.

## Architecture & Infrastructure

### 1. Subdomain Handling (Middleware)
Requests to `*.novabuilder.app` (or configured domain) are handled via `middleware.ts`:
- Requests to subdomains are internally rewritten to `/sites/[id]`.
- The user URL remains the same (Transparent proxy/rewrite).

### 2. Virtual File System (VFS)
Project source code is stored as a **VFS** inside a Supabase Postgres **JSONB** column.
- **Schema:** `{ "filename": { "content": "..." }, ... }`
- This architecture allows the AI to perform multi-file edits and patches in a single atomic database operation.
- The `workspace-client.tsx` and related components handle the rendering and editing of this VFS.

### 3. AI Generation Flow
- The `geminiService.ts` handles communication with Google Gemini.
- Generation is streamed and processed to support both full generation and incremental patches.
- The UI includes an inline diff viewer for reviewing AI-suggested changes.

## Engineering Principles
1.  **Maintain the Monolith:** The Builder and Viewer infrastructure share the same Next.js codebase for maximum logic reuse.
2.  **VFS First:** Always treat site content as a JSONB structure until deployment.
3.  **Aesthetics Matter:** All UI components should follow the premium design system (Glassmorphism, smooth transitions, dark mode).

## Documentation Reference
Full details available in `/docs/decisions/`.
