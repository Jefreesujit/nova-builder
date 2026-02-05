"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, Code, Download, Rocket } from "lucide-react";
import { ChatInterface } from "@/components/builder/chat-interface";
import { PreviewFrame } from "@/components/builder/preview-frame";
import { CodeEditor } from "@/components/builder/code-editor";
import { DeployDialog } from "@/components/builder/deploy-dialog";
import { addMessage } from "@/lib/actions/messages";
import { updateProject, publishProject } from "@/lib/actions/projects";
import type { Project, Message, Attachment } from "@/lib/types/database";
import { generateAppCode } from "@/services/geminiService";

interface WorkspaceClientProps {
  project: Project;
  initialMessages: Message[];
  initialPrompt?: string;
}

export function WorkspaceClient({
  project,
  initialMessages,
  initialPrompt,
}: WorkspaceClientProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [generatedCode, setGeneratedCode] = useState(
    project.files?.["index.html"]?.content || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [showDeployDialog, setShowDeployDialog] = useState(false);

  const hasInitialized = useRef(false);

  // Handle initial prompt from new project
  useEffect(() => {
    if (initialPrompt && messages.length === 0 && !hasInitialized.current) {
      hasInitialized.current = true;
      handleSendMessage(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async (
    text: string,
    attachments: Attachment[] = []
  ) => {
    // Add user message to UI
    const userMessage: Message = {
      id: crypto.randomUUID(),
      project_id: project.id,
      role: "user",
      content: text,
      attachments,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Save user message to DB
      await addMessage(project.id, "user", text, attachments);

      // Call Gemini Service (Streaming)
      const generator = generateAppCode(text, messages, generatedCode, attachments);

      let finalCode = generatedCode;
      let finalSummary = "";
      let finalProjectName = project.name;

      // Initialize a placeholder AI message for the UI
      const aiMessageId = crypto.randomUUID();
      const initialAiMessage: Message = {
        id: aiMessageId,
        project_id: project.id,
        role: "model",
        content: "Generating...",
        attachments: [],
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, initialAiMessage]);
      setViewMode("preview");

      for await (const update of generator) {
        if (update.code) {
          setGeneratedCode(update.code);
          finalCode = update.code;
        }

        if (update.summary) {
          finalSummary = update.summary;
          // Update the specific AI message in state
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId ? { ...msg, content: finalSummary } : msg
            )
          );
        }

        if (update.projectName) {
          finalProjectName = update.projectName;
        }
      }

      // Save AI message to DB (final summary)
      await addMessage(project.id, "model", finalSummary);

      // Update project files in DB
      await updateProject(project.id, {
        files: {
          ...project.files,
          "index.html": {
            content: finalCode,
            type: "html",
          },
        },
        name: finalProjectName,
      });
    } catch (error) {
      console.error("Error generating code:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        project_id: project.id,
        role: "model",
        content: error instanceof Error ? `Error: ${error.message}` : "Sorry, I encountered an error. Please try again.",
        attachments: [],
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePublish = async (subdomain: string) => {
    await publishProject(project.id, subdomain);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Chat Panel */}
      <div className="w-full md:w-[400px] lg:w-[450px] flex-shrink-0 border-r border-border">
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
        />
      </div>

      {/* Workspace Panel */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-card">
          <div className="flex bg-background rounded-lg p-1">
            <button
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === "preview"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
                }`}
            >
              <Eye size={14} />
              Preview
            </button>
            <button
              onClick={() => setViewMode("code")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === "code"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
                }`}
            >
              <Code size={14} />
              Code
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 text-muted hover:text-foreground hover:bg-background rounded-lg transition-colors"
              title="Download code"
            >
              <Download size={16} />
            </button>
            <button
              onClick={() => setShowDeployDialog(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:bg-accent/90 transition-colors"
            >
              <Rocket size={14} />
              Deploy
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-hidden">
          {viewMode === "preview" ? (
            <PreviewFrame
              code={generatedCode}
              isLoading={isLoading}
              refreshKey={messages.length}
            />
          ) : (
            <CodeEditor code={generatedCode} />
          )}
        </div>
      </div>

      {/* Deploy Dialog */}
      <DeployDialog
        isOpen={showDeployDialog}
        onClose={() => setShowDeployDialog(false)}
        generatedCode={generatedCode}
        projectId={project.id}
        currentSubdomain={project.subdomain}
        onPublish={handlePublish}
      />
    </div>
  );
}
