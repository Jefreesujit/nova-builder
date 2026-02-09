
import { LandingHero } from "@/components/marketing/landing-hero";
import { Header } from "@/components/layout/header";
import { Sparkles, Code, Zap, Globe, ArrowRight } from "lucide-react";
import { ProjectDiscovery } from "@/components/builder/project-discovery";
import { CtaButton } from "@/components/marketing/cta-button";
import { getProjects, getPublicProjects } from "@/lib/actions/projects";
import { auth } from "@/lib/auth";

export default async function LandingPage() {
  const session = await auth();
  const userProjects = session?.user?.id ? await getProjects() : [];
  const publicProjects = await getPublicProjects();

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Header isLanding />

      <main>
        <LandingHero user={session?.user} />

        {/* Project Discovery Section */}
        <ProjectDiscovery
          userProjects={userProjects}
          publicProjects={publicProjects}
          isAuthenticated={!!session?.user}
        />

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

        {/* Stats Section */}
        <section className="py-24 border-y border-border/30 bg-card/10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="space-y-2">
                <h3 className="text-5xl font-extrabold text-primary">10x</h3>
                <p className="text-muted font-medium uppercase tracking-widest text-xs">Faster Prototyping</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-5xl font-extrabold text-accent">100%</h3>
                <p className="text-muted font-medium uppercase tracking-widest text-xs">Clean Source Code</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-5xl font-extrabold text-purple-500">Free</h3>
                <p className="text-muted font-medium uppercase tracking-widest text-xs">Open Source Forever</p>
              </div>
            </div>
          </div>
        </section>

        {/* Details Section / "Why Nova" */}
        <section className="py-24 px-4 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-bold uppercase tracking-wider">
                  Developer First
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Built for the modern web.</h2>
                <p className="text-muted text-lg leading-relaxed">
                  NovaBuilder doesn't just generate a static mockup. It produces high-quality, responsive HTML/Tailwind code that you can drop into any project. No complex exports, just pure, clean code.
                </p>
                <ul className="space-y-4">
                  {[
                    "Responsive by default with Tailwind CSS",
                    "Interactivity powered by Vanilla JS",
                    "Bring your own Gemini API keys",
                    "One-click deployment to custom subdomains"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground/80">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Zap size={12} className="text-primary" />
                      </div>
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl opacity-30 -z-10"></div>
                <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-2 shadow-2xl relative overflow-hidden group">
                  <div className="aspect-video bg-[#0d0d0d] rounded-2xl border border-border/50 overflow-hidden relative">
                    {/* Mock editor UI */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-card border-b border-border/50 flex items-center px-4 gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                    </div>
                    <div className="p-6 pt-12 font-mono text-xs text-muted/80 space-y-2">
                      <div className="flex gap-2"><span className="text-purple-400">&lt;div</span> <span className="text-blue-400">class</span>=<span className="text-emerald-400">"flex p-8"</span><span className="text-purple-400">&gt;</span></div>
                      <div className="flex gap-2 pl-4"><span className="text-purple-400">&lt;h1</span> <span className="text-blue-400">class</span>=<span className="text-emerald-400">"text-4xl"</span><span className="text-purple-400">&gt;</span>Hello Nova<span className="text-purple-400">&lt;/h1&gt;</span></div>
                      <div className="flex gap-2 pl-4"><span className="text-purple-400">&lt;p&gt;</span>The next gen builder<span className="text-purple-400">&lt;/p&gt;</span></div>
                      <div className="flex gap-2"><span className="text-purple-400">&lt;/div&gt;</span></div>
                      <div className="animate-pulse w-1/2 h-2 bg-muted/20 rounded mt-4"></div>
                      <div className="animate-pulse w-3/4 h-2 bg-muted/20 rounded"></div>
                      <div className="animate-pulse w-2/3 h-2 bg-muted/20 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-[3rem] p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Ready to build your next big thing?</h2>
              <p className="text-muted text-lg max-w-xl mx-auto">
                Join developers worldwide building stunning apps in seconds. No complex setups, just pure creativity.
              </p>
              <div className="flex justify-center">
                <CtaButton />
              </div>
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
              <a href="#projects" className="hover:text-foreground transition-colors">Projects</a>
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
