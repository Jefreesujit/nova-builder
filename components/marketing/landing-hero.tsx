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


interface LandingHeroProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function LandingHero({ user }: LandingHeroProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession(); // Keep this for redirect logic if needed, or rely on user prop
  const currentUser = user || session?.user;

  const [isRedirecting, setIsRedirecting] = useState(false);

  // Auto-trigger if redirected back from login with a prompt
  useEffect(() => {
    const prompt = searchParams.get("prompt");
    if (prompt && currentUser && !isRedirecting) {
      handleStartBuilding(prompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, searchParams]);

  const handleStartBuilding = async (text: string, attachments: Attachment[] = [], model?: string) => {
    if (!currentUser) {
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
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 overflow-hidden">
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
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
            {currentUser ? (
              <>
                <span className="block text-2xl md:text-3xl font-bold text-muted-foreground mb-2 text-left md:text-center w-full">
                  Welcome back, <span className="text-primary">{currentUser.name?.split(' ')[0]}</span>
                </span>
                <span className="block bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  What are we building today?
                </span>
              </>
            ) : (
              <>
                Turn your ideas into
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-x">
                  shippable apps
                </span>
              </>
            )}
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            {currentUser
              ? "Your personal AI coding companion is ready. Describe your idea below and watch it come to life instantly."
              : "NovaBuilder is the open-source engine that transforms your natural language prompts into stunning, high-performance web applications instantly."}
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

      </div>
    </div>
  );
}
