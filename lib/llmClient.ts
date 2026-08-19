import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface LLMStreamOptions {
  messages: ChatMessage[];
  systemPrompt?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Resolves the Anthropic model string, with fallbacks and nickname mapping.
 */
function resolveModel(inputModel?: string): string {
  const envModel = process.env.ANTHROPIC_MODEL;
  const rawModel = inputModel || envModel || "claude-3-7-sonnet-20250219";

  // Alias handling
  if (rawModel === "claude-sonnet-4-6") {
    return "claude-3-7-sonnet-20250219";
  }

  return rawModel;
}

/**
 * Streams responses from the Claude API (Anthropic).
 * Yields individual text tokens as an AsyncGenerator.
 */
export async function* streamLLMResponse(
  options: LLMStreamOptions
): AsyncGenerator<string, void, unknown> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      "❌ Missing ANTHROPIC_API_KEY. Please add ANTHROPIC_API_KEY to your .env.local file."
    );
  }

  const anthropic = new Anthropic({ apiKey });
  const model = resolveModel(options.model);

  try {
    const stream = await anthropic.messages.create({
      model,
      max_tokens: options.maxTokens || 1024,
      temperature: options.temperature ?? 0.7,
      system: options.systemPrompt,
      messages: options.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      stream: true,
    });

    for await (const chunk of stream) {
      if (
        chunk.type === "content_block_delta" &&
        chunk.delta.type === "text_delta"
      ) {
        yield chunk.delta.text;
      }
    }
  } catch (error: any) {
    console.error("❌ Anthropic LLM Client Error:", error);

    if (error?.status === 429) {
      throw new Error("Rate limit exceeded on Claude API. Please wait a moment before trying again.");
    } else if (error?.status === 401) {
      throw new Error("Invalid ANTHROPIC_API_KEY. Please verify your API key.");
    } else if (error?.status === 404) {
      throw new Error(`The requested Claude model '${model}' was not found.`);
    }

    throw new Error(error?.message || "An unexpected error occurred while communicating with Claude API.");
  }
}
