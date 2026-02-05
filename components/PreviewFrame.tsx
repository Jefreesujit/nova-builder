import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Zap } from 'lucide-react';

interface PreviewFrameProps {
  code: string;
  refreshKey: number; // Used to force iframe reload
  isLoading: boolean;
}

const LOADING_HINTS = [
  "Drafting the layout structure...",
  "Applying Tailwind styles...",
  "Adding interactivity...",
  "Polishing the UI...",
  "Checking responsiveness...",
  "Finalizing your app..."
];

const PreviewFrame: React.FC<PreviewFrameProps> = ({ code, refreshKey, isLoading }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [hintIndex, setHintIndex] = useState(0);

  // Cycle through hints while loading
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setHintIndex((prev) => (prev + 1) % LOADING_HINTS.length);
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setHintIndex(0);
    }
  }, [isLoading]);

  // Update iframe content whenever code changes
  useEffect(() => {
    if (iframeRef.current) {
      // Direct document write to inject code
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(code);
        doc.close();
      }
    }
  }, [code]);

  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-2xl relative">
      <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="flex-1 text-center">
          <div className="inline-flex items-center bg-white px-3 py-0.5 rounded text-xs text-gray-500 border border-gray-200">
            localhost:3000
          </div>
        </div>
      </div>

      {/* Loading Overlay - only show if loading and we don't have enough code yet */}
      {isLoading && (!code || code.length < 100) && (
        <div className="absolute inset-0 top-8 z-50 flex flex-col items-center justify-center bg-slate-50 text-slate-500 animate-in fade-in duration-300">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border border-indigo-100 flex items-center justify-center relative z-10 mb-6">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          </div>

          <h3 className="text-lg font-medium text-slate-800 mb-2">Building your app</h3>
          <p className="text-sm text-slate-400 min-w-[200px] text-center transition-all duration-500">
            {LOADING_HINTS[hintIndex]}
          </p>

          <div className="mt-8 flex gap-2 text-xs text-slate-400 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <Zap size={14} className="text-yellow-500" />
            <span>AI is generating code...</span>
          </div>
        </div>
      )}

      {/* Mini loading indicator for when code is streaming but not finished */}
      {isLoading && code && code.length >= 100 && (
        <div className="absolute bottom-4 right-4 z-50 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-indigo-100 shadow-lg flex items-center gap-2 text-xs font-medium text-indigo-600 animate-in slide-in-from-bottom-2">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Streaming updates...</span>
        </div>
      )}

      <iframe
        ref={iframeRef}
        title="App Preview"
        className="w-full h-[calc(100%-2rem)] border-none bg-white"
        sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
      />
    </div>
  );
};

export default PreviewFrame;
