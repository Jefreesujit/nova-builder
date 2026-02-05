# Storage & Deployment Strategy

## 1. Data Storage Strategy
**Recommendation: Postgres JSONB (Virtual File System)**

For an AI Code Builder, you are building a **Virtual File System (VFS)**.
- **Do NOT use S3/Blob for source code:** Reading tiny text files from S3 is slow.
- **USE Postgres JSONB:** Store the entire project's file structure in a single JSON column.

### Why JSONB?
1.  **Speed:** 1 Query to load the entire project. Instant "boot" time.
2.  **AI Friendly:** Easier to patch JSON structure with AI output.
3.  **Realtime:** Supabase provides specific "Realtime" subscriptions to row changes.

### Where do "Assets" go? (Images/Uploads)
**Supabase Storage (S3 wrapper).**
- Store the *public URL* in the `files` JSONB.

---

## 2. Deployment & Export Strategy

### A. "Download Code"
**Implementation:** Client-side using `jszip`. Iterate through `files` JSON object and trigger a browser download.

### B. "Hosting Subdomains" (`project.novabuilder.app`)
**Solution: Next.js Middleware (Internal Rewrites)**
1.  **DNS:** Point `*.novabuilder.app` to the Vercel project.
2.  **Middleware:** Detects the subdomain (`abc`).
3.  **Internal Rewrite:** Rewrites the request to an internal route (e.g., `/sites/abc`) **without changing the URL in the user's browser**.
4.  **Render:** The page fetches the `files` JSONB from Supabase and renders the content.
