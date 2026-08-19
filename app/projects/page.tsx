import { getProjectsFromMarkdown } from "@/lib/content-loader";
import ProjectsList from "@/components/ProjectsList";
import { FolderGit2 } from "lucide-react";

export const revalidate = 60; // Refresh markdown data on updates

export default function ProjectsPage() {
  const projects = getProjectsFromMarkdown();

  return (
    <div className="space-y-xl py-md">
      {/* Header Section */}
      <section className="space-y-md border-b border-neutralLight-border pb-xl">
        <div className="inline-flex items-center gap-xs px-sm py-1 rounded-full bg-primary-light border border-primary-border text-xs font-body font-semibold text-primary">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Portfolio Knowledge Base</span>
        </div>

        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-neutralDark">
          Featured Engineering & AI Projects
        </h1>

        <p className="font-body text-base sm:text-lg text-neutralLight-muted max-w-2xl">
          A collection of full-stack web applications, vector search algorithms, microservices, and AI developer tooling built with modern web technologies. (Sourced from <code className="text-primary bg-primary-light/50 px-1 rounded">data/projects.md</code>).
        </p>
      </section>

      {/* Projects List Component */}
      <ProjectsList initialProjects={projects} />
    </div>
  );
}
