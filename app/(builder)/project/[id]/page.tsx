import { notFound } from "next/navigation";
import { getProject } from "@/lib/actions/projects";
import { getMessages } from "@/lib/actions/messages";
import { WorkspaceClient } from "./workspace-client";

interface WorkspacePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ prompt?: string; model?: string }>;
}

export default async function WorkspacePage({
  params,
  searchParams,
}: WorkspacePageProps) {
  const { id } = await params;
  const { prompt, model } = await searchParams;

  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  const messages = await getMessages(id);

  return (
    <WorkspaceClient
      project={project}
      initialMessages={messages}
      initialPrompt={prompt}
      initialModel={model}
    />
  );
}
