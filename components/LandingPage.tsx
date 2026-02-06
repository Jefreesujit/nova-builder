import React, { useState, useRef } from 'react';
import { Sparkles, ArrowRight, Layout, Clock, ChevronRight, Plus, Search, Paperclip, X, FileText } from 'lucide-react';
import { Project, Attachment } from '../types';

interface LandingPageProps {
  onStart: (prompt: string, attachments: Attachment[]) => void;
  projects: Project[];
  onOpenProject: (projectId: string) => void;
}

const SUGGESTIONS = [
  { icon: "🛍️", label: "E-commerce Store", prompt: "A modern e-commerce landing page for a sneaker brand with a hero slider and product grid." },
  { icon: "👤", label: "Personal Portfolio", prompt: "A minimalist personal portfolio for a designer with a dark theme, bio section, and project gallery." },
  { icon: "🏢", label: "SaaS Dashboard", prompt: "A SaaS analytics dashboard layout with a sidebar, top stats cards, and a chart placeholder." },
  { icon: "🥗", label: "Restaurant Menu", prompt: "A responsive restaurant menu page with categories, mouth-watering images, and a reservation form." },
  { icon: "📅", label: "Event Landing", prompt: "A high-conversion landing page for a tech conference with countdown timer, speaker list, and ticket pricing." },
];

const LandingPage: React.FC<LandingPageProps> = ({ onStart, projects, onOpenProject }) => {
  const [prompt, setPrompt] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() || attachments.length > 0) {
      onStart(prompt, attachments);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

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

      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col bg-[#020617] text-white overflow-x-hidden relative scrollbar-hide">
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
          .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
          }
        `}
      </style>

      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 min-h-screen flex flex-col items-center justify-center">

        {/* Hero Text */}
        <div className="text-center space-y-6 mb-16 w-full max-w-4xl">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm mb-6 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Powered by Gemini Models</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
              Build software <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">
                at the speed of thought.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto leading-relaxed">
              Turn your ideas into production-ready web apps instantly. Just describe it, and Nova will build it.
            </p>
          </div>
        </div>

        {/* Suggestions Bar */}
        <div className="w-full max-w-4xl mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-3 justify-center min-w-max px-4">
            {SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onStart(suggestion.prompt, [])}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all text-sm text-slate-300 hover:text-white group whitespace-nowrap backdrop-blur-sm"
              >
                <span className="grayscale group-hover:grayscale-0 transition-all">{suggestion.icon}</span>
                <span>{suggestion.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Box */}
        <div className="w-full max-w-2xl mx-auto space-y-3">
          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="flex gap-3 flex-wrap justify-center">
              {attachments.map((att, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                  <FileText size={14} />
                  <span className="truncate max-w-[200px]">{att.name}</span>
                  <button onClick={() => removeAttachment(idx)} className="hover:text-white ml-1">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-30 group-hover:opacity-60 blur transition duration-500"></div>
            <div className="relative bg-slate-950 rounded-2xl p-2 flex flex-col gap-2 shadow-2xl">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Describe your dream app... (e.g., 'A landing page for a coffee shop')"
                className="w-full bg-transparent border-none text-lg text-white placeholder-slate-500 p-4 focus:ring-0 focus:outline-none resize-none h-[80px] min-h-[80px]"
                autoFocus
              />
              <div className="flex justify-between items-center px-2 pb-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
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
                  <div className="text-xs text-slate-500 hidden sm:block">
                    Press Enter to generate
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!prompt.trim() && attachments.length === 0}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                >
                  Generate <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>

      </div>

      {/* Projects Section */}
      {projects.length > 0 && (
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-20 pt-10 border-t border-slate-800/30 min-h-screen">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Layout className="w-5 h-5 text-indigo-400" />
              Your Projects
            </h2>
            <span className="text-sm text-slate-500">{projects.length} projects</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* New Project Card */}
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => document.querySelector('textarea')?.focus(), 500);
              }}
              className="group flex flex-col items-center justify-center min-h-[220px] rounded-2xl border border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-900/20 hover:bg-slate-900/40 transition-all text-slate-500 hover:text-indigo-400"
            >
              <div className="w-14 h-14 rounded-full bg-slate-800 group-hover:bg-indigo-500/10 flex items-center justify-center mb-4 transition-colors">
                <Plus className="w-7 h-7" />
              </div>
              <span className="font-medium text-lg">Create New Project</span>
            </button>

            {/* Existing Projects */}
            {projects.slice().reverse().map((project) => (
              <div
                key={project.id}
                onClick={() => onOpenProject(project.id)}
                className="group relative flex flex-col justify-between p-6 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition-all cursor-pointer overflow-hidden backdrop-blur-sm min-h-[220px]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500" />

                <div className="relative z-10">
                  <h3 className="font-semibold text-xl text-slate-200 group-hover:text-white mb-3 line-clamp-2 leading-tight">
                    {project.name}
                  </h3>
                  <div className="text-xs font-mono text-slate-500 mb-4 bg-slate-950/50 inline-block px-2.5 py-1 rounded-md border border-slate-800">
                    {project.id}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mt-4 pt-4 border-t border-slate-800/50 group-hover:border-slate-800 transition-colors">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(project.lastModified)}
                  </div>
                  <div className="flex items-center gap-1 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    Open <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
