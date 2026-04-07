import { create } from "zustand";
import type { Project, Message, FileEntry } from "@/lib/types/database";

interface ProjectState {
  // Current project
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;

  // Messages
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;

  // Generated code (main file content)
  generatedCode: string;
  setGeneratedCode: (code: string) => void;

  // Files (VFS)
  files: Record<string, FileEntry>;
  setFiles: (files: Record<string, FileEntry>) => void;
  updateFile: (path: string, content: string) => void;

  // UI State
  viewMode: "preview" | "code";
  setViewMode: (mode: "preview" | "code") => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  currentProject: null,
  messages: [],
  generatedCode: "",
  files: {},
  viewMode: "preview" as const,
  isLoading: false,
};

export const useProjectStore = create<ProjectState>((set) => ({
  ...initialState,

  setCurrentProject: (project) => set({ currentProject: project }),

  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setGeneratedCode: (code) => set({ generatedCode: code }),

  setFiles: (files) => set({ files }),
  updateFile: (path, content) =>
    set((state) => ({
      files: {
        ...state.files,
        [path]: { ...state.files[path], content },
      },
    })),

  setViewMode: (mode) => set({ viewMode: mode }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  reset: () => set(initialState),
}));
