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


export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  skills: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  details: string;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

const EXPERIENCES: ExperienceItem[] = [
  {
    id: "exp-1",
    role: "Senior Full-Stack & AI Engineer",
    company: "Apex Tech Labs",
    location: "Remote / San Francisco, CA",
    period: "2023 — Present",
    description: [
      "Architected and deployed production RAG knowledge platforms using Next.js 14, LangChain, and vector databases, reducing document retrieval latency by 45%.",
      "Led frontend architecture across 3 core SaaS products, establishing unified design system tokens with Tailwind CSS and TypeScript.",
      "Mentored junior developers and instituted automated CI/CD unit and e2e testing workflows.",
    ],
    skills: ["Next.js 14", "TypeScript", "LangChain", "Vector Store", "Tailwind CSS", "Node.js"],
  },
  {
    id: "exp-2",
    role: "Full-Stack Software Engineer",
    company: "CloudFlow Systems",
    location: "Hybrid / New York, NY",
    period: "2021 — 2023",
    description: [
      "Built high-concurrency microservices and real-time dashboard components consuming WebSockets and REST APIs.",
      "Optimized SQL query performance and database indexing in PostgreSQL, lowering API p99 latency to under 120ms.",
      "Engineered automated refactoring scripts and internal developer tools.",
    ],
    skills: ["React", "Node.js", "PostgreSQL", "Prisma", "Tailwind CSS", "Docker"],
  },
  {
    id: "exp-3",
    role: "Frontend Developer",
    company: "Pixel Craft Studio",
    location: "Remote",
    period: "2020 — 2021",
    description: [
      "Developed pixel-perfect, accessible client web portals with strict WCAG AA compliance.",
      "Collaborated closely with UX designers to build responsive UI component libraries.",
    ],
    skills: ["React", "JavaScript (ES6+)", "CSS3/HTML5", "Git", "REST APIs"],
  },
];

const EDUCATION: EducationItem[] = [
  {
    id: "edu-1",
    degree: "B.S. in Computer Science",
    institution: "University of Technology",
    location: "USA",
    period: "2016 — 2020",
    details: "Graduated with Honors. Focused on Distributed Systems, Data Structures & Software Engineering.",
  },
];

const SKILL_GROUPS: SkillGroup[] = [
  {
    category: "Frontend Engineering",
    skills: ["React 18", "Next.js 14 (App Router)", "TypeScript", "Tailwind CSS", "HTML5 & Semantic UI", "Zustand / Redux", "Framer Motion"],
  },
  {
    category: "Backend & Databases",
    skills: ["Node.js", "Express", "Python", "FastAPI", "PostgreSQL", "Prisma ORM", "Redis", "RESTful & GraphQL APIs"],
  },
  {
    category: "AI & Vector Search",
    skills: ["Retrieval-Augmented Generation (RAG)", "LangChain", "Vector Embeddings", "OpenAI / Anthropic APIs", "Prompt Engineering", "Guardrails"],
  },
  {
    category: "DevOps & Workflows",
    skills: ["Git & GitHub Actions", "Docker", "Vercel", "AWS Fundamentals", "Jest & Cypress", "Performance Optimization"],
  },
];

export default function ResumePage() {
  return (
    <div className="space-y-3xl py-md">
      {/* Header Section */}
      <section className="space-y-md border-b border-neutralLight-border pb-xl flex flex-col md:flex-row md:items-end justify-between gap-lg">
        <div className="space-y-xs max-w-2xl">
          <div className="inline-flex items-center gap-xs px-sm py-1 rounded-full bg-primary-light border border-primary-border text-xs font-body font-semibold text-primary">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Professional Background</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-neutralDark">
            Resume & Experience Timeline
          </h1>

          <p className="font-body text-base sm:text-lg text-neutralLight-muted">
            Over 4 years of hands-on experience designing, shipping, and scaling modern web applications & AI agent systems.
          </p>
        </div>

        {/* Action Button: Download Resume */}
        <div className="shrink-0">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-xs px-lg py-md rounded-xl bg-primary text-surface font-body font-semibold hover:bg-primary-hover transition-all shadow-subtle hover:shadow-card-hover"
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
              Career history and key technical impacts
            </p>
          </div>
        </div>

        {/* Timeline List */}
        <div className="relative border-l-2 border-primary-border/60 ml-4 sm:ml-6 pl-md sm:pl-xl space-y-2xl">
          {EXPERIENCES.map((exp) => (
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

                {/* Achievements List */}
                <ul className="space-y-xs">
                  {exp.description.map((item, index) => (
                    <li key={index} className="font-body text-sm text-neutralLight-muted flex items-start gap-xs">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Tag Pills */}
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
          {EDUCATION.map((edu) => (
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
          {SKILL_GROUPS.map((group) => (
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
