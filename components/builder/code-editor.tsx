import { useEffect, useRef, useState } from "react";
import { Copy, Check, WrapText } from "lucide-react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-markup"; // HTML/XML
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";

interface CodeEditorProps {
  code: string;
  onChange?: (code: string) => void;
  readOnly?: boolean;
}

export function CodeEditor({ code, onChange, readOnly = true }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  // Auto-scroll to bottom as code grows
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [code]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#1d1f21] rounded-xl border border-border overflow-hidden">
      {/* Toolbar */}
      <div className="h-10 bg-card border-b border-border flex items-center justify-between px-3">
        <span className="text-xs text-muted">index.html</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setWordWrap(!wordWrap)}
            className={`p-1.5 rounded transition-colors ${wordWrap
              ? "text-primary bg-primary/10"
              : "text-muted hover:text-foreground"
              }`}
            title="Toggle word wrap"
          >
            <WrapText size={14} />
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 text-muted hover:text-foreground rounded transition-colors"
            title="Copy code"
          >
            {copied ? (
              <Check size={14} className="text-accent" />
            ) : (
              <Copy size={14} />
            )}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto font-mono text-sm custom-scrollbar bg-[#1d1f21]"
      >
        <div className="p-4 min-h-full">
          <pre
            className={`language-html !bg-transparent !m-0 !p-0 ${wordWrap ? "!whitespace-pre-wrap !break-words" : "!whitespace-pre"
              }`}
          >
            <code ref={codeRef} className="language-html">
              {code}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
