import { ingestKnowledgeBase } from "../lib/embeddings/ingest";

async function main() {
  console.log("🚀 Starting Knowledge Base Vector Ingestion Pipeline...");
  try {
    await ingestKnowledgeBase();
    process.exit(0);
  } catch (error: any) {
    if (error.message !== "Missing GEMINI_API_KEY") {
      console.error("\n❌ Ingestion failed with error:", error);
    }
    process.exit(1);
  }
}

main();
