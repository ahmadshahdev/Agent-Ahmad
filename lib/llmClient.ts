import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

export interface ChatMessage {
  role: "user" | "assistant";
  content: string | Anthropic.ContentBlockParam[];
}

export interface LLMStreamOptions {
  messages: ChatMessage[];
  systemPrompt?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  tools?: Anthropic.Tool[];
}

export interface ToolUseCall {
  id: string;
  name: string;
  input: unknown;
}

export interface LLMToolResponse {
  type: "tool_use" | "text";
  toolCall?: ToolUseCall;
  text?: string;
  rawContent: Anthropic.ContentBlock[];
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
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!anthropicKey && !geminiKey) {
    throw new Error(
      "❌ Missing API Keys. Please add GEMINI_API_KEY or ANTHROPIC_API_KEY to your .env.local file."
    );
  }

  // Use Anthropic if Key is available
  if (anthropicKey) {
    const anthropic = new Anthropic({ apiKey: anthropicKey });
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
          (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
        );

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

      const textContent = response.content
        .filter((block): block is Anthropic.TextBlock => block.type === "text")
        .map((block) => block.text)
        .join("\n");

      return {
        type: "text",
        text: textContent,
        rawContent: response.content,
      };
    } catch (error: unknown) {
      console.error("❌ Anthropic LLM Error:", error);
      const errObj = error as { message?: string };
      throw new Error(errObj?.message || "Failed to communicate with Anthropic API.");
    }
  }

  // Fallback to Google Gemini
  if (geminiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: options.systemPrompt,
      });

      const lastMessage = options.messages[options.messages.length - 1];
      const userPrompt =
        typeof lastMessage?.content === "string"
          ? lastMessage.content
          : JSON.stringify(lastMessage?.content);

      const result = await model.generateContent(userPrompt);
      const responseText = result.response.text();

      return {
        type: "text",
        text: responseText,
        rawContent: [],
      };
    } catch (error: unknown) {
      console.error("❌ Gemini LLM Error:", error);
      const errObj = error as { message?: string };
      throw new Error(errObj?.message || "Failed to communicate with Google Gemini API.");
    }
  }

  throw new Error("No valid LLM API key provided.");
}

/**
 * Streams text responses from Claude API or Gemini API.
 * Yields individual text tokens as an AsyncGenerator.
 */
export async function* streamLLMResponse(
  options: LLMStreamOptions
): AsyncGenerator<string, void, unknown> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!anthropicKey && !geminiKey) {
    throw new Error(
      "❌ Missing API Keys. Please add GEMINI_API_KEY or ANTHROPIC_API_KEY to your .env.local file."
    );
  }

  // 1. Google Gemini Streaming Option
  if (geminiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: options.systemPrompt,
      });

      const history = options.messages.slice(0, -1).map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [
          {
            text:
              typeof msg.content === "string"
                ? msg.content
                : JSON.stringify(msg.content),
          },
        ],
      }));

      const lastMessage = options.messages[options.messages.length - 1];
      const userPrompt =
        typeof lastMessage?.content === "string"
          ? lastMessage.content
          : JSON.stringify(lastMessage?.content);

      const chat = model.startChat({ history });
      const result = await chat.sendMessageStream(userPrompt);

      for await (const chunk of result.stream) {
        yield chunk.text();
      }
      return;
    } catch (error: unknown) {
      console.error("❌ Gemini Streaming Error:", error);
      const errObj = error as { message?: string };
      throw new Error(errObj?.message || "Error streaming response from Google Gemini API.");
    }
  }

  // 2. Anthropic Claude Streaming Option
  if (anthropicKey) {
    const anthropic = new Anthropic({ apiKey: anthropicKey });
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
      return;
    } catch (error: unknown) {
      console.error("❌ Anthropic Streaming Error:", error);
      const errObj = error as { message?: string };
      throw new Error(errObj?.message || "Error streaming response from Claude API.");
    }
  }
}
