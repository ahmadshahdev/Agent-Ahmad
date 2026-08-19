import { retrieveContext, RetrievedChunk } from "./retrieval";
import { SYSTEM_PROMPT } from "./systemPrompt";
import {
  streamLLMResponse,
  invokeLLMWithTools,
  ChatMessage,
} from "../llmClient";
import { ALL_GEMINI_TOOLS, executeTool } from "./tools";

export interface AgentSource {
  id: string;
  sourceFile: string;
  sectionTitle: string;
  score: number;
}

export interface RunAgentInput {
  message: string;
  history?: ChatMessage[];
  topK?: number;
  model?: string;
}

export interface RunAgentOutput {
  stream: AsyncGenerator<string, void, unknown>;
  sources: AgentSource[];
}

/**
 * Orchestrates Agent Ahmad logic using Google Gemini API & Function Calling:
 * 1. Retrieves semantically relevant context chunks from vector store
 * 2. Prepares system prompt, context blocks, and user query
 * 3. Calls Google Gemini with tool definitions (e.g. getLatestGithubActivity)
 * 4. If Gemini requests a tool call, executes tool server-side and announces action
 * 5. Passes tool results back to Gemini to stream final natural language answer
 */
export async function runAgent({
  message,
  history = [],
  topK = 4,
  model,
}: RunAgentInput): Promise<RunAgentOutput> {
  let retrievedChunks: RetrievedChunk[] = [];

  // 1. Vector store context retrieval
  try {
    retrievedChunks = await retrieveContext(message, topK);
  } catch (error) {
    console.warn("⚠️ Retrieval lookup failed or skipped:", error);
    retrievedChunks = [];
  }

  // 2. Format knowledge base context
  let contextText = "";
  if (retrievedChunks.length > 0) {
    contextText = retrievedChunks
      .map(
        (chunk, idx) =>
          `[Source ${idx + 1}: ${chunk.sourceFile} | Section: ${chunk.sectionTitle}]\n${chunk.content}`
      )
      .join("\n\n");
  } else {
    contextText = "No relevant context found in Ahmad's static knowledge base for this query.";
  }

  // 3. Construct prompt with injected context
  const userContentWithContext = `Retrieved Static Knowledge Base Context:
---
${contextText}
---

User Query: ${message}`;

  const formattedHistory: ChatMessage[] = history.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  const messages: ChatMessage[] = [
    ...formattedHistory,
    {
      role: "user",
      content: userContentWithContext,
    },
  ];

  const sources: AgentSource[] = retrievedChunks.map((chunk) => ({
    id: chunk.id,
    sourceFile: chunk.sourceFile,
    sectionTitle: chunk.sectionTitle,
    score: chunk.score,
  }));

  // 4. Create generator to handle tool execution & streaming output
  async function* agentStreamGenerator(): AsyncGenerator<string, void, unknown> {
    try {
      // Initial evaluation with Gemini tools enabled
      const llmResult = await invokeLLMWithTools({
        messages,
        systemPrompt: SYSTEM_PROMPT,
        tools: ALL_GEMINI_TOOLS,
        model,
      });

      if (llmResult.type === "tool_use" && llmResult.toolCall) {
        const { toolCall } = llmResult;

        // Announce tool execution to the visitor
        if (toolCall.name === "getLatestGithubActivity") {
          yield `🔍 *Let me check Ahmad's latest GitHub activity for you...*\n\n`;
        } else {
          yield `⚙️ *Executing tool: ${toolCall.name}...*\n\n`;
        }

        // Execute tool server-side
        let toolResultData: unknown;
        try {
          toolResultData = await executeTool(toolCall.name, toolCall.args);
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : "Failed to execute tool";
          toolResultData = { error: errMsg };
        }

        // Pass tool result back to Gemini
        const updatedUserQuery = `${message}\n\nLive GitHub Tool Data Result:\n${JSON.stringify(
          toolResultData
        )}`;

        const updatedMessages: ChatMessage[] = [
          ...formattedHistory,
          {
            role: "user",
            content: `Retrieved Static Knowledge Base Context:\n---\n${contextText}\n---\n\nUser Query with Live Data:\n${updatedUserQuery}`,
          },
        ];

        // Stream final natural language summary from Gemini
        for await (const chunk of streamLLMResponse({
          messages: updatedMessages,
          systemPrompt: SYSTEM_PROMPT,
          model,
        })) {
          yield chunk;
        }
      } else {
        // If no tool call was requested, stream or yield text output
        if (llmResult.text) {
          yield llmResult.text;
        } else {
          for await (const chunk of streamLLMResponse({
            messages,
            systemPrompt: SYSTEM_PROMPT,
            model,
          })) {
            yield chunk;
          }
        }
      }
    } catch (err: unknown) {
      console.error("❌ Agent stream error:", err);
      const errMsg =
        err instanceof Error ? err.message : "An unexpected AI connection error occurred.";
      yield `⚠️ **Agent Ahmad Setup Notice:**\n\n${errMsg}\n\n*Quick Fix:* Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to get a free API Key, then set \`GEMINI_API_KEY=AIzaSy...\` in your \`.env.local\` file!`;
    }
  }

  return {
    stream: agentStreamGenerator(),
    sources,
  };
}
