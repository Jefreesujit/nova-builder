# Hosting Strategy: Vercel vs. Self-Hosted (Docker)

## The Question
*Is it acceptable to rely on Vercel (proprietary) for an Open Source project, or should we support a fully self-hosted Docker approach?*

## The Challenge: Wildcard Subdomains
The main technical hurdle is routing `*.novabuilder.app` to your application.
-   **Vercel:** Works out-of-the-box. Next.js Middleware handles the rewriting.
-   **Docker/Self-Hosted:** You cannot simply "bind" a wildcard domain to a container port. You need a **Reverse Proxy** (Caddy, Nginx, or Traefik) sitting in front of the container to handle the incoming `*.domain.com` traffic and pass the `Host` header to Next.js.

## Comparison

### Option 1: Vercel Only
-   **Pros:** Zero configuration, built-in CI/CD, global CDN.
-   **Cons:** Vendor lock-in. "Open Source" users need a Vercel account. Not truly "self-sovereign."

### Option 2: Docker + Caddy (Recommended for OS)
-   **Pros:** Runs anywhere (Coolify, VPS, AWS EC2, DigitalOcean). 100% Open Source.
-   **Cons:** Requires a `docker-compose.yml` with proxy configuration.

## Recommendation: The "Hybrid" Path
We do not have to choose one *or* the other for the codebase. **Next.js supports both.**

### How "Functions" work in both worlds
You asked: *If we use Vercel Functions, how does that run in Docker?*
-   **On Vercel:** Next.js automatically splits your `/api/*` routes into individual Serverless Functions.
-   **In Docker:** Next.js builds into a single **standard Node.js HTTP server**. All your `/api/*` routes run inside this one server process.
-   **The Benefit:** You write standard Next.js API code. Vercel optimizes it for serverless, while Docker runs it as a robust, long-running Node process. **Zero code changes required.**

**Strategy:**
1.  **Build Target:** Use Next.js `output: 'standalone'`. This creates an optimized Node.js server that runs perfectly in Docker.
2.  **The Code:** Keep the "Middleware Rewrite" logic in Next.js. It works seamlessly in Docker as long as the correct `Host` header is passed.
3.  **The Repostory:**
    -   Provide a `Dockerfile` for the app.
    -   Provide a `docker-compose.yml` that spins up:
        -   `app` (The Next.js Monolith)
        -   `proxy` (Caddy - handling SSL and wildcards)
        -   `db` (Supabase/Postgres - optional for full local dev)

### How Self-Hosting will work (Caddyfile Example)
Users running locally or on a VPS will use Caddy to route traffic.

```caddyfile
# Caddyfile
{
    # Global options
    email your-email@example.com
}

*.yourdomain.com, yourdomain.com {
    reverse_proxy app:3000 {
        # Important: Pass the original Host header so Next.js Middleware sees "abc.domain.com"
        header_up Host {host}
    }
}
```

## Conclusion: Phased Rollout Strategy

**Phase 1: Speed to Market (Vercel + Supabase)**
-   **Hosting:** Vercel (Zero config, immediate global CDN).
-   **Database:** Supabase Cloud (Managed Postgres + Auth).
-   **Goal:** Launch quickly, validate the product, and get the first 1,000 users.

**Phase 2: Independence & Cost Control (Docker + Self-Hosted)**
-   **Hosting:** Docker containers (via Coolify or AWS ECS).
-   **Database:** Self-hosted Postgres (RDS or dedicated VPS).
-   **Goal:** Reduce costs at scale and provide a fully open-source, self-sovereign stack for Enterprise users.

**Implementation Note:**
We will write code for **Phase 1** immediately, but keep the architecture "Docker-ready" (using standard Next.js API routes) so Phase 2 is a smooth infrastructure switch, not a code rewrite.
