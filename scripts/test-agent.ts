import { runAgent } from "../lib/agent/runAgent";

async function main() {
  const query = process.argv[2] || "What projects has Ahmad built?";
  console.log(`🤖 Testing Agent Ahmad with query: "${query}"\n`);

  try {
    const { stream, sources } = await runAgent({ message: query });

    console.log("📚 Retrieved Sources:");
    if (sources.length === 0) {
      console.log("   (No sources retrieved)\n");
    } else {
      sources.forEach((src, idx) => {
        console.log(
          `   ${idx + 1}. [File: ${src.sourceFile}] ${src.sectionTitle} (Score: ${src.score})`
        );
      });
      console.log("");
    }

    console.log("💬 Agent Response:");
    console.log("----------------------------------------");
    for await (const chunk of stream) {
      process.stdout.write(chunk);
    }
    console.log("\n----------------------------------------\n");
    console.log("✅ Stream completed successfully.");
  } catch (error: any) {
    console.error("❌ Agent execution error:", error?.message || error);
    process.exit(1);
  }
}

main();
