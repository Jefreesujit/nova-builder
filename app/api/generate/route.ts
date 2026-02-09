import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { streamAppCode } from "@/lib/ai/gemini";
import type { Message, Attachment } from "@/lib/types/database";

export const maxDuration = 180; // Extend to 3 minutes

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      prompt,
      history,
      currentCode,
      attachments,
      model,
    }: {
      prompt: string;
      history: Message[];
      currentCode: string;
      attachments?: Attachment[];
      model?: string;
    } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Get the async generator (stream) from Gemini
    const stream = await streamAppCode(
      prompt,
      history || [],
      currentCode || "",
      attachments || [],
      model
    );

    // Create a ReadableStream to pipe the data to the client
    const readableStream = new ReadableStream({
      async start(controller) {
        console.log("[API] Starting stream to client...");
        try {
          // Iterate over the async generator
          for await (const chunk of stream) {
            try {
              const text = chunk.text;
              if (text) {
                console.log("[API] Sending chunk text (len:", text.length, ")");
                controller.enqueue(new TextEncoder().encode(text));
              }
            } catch (chunkError: any) {
              console.error("[API] Error reading chunk text:", chunkError);
              const msg = `\n\n### ERROR ###\nAI error: ${chunkError.message || 'Safety block or model error'}\n`;
              controller.enqueue(new TextEncoder().encode(msg));
            }
          }
          console.log("[API] AI Stream finished successfully.");
          controller.close();
        } catch (error: any) {
          console.error("[API] Global Streaming error:", error);
          const errorMsg = `\n\n### ERROR ###\nStreaming failed: ${error.message || 'Unknown error'}\n`;
          controller.enqueue(new TextEncoder().encode(errorMsg));
          controller.error(error);
        }
      },
    });

    // Return the stream with appropriate headers
    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });

  } catch (error: any) {
    console.error("Generate API error:", error);

    const message = error.message;
    let status = 500;
    let userMessage = "Failed to generate code";

    if (message === "RATE_LIMIT_REACHED") {
      status = 429;
      userMessage = "Rate limit reached. please wait a minute before trying again.";
    } else if (message === "SAFETY_BLOCK") {
      status = 400;
      userMessage = "Your request was blocked by AI safety filters. Please try a different prompt.";
    } else if (message) {
      userMessage = message;
    }

    return NextResponse.json(
      { error: userMessage },
      { status }
    );
  }
}
