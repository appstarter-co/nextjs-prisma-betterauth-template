// app/api/chat/route.ts
import { NextResponse } from "next/server";

const LOCAL_API_URL = process.env.LOCAL_AI_API_URL || "http://localhost:11434/api/generate";

export async function POST(req: Request) {
  const { message } = await req.json();
  
  if (message.length > 1500) {
    return NextResponse.json({ error: "Prompt too long" }, { status: 400 });
  }

  try {
    // Connect to local Ollama (must be running)
    const ollamaResponse = await fetch(LOCAL_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2", // ← change to your model
        prompt: message,
        stream: true,    // enable streaming from Ollama
      }),
    });

    // Check if Ollama responded successfully
    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API error: ${ollamaResponse.status}`);
    }

    // Create a readable stream for the browser
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = ollamaResponse.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          controller.enqueue(encoder.encode("data: ERROR: No response from Ollama\n\n"));
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true }); // Add stream: true
            // Ollama streams JSON lines; each line contains partial text
            const lines = chunk.split("\n").filter(line => line.trim()); // Filter empty lines properly

            for (const line of lines) {
              try {
                const data = JSON.parse(line);
                if (data.response) {
                  // Send partial text chunks as SSE-like data
                  controller.enqueue(encoder.encode(`data: ${data.response}\n\n`));
                }
                // Handle completion signal from Ollama
                if (data.done === true) {
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                  controller.close();
                  return;
                }
              } catch (parseError) {
                // Log parsing errors but continue
                console.warn("Failed to parse Ollama response line:", line, parseError);
              }
            }
          }
        } catch (streamError) {
          console.error("Stream reading error:", streamError);
          controller.enqueue(encoder.encode("data: ERROR: Stream interrupted\n\n"));
        } finally {
          // Only send [DONE] if not already sent
          try {
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch {
            // Stream might already be closed
          }
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*", // Add CORS if needed
      },
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to connect to AI service" },
      { status: 500 }
    );
  }
}