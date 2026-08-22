import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// DEPRECATED: Persistent store vector query module (kept for comparison/reference)
// import { searchVectorStore, loadVectorStore, SearchResult } from "../embeddings/store";

dotenv.config({ path: ".env.local" });
dotenv.config();

const EMBEDDING_MODELS = ["gemini-embedding-001", "gemini-embedding-2"];

export interface RetrievedChunk {
  id: string;
  content: string;
  sourceFile: string;
  sectionTitle: string;
  score: number;
}

export interface StoredEmbeddingChunk {
  id: string;
  text: string;
  source: string;
  section: string;
  content?: string;
  sourceFile?: string;
  sectionTitle?: string;
  embedding: number[];
}

// Module-level in-memory cache for data/embeddings.json across serverless instances
let cachedEmbeddings: StoredEmbeddingChunk[] | null = null;

function loadEmbeddings(): StoredEmbeddingChunk[] {
  if (cachedEmbeddings) {
    return cachedEmbeddings;
  }

  const embeddingsPath = path.join(process.cwd(), "data", "embeddings.json");
  if (!fs.existsSync(embeddingsPath)) {
    console.warn(`⚠️ Embeddings file not found at ${embeddingsPath}`);
    return [];
  }

  try {
    const raw = fs.readFileSync(embeddingsPath, "utf8");
    cachedEmbeddings = JSON.parse(raw) as StoredEmbeddingChunk[];
    return cachedEmbeddings;
  } catch (error) {
    console.error(`❌ Failed to read embeddings from ${embeddingsPath}:`, error);
    return [];
  }
}

/**
 * Computes cosine similarity between two numeric vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

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
 * Expands query terms with relevant domain synonyms to improve keyword matching.
 */
function expandQueryTerms(terms: string[]): string[] {
  const expanded = new Set<string>(terms);

  terms.forEach((term) => {
    if (["stack", "tech", "technology", "technologies", "skill", "skills", "tools"].includes(term)) {
      ["skills", "technical", "technologies", "stack", "frontend", "backend", "ai", "tools", "experience"].forEach(
        (s) => expanded.add(s)
      );
    }
    if (["experience", "work", "job", "career", "history"].includes(term)) {
      ["experience", "work", "senior", "engineer", "highlights", "period", "background"].forEach(
        (s) => expanded.add(s)
      );
    }
    if (["projects", "built", "apps", "portfolio", "created"].includes(term)) {
      ["projects", "engineering", "showcase", "description", "category", "app"].forEach(
        (s) => expanded.add(s)
      );
    }
  });

  return Array.from(expanded);
}

/**
 * Keyword-based text relevance search fallback when embedding API quota is unavailable.
 */
function fallbackTextSearch(query: string, topK = 4): RetrievedChunk[] {
  // DEPRECATED: const records = loadVectorStore();
  const records = loadEmbeddings();
  if (!records || records.length === 0) return [];

  const rawTerms = query
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((t) => t.length > 2);

  const queryTerms = expandQueryTerms(rawTerms);

  if (queryTerms.length === 0) {
    return records.slice(0, topK).map((r) => ({
      id: r.id,
      content: r.content || r.text || "",
      sourceFile: r.sourceFile || r.source || "",
      sectionTitle: r.sectionTitle || r.section || "",
      score: 0.5,
    }));
  }

  const scored = records.map((rec) => {
    const content = rec.content || rec.text || "";
    const sourceFile = rec.sourceFile || rec.source || "";
    const sectionTitle = rec.sectionTitle || rec.section || "";
    const textToMatch = `${sectionTitle} ${content} ${sourceFile}`.toLowerCase();
    let matches = 0;
    queryTerms.forEach((term) => {
      if (textToMatch.includes(term)) {
        matches += 1;
      }
    });

    const score = matches / queryTerms.length;
    return {
      id: rec.id,
      content,
      sourceFile,
      sectionTitle,
      score: Math.round(score * 1000) / 1000,
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Guarantee that if the user asks about skills or tech stack, the Technical Skills section is included
  const isSkillsQuery = rawTerms.some((t) =>
    ["stack", "tech", "technology", "skill", "skills", "tools", "what", "know", "use"].includes(t)
  );

  let results = scored.slice(0, topK);

  if (isSkillsQuery) {
    const skillsRecord = records.find((r) => {
      const sec = (r.sectionTitle || r.section || "").toLowerCase();
      const con = (r.content || r.text || "").toLowerCase();
      return sec.includes("skills") || con.includes("technical skills");
    });
    if (skillsRecord && !results.some((r) => r.id === skillsRecord.id)) {
      results = [
        {
          id: skillsRecord.id,
          content: skillsRecord.content || skillsRecord.text || "",
          sourceFile: skillsRecord.sourceFile || skillsRecord.source || "",
          sectionTitle: skillsRecord.sectionTitle || skillsRecord.section || "",
          score: 1.0,
        },
        ...results.slice(0, topK - 1),
      ];
    }
  }

  return results;
}

/**
 * Retrieves the top-K most semantically relevant chunks from memory (data/embeddings.json) for a given user query.
 * Falls back gracefully to text relevance search if embedding API fails.
 */
export async function retrieveContext(
  query: string,
  topK = 4
): Promise<RetrievedChunk[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim()) {
    const genAI = new GoogleGenerativeAI(apiKey.trim());

    for (const modelName of EMBEDDING_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const res = await model.embedContent(query.trim());
        const queryEmbedding = res.embedding.values;

        // DEPRECATED: const results: SearchResult[] = searchVectorStore(queryEmbedding, topK);

        const records = loadEmbeddings();
        if (records.length === 0) {
          return fallbackTextSearch(query, topK);
        }

        const scored = records.map((rec) => ({
          id: rec.id,
          content: rec.content || rec.text || "",
          sourceFile: rec.sourceFile || rec.source || "",
          sectionTitle: rec.sectionTitle || rec.section || "",
          score: cosineSimilarity(queryEmbedding, rec.embedding),
        }));

        scored.sort((a, b) => b.score - a.score);

        return scored.slice(0, topK).map((res) => ({
          id: res.id,
          content: res.content,
          sourceFile: res.sourceFile,
          sectionTitle: res.sectionTitle,
          score: Math.round(res.score * 1000) / 1000,
        }));
      } catch (err: unknown) {
        console.warn(`⚠️ Gemini Embedding query failed on model '${modelName}':`, err);
      }
    }
  }

  // Fallback to text matching if Gemini key missing or failed
  return fallbackTextSearch(query, topK);
}

