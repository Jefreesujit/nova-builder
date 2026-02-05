# NovaBuilder: The "Supabase" of AI Code Generation
**Strategic Plan for Open Source & SaaS Evolution**

## 1. Executive Summary
**The Vision:** Create the first truly open-source, community-driven alternative to proprietary AI app builders like Lovable, v0, and Bolt.new.
**The Analogy:** Just as Supabase provided an open-source alternative to Firebase (using standard Postgres), NovaBuilder will provide an open-source alternative to AI generators (using standard LLMs and standard React/Next.js code).
**The Value Prop:** No vendor lock-in, Bring Your Own Key (BYOK), self-hostable privacy, and standard code exports.

---

## 2. The Open Source Strategy (The Core)
To gain traction, the core product must be free, easy to deploy, and developer-friendly.

### A. Technical Architecture for Open Source
1.  **"Bring Your Own Key" (BYOK) First:**
    *   Architecture the app so users can plug in their own API keys (Gemini, OpenAI, Anthropic, OpenRouter) via `.env` variables or a settings UI.
    *   This removes the cost burden from you for the open-source version.
2.  **One-Click Deployment:**
    *   Add a "Deploy to Vercel" and "Deploy to Netlify" button on the GitHub README.
    *   Ensure the repo runs out-of-the-box with `npm install && npm run dev`.
3.  **Database Abstraction:**
    *   Currently, we use `localStorage`. For a real "app builder," migrate to an adapter pattern:
        *   **Default:** SQLite (local file) or LocalStorage (browser only).
        *   **Production:** PostgreSQL (Supabase/Neon) adapter for saving projects remotely.

### B. Licensing
*   **MIT or Apache 2.0:** For the core codebase. This encourages maximum adoption.
*   **EE (Enterprise Edition) License:** If you develop specific "Teams" features (SSO, Audit Logs), keep those in a separate folder or private repo that is proprietary (Open Core model).

---

## 3. The SaaS Business Model (The Revenue)
How do you make money if the code is free? You sell **Convenience, Hosting, and Collaboration**.

### Tier 1: Open Source (Free - Self Hosted)
*   User forks the repo.
*   User pays their own Vercel bill and Gemini/OpenAI API bill.
*   User manages their own updates.
*   **Revenue:** $0 (But drives brand awareness).

### Tier 2: Nova Cloud (Pro - $19/mo)
*   **Zero Config:** No setting up API keys. You provide the LLM quota (bundled).
*   **Hosted Workspace:** Projects are saved to the cloud, accessible from any device.
*   **Instant Hosting:** Users get `project-name.novabuilder.app` subdomains instantly (hosting the preview, not just the code).
*   **History & Rollbacks:** Infinite chat history and version control.

### Tier 3: Teams/Enterprise ($49/seat)
*   **Collaboration:** Multiplayer editing (like Figma) on the generated code.
*   **Shared Workspaces:** Team folders.
*   **GitHub Sync:** Two-way sync. If a developer pushes code to GitHub, Nova is aware of it.
*   **Private VPC:** Run the builder inside their own VPN (for privacy-conscious companies).

---

## 4. Branding & Positioning
To succeed, the branding must scream "Developer Experience."

*   **Name:** "Nova" is good. Ensure you own the npm package or a clean domain.
*   **Tagline:** "The Open Source AI Stack Builder."
*   **Key Differentiators vs. Lovable/Bolt:**
    1.  **Code Ownership:** "We don't hold your code hostage. Export standard Next.js anytime."
    2.  **Model Agnostic:** "Switch between Gemini 1.5 Pro, GPT-4o, and Claude 3.5 Sonnet instantly."
    3.  **Cost:** "Don't pay a markup on tokens. Use your own keys or our flat rate."

---

## 5. Roadmap to Launch

### Phase 1: The "Hacker News" Launch (Weeks 1-4)
*   **Goal:** 1,000 GitHub Stars.
*   **Action Items:**
    *   Refactor `geminiService` to be model-agnostic (prepare for OpenAI/Claude integration).
    *   Replace the Mock Auth with NextAuth.js (supporting GitHub provider).
    *   Create a high-quality README with GIFs showing the workflow.
    *   Launch on Product Hunt, Hacker News, and Reddit (r/webdev, r/reactjs).

### Phase 2: The "SaaS" Layer (Weeks 5-8)
*   **Goal:** First 50 Paying Customers.
*   **Action Items:**
    *   Integrate Stripe for subscriptions.
    *   Set up a Supabase backend to store User Projects remotely.
    *   Build the "Publish" pipeline (using Vercel API to programmatically deploy user apps).

### Phase 3: The "Ecosystem" (Months 3+)
*   **Goal:** Retention & Stickiness.
*   **Action Items:**
    *   **Plugin System:** Allow the AI to access external tools (Figma import, Notion connection).
    *   **Template Marketplace:** Users can submit "Starter Prompts" or "Base Templates" (e.g., "SaaS Starter Kit").

---

## 6. Technical Checklist for "Production Ready"
Before opening the repo, ensure these are handled:

1.  [ ] **Security:** Ensure prompt injection protection. Sanitize HTML output properly.
2.  [ ] **Sandboxing:** The `PreviewFrame` currently allows scripts. Ensure it runs in a cross-origin iframe so generated code cannot steal cookies from the main builder app.
3.  [ ] **State Management:** Move from `useState` to a global store (Zustand/Jotai) to handle complex file trees.
4.  [ ] **File System:** Implement a virtual file system (VFS) so the AI can generate multiple files (components, utils) rather than just one big `index.html`.

## 7. Marketing "Hook" Idea
*   **The "Exit Strategy" Button:** prominently feature a button that downloads the *entire* Next.js repo of the generated app. Market this as "The builder that lets you leave." Developers love tools that don't lock them in.
