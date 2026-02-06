# NovaBuilder
### An Open-Source AI Site Builder & Hosting Platform

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/jefree/nova-builder)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Stack: Next.js 15](https://img.shields.io/badge/Stack-Next.js%2015-black.svg)](https://nextjs.org/)
[![Database: Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E.svg)](https://supabase.com/)
[![AI: Gemini 2.0 Flash](https://img.shields.io/badge/AI-Gemini%202.0%20Flash-orange.svg)](https://aistudio.google.com/)

**NovaBuilder** is a comprehensive, open-source platform for generating and hosting AI-powered web applications. It serves as a single-repo solution for both building sites and serving them via custom subdomains.

[Implementation Plan](./docs/plans/IMPLEMENTATION_PLAN.md) • [Getting Started](#getting-started) • [Architecture](#architecture)
</div>

---

## 🏗️ Architecture: The Next.js Monolith

NovaBuilder has evolved from a simple Vite app into a robust Next.js application designed for scale and multi-tenancy.

- **The Builder (`app.novabuilder.com`):** The primary interface for users to prompt, iterate, and manage their AI projects.
- **The Sites (`*.novabuilder.app`):** User projects are served dynamically via **Next.js Middleware Rewrites**, providing a seamless "published" experience without external hosting fees.
- **The Engine:** Powered by **Gemini 2.0 Flash** for high-speed, context-aware code generation.

## ✨ Features

- 💬 **Dynamic AI Generation:** Real-time site building from natural language prompts.
- 📂 **Native Context Support:** Attach PDFs, documentation, or brand guidelines to guide the AI.
- 🌐 **Project Hosting:** Instant subdomain deployment for every project.
- � **Persistent Workspace:** Projects are securely stored in **Supabase** (Postgres JSONB).
- 🔐 **Enterprise-Ready Auth:** Secure session management via **NextAuth.js** and Supabase.
- 🌑 **Premium DX:** Sleek dark-mode interface with a focus on developer experience.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Database:** [Supabase](https://supabase.com/) (Postgres + SSR)
- **AI Engine:** [Google Gemini 2.0 Flash](https://aistudio.google.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Authentication:** [Auth.js (NextAuth)](https://authjs.dev/)

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- A [Supabase](https://supabase.com/) Project
- A [Google AI Studio](https://aistudio.google.com/) API Key

### Installation

1. **Clone and Install:**
   ```bash
   git clone https://github.com/jefree/nova-builder.git
   cd nova-builder
   npm install
   ```

2. **Environment Setup:**
   Create a `.env.local` file:
   ```env
   # AI
   GEMINI_API_KEY=your_key_here

   # Database (Supabase)
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   SUPABASE_SERVICE_ROLE_KEY=your_key

   # Authentication
   AUTH_SECRET=your_secret
   AUTH_GITHUB_ID=...
   AUTH_GITHUB_SECRET=...
   ```

3. **Run for Development:**
   ```bash
   npm run dev
   ```

### Local Subdomain Testing
To test subdomains locally, you can use the path-based fallback:
- **Builder:** `localhost:3000/dashboard`
- **Project Site:** `localhost:3000/sites/[subdomain]`

For full production simulation, edit your `/etc/hosts`:
```text
127.0.0.1 app.novabuilder.localhost
127.0.0.1 user-site-1.novabuilder.localhost
```

## 📄 License

NovaBuilder is open-source software licensed under the [MIT License](./LICENSE).

---

<div align="center">
Built for the community. Star us on GitHub to support open-source AI.
</div>
