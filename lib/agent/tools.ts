import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

export interface GithubRepo {
  name: string;
  description: string | null;
  language: string | null;
  updatedAt: string;
  htmlUrl: string;
  stars: number;
  forks: number;
}

interface RawGithubRepo {
  name: string;
  description?: string | null;
  language?: string | null;
  updated_at: string;
  html_url: string;
  stargazers_count?: number;
  forks_count?: number;
}

/**
 * Fetches Ahmad's most recently updated public GitHub repositories from GitHub REST API.
 */
export async function getLatestGithubActivity(limit = 5): Promise<GithubRepo[]> {
  const username = process.env.GITHUB_USERNAME || "ahmadshahdev";
  const url = `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=${limit}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Agent-Ahmad-App",
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!res.ok) {
      throw new Error(`GitHub API returned status ${res.status}: ${res.statusText}`);
    }

    const repos = (await res.json()) as RawGithubRepo[];

    if (!Array.isArray(repos)) {
      throw new Error("Invalid response format from GitHub API.");
    }

    return repos.map((repo) => ({
      name: repo.name,
      description: repo.description || "No description provided.",
      language: repo.language || "Unknown",
      updatedAt: repo.updated_at,
      htmlUrl: repo.html_url,
      stars: repo.stargazers_count ?? 0,
      forks: repo.forks_count ?? 0,
    }));
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("❌ Error fetching GitHub activity:", error);
    throw new Error(`Failed to fetch GitHub activity for username '${username}': ${errMsg}`);
  }
}

/**
 * Anthropic Tool definition for getLatestGithubActivity tool.
 */
export const GITHUB_ACTIVITY_TOOL = {
  name: "getLatestGithubActivity",
  description: "Fetches Ahmad's most recently updated public GitHub repositories and live coding activity.",
  input_schema: {
    type: "object" as const,
    properties: {
      limit: {
        type: "integer",
        description: "Number of recently updated repositories to fetch (default: 5, max: 10).",
      },
    },
    required: [],
  },
};

export const ALL_AGENT_TOOLS = [GITHUB_ACTIVITY_TOOL];

/**
 * Dispatches and executes agent tool calls server-side.
 */
export async function executeTool(name: string, input: unknown): Promise<unknown> {
  if (name === "getLatestGithubActivity") {
    const inputObj = input as { limit?: number } | null | undefined;
    const limit = typeof inputObj?.limit === "number" ? inputObj.limit : 5;
    return await getLatestGithubActivity(limit);
  }
  throw new Error(`Unknown tool requested: ${name}`);
}
