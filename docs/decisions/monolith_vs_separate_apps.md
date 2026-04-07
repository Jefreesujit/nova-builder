# Architecture Decision: Monolith vs. Separate Apps

## Recommendation: The Monolith (Single Next.js App)

### Why this wins?
1.  **Code Sharing:** You define UI components **once**. They are used by both the Builder (editor/preview) and the Viewer (live user site).
2.  **Single Deployment:** git push -> Vercel deploys everything.
3.  **Unified Stack:** No context switching between Vite and Next.js.

## The Core Need: Shared Infrastructure
Even with a prompt-based builder (like v0 or Bolt) that generates HTML/JS, a single repo is superior for:
1.  **Rendering Logic:** The same "Sanitized Sandbox" or "Iframe Preview" logic is used by the Builder (preview) and the Viewer (live site).
2.  **CSS/Tailwind Base:** Ensures the AI-generated code looks identical in both environments.
3.  **Asset Resolution:** Shared logic for handling Supabase Storage URLs.

### No-Redirect Subdomain Hosting
Next.js **Middleware** acts as a global router. It detects if the request is for:
- `app.novabuilder.com` -> Serves the Builder Dashboard.
- `abc.novabuilder.app` -> Serves the rendered User Site via an **internal rewrite**.
    - **CRITICAL:** This is not a search-engine redirect. The user stays on `abc.novabuilder.app` and never sees the internal `/sites/abc` path.
- `novabuilder.com` -> Serves the Marketing/Landing page.
