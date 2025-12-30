import React, { useState, useEffect } from 'react';
import { X, Github, ArrowRight, Download, Check, ExternalLink, Loader2, Globe, Copy, Terminal } from 'lucide-react';
import { User } from '../types';

interface DeployDialogProps {
  isOpen: boolean;
  onClose: () => void;
  generatedCode: string;
  onDeploy: () => void;
  deployStatus: 'idle' | 'deploying' | 'deployed' | 'error';
  deployedUrl: string | null;
  user: User | null;
  onLogin: () => void;
  isGitHubConnected: boolean;
  onConnectGitHub: () => void;
}

const DeployDialog: React.FC<DeployDialogProps> = ({
  isOpen,
  onClose,
  generatedCode,
  onDeploy,
  deployStatus,
  deployedUrl,
  user,
  onLogin,
  isGitHubConnected,
  onConnectGitHub
}) => {
  const [activeTab, setActiveTab] = useState<'deploy' | 'export'>('deploy');
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-500" />
            Deploy & Export
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('deploy')}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'deploy' 
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Deployment
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'export' 
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Export Code
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {activeTab === 'deploy' && (
            <div className="space-y-8">
              {/* Step 1: Authentication */}
              <div className={`relative pl-8 pb-8 border-l-2 ${user ? 'border-green-500' : 'border-slate-200 dark:border-slate-800'}`}>
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${user ? 'bg-green-500 border-green-500' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'}`}>
                  {user && <Check size={10} className="text-white absolute top-0.5 left-0.5" />}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">1. Sign In</h3>
                {user ? (
                   <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg border border-green-200 dark:border-green-800/50 w-fit">
                      <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="" className="w-5 h-5 rounded-full" />
                      Signed in as {user.name}
                   </div>
                ) : (
                  <div>
                    <p className="text-sm text-slate-500 mb-3">Sign in to link your projects.</p>
                    <button 
                      onClick={onLogin}
                      className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>

              {/* Step 2: GitHub Connection */}
              <div className={`relative pl-8 pb-8 border-l-2 ${isGitHubConnected ? 'border-green-500' : 'border-slate-200 dark:border-slate-800'}`}>
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${isGitHubConnected ? 'bg-green-500 border-green-500' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'}`}>
                  {isGitHubConnected && <Check size={10} className="text-white absolute top-0.5 left-0.5" />}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">2. Connect to GitHub</h3>
                {isGitHubConnected ? (
                   <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 w-fit">
                      <Github size={16} />
                      Connected to Repository
                   </div>
                ) : (
                  <div>
                    <p className="text-sm text-slate-500 mb-3">Link a GitHub repository to enable deployments.</p>
                    <button 
                      onClick={user ? onConnectGitHub : onLogin}
                      disabled={!user}
                      className={`flex items-center gap-2 px-4 py-2 bg-[#24292e] text-white rounded-lg text-sm font-medium hover:bg-[#2f363d] transition-colors ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Github size={16} />
                      Connect GitHub
                    </button>
                  </div>
                )}
              </div>

              {/* Step 3: Vercel Deployment */}
              <div className="relative pl-8">
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${deployStatus === 'deployed' ? 'bg-green-500 border-green-500' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'}`}>
                   {deployStatus === 'deployed' && <Check size={10} className="text-white absolute top-0.5 left-0.5" />}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">3. Deploy to Vercel</h3>
                
                {deployStatus === 'deployed' && deployedUrl ? (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium mb-2">
                            <Check size={18} />
                            Deployment Successful!
                        </div>
                        <a 
                            href={deployedUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between bg-white dark:bg-slate-950 p-2 rounded-lg border border-green-100 dark:border-green-900/30 group hover:border-green-300 dark:hover:border-green-700 transition-colors"
                        >
                            <span className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-[250px]">{deployedUrl}</span>
                            <ExternalLink size={14} className="text-slate-400 group-hover:text-green-500" />
                        </a>
                    </div>
                ) : (
                    <div>
                        <p className="text-sm text-slate-500 mb-4">Deploy your application instantly to a global edge network.</p>
                        <button 
                        onClick={onDeploy}
                        disabled={!isGitHubConnected || deployStatus === 'deploying'}
                        className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all
                            ${!isGitHubConnected 
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90 shadow-lg shadow-indigo-500/20'
                            }`}
                        >
                        {deployStatus === 'deploying' ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Deploying...
                            </>
                        ) : (
                            <>
                                <svg viewBox="0 0 1155 1000" className="w-4 h-4 fill-current"><path d="M577.344 0L1154.69 1000H0L577.344 0Z" /></svg>
                                Deploy to Vercel
                            </>
                        )}
                        </button>
                    </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <Terminal size={18} className="text-indigo-500" />
                        Single File Export
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Download your entire application as a single HTML file. It includes all styles, scripts, and logic needed to run.
                    </p>
                    <div className="flex gap-3">
                        <button 
                            onClick={handleDownload}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors font-medium text-sm"
                        >
                            <Download size={16} />
                            Download HTML
                        </button>
                        <button 
                            onClick={handleCopyCode}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-sm"
                        >
                            {copySuccess ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                            {copySuccess ? 'Copied' : 'Copy Code'}
                        </button>
                    </div>
                </div>

                <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center py-8">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                        <Github size={24} className="text-slate-400" />
                    </div>
                    <h4 className="font-medium text-slate-900 dark:text-white">Push to GitHub</h4>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1 mb-4">
                        Create a repository and push your code directly to GitHub.
                    </p>
                    <button 
                        disabled={!isGitHubConnected}
                        className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                            isGitHubConnected 
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        {isGitHubConnected ? 'Push to Main' : 'Connect GitHub First'}
                    </button>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeployDialog;