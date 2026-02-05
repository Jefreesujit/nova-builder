import type { Message, Attachment } from '../types';

export interface GenerateResult {
  code: string;
  summary: string;
  projectName?: string;
}

export const generateAppCode = async function* (
  prompt: string,
  history: Message[],
  currentCode: string,
  attachments: Attachment[] = []
): AsyncGenerator<GenerateResult, void, unknown> {
  try {
    console.log("[GeminiService] Fetching /api/generate...");
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, history, currentCode, attachments }),
    });

    if (!response.ok) {
      let err = `Server error ${response.status}`;
      try { err = await response.text(); } catch { }
      console.error("[GeminiService] API Error:", err);
      throw new Error(err);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("Connection failed: No response body.");

    const decoder = new TextDecoder();
    let accumulatedBuffer = '';

    // State to accumulate parts
    let accumulatedSummary = '';
    let accumulatedProjectName = '';
    let accumulatedHtml = '';

    const markers = {
      SUMMARY: "### SUMMARY ###",
      PROJECT_NAME: "### PROJECT_NAME ###",
      HTML: "### HTML ###",
      ERROR: "### ERROR ###"
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      accumulatedBuffer += decoder.decode(value, { stream: true });

      // Check for ERROR marker
      if (accumulatedBuffer.includes(markers.ERROR)) {
        const errorContent = accumulatedBuffer.split(markers.ERROR)[1];
        throw new Error(errorContent || "AI Generation failed.");
      }

      let summaryStart = accumulatedBuffer.indexOf(markers.SUMMARY);
      let projectNameStart = accumulatedBuffer.indexOf(markers.PROJECT_NAME);
      let htmlStart = accumulatedBuffer.indexOf(markers.HTML);

      // FALLBACK: If AI is just outputting raw HTML or text without markers
      // If we have > 100 chars and NO summary marker found yet, assume it's just HTML or summary
      if (summaryStart === -1 && projectNameStart === -1 && htmlStart === -1 && accumulatedBuffer.length > 200) {
        // Check if it looks like HTML
        if (accumulatedBuffer.trim().toLowerCase().startsWith("<!doctype") || accumulatedBuffer.includes("<html")) {
          accumulatedHtml = accumulatedBuffer;
          accumulatedSummary = "Generating HTML directly...";
        } else {
          accumulatedSummary = accumulatedBuffer;
        }
      } else {
        // NORMAL PARSING BASED ON MARKERS
        if (summaryStart !== -1) {
          const start = summaryStart + markers.SUMMARY.length;
          const end = projectNameStart !== -1 ? projectNameStart : (htmlStart !== -1 ? htmlStart : accumulatedBuffer.length);
          accumulatedSummary = accumulatedBuffer.substring(start, end).trim();
        }

        if (projectNameStart !== -1) {
          const start = projectNameStart + markers.PROJECT_NAME.length;
          const end = htmlStart !== -1 ? htmlStart : accumulatedBuffer.length;
          accumulatedProjectName = accumulatedBuffer.substring(start, end).trim();
        }

        if (htmlStart !== -1) {
          const start = htmlStart + markers.HTML.length;
          accumulatedHtml = accumulatedBuffer.substring(start).trim();
        }
      }

      // Determine what to show in the code view
      let codeToYield = accumulatedHtml;
      if (!codeToYield) {
        if (accumulatedProjectName) codeToYield = `<!-- Building project: ${accumulatedProjectName} ... -->`;
        else if (accumulatedSummary) codeToYield = `<!-- ${accumulatedSummary.split('\n')[0]} ... -->`;
        else codeToYield = `<!-- Thinking... -->`;
      }

      // Emit update
      yield {
        code: codeToYield,
        summary: accumulatedSummary || "Thinking...",
        projectName: accumulatedProjectName
      };
    }

    console.log("[GeminiService] Generator finished successfully.");

  } catch (error: any) {
    console.error("[GeminiService] Streaming error:", error);
    throw error;
  }
};
