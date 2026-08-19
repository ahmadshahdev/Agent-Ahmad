import { GoogleGenerativeAI, Tool } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface GeminiLLMOptions {
  messages: ChatMessage[];
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  tools?: Tool[];
}

export interface GeminiToolCall {
  name: string;
  args: Record<string, unknown>;
}

export interface GeminiLLMResponse {
  type: "tool_use" | "text";
  toolCall?: GeminiToolCall;
  text?: string;
}

const CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-3.6-flash",
  "gemini-flash-latest",
  "gemini-1.5-flash",
  "gemini-2.0-flash-exp",
];

/**
 * Validates and retrieves the GEMINI_API_KEY from environment variables.
 */
function getGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error("❌ Missing GEMINI_API_KEY");
  }
  return apiKey.trim();
}

/**
 * Resolves the candidate list of models to try, placing user/env preference first.
 */
function getModelCandidateList(inputModel?: string): string[] {
  const envModel = process.env.GEMINI_MODEL;
  const preferred = inputModel || envModel || "gemini-2.5-flash";

  return Array.from(new Set([preferred, ...CANDIDATE_MODELS]));
}

/**
 * Executes initial turn with Google Gemini with multi-model fallback resilience.
 */
export async function invokeLLMWithTools(
  options: GeminiLLMOptions
): Promise<GeminiLLMResponse> {
  const apiKey = getGeminiApiKey();
  const modelsToTry = getModelCandidateList(options.model);

  let lastError: unknown;

  for (const modelName of modelsToTry) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: options.systemPrompt,
        tools: options.tools,
      });

      const lastMessage = options.messages[options.messages.length - 1];
      const userPrompt = lastMessage?.content || "";

      const result = await model.generateContent(userPrompt);
      const response = result.response;
      const functionCalls = response.functionCalls();

      if (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];
        return {
          type: "tool_use",
          toolCall: {
            name: call.name,
            args: (call.args as Record<string, unknown>) || {},
          },
        };
      }

      return {
        type: "text",
        text: response.text(),
      };
    } catch (error: unknown) {
      console.warn(`⚠️ Gemini invocation failed on model '${modelName}', trying candidate fallback:`, error);
      lastError = error;
    }
  }

  console.error("❌ All candidate Google Gemini models failed (invokeLLMWithTools).");
  const errObj = lastError as { message?: string };
  throw new Error(errObj?.message || "Failed to communicate with Google Gemini API across all model candidates.");
}

/**
 * Streams text responses from Google Gemini API with multi-model fallback.
 */
export async function* streamLLMResponse(
  options: GeminiLLMOptions
): AsyncGenerator<string, void, unknown> {
  const apiKey = getGeminiApiKey();
  const modelsToTry = getModelCandidateList(options.model);

  let lastError: unknown;

  for (const modelName of modelsToTry) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: options.systemPrompt,
      });

      const history = options.messages.slice(0, -1).map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      const lastMessage = options.messages[options.messages.length - 1];
      const userPrompt = lastMessage?.content || "";

      const chat = model.startChat({ history });
      const result = await chat.sendMessageStream(userPrompt);

      for await (const chunk of result.stream) {
        yield chunk.text();
      }
      return;
    } catch (error: unknown) {
      console.warn(`⚠️ Gemini streaming failed on model '${modelName}', trying candidate fallback:`, error);
      lastError = error;
    }
  }

  console.error("❌ All candidate Google Gemini models failed (streamLLMResponse).");
  const errObj = lastError as { message?: string };
  throw new Error(errObj?.message || "Error streaming response from Google Gemini API.");
}
