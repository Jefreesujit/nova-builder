"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { auth } from "@/lib/auth";
import type { Message, MessageInsert } from "@/lib/types/database";

export async function getMessages(projectId: string): Promise<Message[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }

  return data || [];
}

export async function addMessage(
  projectId: string,
  role: "user" | "model",
  content: string,
  attachments: MessageInsert["attachments"] = []
): Promise<Message | null> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const supabase = createServiceClient();

  // Verify project ownership
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", session.user.id)
    .single();

  if (!project) {
    throw new Error("Project not found");
  }

  const newMessage: MessageInsert = {
    project_id: projectId,
    role,
    content,
    attachments,
  };

  const { data, error } = await supabase
    .from("messages")
    .insert(newMessage)
    .select()
    .single();

  if (error) {
    console.error("Error adding message:", error);
    throw new Error("Failed to add message");
  }

  return data;
}

export async function clearMessages(projectId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const supabase = createServiceClient();

  // Verify project ownership first
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", session.user.id)
    .single();

  if (!project) {
    throw new Error("Project not found");
  }

  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("project_id", projectId);

  if (error) {
    console.error("Error clearing messages:", error);
    throw new Error("Failed to clear messages");
  }

  return true;
}
