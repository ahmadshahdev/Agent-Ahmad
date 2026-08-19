import { retrieveContext, RetrievedChunk } from "./retrieval";
import { SYSTEM_PROMPT } from "./systemPrompt";
import {
  streamLLMResponse,
  invokeLLMWithTools,
  ChatMessage,
} from "../llmClient";
import { ALL_AGENT_TOOLS, executeTool } from "./tools";

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
 * Orchestrates Agent Ahmad logic with Retrieval and Tool-Calling (Function Calling):
 * 1. Retrieves semantically relevant context chunks from vector store
 * 2. Prepares system prompt, context blocks, and user query
 * 3. Calls LLM with tool definitions (e.g. getLatestGithubActivity)
 * 4. If LLM requests a tool call, executes tool server-side and announces action
 * 5. Passes tool results back to LLM to stream final natural language answer
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
    // Initial evaluation with tools enabled
    const llmResult = await invokeLLMWithTools({
      messages,
      systemPrompt: SYSTEM_PROMPT,
      tools: ALL_AGENT_TOOLS,
      model,
    });

    if (llmResult.type === "tool_use" && llmResult.toolCall) {
      const { toolCall, rawContent } = llmResult;

      // Announce tool execution to the visitor
      if (toolCall.name === "getLatestGithubActivity") {
        yield `🔍 *Let me check Ahmad's latest GitHub activity for you...*\n\n`;
      } else {
        yield `⚙️ *Executing tool: ${toolCall.name}...*\n\n`;
      }

      // Execute tool server-side
      let toolResultData: unknown;
      try {
        toolResultData = await executeTool(toolCall.name, toolCall.input);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Failed to execute tool";
        toolResultData = { error: errMsg };
      }

      // Update message history with tool use and tool result
      const updatedMessages: ChatMessage[] = [
        ...messages,
        {
          role: "assistant",
          content: rawContent,
        },
        {
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: toolCall.id,
              content: JSON.stringify(toolResultData),
            },
          ],
        },
      ];

      // Stream the final natural language summary from Claude
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
      }
    }
  }

  return {
    stream: agentStreamGenerator(),
    sources,
  };
}
