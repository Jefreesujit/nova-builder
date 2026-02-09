"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Paperclip, X, FileText, Image as ImageIcon, Sparkles } from "lucide-react";
import type { Message, Attachment } from "@/lib/types/database";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { PromptInput } from "./prompt-input";

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string, attachments?: Attachment[], model?: string) => void;
}

export function ChatInterface({
  messages,
  isLoading,
  onSendMessage,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  return (
    <div className="flex flex-col h-full border-r border-border bg-background">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted text-center p-4">
            <div className="animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <p className="text-lg font-bold mb-2">Build something epic</p>
              <p className="text-sm text-muted max-w-[200px] mx-auto">
                Describe your vision and I&#39;ll bring it to life with code.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-card border border-border rounded-bl-none"
                  }`}
              >
                <div className="text-sm markdown-content">
                  {/* Show "Generating..." animation if content is literally "Generating..." or if it's the latest AI message while loading */}
                  {msg.role === "model" && (msg.content === "Generating..." || (isLoading && index === messages.length - 1)) ? (
                    <div className="flex items-center gap-1.5 py-1">
                      <span className="text-sm font-medium animate-pulse text-primary">Generating</span>
                      <span className="flex gap-1 items-end h-4 pb-1">
                        <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1 h-1 bg-primary rounded-full animate-bounce"></span>
                      </span>
                    </div>
                  ) : (
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
                  )}
                </div>

                {/* Attachments within message */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {msg.attachments.map((att, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-black/10 px-2 py-0.5 rounded flex items-center gap-1 opacity-70"
                      >
                        {att.isText ? (
                          <FileText size={10} />
                        ) : (
                          <ImageIcon size={10} />
                        )}
                        <span className="truncate max-w-[100px]">{att.name}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-border bg-card/30 backdrop-blur-sm">
        <PromptInput
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          className="w-full"
        />
      </div>
    </div>
  );
}
