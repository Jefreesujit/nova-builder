import React from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeEditorProps {
  code: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-300 font-mono text-sm relative border border-slate-800 rounded-lg overflow-hidden">
        <button 
            onClick={handleCopy}
            className="absolute top-4 right-4 z-10 p-2 bg-slate-800/80 rounded-md hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-2 backdrop-blur-sm"
        >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            <span className="text-xs">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <pre className="whitespace-pre-wrap">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;