"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, RefreshCw, Maximize2, Minimize2, CheckCircle2 } from "lucide-react";

interface PreviewFrameProps {
  code: string;
  isLoading?: boolean;
  refreshKey?: number;
  status?: string;
}

export function PreviewFrame({ code, isLoading, refreshKey, status }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(code || "");
        doc.close();
      }
    }
  }, [code, iframeKey, refreshKey]);

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Helper to parse descriptive steps from the AI summary
  const steps = status ? status.split('\n').filter(s => s.trim().length > 0) : [];

  return (
    <div
      className={`relative h-full flex flex-col p-4 ${isFullscreen
        ? "fixed inset-0 z-50 bg-background !p-0"
        : ""
        }`}
    >
      <div className={`flex flex-col h-full overflow-hidden ${isFullscreen ? "" : "rounded-xl border border-border bg-card shadow-sm"}`}>
        {/* Toolbar */}
        <div className="h-10 border-b border-border flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-accent/80" />
            </div>
            <span className="text-xs text-muted ml-2">Preview</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleRefresh}
              className="p-1.5 text-muted hover:text-foreground rounded transition-colors"
              title="Refresh"
            >
              <RefreshCw size={14} />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-muted hover:text-foreground rounded transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 relative bg-white">
          {isLoading && (!code || code.length < 100) && (
            <div className="absolute inset-0 bg-slate-50 flex items-center justify-center z-10 transition-all duration-300 border-none">
              <div className="max-w-md w-full px-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-xl border border-border flex items-center justify-center mb-6 relative">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                    <div className="absolute -inset-1 bg-accent/10 rounded-2xl blur-md -z-10 animate-pulse"></div>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Architecting your App</h3>

                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-6">
                    <div className="bg-accent h-full animate-progress-indeterminate"></div>
                  </div>

                  <div className="space-y-3 w-full text-left">
                    {steps.slice(-3).map((step, i) => (
                      <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-500 ${i === steps.slice(-3).length - 1 ? 'text-slate-900 font-medium' : 'text-slate-400 opacity-60'}`}>
                        {i === steps.slice(-3).length - 1 ? (
                          <Loader2 className="w-4 h-4 text-accent animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                        <span className="truncate">{step}</span>
                      </div>
                    ))}
                    {steps.length === 0 && (
                      <div className="flex items-center gap-3 text-sm text-slate-900 font-medium">
                        <Loader2 className="w-4 h-4 text-accent animate-spin" />
                        <span>Analyzing requirements...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subtle streaming indicator */}
          {isLoading && code && code.length >= 100 && (
            <div className="absolute bottom-4 right-4 z-20 bg-card/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-border shadow-2xl flex items-center gap-2 text-[10px] font-medium text-accent animate-in slide-in-from-bottom-2">
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
              <span>Building Live Preview...</span>
            </div>
          )}

          <iframe
            key={iframeKey}
            ref={iframeRef}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            title="Preview"
          />
        </div>
      </div>
    </div>
  );
}
