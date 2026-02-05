"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, RefreshCw, Maximize2, Minimize2 } from "lucide-react";

interface PreviewFrameProps {
  code: string;
  isLoading?: boolean;
  refreshKey?: number;
}

export function PreviewFrame({ code, isLoading, refreshKey }: PreviewFrameProps) {
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

  return (
    <div
      className={`relative h-full flex flex-col ${isFullscreen
        ? "fixed inset-0 z-50 bg-background"
        : "rounded-xl overflow-hidden"
        }`}
    >
      {/* Toolbar */}
      <div className="h-10 bg-card border-b border-border flex items-center justify-between px-3">
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
        {isLoading && (!code || code.length < 50) && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 transition-all duration-300">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm text-muted">Generating your app...</p>
            </div>
          </div>
        )}

        {/* Subtle streaming indicator */}
        {isLoading && code && code.length >= 50 && (
          <div className="absolute bottom-4 right-4 z-20 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border shadow-lg flex items-center gap-2 text-[10px] font-medium text-accent animate-in slide-in-from-bottom-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Streaming...</span>
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
  );
}
