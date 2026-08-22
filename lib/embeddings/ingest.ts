import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { chunkMarkdown, MarkdownChunk } from "./chunk";


// DEPRECATED: Persistent store import (kept for comparison)
// import { saveVectorStore, VectorRecord } from "./store";

// Load environment variables from .env / .env.local
dotenv.config({ path: ".env.local" });
dotenv.config();

const EMBEDDING_MODELS = ["gemini-embedding-001", "gemini-embedding-2"];

export interface StoredEmbeddingChunk {
  id: string;
  text: string;
  source: string;
  section: string;
  content: string;
  sourceFile: string;
  sectionTitle: string;
  embedding: number[];
}

export async function ingestKnowledgeBase(): Promise<{
  fileCount: number;
  chunkCount: number;
}> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    console.error(
      "\n❌ ERROR: GEMINI_API_KEY environment variable is not set.\n" +
        "Please create a .env.local file in the project root containing:\n" +
        "GEMINI_API_KEY=your_gemini_api_key_here\n"
    );
    throw new Error("Missing GEMINI_API_KEY");
  }

  const genAI = new GoogleGenerativeAI(apiKey.trim());

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    console.error(`❌ Data directory not found at ${dataDir}`);
    return { fileCount: 0, chunkCount: 0 };
  }

  const files = fs
    .readdirSync(dataDir)
    .filter((file) => file.endsWith(".md"));

  if (files.length === 0) {
    console.warn("⚠️ No markdown files found in data/ directory.");
    return { fileCount: 0, chunkCount: 0 };
  }

  console.log(`\n🔍 Found ${files.length} markdown file(s) in data/:`);
  files.forEach((f) => console.log(`   - data/${f}`));

  const allChunks: MarkdownChunk[] = [];

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const content = fs.readFileSync(filePath, "utf8");
    const fileChunks = chunkMarkdown(filePath, content);
    allChunks.push(...fileChunks);
  }

  console.log(`\n✂️ Chunked into ${allChunks.length} sections (~300-500 tokens each).`);

  let embeddings: number[][] = [];
  let successModel = "";

  for (const modelName of EMBEDDING_MODELS) {
    try {
      console.log(`🧠 Generating embeddings using Google Gemini '${modelName}'...`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const batchResult = await model.batchEmbedContents({
        requests: allChunks.map((c) => ({
          content: { role: "user", parts: [{ text: c.content }] },
        })),
      });

      embeddings = batchResult.embeddings.map((e) => e.values);
      successModel = modelName;
      break;
    } catch (err) {
      console.warn(`⚠️ Batch embedding failed on model '${modelName}', trying candidate fallback:`, err);
    }
  }

  if (embeddings.length === 0) {
    throw new Error("Failed to generate embeddings using Google Gemini API across candidate models.");
  }

  // Build entries for data/embeddings.json
  const embeddingRecords: StoredEmbeddingChunk[] = allChunks.map((chunk, index) => ({
    id: chunk.id,
    text: chunk.content,
    source: chunk.sourceFile,
    section: chunk.sectionTitle,
    content: chunk.content,
    sourceFile: chunk.sourceFile,
    sectionTitle: chunk.sectionTitle,
    embedding: embeddings[index],
  }));

  // DEPRECATED: Previously written to persistent vector store
  // const vectorRecords: VectorRecord[] = allChunks.map((chunk, index) => ({
  //   id: chunk.id,
  //   sourceFile: chunk.sourceFile,
  //   sectionTitle: chunk.sectionTitle,
  //   content: chunk.content,
  //   embedding: embeddings[index],
  // }));
  // saveVectorStore(vectorRecords);

  const outputPath = path.join(dataDir, "embeddings.json");

  try {
    fs.writeFileSync(outputPath, JSON.stringify(embeddingRecords, null, 2), "utf8");
    console.log(`\n✅ Ingestion Complete using '${successModel}'!`);
    console.log(
      `📊 Successfully wrote ${embeddingRecords.length} chunks from ${files.length} files to ${outputPath}`
    );
  } catch (error) {
    console.error(`❌ ERROR: Failed to write embeddings file to ${outputPath}:`, error);
    process.exit(1);
  }

  return { fileCount: files.length, chunkCount: allChunks.length };
}

