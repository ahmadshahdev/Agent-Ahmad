import { getProjectsFromMarkdown, Project } from "@/lib/content-loader";

export type { Project };

export const PROJECTS_DATA: Project[] = getProjectsFromMarkdown();
