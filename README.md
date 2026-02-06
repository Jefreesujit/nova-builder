<div align="center">
<img width="1200" height="475" alt="NovaBuilder Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# NovaBuilder
### The "Supabase" of AI Code Generation

[![Version](https://img.shields.io/badge/version-0.0.0--alpha-blue.svg)](https://github.com/jefree/nova-builder)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stack: React 19](https://img.shields.io/badge/Stack-React%2019-61DAFB.svg)](https://react.dev/)
[![Powered by Gemini](https://img.shields.io/badge/AI-Gemini%202.0%20Flash-orange.svg)](https://deepmind.google/technologies/gemini/)

**NovaBuilder** is the first truly community-driven, open-source alternative to proprietary AI app builders like Lovable, v0, and Bolt.new. Built for developers who want the power of AI without the vendor lock-in.

[Vision Document](./PLAN_OPEN_SOURCE_SAAS.md) • [Getting Started](#getting-started) • [Contributing](#contributing)
</div>

---

## 🚀 The Vision

Just as Supabase provided an open-source alternative to Firebase, NovaBuilder provides an open-source alternative to AI generators.

- **No Vendor Lock-in:** Own your code. Export standard React/Next.js projects anytime.
- **Bring Your Own Key (BYOK):** Use your own Gemini, OpenAI, or Anthropic keys. No markups on tokens.
- **Privacy First:** Self-hostable and local-storage focused by default.
- **Standard Stack:** No proprietary runtime. Generates clean, modern web code.

## ✨ Features

- 💬 **Natural Language UI:** Describe your app and watch Nova build it in seconds.
- ⚡ **Real-time Preview:** See your changes instantly with the integrated live preview frame.
- 📂 **Context Aware:** Attach PDFs, JSONs, or documentation to guide the AI with specific project requirements.
- 🛠️ **Developer Toolbar:** Switch between Preview and Code modes, download your code, or simulate deployments.
- 🌑 **Premium UI:** A sleek, glassmorphic dark interface designed for modern development.
- 💾 **Project Management:** Save and manage multiple projects locally.

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **AI Engine:** [Google Gemini 2.0 Flash](https://aistudio.google.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jefree/nova-builder.git
   cd nova-builder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 🗺️ Roadmap

- [ ] **Phase 1:** Model Agnostic support (OpenAI, Claude, Llama via OpenRouter).
- [ ] **Phase 2:** Supabase integration for remote project persistence.
- [ ] **Phase 3:** Instant deployment pipeline to Vercel/Netlify.
- [ ] **Phase 4:** Collaborative "Multiplayer" mode for team building.

## 📄 License

NovaBuilder is open-source software licensed under the [MIT License](./LICENSE).

---

<div align="center">
Built with ❤️ by the community. Join us in democratizing AI application building.
</div>
