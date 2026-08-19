import { NextRequest, NextResponse } from "next/server";
import { runAgent } from "@/lib/agent/runAgent";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    // Invoke agent orchestrator chain
    const { stream, sources } = await runAgent({
      message: message.trim(),
      history: Array.isArray(history) ? history : [],
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (err: any) {
          console.error("❌ Error while streaming agent response:", err);
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Sources": JSON.stringify(sources),
      },
    });
  } catch (error: any) {
    console.error("❌ Error in chat API route handler:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
