"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Zap, Code, Layout, Github } from "lucide-react";
import { PromptInput } from "@/components/builder/prompt-input";
import { createProject } from "@/lib/actions/projects";
import { useSession } from "next-auth/react";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import type { Attachment } from "@/lib/types/database";

const SUGGESTIONS = [
  "A modern portfolio with glassmorphism",
  "An e-commerce landing page for a coffee shop",
  "A SaaS dashboard with dark mode and charts",
  "A simple todo app with drag and drop",
];

export function LandingHero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Auto-trigger if redirected back from login with a prompt
  useEffect(() => {
    const prompt = searchParams.get("prompt");
    if (prompt && session && !isRedirecting) {
      handleStartBuilding(prompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, searchParams]);

  const handleStartBuilding = async (text: string, attachments: Attachment[] = [], model?: string) => {
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/?prompt=${encodeURIComponent(text)}`)}`);
      return;
    }

    setIsRedirecting(true);
    try {
      const project = await createProject(text.slice(0, 50) || "New Project");
      if (project) {
        let url = `/project/${project.id}?prompt=${encodeURIComponent(text)}`;
        if (model) url += `&model=${encodeURIComponent(model)}`;
        router.push(url);
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      setIsRedirecting(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 pt-20 overflow-hidden">
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse [animation-delay:2s]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-10 animate-bounce [animation-duration:5s]">
          <Code className="w-12 h-12 text-primary" />
        </div>
        <div className="absolute bottom-1/4 right-10 animate-bounce [animation-duration:7s]">
          <Layout className="w-12 h-12 text-accent" />
        </div>
        <div className="absolute top-20 right-1/4 animate-pulse [animation-duration:4s]">
          <Zap className="w-10 h-10 text-yellow-500" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-500">
          <Sparkles size={16} />
          <span>The Next-Gen AI App Builder</span>
        </div>

        {/* Heading */}
        <div className="space-y-4 animate-in fade-in slide-in-from-top-6 duration-700 delay-100">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Turn your ideas into
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-x">
              shippable apps
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            NovaBuilder is the open-source engine that transforms your natural language prompts into stunning, high-performance web applications instantly.
          </p>
        </div>

        {/* Prompt Input Box */}
        <div className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <PromptInput
            onSendMessage={handleStartBuilding}
            isLoading={isRedirecting}
            placeholder="What would you like to build today?"
            className="group"
          />

          {/* Suggestions */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleStartBuilding(suggestion)}
                className="px-3 py-1.5 text-xs text-muted hover:text-foreground bg-card/50 hover:bg-card border border-border/50 rounded-full transition-all hover:border-primary/30"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <a
            href="https://github.com/JefreeSujit/nova-builder"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 bg-card/50 border border-border/50 text-sm font-medium rounded-xl hover:bg-card transition-all hover:border-border"
          >
            <Github size={18} />
            Star on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
