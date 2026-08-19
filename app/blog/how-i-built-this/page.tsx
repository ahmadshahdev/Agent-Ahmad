import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  Cpu,
  Database,
  Zap,
  GitBranch,
  ArrowRight,
  ShieldCheck,
  Layers,
  Server,
} from "lucide-react";

export const metadata = {
  title: `How I Built Agent Ahmad | Architecture & RAG Pipeline`,
  description:
    "Deep dive into the technical architecture of Agent Ahmad: Retrieval-Augmented Generation (RAG), vector store persistence, Anthropic Claude tool execution, and serverless optimization on Vercel.",
};

export default function ArchitectureBlogPage() {
  return (
    <article className="max-w-4xl mx-auto space-y-3xl py-md">
      {/* Article Header */}
      <header className="space-y-md border-b border-neutralLight-border pb-xl">
        <div className="inline-flex items-center gap-xs px-sm py-1 rounded-full bg-primary-light border border-primary-border text-xs font-body font-semibold text-primary">
          <Layers className="w-3.5 h-3.5" />
          <span>System Architecture & Engineering Breakdown</span>
        </div>

        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-neutralDark leading-tight">
          How I Built <span className="text-primary">{siteConfig.agentName}</span>: RAG & Tool-Calling Agent Architecture
        </h1>

        <p className="font-body text-base sm:text-lg text-neutralLight-muted leading-relaxed">
          An in-depth technical breakdown of how I transformed a standard personal portfolio into an interactive, grounded AI agent experience powered by Next.js 14, OpenAI embeddings, a custom vector store, and Anthropic Claude function calling.
        </p>

        <div className="flex flex-wrap items-center gap-md pt-xs text-xs font-body text-neutralLight-muted border-t border-neutralLight-border/60">
          <span className="flex items-center gap-1 font-medium text-neutralDark">
            Author: {siteConfig.name}
          </span>
          <span>•</span>
          <span>Topic: RAG Pipeline & AI Agents</span>
          <span>•</span>
          <span className="text-primary font-semibold">10 min read</span>
        </div>
      </header>

      {/* Overview & High-Level Architecture */}
      <section className="space-y-lg">
        <h2 className="font-heading font-bold text-2xl text-neutralDark flex items-center gap-xs">
          <Cpu className="w-6 h-6 text-primary" />
          High-Level Architecture
        </h2>

        <p className="font-body text-neutralDark-muted leading-relaxed">
          Traditional personal websites are static documents—visitors read text and click links manually. <strong>Agent Ahmad</strong> elevates this experience by introducing a grounded conversational delegate that answers questions directly using verified background data and live server actions.
        </p>

        {/* Text-based Architecture Flow Diagram Box */}
        <div className="bg-neutralDark text-white p-lg rounded-2xl border border-neutralDark-muted shadow-card font-mono text-xs overflow-x-auto space-y-3">
          <div className="text-primary-bright font-bold border-b border-neutralDark-muted/60 pb-xs flex items-center justify-between">
            <span>SYSTEM_FLOW_DIAGRAM.txt</span>
            <span className="text-[10px] text-neutralLight-lightMuted">End-to-End Pipeline</span>
          </div>

          <pre className="text-neutralLight-lightMuted leading-relaxed">
{`┌─────────────────────────────────────────────────────────────────────────┐
│                           1. INGESTION PHASE                            │
│  [ data/bio.md | data/projects.md | data/resume.md ]                   │
│                              │                                          │
│                    chunkMarkdownSections()                              │
│                              │                                          │
│                OpenAI text-embedding-3-small                            │
│                              │                                          │
│                [ vectorstore/store.json ]  <── Bundled in Repository    │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────────┐
│                        2. USER QUERY & RETRIEVAL                        │
│  User Input: "What projects has Ahmad built?"                           │
│                              │                                          │
│                retrieveContext(query, topK=4)                           │
│                              │                                          │
│                In-Memory Cosine Similarity Match                        │
│                              │                                          │
│        [ Top 4 Context Chunks + Source Labels Formatted ]               │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────────┐
│                    3. ORCHESTRATION & TOOL EXECUTION                    │
│   Anthropic Claude API (claude-3-7-sonnet-20250219 / claude-sonnet-4-6) │
│   Tools Passed: [ getLatestGithubActivity ]                             │
│                              │                                          │
│   ───► If Tool Call requested:                                         │
│        1. Announce action ("Let me check GitHub...")                    │
│        2. Execute GitHub REST API server-side                           │
│        3. Append tool_result to message chain                           │
│                                                                         │
│   ───► Stream final natural language tokens to client                   │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────────┐
│                    4. CLIENT STREAMING INTERFACE                        │
│   Next.js API Route (/api/chat) -> Web ReadableStream + X-Sources Header│
│   ChatWidget.tsx -> Token-by-token rendering + Source Citation tags     │
└─────────────────────────────────────────────────────────────────────────┘`}
          </pre>
        </div>
      </section>

      {/* Component Breakdown 1: RAG Data Pipeline */}
      <section className="space-y-md border-t border-neutralLight-border pt-xl">
        <h2 className="font-heading font-bold text-2xl text-neutralDark flex items-center gap-xs">
          <Database className="w-6 h-6 text-primary" />
          1. Retrieval-Augmented Generation (RAG) Pipeline
        </h2>

        <p className="font-body text-neutralDark-muted leading-relaxed">
          LLMs suffer from hallucinations when asked specific questions about individuals. To solve this, Agent Ahmad enforces <strong>Strict Context Grounding</strong>:
        </p>

        <ul className="space-y-xs list-disc list-inside font-body text-neutralDark-muted text-sm pl-2">
          <li><strong>Document Parsing & Chunking:</strong> The ingestion script (<code className="text-primary bg-primary-light px-1.5 py-0.5 rounded font-mono">scripts/ingest.ts</code>) processes raw Markdown files (<code className="text-primary bg-primary-light px-1.5 py-0.5 rounded font-mono">bio.md</code>, <code className="text-primary bg-primary-light px-1.5 py-0.5 rounded font-mono">projects.md</code>, <code className="text-primary bg-primary-light px-1.5 py-0.5 rounded font-mono">resume.md</code>) using header hierarchy chunking (<code className="text-primary bg-primary-light px-1.5 py-0.5 rounded font-mono">lib/embeddings/chunk.ts</code>).</li>
          <li><strong>Embedding Generation:</strong> Each chunk is converted into a 1536-dimensional vector using OpenAI&apos;s <code className="text-primary bg-primary-light px-1.5 py-0.5 rounded font-mono">text-embedding-3-small</code> model.</li>
          <li><strong>Vector Store Persistence:</strong> Vectors are stored directly in <code className="text-primary bg-primary-light px-1.5 py-0.5 rounded font-mono">vectorstore/store.json</code>.</li>
        </ul>

        {/* Code Snippet Box */}
        <div className="bg-surface rounded-xl border border-neutralLight-border p-md space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-neutralLight-muted text-[11px] pb-1 border-b border-neutralLight-border">
            <span>lib/embeddings/store.ts</span>
            <span>Cosine Similarity Engine</span>
          </div>
          <pre className="text-neutralDark overflow-x-auto">
{`export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return (normA === 0 || normB === 0) ? 0 : dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}`}
          </pre>
        </div>
      </section>

      {/* Component Breakdown 2: Tool Execution */}
      <section className="space-y-md border-t border-neutralLight-border pt-xl">
        <h2 className="font-heading font-bold text-2xl text-neutralDark flex items-center gap-xs">
          <GitBranch className="w-6 h-6 text-primary" />
          2. Server-Side Function Calling & Live GitHub Tools
        </h2>

        <p className="font-body text-neutralDark-muted leading-relaxed">
          What makes Agent Ahmad an <em>AI Agent</em> rather than a passive chatbot is its ability to take real-world server actions.
        </p>

        <div className="p-md rounded-xl bg-primary-light/50 border border-primary-border space-y-2">
          <h3 className="font-heading font-semibold text-sm text-primary flex items-center gap-1.5">
            <Zap className="w-4 h-4" />
            Live GitHub Activity Tool (<code className="font-mono text-xs">getLatestGithubActivity</code>)
          </h3>
          <p className="font-body text-xs text-neutralDark-muted leading-relaxed">
            When a visitor asks <em>&quot;What has Ahmad been working on lately?&quot;</em>, static data is insufficient. The agent invokes the GitHub REST API server-side, fetches live public repositories, and summarizes real, up-to-date activity.
          </p>
        </div>
      </section>

      {/* Component Breakdown 3: Vercel Free-Tier Serverless Optimization */}
      <section className="space-y-md border-t border-neutralLight-border pt-xl">
        <h2 className="font-heading font-bold text-2xl text-neutralDark flex items-center gap-xs">
          <Server className="w-6 h-6 text-primary" />
          3. Vercel Free-Tier Serverless Optimization Analysis
        </h2>

        <p className="font-body text-neutralDark-muted leading-relaxed">
          Deploying AI applications on Vercel&apos;s free tier presents specific architectural constraints:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md pt-xs">
          <div className="p-md rounded-xl bg-surface border border-neutralLight-border space-y-2">
            <h4 className="font-heading font-semibold text-sm text-neutralDark flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              File-Backed JSON Vector Store
            </h4>
            <p className="font-body text-xs text-neutralLight-muted leading-relaxed">
              Standard local vector database daemons (like local ChromaDB servers) fail on Vercel because serverless lambdas are ephemeral. Bundling <code className="font-mono text-primary">vectorstore/store.json</code> inside the deployment allows in-memory vector loading in <strong>~1ms</strong> with zero extra database costs!
            </p>
          </div>

          <div className="p-md rounded-xl bg-surface border border-neutralLight-border space-y-2">
            <h4 className="font-heading font-semibold text-sm text-neutralDark flex items-center gap-1">
              <Zap className="w-4 h-4 text-primary" />
              Response Token Streaming
            </h4>
            <p className="font-body text-xs text-neutralLight-muted leading-relaxed">
              Vercel limits serverless execution time. By streaming responses via Web <code className="font-mono text-primary">ReadableStream</code>, response chunks begin transferring immediately, avoiding gateway timeout limits and giving visitors instant feedback.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Navigation CTA */}
      <footer className="border-t border-neutralLight-border pt-xl flex flex-col sm:flex-row items-center justify-between gap-md">
        <div>
          <h3 className="font-heading font-bold text-lg text-neutralDark">
            Ready to test Agent Ahmad?
          </h3>
          <p className="font-body text-xs text-neutralLight-muted">
            Click the floating chat widget on the bottom-right corner to start a conversation!
          </p>
        </div>

        <Link
          href="/projects"
          className="inline-flex items-center gap-xs px-lg py-md rounded-xl bg-primary text-surface font-body font-semibold hover:bg-primary-hover transition-all shadow-subtle hover:shadow-card-hover"
        >
          <span>Explore Projects</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </footer>
    </article>
  );
}
