import Link from "next/link";
import { Plus, Folder, Trash2, ExternalLink, Clock } from "lucide-react";
import { getProjects, deleteProject } from "@/lib/actions/projects";
import { formatDistanceToNow } from "@/lib/utils/date";

export default async function DashboardPage() {
  const projects = await getProjects();

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Your Projects</h1>
          <p className="text-muted text-sm">
            Create, manage, and deploy your AI-generated apps
          </p>
        </div>
        <Link
          href="/project/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          New Project
        </Link>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-card rounded-xl flex items-center justify-center">
            <Folder className="w-8 h-8 text-muted" />
          </div>
          <h2 className="text-lg font-medium mb-2">No projects yet</h2>
          <p className="text-muted text-sm mb-6">
            Create your first project to get started
          </p>
          <Link
            href="/project/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{project.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted mt-1">
                    <Clock size={12} />
                    <span>
                      {formatDistanceToNow(new Date(project.updated_at))}
                    </span>
                  </div>
                </div>
                {project.is_published && project.subdomain && (
                  <a
                    href={`https://${project.subdomain}.novabuilder.app`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-accent hover:bg-accent/10 rounded transition-colors"
                    title="View live site"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>

              {/* Preview thumbnail or placeholder */}
              <div className="aspect-video bg-background rounded-lg mb-3 overflow-hidden border border-border">
                {project.files?.["index.html"]?.content ? (
                  <iframe
                    srcDoc={project.files["index.html"].content}
                    className="w-full h-full pointer-events-none"
                    title={project.name}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted">
                    <Folder size={24} />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href={`/project/${project.id}`}
                  className="flex-1 text-center py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  Open
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteProject(project.id);
                  }}
                >
                  <button
                    type="submit"
                    className="p-2 text-muted hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    title="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
