import { NextRequest, NextResponse } from "next/server";
import { getLatestGithubActivity } from "@/lib/agent/tools";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 5;

    const repos = await getLatestGithubActivity(limit);
    const username = process.env.GITHUB_USERNAME || "ahmadshahdev";

    return NextResponse.json({
      username,
      reposCount: repos.length,
      repos,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch GitHub activity";
    console.error("❌ Error in /api/github route:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
