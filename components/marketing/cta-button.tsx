"use client";

import { ArrowRight } from "lucide-react";

export function CtaButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-2 group/btn"
    >
      Start Building Now
      <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
    </button>
  );
}
