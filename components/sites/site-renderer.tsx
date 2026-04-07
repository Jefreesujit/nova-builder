"use client";

interface SiteRendererProps {
  html: string;
}

export function SiteRenderer({ html }: SiteRendererProps) {
  return (
    <iframe
      srcDoc={html}
      className="w-full h-screen border-0"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      title="Site Preview"
    />
  );
}
