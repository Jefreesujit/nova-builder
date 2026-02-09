"use client";

import Link from "next/link";
import { Clock, ExternalLink, Trash2, Folder, Globe, Lock, Play } from "lucide-react";
import { formatDistanceToNow } from "@/lib/utils/date";
import type { Project } from "@/lib/types/database";

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => Promise<void>;
  isOwner?: boolean;
}

export function ProjectCard({ project, onDelete, isOwner = true }: ProjectCardProps) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this project?")) {
      await onDelete?.(project.id);
    }
  };

  return (
    <div
      className="group bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full relative"
    >
      <Link href={`/project/${project.id}`} className="absolute inset-0 z-10" aria-label={`Open project ${project.name}`}>
        <span className="sr-only">Open Project</span>
      </Link>
      {/* Thumbnail Area */}
      <div className="aspect-video relative overflow-hidden bg-slate-900 border-b border-border/30">
        {/* Mock representation of a website instead of a tiny full render */}
        <div className="absolute inset-0 p-4 flex flex-col gap-2 scale-[0.8] origin-top opacity-60 group-hover:opacity-100 transition-opacity">
          {/* Header mock */}
          <div className="h-4 w-full bg-white/10 rounded flex items-center justify-between px-2">
            <div className="w-8 h-2 bg-white/20 rounded"></div>
            <div className="flex gap-1">
              <div className="w-4 h-2 bg-white/20 rounded"></div>
              <div className="w-4 h-2 bg-white/20 rounded"></div>
            </div>
          </div>
          {/* Hero mock */}
          <div className="flex-1 rounded bg-gradient-to-br from-primary/20 to-accent/20 flex flex-col items-center justify-center p-4">
            <div className="w-2/3 h-3 bg-white/30 rounded mb-2"></div>
            <div className="w-1/2 h-2 bg-white/20 rounded"></div>
          </div>
          {/* Content mock */}
          <div className="grid grid-cols-3 gap-2">
            <div className="h-10 bg-white/5 rounded"></div>
            <div className="h-10 bg-white/5 rounded"></div>
            <div className="h-10 bg-white/5 rounded"></div>
          </div>
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play size={20} fill="currentColor" className="ml-1" />
          </div>
        </div>

        {/* Project Type Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-0.5 bg-background/80 backdrop-blur-sm border border-border/50 rounded-md text-[10px] font-bold uppercase tracking-wider text-muted">
            {project.is_published ? (
              <span className="flex items-center gap-1 text-accent">
                <Globe size={10} /> Published
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Lock size={10} /> Private
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
              {project.name || "Untitled Project"}
            </h3>
          </div>
          {project.is_published && project.subdomain && (
            <a
              href={`https://${project.subdomain}.novabuilder.app`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-all relative z-20"
              onClick={(e) => e.stopPropagation()}
              title="View live site"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted mt-auto pt-4 border-t border-border/30">
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>{formatDistanceToNow(new Date(project.updated_at))}</span>
          </div>

          {isOwner && onDelete && (
            <button
              onClick={handleDelete}
              className="ml-auto p-1.5 text-muted hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all relative z-20"
              title="Delete project"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
