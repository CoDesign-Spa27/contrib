"use server";

import { groq } from "@/lib/ai";
import { fetchCommits, fetchUserByUsername, type HardStats, type GitHubUser } from "@/lib/github";
import { generateObject } from "ai";
import { z } from "zod";

const ImportantThingSchema = z.object({
  title: z.string().describe("Short label for this point, e.g. 'Auth refactor', 'New payment flow'."),
  description: z.string().describe("2-3 sentences explaining what was done and why it matters."),
});

const AnalysisSchema = z.object({
  detailed_summary: z
    .string()
    .describe(
      "3-5 paragraphs. Every claim must be grounded in the commit list or file areas: cite or paraphrase specific commit messages. No vague filler. Structure: (1) who and scope; (2) concrete work from commits; (3) technical themes/patterns; (4) overall impact."
    ),
  impact_score: z.number().min(1).max(10).describe("1-10 based on complexity and impact."),
  key_areas: z.array(z.string()).describe("Specific modules/areas worked on, e.g. 'Authentication', 'Payment Gateway'."),
  important_things: z
    .array(ImportantThingSchema)
    .describe(
      "5-12 concrete important items: each has a short title and a 2-3 sentence description of what was done and its significance. Focus on features, refactors, and notable changes."
    ),
});

export type AnalysisResult = z.infer<typeof AnalysisSchema>;

export type AnalyzeResult =
  | {
      success: true;
      stats: HardStats;
      analysis: AnalysisResult;
      commitsPerDay: Record<string, number>;
      user: GitHubUser | null;
      inputs: { repo: string; branch: string; username: string };
    }
  | { success: false; error: string };

export async function analyzeCommits(
  repoInput: string,
  branch: string,
  username: string,
  token: string
): Promise<AnalyzeResult> {
  if (!token) {
    return { success: false, error: "Not authenticated. Sign in with GitHub." };
  }
  if (!process.env.GROQ_API_KEY) {
    return { success: false, error: "AI is not configured (GROQ_API_KEY)." };
  }

  let commits: Awaited<ReturnType<typeof fetchCommits>>["commits"];
  let stats: HardStats;
  let compressedForAi: string[];

  try {
    const result = await fetchCommits(token, repoInput, branch, username);
    console.log(result);
    commits = result.commits;
    stats = result.stats;
    compressedForAi = result.compressedForAi;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const status = (err as { status?: number })?.status ?? (err as { response?: { status?: number } })?.response?.status;
    console.error("[analyze] GitHub fetch failed:", err);
    if (status === 401) return { success: false, error: "GitHub token invalid or expired. Try signing out and back in." };
    if (status === 403) return { success: false, error: "GitHub access denied (rate limit or scope). Ensure you granted repo access." };
    if (status === 404 || message.includes("404") || message.includes("Not Found")) {
      return { success: false, error: "Repository or branch not found, or you don't have access." };
    }
    if (message.includes("429") || message.includes("rate limit")) {
      return { success: false, error: "GitHub rate limit reached. Please wait a minute and try again." };
    }
    return { success: false, error: `GitHub error: ${message}` };
  }

  if (commits.length === 0) {
    return { success: false, error: "No commits found for this user on the selected branch." };
  }

  const user = await fetchUserByUsername(token, username);

  const commitsPerDay: Record<string, number> = {};
  for (const c of commits) {
    if (c.date) commitsPerDay[c.date] = (commitsPerDay[c.date] ?? 0) + 1;
  }

  const promptContext = compressedForAi.join("\n");
  const fileAreasBlob =
    stats.topFileAreas.length > 0
      ? `\nFile areas touched (path prefix, commit count):\n${stats.topFileAreas.map((a) => `  ${a.path} (${a.count})`).join("\n")}\n`
      : "";

  try {
    // Use a model that supports json_schema structured output (see https://console.groq.com/docs/structured-outputs#supported-models)
    const { object } = await generateObject({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      schema: AnalysisSchema,
      prompt: `You are a Senior Engineering Manager writing a contribution review. Use ONLY the commit list and file areas below. Ground every statement in this data.

RULES FOR detailed_summary:
- Write 3-5 paragraphs. Every claim must be backed by at least one commit message or file area—cite or paraphrase (e.g. "commits like 'Add auth middleware' and 'Fix login redirect' show..." or "work in src/auth/ and src/api/ indicates...").
- Do not use vague filler ("various improvements", "multiple changes"). Name concrete work.
- Structure: (1) Developer and scope (repo/branch, time range from dates). (2) Concrete work: list specific changes from the commits. (3) Technical themes and patterns. (4) Overall impact.
- If messages are brief or vague, infer from file paths and still be specific (e.g. "Contributions in components/ and lib/ suggest UI and shared logic work.").

RULES FOR key_areas and important_things:
- key_areas: derive from commit messages and file paths (e.g. 'Authentication', 'API layer', 'UI components').
- important_things: 5-12 items. Each title and description must reference specific commits or file areas. No generic bullets.

Developer: ${username}
Commits (reverse chronological, newest first; each line may have subject and "> body" preview):
${promptContext}
${fileAreasBlob}

Return JSON: detailed_summary (3-5 paragraphs, grounded in commits/file areas), impact_score (1-10), key_areas (array of strings), important_things (array of { title, description }).`,
    });

    return {
      success: true,
      stats,
      analysis: object,
      commitsPerDay,
      user,
      inputs: { repo: repoInput.trim(), branch, username: username.trim() },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const cause = err instanceof Error && err.cause instanceof Error ? err.cause.message : "";
    console.error("[analyze] Groq AI failed:", err);
    if (message.includes("429") || message.includes("rate limit") || cause.includes("429")) {
      return { success: false, error: "AI rate limit reached. Please wait a minute and try again." };
    }
    if (message.includes("401") || message.includes("Invalid") || cause.includes("401")) {
      return { success: false, error: "Invalid GROQ_API_KEY. Check your .env." };
    }
    return { success: false, error: `Analysis failed: ${message || cause || "unknown error"}` };
  }
}
