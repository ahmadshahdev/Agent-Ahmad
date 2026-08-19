import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

export interface ChatMessage {
  role: "user" | "assistant";
  content: string | any[];
}

export interface LLMStreamOptions {
  messages: ChatMessage[];
  systemPrompt?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  tools?: any[];
}

export interface ToolUseCall {
  id: string;
  name: string;
  input: any;
}

export interface LLMToolResponse {
  type: "tool_use" | "text";
  toolCall?: ToolUseCall;
  text?: string;
  rawContent: any[];
}

function resolveModel(inputModel?: string): string {
  const envModel = process.env.ANTHROPIC_MODEL;
  const rawModel = inputModel || envModel || "claude-3-7-sonnet-20250219";

  if (rawModel === "claude-sonnet-4-6") {
    return "claude-3-7-sonnet-20250219";
  }

  return rawModel;
}

/**
 * Executes initial LLM turn with tools enabled to detect if tool call is needed.
 */
export async function invokeLLMWithTools(
  options: LLMStreamOptions
): Promise<LLMToolResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      "❌ Missing ANTHROPIC_API_KEY. Please add ANTHROPIC_API_KEY to your .env.local file."
    );
  }

  const anthropic = new Anthropic({ apiKey });
  const model = resolveModel(options.model);

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: options.maxTokens || 1024,
      temperature: options.temperature ?? 0.7,
      system: options.systemPrompt,
      messages: options.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      tools: options.tools,
    });

    if (response.stop_reason === "tool_use") {
      const toolBlock = response.content.find(
        (block: any) => block.type === "tool_use"
      ) as any;

      if (toolBlock) {
        return {
          type: "tool_use",
          toolCall: {
            id: toolBlock.id,
            name: toolBlock.name,
            input: toolBlock.input,
          },
          rawContent: response.content,
        };
      }
    }

    // Extract text blocks if not tool_use
    const textContent = response.content
      .filter((block: any) => block.type === "text")
      .map((block: any) => block.text)
      .join("\n");

    return {
      type: "text",
      text: textContent,
      rawContent: response.content,
    };
  } catch (error: any) {
    console.error("❌ Anthropic LLM Client Error (invokeLLMWithTools):", error);

    if (error?.status === 429) {
      throw new Error("Rate limit exceeded on Claude API. Please wait a moment before trying again.");
    } else if (error?.status === 401) {
      throw new Error("Invalid ANTHROPIC_API_KEY. Please verify your API key.");
    }

    throw new Error(error?.message || "An unexpected error occurred while communicating with Claude API.");
  }
}

/**
 * Streams text responses from Claude API (Anthropic).
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
    console.error("❌ Anthropic LLM Client Error (streamLLMResponse):", error);

    if (error?.status === 429) {
      throw new Error("Rate limit exceeded on Claude API. Please wait a moment before trying again.");
    } else if (error?.status === 401) {
      throw new Error("Invalid ANTHROPIC_API_KEY. Please verify your API key.");
    }

    throw new Error(error?.message || "An unexpected error occurred while communicating with Claude API.");
  }
}
