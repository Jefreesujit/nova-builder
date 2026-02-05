"use client";

import { useState } from "react";
import { X, Download, Rocket, Globe, Copy, Check, AlertCircle } from "lucide-react";

interface DeployDialogProps {
  isOpen: boolean;
  onClose: () => void;
  generatedCode: string;
  projectId?: string;
  currentSubdomain?: string | null;
  onPublish?: (subdomain: string) => Promise<void>;
}

export function DeployDialog({
  isOpen,
  onClose,
  generatedCode,
  currentSubdomain,
  onPublish,
}: DeployDialogProps) {
  const [subdomain, setSubdomain] = useState(currentSubdomain || "");
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  if (!isOpen) return null;

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

  const handlePublish = async () => {
    if (!subdomain.trim() || !onPublish) return;

    setIsPublishing(true);
    setError(null);

    try {
      await onPublish(subdomain.toLowerCase());
      setPublishSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish");
    } finally {
      setIsPublishing(false);
    }
  };

  const siteUrl = `https://${subdomain}.novabuilder.app`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Deploy & Export</h2>
          <button
            onClick={onClose}
            className="p-1 text-muted hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Download Option */}
          <div className="p-4 bg-background rounded-xl border border-border">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">Download Code</h3>
                <p className="text-sm text-muted mb-3">
                  Get the complete HTML file to host anywhere.
                </p>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-border text-foreground text-sm font-medium rounded-lg hover:bg-border/80 transition-colors"
                >
                  Download index.html
                </button>
              </div>
            </div>
          </div>

          {/* Publish Option */}
          {onPublish && (
            <div className="p-4 bg-background rounded-xl border border-border">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Rocket className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Publish to Web</h3>
                  <p className="text-sm text-muted mb-3">
                    Get a live URL to share your app with anyone.
                  </p>

                  {publishSuccess && currentSubdomain ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-accent">
                        <Check size={16} />
                        <span className="text-sm font-medium">Published!</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center gap-2 bg-card px-3 py-2 rounded-lg border border-border">
                          <Globe size={14} className="text-muted" />
                          <span className="text-sm">{siteUrl}</span>
                        </div>
                        <button
                          onClick={handleCopyUrl}
                          className="p-2 bg-border rounded-lg hover:bg-border/80 transition-colors"
                        >
                          {copied ? (
                            <Check size={16} className="text-accent" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={subdomain}
                          onChange={(e) =>
                            setSubdomain(
                              e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                            )
                          }
                          placeholder="your-app-name"
                          className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <span className="flex items-center text-sm text-muted">
                          .novabuilder.app
                        </span>
                      </div>

                      {error && (
                        <div className="flex items-center gap-2 text-destructive text-sm">
                          <AlertCircle size={14} />
                          <span>{error}</span>
                        </div>
                      )}

                      <button
                        onClick={handlePublish}
                        disabled={!subdomain.trim() || isPublishing}
                        className="w-full px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPublishing ? "Publishing..." : "Publish"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
