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
import JSZip from "jszip";

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
  const [generationSummary, setGenerationSummary] = useState("");

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
    setViewMode("code"); // Code tab priority during generation

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

      for await (const update of generator) {
        if (update.code) {
          setGeneratedCode(update.code);
          finalCode = update.code;
        }

        if (update.summary) {
          finalSummary = update.summary;
          setGenerationSummary(finalSummary);
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

      // Automatically switch to preview when finished
      setViewMode("preview");

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
    } catch (error: any) {
      console.error("Error generating code:", error);
      let userFriendlyMessage = "Sorry, I encountered an error. Please try again.";

      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.toLowerCase().includes("rate limit")) {
        userFriendlyMessage = "🚨 Rate limit reached! The Gemini API is currently busy. Please wait about 60 seconds and try your request again.";
      } else if (errorMessage.toLowerCase().includes("safety") || errorMessage.toLowerCase().includes("blocked")) {
        userFriendlyMessage = "🛡️ Your request was blocked by safety filters. Try rephrasing your prompt to be more specific and standard.";
      } else if (errorMessage) {
        userFriendlyMessage = `Error: ${errorMessage}`;
      }

      const errorMessageObj: Message = {
        id: crypto.randomUUID(),
        project_id: project.id,
        role: "model",
        content: userFriendlyMessage,
        attachments: [],
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
      setGenerationSummary("");
    }
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    // Explicitly name the file "index.html" to avoid "index 2.html"
    zip.file("index.html", generatedCode);

    try {
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const fileName = project.name ? `${project.name.replace(/\s+/g, '-').toLowerCase()}.zip` : "nova-app.zip";

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Zip generation failed:", err);
      // Fallback to direct html download
      const blob = new Blob([generatedCode], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "index.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handlePublish = async (subdomain: string) => {
    await publishProject(project.id, subdomain);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-background">
      {/* Chat Panel */}
      <div className="w-full md:w-[400px] lg:w-[450px] flex-shrink-0 bg-background flex flex-col h-full">
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
        />
      </div>

      {/* Workspace Panel */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
        {/* Toolbar */}
        <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm shadow-sm z-10">
          <div className="flex bg-background/50 rounded-lg p-1 border border-border/50">
            <button
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === "preview"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted hover:text-foreground hover:bg-card/30"
                }`}
            >
              <Eye size={14} />
              Preview
            </button>
            <button
              onClick={() => setViewMode("code")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === "code"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted hover:text-foreground hover:bg-card/30"
                }`}
            >
              <Code size={14} />
              Code
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 text-muted hover:text-foreground hover:bg-card/50 bg-background/50 border border-border/50 rounded-lg transition-colors"
              title="Download code as ZIP"
            >
              <Download size={16} />
            </button>
            <button
              onClick={() => setShowDeployDialog(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
            >
              <Rocket size={14} />
              Deploy
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden bg-background">
          {viewMode === "preview" ? (
            <PreviewFrame
              code={generatedCode}
              isLoading={isLoading}
              refreshKey={messages.length}
              status={generationSummary}
            />
          ) : (
            <div className="h-full p-4 flex flex-col">
              <div className="flex-1 rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                <CodeEditor code={generatedCode} />
              </div>
            </div>
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
