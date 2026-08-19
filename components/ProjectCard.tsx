import { Project } from "@/data/projects";
import { ExternalLink, Sparkles, Tag } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group h-full flex flex-col justify-between bg-surface rounded-2xl border border-neutralLight-border p-lg shadow-card hover:shadow-card-hover hover:border-primary-border transition-all duration-300 relative overflow-hidden">
      {/* Decorative Subtle Accent Gradient Glow on Hover */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-light/50 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500 pointer-events-none" />

      <div className="space-y-md">
        {/* Top Meta: Category & Badges */}
        <div className="flex items-center justify-between gap-xs flex-wrap">
          <span className="text-xs font-body font-semibold px-sm py-1 rounded-full bg-neutralLight-card border border-neutralLight-border text-neutralDark-muted">
            {project.category}
          </span>
          {project.featured && (
            <span className="inline-flex items-center gap-1 text-[11px] font-body font-semibold px-sm py-1 rounded-full bg-primary-light text-primary border border-primary-border">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}
        </div>

        {/* Project Header & Title */}
        <div>
          <h3 className="font-heading font-bold text-xl text-neutralDark group-hover:text-primary transition-colors line-clamp-1">
            {project.title}
          </h3>
          {project.metrics && (
            <span className="inline-block mt-1 text-xs font-body font-medium text-primary bg-primary-light/60 px-xs py-0.5 rounded">
              ⚡ {project.metrics}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="font-body text-sm text-neutralLight-muted leading-relaxed line-clamp-3">
          {project.description}
        </p>
      </div>

      {/* Footer: Tech Stack Tags & External Links */}
      <div className="pt-lg mt-lg border-t border-neutralLight-border space-y-md">
        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-xs">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-body font-medium px-xs py-0.5 rounded-md bg-neutralLight border border-neutralLight-border text-neutralDark-muted flex items-center gap-1"
            >
              <Tag className="w-2.5 h-2.5 text-neutralLight-muted" />
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-xs">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-xs text-xs font-body font-semibold text-neutralDark hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded p-xs"
              aria-label={`View ${project.title} on GitHub`}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Source Code</span>
            </a>
          ) : (
            <span />
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-xs text-xs font-body font-semibold px-md py-sm rounded-lg bg-primary-light text-primary hover:bg-primary hover:text-surface transition-all border border-primary-border shadow-subtle group/btn"
              aria-label={`Visit live demo for ${project.title}`}
            >
              <span>Live Demo</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
