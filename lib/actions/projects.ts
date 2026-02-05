"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { auth } from "@/lib/auth";
import type { Project, ProjectInsert, ProjectUpdate } from "@/lib/types/database";
import { revalidatePath } from "next/cache";

export async function getProjects(): Promise<Project[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", session.user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", JSON.stringify(error, null, 2));
    return [];
  }

  return data || [];
}

export async function getProject(id: string): Promise<Project | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    return null;
  }

  return data;
}

export async function createProject(name: string): Promise<Project | null> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const supabase = createServiceClient();

  const newProject: ProjectInsert = {
    user_id: session.user.id,
    name,
    subdomain: null,
    files: {
      "index.html": {
        content: "",
        type: "html",
      },
    },
    settings: {},
    is_published: false,
  };

  const { data, error } = await supabase
    .from("projects")
    .insert(newProject)
    .select()
    .single();

  if (error) {
    console.error("Error creating project:", error);
    throw new Error("Failed to create project");
  }

  revalidatePath("/dashboard");
  return data;
}

export async function updateProject(
  id: string,
  updates: ProjectUpdate
): Promise<Project | null> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("projects")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", session.user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating project:", error);
    throw new Error("Failed to update project");
  }

  revalidatePath(`/project/${id}`);
  return data;
}

export async function deleteProject(id: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Error deleting project:", error);
    throw new Error("Failed to delete project");
  }

  revalidatePath("/dashboard");
  return true;
}

export async function publishProject(
  id: string,
  subdomain: string
): Promise<Project | null> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Validate subdomain format
  const subdomainRegex = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;
  if (!subdomainRegex.test(subdomain)) {
    throw new Error("Invalid subdomain format");
  }

  const supabase = createServiceClient();

  // Check if subdomain is already taken
  const { data: existingProject } = await supabase
    .from("projects")
    .select("id")
    .eq("subdomain", subdomain)
    .neq("id", id)
    .single();

  if (existingProject) {
    throw new Error("Subdomain is already taken");
  }

  const { data, error } = await supabase
    .from("projects")
    .update({
      subdomain,
      is_published: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", session.user.id)
    .select()
    .single();

  if (error) {
    console.error("Error publishing project:", error);
    throw new Error("Failed to publish project");
  }

  revalidatePath(`/project/${id}`);
  return data;
}

export async function getPublishedProject(subdomain: string): Promise<Project | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("subdomain", subdomain)
    .eq("is_published", true)
    .single();

  if (error) {
    return null;
  }

  return data;
}
