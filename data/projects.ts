export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  category: "AI & ML" | "Full-Stack" | "Developer Tools" | "Web App";
  metrics?: string;
}

export const PROJECTS_DATA: Project[] = [
  {
    id: "agentic-rag-engine",
    title: "Agentic RAG Knowledge Engine",
    description:
      "Autonomous retrieval-augmented generation engine with dynamic hybrid search, reranking, and self-correction guardrails.",
    tags: ["Next.js 14", "TypeScript", "LangChain", "Vector Store", "Tailwind CSS"],
    githubUrl: "https://github.com/ahmadshahdev/Agent-Ahmad",
    liveUrl: "https://agent-ahmad.vercel.app",
    featured: true,
    category: "AI & ML",
    metrics: "Sub-200ms query latency",
  },
  {
    id: "dev-pulse-analytics",
    title: "DevPulse Cloud Observability",
    description:
      "Real-time microservices monitoring dashboard with predictive anomaly detection and interactive telemetry charts.",
    tags: ["React", "TypeScript", "Node.js", "WebSockets", "Tailwind CSS"],
    githubUrl: "https://github.com/ahmadshahdev/dev-pulse",
    liveUrl: "https://dev-pulse.example.com",
    featured: true,
    category: "Full-Stack",
    metrics: "10k+ events/sec",
  },
  {
    id: "nexus-commerce-ai",
    title: "Nexus AI E-Commerce Suite",
    description:
      "Next-gen storefront featuring AI-powered personalized visual recommendations, instant search, and headless architecture.",
    tags: ["Next.js 14", "Tailwind CSS", "Stripe", "PostgreSQL", "Prisma"],
    githubUrl: "https://github.com/ahmadshahdev/nexus-commerce",
    liveUrl: "https://nexus-commerce.example.com",
    featured: true,
    category: "Web App",
    metrics: "99.9% uptime",
  },
  {
    id: "code-craft-cli",
    title: "CodeCraft AI CLI Assistant",
    description:
      "Terminal-native developer tool for automated code generation, git diff explanations, and automated refactoring pipelines.",
    tags: ["Node.js", "TypeScript", "OpenAI API", "CLI"],
    githubUrl: "https://github.com/ahmadshahdev/code-craft-cli",
    featured: false,
    category: "Developer Tools",
    metrics: "1.2k npm downloads",
  },
  {
    id: "synth-voice-studio",
    title: "SynthVoice AI Workspace",
    description:
      "Browser-based audio generation and synthesis suite with low-latency streaming audio processing and custom voice fine-tuning.",
    tags: ["React", "Web Audio API", "Python", "FastAPI", "Tailwind CSS"],
    githubUrl: "https://github.com/ahmadshahdev/synth-voice",
    liveUrl: "https://synth-voice.example.com",
    featured: false,
    category: "AI & ML",
  },
  {
    id: "flow-kanban-realtime",
    title: "Flow Workspace Kanban",
    description:
      "Collaborative project management board with multi-user cursors, offline persistence, and automated workflow triggers.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "CRDTs", "Zustand"],
    githubUrl: "https://github.com/ahmadshahdev/flow-kanban",
    liveUrl: "https://flow-kanban.example.com",
    featured: false,
    category: "Full-Stack",
  },
];
