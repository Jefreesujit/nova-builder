"use client";

import { useState } from "react";
import { Copy, Check, WrapText } from "lucide-react";

interface CodeEditorProps {
  code: string;
  onChange?: (code: string) => void;
  readOnly?: boolean;
}

export function CodeEditor({ code, onChange, readOnly = true }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div className="h-full flex flex-col bg-card rounded-xl border border-border overflow-hidden">
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
      <div className="flex-1 overflow-auto font-mono text-sm">
        <div className="flex min-h-full">
          {/* Line Numbers */}
          <div className="sticky left-0 bg-card border-r border-border px-3 py-3 text-right text-muted select-none">
            {lines.map((_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code */}
          <div className="flex-1 p-3">
            {readOnly ? (
              <pre
                className={`leading-6 ${wordWrap ? "whitespace-pre-wrap break-words" : "whitespace-pre"
                  }`}
              >
                <code>{code}</code>
              </pre>
            ) : (
              <textarea
                value={code}
                onChange={(e) => onChange?.(e.target.value)}
                className={`w-full h-full bg-transparent resize-none outline-none leading-6 ${wordWrap ? "whitespace-pre-wrap break-words" : "whitespace-pre"
                  }`}
                spellCheck={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
