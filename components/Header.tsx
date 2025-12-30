import React from 'react';
import { Sparkles, User as UserIcon, LogOut, Rocket, CheckCircle, Moon, Sun } from 'lucide-react';
import { User, Theme } from '../types';

interface HeaderProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onDeploy: () => void;
  deployStatus: 'idle' | 'deploying' | 'deployed' | 'error';
  theme: Theme;
  onToggleTheme: () => void;
  isLanding?: boolean;
  onGoHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  onLogin, 
  onLogout, 
  onDeploy, 
  deployStatus, 
  theme, 
  onToggleTheme,
  isLanding = false,
  onGoHome
}) => {
  return (
    <header className={`h-16 border-b flex items-center justify-between px-6 fixed top-0 w-full z-50 transition-colors duration-200 
      ${isLanding 
        ? 'bg-transparent border-transparent' 
        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800'
      }`}>
      
      <button 
        onClick={onGoHome}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
      >
        <div className="bg-indigo-600 p-1.5 rounded-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
          ${isLanding ? 'from-white to-slate-400' : 'from-slate-900 to-slate-600 dark:from-white dark:to-slate-400'}`}>
          NovaBuilder
        </span>
      </button>

      <div className="flex items-center gap-4">
        {/* Theme Toggle - Hidden on Landing Page */}
        {!isLanding && (
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full transition-colors text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}

        {!isLanding && (
          <button
            onClick={onDeploy}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              deployStatus === 'deployed'
                ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm'
            }`}
          >
            {deployStatus === 'deployed' ? <CheckCircle className="w-4 h-4" /> : <Rocket className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {deployStatus === 'deployed' ? 'Deployed' : 'Deploy'}
            </span>
          </button>
        )}

        {/* User Auth */}
        {user ? (
          <div className={`flex items-center gap-3 pl-4 border-l ${isLanding ? 'border-white/20' : 'border-slate-200 dark:border-slate-800'}`}>
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-white dark:ring-slate-900">
                  {user.name.charAt(0)}
               </div>
            </div>
            <button 
              onClick={onLogout}
              className={`p-2 rounded-md transition-colors ${
                isLanding 
                  ? 'text-slate-300 hover:text-white hover:bg-white/10' 
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onLogin}
            className={`text-sm font-medium px-4 py-2 rounded-md transition-all ${
                isLanding 
                ? 'bg-white text-slate-900 hover:bg-slate-100' 
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;