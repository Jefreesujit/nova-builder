"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Paperclip, X, FileText, Image as ImageIcon } from "lucide-react";
import type { Message, Attachment } from "@/lib/types/database";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string, attachments?: Attachment[]) => void;
}

export function ChatInterface({
  messages,
  isLoading,
  onSendMessage,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || attachments.length > 0) && !isLoading) {
      onSendMessage(input, attachments);
      setInput("");
      setAttachments([]);
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
    <div className="flex flex-col h-full border-r border-border">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted text-center p-4">
            <div>
              <p className="text-lg font-medium mb-2">Start building your app</p>
              <p className="text-sm">
                Describe what you want to create and I&#39;ll generate the code for
                you.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card text-card-foreground rounded-bl-md"
                  }`}
              >
                <div className="text-sm markdown-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed whitespace-pre-wrap">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      code: ({ children }) => <code className="bg-black/20 rounded px-1 py-0.5 font-mono text-[11px]">{children}</code>,
                      strong: ({ children }) => <span className="font-bold text-accent">{children}</span>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {msg.attachments.map((att, i) => (
                      <span
                        key={i}
                        className="text-xs bg-black/20 px-2 py-0.5 rounded flex items-center gap-1"
                      >
                        {att.isText ? (
                          <FileText size={10} />
                        ) : (
                          <ImageIcon size={10} />
                        )}
                        {att.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card text-card-foreground rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card/30">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((att, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-lg text-sm"
              >
                {att.isText ? (
                  <FileText size={14} className="text-muted" />
                ) : (
                  <ImageIcon size={14} className="text-muted" />
                )}
                <span className="truncate max-w-[150px]">{att.name}</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-muted hover:text-destructive transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
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
            className="p-3 text-muted hover:text-foreground hover:bg-card rounded-xl transition-colors"
          >
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to build..."
            className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && attachments.length === 0)}
            className="p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
