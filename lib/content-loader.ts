import fs from "fs";
import path from "path";
import matter from "gray-matter";

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
  problemSolved?: string;
  outcomeImpact?: string;
}

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

/**
 * Load and parse all project cards from data/projects.md
 */
export function getProjectsFromMarkdown(): Project[] {
  const filePath = path.join(process.cwd(), "data", "projects.md");
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { content } = matter(fileContent);

  // Split by markdown ## headers (excluding the main document # title)
  const rawSections = content.split(/^##\s+/m).slice(1);

  const projects: Project[] = [];

  for (const section of rawSections) {
    const lines = section.trim().split("\n");
    const title = lines[0].trim();

    if (!title) continue;

    let id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    let category: Project["category"] = "Full-Stack";
    let featured = false;
    let metrics: string | undefined = undefined;
    let tags: string[] = [];
    let githubUrl: string | undefined = undefined;
    let liveUrl: string | undefined = undefined;
    let description = "";

    // Parse bullet attributes (- **Key**: Value)
    for (const line of lines) {
      const match = line.match(/^-\s+\*\*([^:]+)\*\*:\s*(.+)$/);
      if (match) {
        const key = match[1].trim().toLowerCase();
        const value = match[2].trim();

        if (key === "id") id = value;
        else if (key === "category") category = value as Project["category"];
        else if (key === "featured") featured = value.toLowerCase() === "true";
        else if (key === "metrics") metrics = value;
        else if (key === "tech stack") {
          tags = value.split(",").map((t) => t.trim());
        } else if (key === "github") githubUrl = value;
        else if (key === "live demo") liveUrl = value;
      }
    }

    // Parse ### Description subsection
    const descMatch = section.match(/### Description\s+([\s\S]*?)(?=###|$|---)/);
    if (descMatch) {
      description = descMatch[1].trim();
    }

    projects.push({
      id,
      title,
      description: description || "No description provided.",
      tags,
      githubUrl,
      liveUrl,
      featured,
      category,
      metrics,
    });
  }

  return projects;
}

/**
 * Load and parse resume data (experience, education, skills) from data/resume.md
 */
export function getResumeFromMarkdown(): {
  experiences: ExperienceItem[];
  education: EducationItem[];
  skillGroups: SkillGroup[];
} {
  const filePath = path.join(process.cwd(), "data", "resume.md");
  if (!fs.existsSync(filePath)) {
    return { experiences: [], education: [], skillGroups: [] };
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { content } = matter(fileContent);

  // Split into major sections: Work Experience, Education, Technical Skills
  const experiences: ExperienceItem[] = [];
  const education: EducationItem[] = [];
  const skillGroups: SkillGroup[] = [];

  // Parse Work Experience
  const expSectionMatch = content.match(/## Work Experience([\s\S]*?)(?=## Education|## Technical Skills|$)/);
  if (expSectionMatch) {
    const rawExpBlocks = expSectionMatch[1].split(/^###\s+/m).slice(1);
    let idCounter = 1;

    for (const block of rawExpBlocks) {
      const lines = block.trim().split("\n");
      const role = lines[0].trim();
      let company = "";
      let location = "";
      let period = "";
      const highlights: string[] = [];
      let skills: string[] = [];

      for (const line of lines) {
        const companyMatch = line.match(/-\s+\*\*Company\*\*:\s*(.+)/);
        if (companyMatch) company = companyMatch[1].trim();

        const locMatch = line.match(/-\s+\*\*Location\*\*:\s*(.+)/);
        if (locMatch) location = locMatch[1].trim();

        const periodMatch = line.match(/-\s+\*\*Period\*\*:\s*(.+)/);
        if (periodMatch) period = periodMatch[1].trim();

        const bulletMatch = line.match(/^\s+-\s+(.+)/);
        if (bulletMatch && !line.includes("**Company**") && !line.includes("**Location**") && !line.includes("**Period**")) {
          highlights.push(bulletMatch[1].trim());
        }

        const techMatch = line.match(/-\s+\*\*Technologies\*\*:\s*(.+)/);
        if (techMatch) {
          skills = techMatch[1].split(",").map((s) => s.trim());
        }
      }

      if (role) {
        experiences.push({
          id: `exp-${idCounter++}`,
          role,
          company,
          location,
          period,
          description: highlights,
          skills,
        });
      }
    }
  }

  // Parse Education
  const eduSectionMatch = content.match(/## Education([\s\S]*?)(?=## Technical Skills|$)/);
  if (eduSectionMatch) {
    const rawEduBlocks = eduSectionMatch[1].split(/^###\s+/m).slice(1);
    let eduCounter = 1;

    for (const block of rawEduBlocks) {
      const lines = block.trim().split("\n");
      const degree = lines[0].trim();
      let institution = "";
      let location = "";
      let period = "";
      let details = "";

      for (const line of lines) {
        const instMatch = line.match(/-\s+\*\*Institution\*\*:\s*(.+)/);
        if (instMatch) institution = instMatch[1].trim();

        const locMatch = line.match(/-\s+\*\*Location\*\*:\s*(.+)/);
        if (locMatch) location = locMatch[1].trim();

        const periodMatch = line.match(/-\s+\*\*Period\*\*:\s*(.+)/);
        if (periodMatch) period = periodMatch[1].trim();

        const detMatch = line.match(/-\s+\*\*Details\*\*:\s*(.+)/);
        if (detMatch) details = detMatch[1].trim();
      }

      if (degree) {
        education.push({
          id: `edu-${eduCounter++}`,
          degree,
          institution,
          location,
          period,
          details,
        });
      }
    }
  }

  // Parse Technical Skills
  const skillsSectionMatch = content.match(/## Technical Skills([\s\S]*?)$/);
  if (skillsSectionMatch) {
    const rawSkillBlocks = skillsSectionMatch[1].split(/^###\s+/m).slice(1);

    for (const block of rawSkillBlocks) {
      const lines = block.trim().split("\n");
      const category = lines[0].trim();
      const skillsLine = lines.slice(1).join(" ").replace(/^-\s+/, "").trim();
      const skills = skillsLine
        ? skillsLine.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      if (category) {
        skillGroups.push({
          category,
          skills,
        });
      }
    }
  }

  return { experiences, education, skillGroups };
}
