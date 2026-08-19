"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { FolderGit2, Sparkles, Filter } from "lucide-react";
import { Project, PROJECTS_DATA } from "@/data/projects";

// Placeholder data list (ready for easy relocation to data/ directory)
const PROJECTS_LIST: Project[] = PROJECTS_DATA;

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "AI & ML",
    "Full-Stack",
    "Developer Tools",
    "Web App",
  ];

  const filteredProjects =
    selectedCategory === "All"
      ? PROJECTS_LIST
      : PROJECTS_LIST.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-xl py-md">
      {/* Header Section */}
      <section className="space-y-md border-b border-neutralLight-border pb-xl">
        <div className="inline-flex items-center gap-xs px-sm py-1 rounded-full bg-primary-light border border-primary-border text-xs font-body font-semibold text-primary">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Portfolio Showcase</span>
        </div>

        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-neutralDark">
          Featured Engineering & AI Projects
        </h1>

        <p className="font-body text-base sm:text-lg text-neutralLight-muted max-w-2xl">
          A collection of full-stack web applications, vector search algorithms, microservices, and AI developer tooling built with modern web technologies.
        </p>

        {/* Filter Pills */}
        <div className="flex items-center gap-xs flex-wrap pt-sm">
          <span className="text-xs font-body font-semibold text-neutralDark-muted flex items-center gap-1 mr-xs">
            <Filter className="w-3.5 h-3.5" />
            Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-body font-semibold px-md py-xs rounded-full border transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-surface border-primary shadow-subtle"
                  : "bg-surface text-neutralDark-muted border-neutralLight-border hover:border-primary-border hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid: 1 column mobile, 2 tablet, 3 desktop */}
      <section className="py-md">
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="p-2xl text-center bg-surface border border-neutralLight-border rounded-2xl space-y-sm">
            <Sparkles className="w-8 h-8 text-neutralLight-muted mx-auto" />
            <p className="font-heading font-semibold text-neutralDark">
              No projects found in this category.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
