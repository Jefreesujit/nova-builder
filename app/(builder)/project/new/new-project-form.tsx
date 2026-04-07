"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface NewProjectFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
}

export function NewProjectForm({ onSubmit }: NewProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "A modern SaaS landing page with pricing section",
    "A portfolio website for a photographer",
    "A task management dashboard with dark theme",
    "An e-commerce product page with reviews",
  ];

  return (
    <form action={handleSubmit}>
      <div className="relative">
        <textarea
          name="prompt"
          placeholder="E.g., Create a modern landing page for an AI startup with hero section, features, and pricing..."
          className="w-full h-32 p-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          required
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate
            </>
          )}
        </button>
      </div>

      <div className="mt-6">
        <p className="text-sm text-muted mb-3">Try one of these:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                const textarea = (e.target as HTMLElement)
                  .closest("form")
                  ?.querySelector("textarea");
                if (textarea) {
                  textarea.value = suggestion;
                }
              }}
              className="px-3 py-1.5 text-sm bg-card border border-border rounded-full text-muted hover:text-foreground hover:border-primary/50 transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
