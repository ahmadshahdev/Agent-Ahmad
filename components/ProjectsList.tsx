"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { Sparkles, Filter } from "lucide-react";
import { Project } from "@/lib/content-loader";

interface ProjectsListProps {
  initialProjects: Project[];
}

export default function ProjectsList({ initialProjects }: ProjectsListProps) {
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
      ? initialProjects
      : initialProjects.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-lg">
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

      {/* Projects Grid: 1 column mobile, 2 tablet, 3 desktop */}
      <div className="py-md">
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
      </div>
    </div>
  );
}
