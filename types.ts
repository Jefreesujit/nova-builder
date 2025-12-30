export interface Attachment {
  name: string;
  mimeType: string;
  content: string; // Base64 for PDF, raw text for others
  isText: boolean;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  attachments?: Attachment[];
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  provider: 'google' | 'github';
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  lastModified: number;
  code: string;
  messages: Message[];
  previewUrl?: string; // Mock URL for display
}

export type Theme = 'light' | 'dark';

export interface AppState {
  generatedCode: string;
  messages: Message[];
  isLoading: boolean;
  viewMode: 'preview' | 'code';
  deployStatus: 'idle' | 'deploying' | 'deployed' | 'error';
  deployedUrl: string | null;
  user: User | null;
  theme: Theme;
}

export const INITIAL_CODE = ``;