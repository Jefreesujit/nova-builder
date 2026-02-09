"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  ChevronDown,
  Sparkles,
  Zap,
  Code
} from "lucide-react";
import type { Attachment } from "@/lib/types/database";

interface PromptInputProps {
  onSendMessage: (text: string, attachments?: Attachment[], model?: string) => void;
  isLoading: boolean;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

const MODELS = [
  { id: "gemini-3-flash-preview", name: "Gemini 2.0 Flash", icon: Zap, description: "Fast & Capable" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", icon: Sparkles, description: "Highly Intelligent" },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", icon: Code, description: "Balanced" },
];

export function PromptInput({
  onSendMessage,
  isLoading,
  placeholder = "Describe what you want to build...",
  className = "",
  initialValue = "",
}: PromptInputProps) {
  const [input, setInput] = useState(initialValue);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((input.trim() || attachments.length > 0) && !isLoading) {
      onSendMessage(input, attachments, selectedModel.id);
      setInput("");
      setAttachments([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = [];

    for (const file of Array.from(files)) {
      const isText =
        file.type.startsWith("text/") ||
        file.name.endsWith(".json") ||
        file.name.endsWith(".js") ||
        file.name.endsWith(".ts") ||
        file.name.endsWith(".css") ||
        file.name.endsWith(".html");

      if (isText) {
        const content = await file.text();
        newAttachments.push({
          name: file.name,
          mimeType: file.type || "text/plain",
          content,
          isText: true,
        });
      } else {
        const content = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        newAttachments.push({
          name: file.name,
          mimeType: file.type,
          content,
          isText: false,
        });
      }
    }

    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`relative ${className}`}>
      {/* Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

      <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:border-border">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="p-3 pb-0 flex flex-wrap gap-2">
            {attachments.map((att, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-background/50 border border-border/50 px-3 py-1.5 rounded-lg text-xs group/item transition-all"
              >
                {att.isText ? (
                  <FileText size={12} className="text-primary" />
                ) : (
                  <ImageIcon size={12} className="text-accent" />
                )}
                <span className="truncate max-w-[150px]">{att.name}</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-muted hover:text-destructive transition-colors ml-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-1">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-transparent border-none focus:ring-0 px-4 pt-4 pb-2 text-base md:text-lg resize-none min-h-[60px] max-h-[200px] placeholder:text-muted/50 custom-scrollbar"
            disabled={isLoading}
          />

          <div className="flex items-center justify-between px-3 py-2 border-t border-border/30">
            <div className="flex items-center gap-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                className="hidden"
                accept=".txt,.json,.js,.ts,.css,.html,.pdf,image/*"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-muted hover:text-foreground hover:bg-white/5 rounded-lg transition-all"
                title="Attach files"
              >
                <Paperclip size={20} />
              </button>

              {/* Model Switcher */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-muted hover:text-foreground hover:bg-white/5 rounded-lg transition-all border border-transparent hover:border-border/50"
                >
                  <selectedModel.icon size={14} className="text-primary" />
                  <span className="hidden sm:inline">{selectedModel.name}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isModelMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isModelMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsModelMenuOpen(false)}
                    />
                    <div className="absolute bottom-full left-0 mb-2 w-56 bg-background border border-border rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                      <div className="p-2 space-y-1">
                        {MODELS.map((model) => (
                          <button
                            key={model.id}
                            type="button"
                            onClick={() => {
                              setSelectedModel(model);
                              setIsModelMenuOpen(false);
                            }}
                            className={`w-full flex flex-col gap-0.5 p-2 rounded-lg text-left transition-colors ${selectedModel.id === model.id
                                ? 'bg-primary/10 text-primary'
                                : 'hover:bg-white/5 text-muted'
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              <model.icon size={14} />
                              <span className="text-sm font-medium">{model.name}</span>
                            </div>
                            <span className="text-[10px] opacity-60 ml-5">{model.description}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || (!input.trim() && attachments.length === 0)}
              className={`p-2 rounded-xl transition-all shadow-lg ${(!input.trim() && attachments.length === 0) || isLoading
                  ? 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:shadow-primary/20 hover:scale-105 active:scale-95'
                }`}
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
