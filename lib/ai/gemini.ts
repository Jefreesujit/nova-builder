import { GoogleGenAI } from "@google/genai";
import type { Message, Attachment } from "@/lib/types/database";

// Initialize Gemini Client (server-side only)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_INSTRUCTION = `
You are Nova, an expert Full Stack Developer and UI/UX Designer specialized in building Landing Pages and Single Page Applications.

YOUR GOAL:
Generate a SINGLE, STANDALONE HTML file that includes everything needed to run the page (HTML, internal CSS, and internal JavaScript).

TECHNICAL CONSTRAINTS:
1.  **Styling**: Use Tailwind CSS via CDN (<script src="https://cdn.tailwindcss.com"></script>). Do not write raw CSS unless absolutely necessary for animations not supported by Tailwind.
2.  **Icons**: If icons are needed, use FontAwesome CDN or inline SVGs. Do not import React libraries like Lucide or Remix in the raw HTML output as it won't run in a simple iframe without a bundler.
3.  **Images**: Use 'https://picsum.photos/width/height' for placeholders.
4.  **Structure**: The output must be a valid HTML5 document starting with <!DOCTYPE html>.
5.  **Interactivity**: Use vanilla JavaScript inside <script> tags for any interactivity (modals, smooth scroll, form handling simulation).
6.  **Response Format**:
    You MUST stream the response in the following specific format with these exact separators:

    ### SUMMARY ###
    (A short, friendly summary of the changes you made)

    ### PROJECT_NAME ###
    (A short, catchy name for this project)

    ### HTML ###
    (The full <!DOCTYPE html> code...)

    DO NOT wrap sections in markdown code blocks. Just output the raw text after each marker.

BEHAVIOR:
- If the user asks to modify the existing app, look at the provided context (previous code) and apply the changes intelligently.
- Make the design modern, responsive, and accessible. Use adequate padding, pleasant color palettes, and clear typography.
- If the user asks for a specific functionality (like a contact form), implement the UI and a JavaScript handler that alerts the user (simulating a backend submission).
`;

export async function streamAppCode(
  prompt: string,
  history: Message[],
  currentCode: string,
  attachments: Attachment[] = []
) {
  try {
    const model = "gemini-3-flash-preview";

    // Construct a context-aware prompt
    let contextPrompt = `
      CURRENT CODE STATE:
      ${currentCode}

      USER REQUEST:
      ${prompt}
    `;

    // Process attachments for the current request
    const currentParts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

    // 1. Add embedded text files to the prompt
    const textAttachments = attachments.filter((a) => a.isText);
    if (textAttachments.length > 0) {
      contextPrompt += `\n\nATTACHED FILES CONTEXT:\n`;
      textAttachments.forEach((att) => {
        contextPrompt += `\n--- START OF FILE ${att.name} ---\n${att.content}\n--- END OF FILE ---\n`;
      });
    }

    // 2. Add the text prompt part
    currentParts.push({
      text: `
      INSTRUCTIONS:
      Based on the CURRENT CODE STATE, USER REQUEST, and any ATTACHED FILES, generate the updated full HTML file.
      If the user wants to completely change the app, ignore the current code.
      Ensure the new code is complete and functional.

      REMEMBER THE OUTPUT FORMAT:
      ### SUMMARY ###
      ...
      ### PROJECT_NAME ###
      ...
      ### HTML ###
      ...

      ${contextPrompt}
    `,
    });

    // 3. Add binary attachments (PDFs) as inlineData
    const binaryAttachments = attachments.filter((a) => !a.isText);
    binaryAttachments.forEach((att) => {
      const base64Data = att.content.split(",")[1] || att.content;
      currentParts.push({
        inlineData: {
          mimeType: att.mimeType,
          data: base64Data,
        },
      });
    });

    // Process History
    const historyContents = history.map((msg) => {
      const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [{ text: msg.content }];

      if (msg.attachments && msg.attachments.length > 0) {
        const histTextAtts = msg.attachments.filter((a) => a.isText);
        if (histTextAtts.length > 0) {
          let attachmentText = "\n[Attached Files in this message]:";
          histTextAtts.forEach((att) => {
            attachmentText += `\nFile: ${att.name}\n${att.content}`;
          });
          (parts[0] as { text: string }).text += attachmentText;
        }

        const histBinAtts = msg.attachments.filter((a) => !a.isText);
        histBinAtts.forEach((att) => {
          const base64Data = att.content.split(",")[1] || att.content;
          parts.push({
            inlineData: {
              mimeType: att.mimeType,
              data: base64Data,
            },
          });
        });
      }

      return {
        role: msg.role,
        parts: parts,
      };
    });

    const result = await ai.models.generateContentStream({
      model: model,
      contents: [...historyContents, { role: "user", parts: currentParts }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return result;

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);

    const errorMessage = error?.message?.toLowerCase() || "";
    if (errorMessage.includes("429") || errorMessage.includes("too many requests") || errorMessage.includes("rate limit")) {
      throw new Error("RATE_LIMIT_REACHED");
    }

    if (errorMessage.includes("safety") || errorMessage.includes("blocked")) {
      throw new Error("SAFETY_BLOCK");
    }

    throw new Error(error.message || "Failed to generate code. Please try again.");
  }
}
