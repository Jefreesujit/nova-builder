import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import PreviewFrame from './components/PreviewFrame';
import CodeEditor from './components/CodeEditor';
import LandingPage from './components/LandingPage';
import DeployDialog from './components/DeployDialog';
import { Message, User, INITIAL_CODE, Theme, Project, Attachment } from './types';
import { generateAppCode } from './services/geminiService';
import { Eye, Code, ExternalLink, X, Github, Sparkles, Download } from 'lucide-react';

const App: React.FC = () => {
  // Application State
  const [messages, setMessages] = useState<Message[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>(INITIAL_CODE);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  
  // Deployment & Auth State
  const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'deployed' | 'error'>('idle');
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isGitHubConnected, setIsGitHubConnected] = useState(false);
  
  // Theme State
  const [theme, setTheme] = useState<Theme>('dark');
  
  // Project & Navigation State
  const [isLanding, setIsLanding] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<{ text: string; attachments: Attachment[] } | null>(null);
  const [projects, setProjects] = useState<Project[]>(() => {
    // Load projects from local storage on initial render
    const saved = localStorage.getItem('nova_projects');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  // Initialize Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Save Projects to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('nova_projects', JSON.stringify(projects));
  }, [projects]);

  // Autosave current project state
  useEffect(() => {
    if (currentProjectId && !isLoading) {
      setProjects(prev => prev.map(p => {
        if (p.id === currentProjectId) {
          return {
            ...p,
            code: generatedCode,
            messages: messages,
            lastModified: Date.now()
          };
        }
        return p;
      }));
    }
  }, [generatedCode, messages, currentProjectId, isLoading]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const createNewProject = (prompt: string): string => {
      const newId = `proj_${Math.random().toString(36).substr(2, 9)}`;
      const newProject: Project = {
          id: newId,
          name: prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt,
          createdAt: Date.now(),
          lastModified: Date.now(),
          code: '', // Start blank
          messages: [], // Start empty, handleSendMessage will populate this via state sync
          previewUrl: `https://${newId}.nova.app`
      };
      setProjects(prev => [...prev, newProject]);
      return newId;
  };

  // Handlers
  const handleSendMessage = async (text: string, attachments: Attachment[] = []) => {
    // 1. Add User Message
    const newUserMsg: Message = { 
        role: 'user', 
        content: text, 
        timestamp: Date.now(),
        attachments: attachments
    };
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      // 2. Call Gemini Service
      const { code, summary, projectName } = await generateAppCode(text, messages, generatedCode, attachments);
      
      // 3. Update State
      setGeneratedCode(code);
      const newBotMsg: Message = { 
        role: 'model', 
        content: summary, 
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, newBotMsg]);
      setViewMode('preview'); // Auto-switch to preview on update

      // 4. Update Project Name if provided and it's the first significant update
      if (projectName && currentProjectId) {
          setProjects(prev => prev.map(p => {
              if (p.id === currentProjectId) {
                  return { ...p, name: projectName };
              }
              return p;
          }));
      }

    } catch (error) {
      console.error(error);
      const errorMsg: Message = { 
        role: 'model', 
        content: "Sorry, I encountered an error generating the code. Please try again.", 
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartBuild = (prompt: string, attachments: Attachment[]) => {
    if (!user) {
        setPendingPrompt({ text: prompt, attachments });
        setShowAuthModal(true);
    } else {
        startWorkspace(prompt, attachments);
    }
  };

  const startWorkspace = (prompt: string, attachments: Attachment[]) => {
      // Create new project
      const projectId = createNewProject(prompt);
      setCurrentProjectId(projectId);
      setGeneratedCode(''); // Ensure code is blank initially
      setMessages([]); // Ensure messages are blank initially to avoid duplication
      setIsLanding(false);
      
      // Immediately trigger generation - this will add the first message
      handleSendMessage(prompt, attachments);
  };

  const handleOpenProject = (projectId: string) => {
      const project = projects.find(p => p.id === projectId);
      if (project) {
          setCurrentProjectId(projectId);
          setGeneratedCode(project.code);
          setMessages(project.messages);
          setIsLanding(false);
      }
  };

  const handleGoHome = () => {
      setIsLanding(true);
      setCurrentProjectId(null);
  };

  const handleLogin = () => {
    // Mock Login
    const mockUser: User = {
      id: '123',
      name: 'Demo User',
      email: 'demo@example.com',
      avatarUrl: '',
      provider: 'google'
    };
    setUser(mockUser);
    setShowAuthModal(false);
    
    if (pendingPrompt) {
        startWorkspace(pendingPrompt.text, pendingPrompt.attachments);
        setPendingPrompt(null);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLanding(true);
    setMessages([]);
    setGeneratedCode(INITIAL_CODE);
    setCurrentProjectId(null);
    setIsGitHubConnected(false);
    setDeployStatus('idle');
    setDeployedUrl(null);
  };

  const handleConnectGitHub = () => {
      // Mock GitHub Connection
      setTimeout(() => {
          setIsGitHubConnected(true);
      }, 1000);
  };

  const handleDeploy = () => {
    setDeployStatus('deploying');
    
    // Simulate Vercel Deployment Process
    setTimeout(() => {
        setDeployStatus('deployed');
        setDeployedUrl(`https://nova-app-${Math.floor(Math.random() * 10000)}.vercel.app`);
    }, 2500);
  };

  const handleDownloadCode = () => {
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
    <div className={`flex flex-col h-screen overflow-hidden font-sans transition-colors duration-200 ${
        theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <Header 
        user={user} 
        onLogin={() => setShowAuthModal(true)} 
        onLogout={handleLogout}
        onDeploy={() => setShowDeployDialog(true)}
        deployStatus={deployStatus}
        theme={theme}
        onToggleTheme={toggleTheme}
        isLanding={isLanding}
        onGoHome={handleGoHome}
      />

      {isLanding ? (
          <LandingPage 
            onStart={handleStartBuild} 
            projects={projects}
            onOpenProject={handleOpenProject}
          />
      ) : (
        <main className="flex-1 flex pt-16 h-full">
            {/* Left Panel: Chat (30% width on Desktop) */}
            <div className={`w-full md:w-[400px] lg:w-[450px] flex-shrink-0 h-full border-r z-10 
                ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
            <ChatInterface 
                messages={messages} 
                isLoading={isLoading} 
                onSendMessage={handleSendMessage} 
            />
            </div>

            {/* Right Panel: Workspace */}
            <div className={`flex-1 flex flex-col h-full relative 
                ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'}`}>
            
            {/* Workspace Toolbar */}
            <div className={`h-12 border-b flex items-center justify-between px-4 
                ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className={`flex rounded-lg p-1 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <button
                    onClick={() => setViewMode('preview')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        viewMode === 'preview' 
                        ? (theme === 'dark' ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm')
                        : (theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
                    }`}
                    >
                    <Eye size={14} /> Preview
                    </button>
                    <button
                    onClick={() => setViewMode('code')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        viewMode === 'code' 
                        ? (theme === 'dark' ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm')
                        : (theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
                    }`}
                    >
                    <Code size={14} /> Code
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {deployedUrl && (
                        <a href={deployedUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-green-500 hover:text-green-600 font-medium mr-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Live
                        </a>
                    )}
                    
                    <button 
                        onClick={handleDownloadCode}
                        className={`p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'}`}
                        title="Download Code"
                    >
                        <Download size={16} />
                    </button>
                </div>
            </div>

            {/* Workspace Content */}
            <div className={`flex-1 overflow-hidden p-4 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'}`}>
                {viewMode === 'preview' ? (
                    <PreviewFrame 
                        code={generatedCode} 
                        refreshKey={messages.length} 
                        isLoading={isLoading}
                    />
                ) : (
                    <CodeEditor code={generatedCode} />
                )}
            </div>
            </div>
        </main>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-8 relative ${theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
                 <button 
                    onClick={() => setShowAuthModal(false)}
                    className={`absolute top-4 right-4 ${theme === 'dark' ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
                  >
                      <X size={20} />
                  </button>
                
                <div className="text-center mb-8">
                     <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
                         <Sparkles className="w-6 h-6 text-white" />
                     </div>
                     <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Sign in to NovaBuilder</h2>
                     <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Sign in to create, save, and deploy your apps.</p>
                </div>

                <div className="space-y-3">
                    <button 
                        onClick={handleLogin}
                        className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl font-medium transition-all group
                            ${theme === 'dark' 
                                ? 'bg-white text-slate-900 hover:bg-slate-200' 
                                : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                    </button>
                    <button 
                        onClick={handleLogin}
                        className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl font-medium border transition-all
                             ${theme === 'dark' 
                                ? 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700' 
                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                    >
                        <Github className="w-5 h-5" />
                        Continue with GitHub
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Deployment & Export Dialog */}
      <DeployDialog 
        isOpen={showDeployDialog}
        onClose={() => setShowDeployDialog(false)}
        generatedCode={generatedCode}
        onDeploy={handleDeploy}
        deployStatus={deployStatus}
        deployedUrl={deployedUrl}
        user={user}
        onLogin={handleLogin}
        isGitHubConnected={isGitHubConnected}
        onConnectGitHub={handleConnectGitHub}
      />
    </div>
  );
};

export default App;