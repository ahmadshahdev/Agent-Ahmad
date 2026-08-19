import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
import { chunkMarkdown, MarkdownChunk } from "./chunk";
import { saveVectorStore, VectorRecord } from "./store";

// Load environment variables from .env / .env.local
dotenv.config({ path: ".env.local" });
dotenv.config();

const EMBEDDING_MODEL = "text-embedding-3-small";

export async function ingestKnowledgeBase(): Promise<{
  fileCount: number;
  chunkCount: number;
}> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error(
      "\n❌ ERROR: OPENAI_API_KEY environment variable is not set.\n" +
        "Please create a .env.local file in the project root containing:\n" +
        "OPENAI_API_KEY=your_openai_api_key_here\n"
    );
    throw new Error("Missing OPENAI_API_KEY");
  }

  const openai = new OpenAI({ apiKey });

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
  console.log(`🧠 Generating embeddings using '${EMBEDDING_MODEL}'...`);

  // Batch generate embeddings via OpenAI API
  const inputs = allChunks.map((c) => c.content);

  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: inputs,
  });

  const vectorRecords: VectorRecord[] = allChunks.map((chunk, index) => ({
    id: chunk.id,
    sourceFile: chunk.sourceFile,
    sectionTitle: chunk.sectionTitle,
    content: chunk.content,
    embedding: response.data[index].embedding,
  }));

  saveVectorStore(vectorRecords);

  console.log(`\n✅ Ingestion Complete!`);
  console.log(
    `📊 Ingested ${allChunks.length} chunks from ${files.length} files into vectorstore/`
  );

  return { fileCount: files.length, chunkCount: allChunks.length };
}
