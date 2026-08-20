import { retrieveContext } from "../lib/agent/retrieval";

async function test() {
  const query = process.argv[2] || "What is Ahmad's experience with Next.js and AI?";
  console.log(`\n🔍 Searching vector store for query: "${query}"...\n`);

  try {
    const results = await retrieveContext(query, 4);

    if (results.length === 0) {
      console.log("⚠️ No relevant context found. (Did you run 'npm run ingest' first?)");
      return;
    }

    console.log(`✅ Found ${results.length} relevant chunk(s):\n`);
    results.forEach((chunk, i) => {
      console.log(`--- [Rank ${i + 1}] (Score: ${chunk.score}) ---`);
      console.log(`Source: ${chunk.sourceFile} > ${chunk.sectionTitle}`);
      console.log(`Content:\n${chunk.content}\n`);
    });
  } catch (error: any) {
    if (error.message !== "Missing GEMINI_API_KEY") {
      console.error("❌ Retrieval test error:", error);
    }
  }
}

test();
