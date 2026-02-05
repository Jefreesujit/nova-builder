import { notFound } from "next/navigation";
import { getPublishedProject } from "@/lib/actions/projects";
import { SiteRenderer } from "@/components/sites/site-renderer";

interface SitePageProps {
  params: Promise<{ subdomain: string }>;
}

export default async function SitePage({ params }: SitePageProps) {
  const { subdomain } = await params;

  const project = await getPublishedProject(subdomain);

  if (!project) {
    notFound();
  }

  const htmlContent = project.files?.["index.html"]?.content;

  if (!htmlContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Site Under Construction</h1>
          <p className="text-slate-400">This site doesn&#39;t have any content yet.</p>
        </div>
      </div>
    );
  }

  return <SiteRenderer html={htmlContent} />;
}
