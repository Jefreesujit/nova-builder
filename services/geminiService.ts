import { GoogleGenAI } from "@google/genai";
import { Message, Attachment } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
6.  **Response Format**: You MUST return a JSON object with the following structure:
    {
      "html": "<!DOCTYPE html>...",
      "summary": "A short, friendly summary of the changes you made.",
      "projectName": "A short, catchy name for this project (1-3 words) based on the content."
    }
    DO NOT wrap the response in markdown code blocks. Return raw JSON.

BEHAVIOR:
- If the user asks to modify the existing app, look at the provided context (previous code) and apply the changes intelligently.
- Make the design modern, responsive, and accessible. Use adequate padding, pleasant color palettes, and clear typography.
- If the user asks for a specific functionality (like a contact form), implement the UI and a JavaScript handler that alerts the user (simulating a backend submission).
`;

export const generateAppCode = async (
  prompt: string, 
  history: Message[], 
  currentCode: string,
  attachments: Attachment[] = []
): Promise<{ code: string; summary: string; projectName?: string }> => {
  try {
    // Using gemini-3-pro-preview as it is best suited for complex coding tasks
    const model = 'gemini-3-pro-preview';
    
    // Construct a context-aware prompt
    let contextPrompt = `
      CURRENT CODE STATE:
      ${currentCode}

      USER REQUEST:
      ${prompt}
    `;

    // Process attachments for the current request
    const currentParts: any[] = [];
    
    // 1. Add embedded text files to the prompt (better for code context)
    const textAttachments = attachments.filter(a => a.isText);
    if (textAttachments.length > 0) {
        contextPrompt += `\n\nATTACHED FILES CONTEXT:\n`;
        textAttachments.forEach(att => {
            contextPrompt += `\n--- START OF FILE ${att.name} ---\n${att.content}\n--- END OF FILE ---\n`;
        });
    }

    // 2. Add the text prompt part
    currentParts.push({ text: `
      INSTRUCTIONS:
      Based on the CURRENT CODE STATE, USER REQUEST, and any ATTACHED FILES, generate the updated full HTML file. 
      If the user wants to completely change the app, ignore the current code.
      Ensure the new code is complete and functional.
      Return the response in JSON format with "html", "summary", and "projectName" fields.
      
      ${contextPrompt}
    `});

    // 3. Add binary attachments (PDFs) as inlineData
    const binaryAttachments = attachments.filter(a => !a.isText);
    binaryAttachments.forEach(att => {
        // Remove data URL prefix if present (e.g., "data:application/pdf;base64,")
        const base64Data = att.content.split(',')[1] || att.content;
        currentParts.push({
            inlineData: {
                mimeType: att.mimeType,
                data: base64Data
            }
        });
    });

    // Process History
    const historyContents = history.map(msg => {
        const parts: any[] = [{ text: msg.content }];
        
        // Handle historical attachments
        if (msg.attachments && msg.attachments.length > 0) {
            // Add text attachments to the content string for history
            const histTextAtts = msg.attachments.filter(a => a.isText);
            if (histTextAtts.length > 0) {
                 let attachmentText = "\n[Attached Files in this message]:";
                 histTextAtts.forEach(att => {
                     attachmentText += `\nFile: ${att.name}\n${att.content}`;
                 });
                 parts[0].text += attachmentText;
            }

            // Add binary attachments as parts
            const histBinAtts = msg.attachments.filter(a => !a.isText);
            histBinAtts.forEach(att => {
                const base64Data = att.content.split(',')[1] || att.content;
                parts.push({
                    inlineData: {
                        mimeType: att.mimeType,
                        data: base64Data
                    }
                });
            });
        }
        
        return {
            role: msg.role,
            parts: parts
        };
    });

    const response = await ai.models.generateContent({
      model: model,
      contents: [
        ...historyContents,
        { role: 'user', parts: currentParts }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text || '{}';
    let parsedResponse;
    
    try {
        parsedResponse = JSON.parse(responseText);
    } catch (e) {
        // Fallback cleanup if model outputs markdown despite JSON instruction
        const cleanedText = responseText.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');
        try {
            parsedResponse = JSON.parse(cleanedText);
        } catch (e2) {
            console.error("Failed to parse Gemini response as JSON", responseText);
            throw new Error("Invalid response format from AI");
        }
    }

    return {
        code: parsedResponse.html || currentCode,
        summary: parsedResponse.summary || "I've updated the app based on your request.",
        projectName: parsedResponse.projectName
    };

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to generate code. Please try again.");
  }
};