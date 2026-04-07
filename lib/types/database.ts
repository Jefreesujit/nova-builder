// Re-export database types (will be generated via supabase gen types)
// For now, define them manually based on our schema

export type Profile = {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  provider: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  name: string;
  subdomain: string | null;
  files: Record<string, FileEntry>;
  settings: ProjectSettings;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ProjectVersion = {
  id: string;
  project_id: string;
  files: Record<string, FileEntry>;
  message: string | null;
  created_at: string;
};

export type Message = {
  id: string;
  project_id: string;
  role: "user" | "model";
  content: string;
  attachments: Attachment[];
  created_at: string;
};

// Supporting types
export type FileEntry = {
  content: string;
  type: "html" | "css" | "js" | "json" | "text" | "image";
  mimeType?: string;
  url?: string; // For assets stored in Supabase Storage
};

export type ProjectSettings = {
  theme?: "light" | "dark";
  tailwindVersion?: string;
  customHead?: string;
};

export type Attachment = {
  name: string;
  mimeType: string;
  content: string;
  isText: boolean;
};

// Database insert/update types
export type ProjectInsert = Omit<Project, "id" | "created_at" | "updated_at">;
export type ProjectUpdate = Partial<ProjectInsert>;
export type MessageInsert = Omit<Message, "id" | "created_at">;
