import { getResumeFromMarkdown } from "@/lib/content-loader";
import {
  Briefcase,
  GraduationCap,
  Wrench,
  Download,
  Calendar,
  MapPin,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";

export const revalidate = 60; // Refresh markdown content on updates

export default function ResumePage() {
  const { experiences, education, skillGroups } = getResumeFromMarkdown();

  return (
    <div className="space-y-3xl py-md">
      {/* Header Section */}
      <section className="space-y-md border-b border-neutralLight-border pb-xl flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div className="space-y-xs max-w-2xl">
          <div className="inline-flex items-center gap-xs px-sm py-1 rounded-full bg-primary-light border border-primary-border text-xs font-body font-semibold text-primary">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Professional Knowledge Base</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-neutralDark">
            Resume & Experience Timeline
          </h1>

          <p className="font-body text-base sm:text-lg text-neutralLight-muted">
            Over 4 years of hands-on experience designing, shipping, and scaling modern web applications & AI agent systems. (Sourced from <code className="text-primary bg-primary-light/50 px-1 rounded">data/resume.md</code>).
          </p>
        </div>

        {/* Action Button: Download Resume */}
        <div className="shrink-0">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-xs px-lg py-md rounded-xl bg-primary text-surface font-body font-semibold hover:bg-primary-hover transition-all shadow-subtle hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none min-h-[44px]"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </a>
        </div>
      </section>

      {/* Experience Timeline Section */}
      <section className="space-y-xl">
        <div className="flex items-center gap-sm">
          <div className="w-10 h-10 rounded-xl bg-primary-light border border-primary-border flex items-center justify-center text-primary shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-2xl text-neutralDark">
              Work Experience
            </h2>
            <p className="font-body text-sm text-neutralLight-muted">
              Career history and technical impacts
            </p>
          </div>
        </div>

        {/* Timeline List */}
        <div className="relative border-l-2 border-primary-border/60 ml-4 sm:ml-6 pl-md sm:pl-xl space-y-2xl">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative group">
              {/* Timeline Bullet Node */}
              <div className="absolute -left-[calc(1rem+9px)] sm:-left-[calc(1.5rem+9px)] top-1.5 w-4 h-4 rounded-full bg-surface border-2 border-primary group-hover:bg-primary transition-colors" />

              <div className="bg-surface rounded-2xl border border-neutralLight-border p-lg shadow-card space-y-md">
                {/* Role Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-xs border-b border-neutralLight-border pb-sm">
                  <div>
                    <h3 className="font-heading font-bold text-lg sm:text-xl text-neutralDark">
                      {exp.role}
                    </h3>
                    <span className="font-body text-sm font-semibold text-primary">
                      {exp.company}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-sm text-xs font-body text-neutralLight-muted">
                    <span className="flex items-center gap-1 bg-neutralLight-card px-xs py-0.5 rounded border border-neutralLight-border">
                      <Calendar className="w-3 h-3 text-primary" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutralLight-muted" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Highlights List */}
                <ul className="space-y-xs">
                  {exp.description.map((item, index) => (
                    <li key={index} className="font-body text-sm text-neutralLight-muted flex items-start gap-xs">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Tag Pills */}
                {exp.skills.length > 0 && (
                  <div className="flex flex-wrap gap-xs pt-xs">
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs font-body font-medium px-sm py-0.5 rounded-md bg-primary-light/60 text-primary border border-primary-border/50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education Timeline Section */}
      <section className="space-y-xl pt-lg">
        <div className="flex items-center gap-sm">
          <div className="w-10 h-10 rounded-xl bg-primary-light border border-primary-border flex items-center justify-center text-primary shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-2xl text-neutralDark">
              Education
            </h2>
            <p className="font-body text-sm text-neutralLight-muted">
              Academic foundation and degree
            </p>
          </div>
        </div>

        <div className="relative border-l-2 border-primary-border/60 ml-4 sm:ml-6 pl-md sm:pl-xl">
          {education.map((edu) => (
            <div key={edu.id} className="relative group">
              <div className="absolute -left-[calc(1rem+9px)] sm:-left-[calc(1.5rem+9px)] top-1.5 w-4 h-4 rounded-full bg-surface border-2 border-primary group-hover:bg-primary transition-colors" />

              <div className="bg-surface rounded-2xl border border-neutralLight-border p-lg shadow-card space-y-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-xs">
                  <h3 className="font-heading font-bold text-lg text-neutralDark">
                    {edu.degree}
                  </h3>
                  <span className="text-xs font-body text-neutralLight-muted flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-primary" />
                    {edu.period}
                  </span>
                </div>
                <p className="font-body text-sm font-semibold text-primary">
                  {edu.institution} — {edu.location}
                </p>
                <p className="font-body text-sm text-neutralLight-muted pt-xs">
                  {edu.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Matrix Section */}
      <section className="space-y-xl pt-lg border-t border-neutralLight-border">
        <div className="flex items-center gap-sm">
          <div className="w-10 h-10 rounded-xl bg-primary-light border border-primary-border flex items-center justify-center text-primary shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-2xl text-neutralDark">
              Technical Core & Skills
            </h2>
            <p className="font-body text-sm text-neutralLight-muted">
              Tools, frameworks, and methodologies
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {skillGroups.map((group) => (
            <div
              key={group.category}
              className="bg-surface rounded-2xl border border-neutralLight-border p-lg shadow-subtle space-y-md hover:border-primary-border transition-colors"
            >
              <h3 className="font-heading font-bold text-base text-neutralDark border-b border-neutralLight-border pb-xs">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-xs">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-body font-medium px-sm py-1 rounded-lg bg-neutralLight-card border border-neutralLight-border text-neutralDark hover:border-primary-border hover:text-primary transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
