import OpenAI from "openai";
import dotenv from "dotenv";
import { searchVectorStore, SearchResult } from "../embeddings/store";

dotenv.config({ path: ".env.local" });
dotenv.config();

const EMBEDDING_MODEL = "text-embedding-3-small";

export interface RetrievedChunk {
  id: string;
  content: string;
  sourceFile: string;
  sectionTitle: string;
  score: number;
}

/**
 * Retrieves the top-K most semantically relevant chunks from the vector store for a given user query.
 */
export async function retrieveContext(
  query: string,
  topK = 4
): Promise<RetrievedChunk[]> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error(
      "❌ ERROR: OPENAI_API_KEY environment variable is missing when invoking retrieveContext."
    );
    throw new Error("Missing OPENAI_API_KEY");
  }

  if (!query || query.trim().length === 0) {
    return [];
  }

  const openai = new OpenAI({ apiKey });

  // Generate embedding for query
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: query.trim(),
  });

  const queryEmbedding = response.data[0].embedding;

  // Perform vector similarity search
  const results: SearchResult[] = searchVectorStore(queryEmbedding, topK);

  return results.map((res) => ({
    id: res.id,
    content: res.content,
    sourceFile: res.sourceFile,
    sectionTitle: res.sectionTitle,
    score: Math.round(res.score * 1000) / 1000,
  }));
}
