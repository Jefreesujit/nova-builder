"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Sparkles,
  LogOut,
  Sun,
  Moon,
  Home,
  Rocket,
  Menu,
  X,
  Settings,
  Github,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface HeaderProps {
  onDeploy?: () => void;
  deployStatus?: "idle" | "deploying" | "deployed" | "error";
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
  isLanding?: boolean;
}

export function Header({
  onDeploy,
  deployStatus = "idle",
  theme = "dark",
  onToggleTheme,
  isLanding = false,
}: HeaderProps) {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-white to-muted bg-clip-text text-transparent">
            NovaBuilder
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href={isLanding ? "#projects" : "/#projects"}
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card"
          >
            <Home size={16} />
            Projects
          </Link>

          {onDeploy && (
            <button
              onClick={onDeploy}
              disabled={deployStatus === "deploying"}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-all disabled:opacity-50"
            >
              <Rocket size={16} />
              {deployStatus === "deploying"
                ? "Deploying..."
                : deployStatus === "deployed"
                  ? "Deployed!"
                  : "Deploy"}
            </button>
          )}

          {/* Theme Toggle */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-2 text-muted hover:text-foreground hover:bg-card rounded-lg transition-colors"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          <a
            href="https://github.com/JefreeSujit/nova-builder"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-muted hover:text-foreground hover:bg-card rounded-lg transition-colors"
            title="View on GitHub"
          >
            <Github size={20} />
          </a>

          {/* Auth */}
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-card animate-pulse" />
          ) : session?.user ? (
            <div className="relative group">
              <button
                className="flex items-center gap-2 focus:outline-none"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-transparent hover:ring-primary transition-all"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {session.user.name?.[0] || "U"}
                  </div>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className={`absolute right-0 top-full pt-2 w-48 z-50 ${profileMenuOpen ? 'block' : 'hidden group-hover:block hover:block'}`}>
                <div className="bg-background border border-border rounded-lg shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-foreground truncate">{session.user.name}</p>
                    <p className="text-xs text-muted truncate">{session.user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:text-foreground hover:bg-card transition-colors">
                      <Settings size={14} />
                      Settings
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-card transition-colors"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-muted hover:text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border p-4 animate-fade-in">
          <div className="flex flex-col gap-3">
            <Link
              href={isLanding ? "#projects" : "/#projects"}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home size={16} />
              Projects
            </Link>
            {session?.user ? (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => signIn()}
                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
