import { retrieveContext, RetrievedChunk } from "./retrieval";
import { SYSTEM_PROMPT } from "./systemPrompt";
import { streamLLMResponse, ChatMessage } from "../llmClient";

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
 * Orchestrates the Agent Ahmad backend chain:
 * 1. Performs vector search retrieval for relevant context chunks
 * 2. Formats retrieved knowledge with clear source labels
 * 3. Assembles system prompt, conversation history, and user query with context
 * 4. Invokes the streaming LLM client
 * 5. Returns stream + source metadata for frontend citation display
 */
export async function runAgent({
  message,
  history = [],
  topK = 4,
  model,
}: RunAgentInput): Promise<RunAgentOutput> {
  let retrievedChunks: RetrievedChunk[] = [];

  // 1. Retrieve relevant context chunks
  try {
    retrievedChunks = await retrieveContext(message, topK);
  } catch (error) {
    console.warn("⚠️ Retrieval lookup failed or skipped:", error);
    retrievedChunks = [];
  }

  // 2. Format context string with source labels
  let contextText = "";
  if (retrievedChunks.length > 0) {
    contextText = retrievedChunks
      .map(
        (chunk, idx) =>
          `[Source ${idx + 1}: ${chunk.sourceFile} | Section: ${chunk.sectionTitle}]\n${chunk.content}`
      )
      .join("\n\n");
  } else {
    contextText = "No relevant context found in Ahmad's knowledge base for this query.";
  }

  // 3. Construct user prompt with injected context
  const userContentWithContext = `Retrieved Knowledge Base Context:
---
${contextText}
---

User Query: ${message}`;

  // 4. Construct messages history chain
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

  // 5. Extract sources for citation display
  const sources: AgentSource[] = retrievedChunks.map((chunk) => ({
    id: chunk.id,
    sourceFile: chunk.sourceFile,
    sectionTitle: chunk.sectionTitle,
    score: chunk.score,
  }));

  // 6. Execute streaming LLM response
  const stream = streamLLMResponse({
    messages,
    systemPrompt: SYSTEM_PROMPT,
    model,
  });

  return {
    stream,
    sources,
  };
}
