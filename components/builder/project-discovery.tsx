"use client";

import { useState } from "react";
import { ProjectCard } from "./project-card";
import { Folder, Globe, Sparkles } from "lucide-react";
import type { Project } from "@/lib/types/database";
import { deleteProject } from "@/lib/actions/projects";

interface ProjectDiscoveryProps {
  userProjects: Project[];
  publicProjects: Project[];
  isAuthenticated: boolean;
}

export function ProjectDiscovery({
  userProjects,
  publicProjects,
  isAuthenticated,
}: ProjectDiscoveryProps) {
  const [activeTab, setActiveTab] = useState<"yours" | "community">(
    isAuthenticated && userProjects.length > 0 ? "yours" : "community"
  );
  const [projects, setProjects] = useState({
    yours: userProjects,
    community: publicProjects,
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      setProjects((prev) => ({
        ...prev,
        yours: prev.yours.filter((p) => p.id !== id),
      }));
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  const currentProjects = activeTab === "yours" ? projects.yours : projects.community;

  return (
    <section id="projects" className="py-24 px-4 bg-background relative border-t border-border/30">
      <div className="max-w-6xl mx-auto">
        {/* Project Tabs Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Discover Projects</h2>
            <p className="text-muted text-sm">Explore what others are building or manage your own</p>
          </div>

          <div className="flex p-1 bg-card border border-border rounded-xl">
            {isAuthenticated && (
              <button
                onClick={() => setActiveTab("yours")}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "yours"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted hover:text-foreground hover:bg-white/5"
                  }`}
              >
                <Folder size={16} />
                Your Projects
              </button>
            )}
            <button
              onClick={() => setActiveTab("community")}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "community"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted hover:text-foreground hover:bg-white/5"
                }`}
            >
              <Globe size={16} />
              Community
            </button>
          </div>
        </div>

        {/* Empty State */}
        {currentProjects.length === 0 ? (
          <div className="text-center py-20 bg-card/20 rounded-[2rem] border border-dashed border-border/50">
            <div className="w-16 h-16 bg-muted/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-muted/30" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              {activeTab === "yours" ? "No projects yet" : "No community projects yet"}
            </h3>
            <p className="text-muted max-w-sm mx-auto mb-8">
              {activeTab === "yours"
                ? "Start building your first AI-generated application above."
                : "Be the first one to publish a project to the community!"}
            </p>
            {activeTab === "yours" && (
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-6 py-3 bg-primary/10 text-primary font-bold rounded-xl border border-primary/20 hover:bg-primary/20 transition-all"
              >
                Build Now
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={activeTab === "yours" ? handleDelete : undefined}
                isOwner={activeTab === "yours"}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
