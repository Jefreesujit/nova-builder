import Link from "next/link";
import { Sparkles, Zap, Code, Globe, ArrowRight, Github } from "lucide-react";
import { Header } from "@/components/layout/header";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header isLanding />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            <Sparkles size={16} />
            Open Source AI App Builder
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Build beautiful apps with
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {" "}
              AI
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-8">
            The open-source alternative to Lovable, v0, and Bolt.new. No vendor
            lock-in. Bring your own API keys. Export standard code anytime.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
            >
              Start Building
              <ArrowRight size={18} />
            </Link>
            <a
              href="https://github.com/novabuilder/nova"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-card border border-border font-medium rounded-xl hover:bg-border transition-colors"
            >
              <Github size={18} />
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Why NovaBuilder?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-background rounded-2xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Lock-in</h3>
              <p className="text-muted text-sm">
                Export your code anytime. We generate standard HTML, CSS, and
                JavaScript that runs anywhere.
              </p>
            </div>

            <div className="p-6 bg-background rounded-2xl border border-border">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Bring Your Own Key</h3>
              <p className="text-muted text-sm">
                Use your own API keys for Gemini, OpenAI, or Claude. No markup
                on token costs.
              </p>
            </div>

            <div className="p-6 bg-background rounded-2xl border border-border">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Hosting</h3>
              <p className="text-muted text-sm">
                Publish your app to a custom subdomain with one click. Share
                with the world instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to build something amazing?
          </h2>
          <p className="text-muted mb-8">
            Start for free. No credit card required.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 text-lg"
          >
            Get Started Free
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">NovaBuilder</span>
          </div>
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} NovaBuilder. Open Source under MIT License.
          </p>
        </div>
      </footer>
    </div>
  );
}
