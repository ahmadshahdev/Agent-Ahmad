# Agent Ahmad — Interactive AI Portfolio & RAG Agent System

> A modern, full-stack personal portfolio and interactive AI agent experience built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **OpenAI Embeddings**, and **Anthropic Claude (Tool Calling)**.

![Agent Ahmad Architecture](https://raw.githubusercontent.com/ahmadshahdev/Agent-Ahmad/main/public/og-image.png)

---

## 🌟 Overview

**Agent Ahmad** elevates traditional portfolio websites by embedding a grounded, conversational AI agent directly on the page. Visitors can chat with "Agent Ahmad" to inquire about Ahmad's experience, technical stack, skills, and projects, or execute live actions like fetching current GitHub activity.

### Key Features
- **🤖 Grounded AI Agent ("Agent Ahmad")**: Answers questions strictly based on Ahmad's knowledge base (`data/bio.md`, `data/projects.md`, `data/resume.md`).
- **📚 Retrieval-Augmented Generation (RAG)**: Uses OpenAI `text-embedding-3-small` and in-memory cosine similarity search to inject relevant context into LLM prompts with source citations.
- **⚡ Live Function Calling / Tool Execution**: Integrates server-side tools (e.g. `getLatestGithubActivity`) to fetch real-time public GitHub activity via REST API.
- **🌊 Streaming Token UI**: Streams answers token-by-token using Next.js Web Streams (`ReadableStream`) with custom source citation tags (`X-Sources`).
- **📱 Fully Responsive & Accessible**: Custom floating chat widget with full-screen overlay for mobile (375px+), keyboard shortcuts (`Escape` to close), and loading skeleton states.
- **🚀 100% Vercel Serverless Ready**: Designed without heavy external database daemons to ensure fast cold starts (~1ms) and 0 extra hosting cost.

---

## 🏗️ Architecture & Pipeline Flow

```text
┌─────────────────────────────────────────────────────────────────────────┐
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
└─────────────────────────────────────────────────────────────────────────┘
```

---

## ☁️ Vercel Free-Tier Serverless Compatibility & Persistence

> **Important Note for Vercel Deployment:**
>
> 1. **Vector Store Persistence:** Local database daemons (like local ChromaDB SQLite instances) do not survive Vercel's ephemeral serverless cold starts. To guarantee 100% reliability on Vercel's free tier, vector records are persisted to `vectorstore/store.json`.
> 2. **Pre-Deploy Ingestion Step:** You **must** run `npm run ingest` before committing code or pushing to Vercel (or include `npm run ingest` as a build command) so that `vectorstore/store.json` is generated and bundled into Vercel's build artifact.
> 3. **Streaming Support:** The chat route `/api/chat` utilizes Next.js Web `ReadableStream` to stream text tokens directly, bypassing standard Vercel gateway timeout limits.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS (Custom Color System & Tokens) |
| **Embeddings** | OpenAI `text-embedding-3-small` |
| **LLM Orchestration** | Anthropic `@anthropic-ai/sdk` (`claude-3-7-sonnet-20250219`) |
| **Vector Engine** | Custom File-Backed Store (`vectorstore/store.json`) & Cosine Similarity |
| **Icons & UI** | `lucide-react`, `react-markdown` |

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js 18.x or 20.x
- npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/ahmadshahdev/Agent-Ahmad.git
cd Agent-Ahmad
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

Add your API keys to `.env.local`:
```env
# Required for vector embeddings generation
OPENAI_API_KEY=sk-proj-your_openai_key

# Required for Agent Ahmad Claude responses & tool calls
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key

# GitHub Username for live tool execution
GITHUB_USERNAME=ahmadshahdev

# Optional model override
ANTHROPIC_MODEL=claude-3-7-sonnet-20250219
```

### 3. Run Ingestion Script
Parse Markdown knowledge sources in `data/` and generate embeddings:
```bash
npm run ingest
```

### 4. Test Pipelines (CLI Validation)
Test retrieval vector search:
```bash
npm run test:retrieval "What projects has Ahmad built?"
```

Test full AI Agent chain and GitHub tool calling:
```bash
npm run test:agent "What has Ahmad been working on lately?"
```

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the application and chat widget.

---

## 📜 Available NPM Scripts

- `npm run dev`: Starts local Next.js development server.
- `npm run build`: Runs TypeScript verification, ESLint, and creates Next.js production build.
- `npm run ingest`: Parses Markdown files in `data/` and generates embeddings into `vectorstore/store.json`.
- `npm run test:retrieval`: CLI script to test vector store cosine similarity retrieval.
- `npm run test:agent`: CLI script to test Agent Ahmad orchestration and tool execution.

---

## 📄 License
Licensed under the [MIT License](LICENSE).
