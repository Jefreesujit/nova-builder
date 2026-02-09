import { LandingHero } from "@/components/marketing/landing-hero";
import { Header } from "@/components/layout/header";
import { Sparkles, Code, Zap, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Header isLanding />

      <main>
        <LandingHero />

        {/* Features Section - Glassmorphism style */}
        <section className="py-24 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">The Power of Nova</h2>
              <p className="text-muted text-lg max-w-2xl mx-auto">
                Built for speed, flexibility, and absolute control over your code.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Code}
                title="Full Source Access"
                description="Unlike other builders, Nova gives you clean, standardized code. Export, modify, and host it anywhere you want."
                color="text-primary"
                bgColor="bg-primary/10"
              />
              <FeatureCard
                icon={Zap}
                title="Hyper-Fast Prototyping"
                description="Go from concept to a functional, interactive web app in seconds. Perfect for MVPs and landing pages."
                color="text-accent"
                bgColor="bg-accent/10"
              />
              <FeatureCard
                icon={Globe}
                title="Instant Subdomains"
                description="Deploy with a single click to our edge network. Share your creations with the world immediately."
                color="text-purple-500"
                bgColor="bg-purple-500/10"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-4 border-t border-border/50 bg-card/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <span className="font-bold text-xl block">NovaBuilder</span>
                <span className="text-xs text-muted font-medium uppercase tracking-widest">Next-Gen App Engine</span>
              </div>
            </div>

            <div className="flex gap-8 text-sm font-medium text-muted">
              <a href="https://github.com/JefreeSujit/nova-builder" className="hover:text-foreground transition-colors">GitHub</a>
              <a href="/login" className="hover:text-foreground transition-colors">Sign In</a>
              <a href="/dashboard" className="hover:text-foreground transition-colors">Projects</a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between border-t border-border/30 pt-8 text-xs text-muted/60">
            <p>© {new Date().getFullYear()} NovaBuilder. Built by Jefree Sujit. MIT License.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <p>Powered by Gemini 2.0</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color, bgColor }: any) {
  return (
    <div className="p-8 bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 group">
      <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
        <Icon className={`w-7 h-7 ${color}`} />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}
