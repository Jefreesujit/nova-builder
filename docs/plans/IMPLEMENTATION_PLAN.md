# Implementation Plan: Next.js Monolith Migration

## Goal
Migrate the existing Vite+React codebase to a **Single Next.js Application** that serves two purposes:
1.  **The Builder (`app.novabuilder.com`):** The prompt-based generator.
2.  **The Viewer (`*.novabuilder.app`):** The public hosting application.

## Subdomain Strategy
We use **Next.js Middleware Rewrites** to serve project content at `abc.novabuilder.app` without redirects, ensuring a professional custom-domain experience.

## Migration Phases
1.  **Foundation:** Init Next.js App Router & Middleware.
2.  **Data Layer:** Integrate Supabase with JSONB storage for project files.
3.  **Porting:** Move the AI prompt logic and preview UI from Vite to Next.js.
