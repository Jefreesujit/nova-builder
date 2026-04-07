import { useEffect, useRef, useState } from "react";
import { Copy, Check, WrapText, Split, Code as CodeIcon } from "lucide-react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-markup"; // HTML/XML
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import { SimpleDiffViewer } from "./simple-diff-viewer";

interface CodeEditorProps {
  code: string;
  originalCode?: string;
  onChange?: (code: string) => void;
  readOnly?: boolean;
}

export function CodeEditor({ code, originalCode, onChange, readOnly = true }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);
  const [showDiff, setShowDiff] = useState(!!originalCode);
  const containerRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (originalCode) {
      setShowDiff(true);
    }
  }, [originalCode]);

  useEffect(() => {
    if (codeRef.current && !showDiff) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, showDiff]);

  // Auto-scroll to bottom as code grows in non-diff mode
  useEffect(() => {
    if (containerRef.current && !showDiff) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [code, showDiff]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#1d1f21] rounded-xl border border-border overflow-hidden">
      {/* Toolbar */}
      <div className="h-10 bg-card border-b border-border flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">index.html</span>
          {originalCode && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
              Diff View
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {!showDiff && (
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
          )}
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
        {showDiff && originalCode ? (
          <div className="h-full relative">
            <SimpleDiffViewer
              oldCode={originalCode}
              newCode={code}
            />
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
