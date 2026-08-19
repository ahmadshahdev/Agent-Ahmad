import OpenAI from "openai";
import dotenv from "dotenv";
import { searchVectorStore, loadVectorStore, SearchResult } from "../embeddings/store";

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
  const records = loadVectorStore();
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
      content: r.content,
      sourceFile: r.sourceFile,
      sectionTitle: r.sectionTitle,
      score: 0.5,
    }));
  }

  const scored = records.map((rec) => {
    const textToMatch = `${rec.sectionTitle} ${rec.content} ${rec.sourceFile}`.toLowerCase();
    let matches = 0;
    queryTerms.forEach((term) => {
      if (textToMatch.includes(term)) {
        matches += 1;
      }
    });

    const score = matches / queryTerms.length;
    return {
      id: rec.id,
      content: rec.content,
      sourceFile: rec.sourceFile,
      sectionTitle: rec.sectionTitle,
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
    const skillsRecord = records.find(
      (r) => r.sectionTitle.toLowerCase().includes("skills") || r.content.toLowerCase().includes("technical skills")
    );
    if (skillsRecord && !results.some((r) => r.id === skillsRecord.id)) {
      results = [
        {
          id: skillsRecord.id,
          content: skillsRecord.content,
          sourceFile: skillsRecord.sourceFile,
          sectionTitle: skillsRecord.sectionTitle,
          score: 1.0,
        },
        ...results.slice(0, topK - 1),
      ];
    }
  }

  return results;
}

/**
 * Retrieves the top-K most semantically relevant chunks from the vector store for a given user query.
 * Falls back gracefully to text relevance search if embedding API fails.
 */
export async function retrieveContext(
  query: string,
  topK = 4
): Promise<RetrievedChunk[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const openai = new OpenAI({ apiKey });
      const response = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: query.trim(),
      });

      const queryEmbedding = response.data[0].embedding;
      const results: SearchResult[] = searchVectorStore(queryEmbedding, topK);

      return results.map((res) => ({
        id: res.id,
        content: res.content,
        sourceFile: res.sourceFile,
        sectionTitle: res.sectionTitle,
        score: Math.round(res.score * 1000) / 1000,
      }));
    } catch (err: unknown) {
      console.warn("⚠️ OpenAI Embedding failed (quota/key issue). Using keyword retrieval fallback:", err);
    }
  }

  // Fallback to text matching if OpenAI key missing or failed
  return fallbackTextSearch(query, topK);
}
