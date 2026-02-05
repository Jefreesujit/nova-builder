import { redirect } from "next/navigation";
import { createProject } from "@/lib/actions/projects";
import { NewProjectForm } from "./new-project-form";

export default function NewProjectPage() {
  async function handleCreate(formData: FormData) {
    "use server";
    const prompt = formData.get("prompt") as string;
    if (!prompt?.trim()) return;

    const project = await createProject(prompt.slice(0, 50));
    if (project) {
      redirect(`/project/${project.id}?prompt=${encodeURIComponent(prompt)}`);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">What do you want to build?</h1>
          <p className="text-muted">
            Describe your app and I&#39;ll generate the code for you
          </p>
        </div>

        <NewProjectForm onSubmit={handleCreate} />
      </div>
    </div>
  );
}
