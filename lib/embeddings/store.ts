import fs from "fs";
import path from "path";

export interface VectorRecord {
  id: string;
  sourceFile: string;
  sectionTitle: string;
  content: string;
  embedding: number[];
}

export interface SearchResult {
  id: string;
  sourceFile: string;
  sectionTitle: string;
  content: string;
  score: number;
}

const VECTORSTORE_DIR = path.join(process.cwd(), "vectorstore");
const VECTORSTORE_FILE = path.join(VECTORSTORE_DIR, "store.json");

/**
 * Persists vector records to vectorstore/store.json
 */
export function saveVectorStore(records: VectorRecord[]): void {
  if (!fs.existsSync(VECTORSTORE_DIR)) {
    fs.mkdirSync(VECTORSTORE_DIR, { recursive: true });
  }

  fs.writeFileSync(VECTORSTORE_FILE, JSON.stringify(records, null, 2), "utf8");
}

/**
 * Loads vector records from vectorstore/store.json
 */
export function loadVectorStore(): VectorRecord[] {
  if (!fs.existsSync(VECTORSTORE_FILE)) {
    return [];
  }

  try {
    const raw = fs.readFileSync(VECTORSTORE_FILE, "utf8");
    return JSON.parse(raw) as VectorRecord[];
  } catch (error) {
    console.error("Failed to load vector store file:", error);
    return [];
  }
}

/**
 * Computes cosine similarity between two embedding vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error(`Vector dimension mismatch: ${vecA.length} vs ${vecB.length}`);
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Searches vector store for top-K most similar records to queryEmbedding
 */
export function searchVectorStore(
  queryEmbedding: number[],
  topK = 4
): SearchResult[] {
  const records = loadVectorStore();
  if (records.length === 0) {
    return [];
  }

  const scored = records.map((rec) => ({
    id: rec.id,
    sourceFile: rec.sourceFile,
    sectionTitle: rec.sectionTitle,
    content: rec.content,
    score: cosineSimilarity(queryEmbedding, rec.embedding),
  }));

  // Sort descending by similarity score
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}
