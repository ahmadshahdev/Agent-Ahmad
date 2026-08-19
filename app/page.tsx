import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getProjectsFromMarkdown } from "@/lib/content-loader";
import ProjectCard from "@/components/ProjectCard";
import {
  Sparkles,
  MessageSquare,
  ArrowRight,
  Code2,
  Cpu,
  Terminal,
  UserCheck,
  FileText,
} from "lucide-react";

export const revalidate = 60; // Refresh markdown content on updates

export default function Home() {
  const projects = getProjectsFromMarkdown();
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <div className="space-y-3xl py-md">
      {/* Hero Section */}
      <section className="relative py-xl md:py-2xl flex flex-col items-start space-y-lg border-b border-neutralLight-border pb-2xl">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-xs px-sm py-1 rounded-full bg-primary-light border border-primary-border text-xs font-body font-semibold text-primary">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Interactive AI Portfolio • {siteConfig.agentName} Integrated</span>
        </div>

        {/* Hero Main Heading & Intro */}
        <div className="max-w-3xl space-y-md">
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-neutralDark leading-[1.15] tracking-tight">
            Hi, I&apos;m <span className="text-primary">{siteConfig.name}</span>.
            <br />
            <span className="text-neutralDark-muted text-3xl sm:text-4xl lg:text-5xl font-bold block mt-xs">
              {siteConfig.tagline}
            </span>
          </h1>

          <p className="font-body text-base sm:text-lg text-neutralLight-muted leading-relaxed max-w-2xl">
            I craft high-performance web applications and intelligent AI agent systems.
            Combining modern full-stack architecture with retrieval algorithms to turn complex ideas into seamless digital experiences.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-md pt-xs w-full sm:w-auto">
          {/* Primary CTA: Chat with Agent Ahmad */}
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("open-agent-chat"));
              }
            }}
            className="inline-flex items-center justify-center gap-sm px-xl py-md rounded-xl bg-primary text-surface font-body font-semibold hover:bg-primary-hover transition-all shadow-card hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none cursor-pointer min-h-[44px]"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Chat with Agent Ahmad</span>
          </button>

          {/* Secondary CTA: View Projects */}
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-xs px-xl py-md rounded-xl bg-surface border border-neutralLight-border text-neutralDark font-body font-semibold hover:bg-neutralLight-card hover:border-primary-border hover:text-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span>View Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Highlight Pills */}
        <div className="pt-lg grid grid-cols-1 sm:grid-cols-3 gap-md w-full max-w-3xl">
          <div className="p-md rounded-xl bg-surface border border-neutralLight-border shadow-subtle flex items-center gap-sm">
            <div className="w-10 h-10 rounded-lg bg-primary-light border border-primary-border flex items-center justify-center text-primary shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-sm text-neutralDark">Full-Stack Web</h3>
              <p className="font-body text-xs text-neutralLight-muted">Next.js 14, React & TS</p>
            </div>
          </div>

          <div className="p-md rounded-xl bg-surface border border-neutralLight-border shadow-subtle flex items-center gap-sm">
            <div className="w-10 h-10 rounded-lg bg-primary-light border border-primary-border flex items-center justify-center text-primary shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-sm text-neutralDark">AI & Agent Systems</h3>
              <p className="font-body text-xs text-neutralLight-muted">RAG, LangChain, LLMs</p>
            </div>
          </div>

          <div className="p-md rounded-xl bg-surface border border-neutralLight-border shadow-subtle flex items-center gap-sm">
            <div className="w-10 h-10 rounded-lg bg-primary-light border border-primary-border flex items-center justify-center text-primary shrink-0">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-sm text-neutralDark">Clean Architecture</h3>
              <p className="font-body text-xs text-neutralLight-muted">Modular & Scalable</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-lg border-b border-neutralLight-border pb-2xl space-y-md">
        <div className="flex items-center gap-xs text-primary font-body text-xs font-bold uppercase tracking-wider">
          <UserCheck className="w-4 h-4" />
          <span>About Me</span>
        </div>

        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-neutralDark">
          Engineered for innovation, built for performance
        </h2>

        <p className="font-body text-base sm:text-lg text-neutralLight-muted leading-relaxed max-w-4xl">
          I am a Full-Stack Engineer and AI Systems Developer passionate about crafting intuitive web interfaces backed by robust server architectures and intelligent agents. Over the past 4+ years, I have specialized in building modern TypeScript applications, vector retrieval engines, and high-concurrency microservices. My goal is to build software that not only solves complex technical challenges but also delivers delight and clarity to every user interaction.
        </p>

        <div className="pt-xs">
          <Link
            href="/resume"
            className="inline-flex items-center gap-xs font-body text-sm font-semibold text-primary hover:underline"
          >
            <FileText className="w-4 h-4" />
            <span>Read full resume & experience timeline &rarr;</span>
          </Link>
        </div>
      </section>

      {/* Featured Projects Preview Section */}
      <section className="space-y-xl py-lg">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-md">
          <div className="space-y-xs">
            <span className="text-xs font-body font-bold text-primary uppercase tracking-wider">
              Selected Work
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-neutralDark">
              Featured Projects
            </h2>
            <p className="font-body text-sm sm:text-base text-neutralLight-muted">
              Highlights of recent full-stack applications and AI research builds (parsed from <code className="text-primary bg-primary-light/50 px-1 rounded">data/projects.md</code>).
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-xs text-sm font-body font-semibold text-primary hover:text-primary-hover transition-colors shrink-0"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Featured Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
