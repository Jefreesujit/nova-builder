import React, { useRef, useEffect, useState } from 'react';
import { Send, Bot, Loader2, Sparkles, Paperclip, X, FileText } from 'lucide-react';
import { Message, Attachment } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string, attachments: Attachment[]) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading, onSendMessage }) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, attachments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || attachments.length > 0) && !isLoading) {
      onSendMessage(input, attachments);
      setInput('');
      setAttachments([]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validation
      const allowedTextTypes = ['text/plain', 'text/markdown', 'text/csv', 'application/json', 'text/xml', 'application/xml'];
      const allowedBinaryTypes = ['application/pdf'];
      
      const isText = allowedTextTypes.includes(file.type) || file.name.endsWith('.md') || file.name.endsWith('.txt') || file.name.endsWith('.json') || file.name.endsWith('.csv');
      const isPdf = allowedBinaryTypes.includes(file.type) || file.name.endsWith('.pdf');

      if (!isText && !isPdf) {
          alert("Only Text, Markdown, JSON, CSV, and PDF files are allowed.");
          return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setAttachments(prev => [...prev, {
            name: file.name,
            mimeType: file.type || (isPdf ? 'application/pdf' : 'text/plain'),
            content: content,
            isText: isText
        }]);
      };

      if (isText) {
          reader.readAsText(file);
      } else {
          reader.readAsDataURL(file);
      }
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
      setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
           <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400 space-y-4 opacity-70">
                <Sparkles className="w-12 h-12 text-indigo-500" />
                <p>Start by describing what you want to build.</p>
           </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
          >
            <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700'
            }`}>
              {msg.content}
              
              {/* Message Attachments Display */}
              {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/20 flex flex-wrap gap-2">
                      {msg.attachments.map((att, i) => (
                          <div key={i} className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded text-xs">
                              <FileText size={12} />
                              <span className="truncate max-w-[100px]">{att.name}</span>
                          </div>
                      ))}
                  </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start max-w-[85%]">
             <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none px-4 py-3 border border-slate-200 dark:border-slate-700 flex items-center gap-2 shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                <span className="text-sm text-slate-500 dark:text-slate-400">Nova is building...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        {/* Attachment Preview */}
        {attachments.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto">
                {attachments.map((att, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg text-sm border border-indigo-100 dark:border-indigo-800/50">
                        <FileText size={14} />
                        <span className="truncate max-w-[150px]">{att.name}</span>
                        <button onClick={() => removeAttachment(idx)} className="hover:text-indigo-900 dark:hover:text-white ml-1">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        )}
        
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={attachments.length > 0 ? "Add instructions for these files..." : "Describe your changes..."}
            className="w-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-500 rounded-xl pl-10 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-600 border-transparent transition-all"
            disabled={isLoading}
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute left-2 top-2 bottom-2 p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Attach file (PDF, TXT, MD, JSON, CSV)"
          >
              <Paperclip size={18} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileSelect}
            accept=".txt,.md,.json,.csv,.xml,.pdf"
          />

          <button
            type="submit"
            disabled={(!input.trim() && attachments.length === 0) || isLoading}
            className="absolute right-2 top-2 bottom-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-sm"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;