"use server";

import { groq } from "@/lib/ai";
import { fetchCommits, type HardStats } from "@/lib/github";
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
      "A detailed analytical summary: 2-4 paragraphs covering what was built, technical themes, patterns, and overall contribution. Be specific and reference actual work from the commits."
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
  | { success: true; stats: HardStats; analysis: AnalysisResult; commitsPerDay: Record<string, number> }
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

  const commitsPerDay: Record<string, number> = {};
  for (const c of commits) {
    if (c.date) commitsPerDay[c.date] = (commitsPerDay[c.date] ?? 0) + 1;
  }

  const promptContext = compressedForAi.join("\n");

  try {
    // Use a model that supports json_schema structured output (see https://console.groq.com/docs/structured-outputs#supported-models)
    const { object } = await generateObject({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      schema: AnalysisSchema,
      prompt: `You are a Senior Engineering Manager writing a detailed contribution review. I will provide a list of git commits for one developer.

Your goals:
1. Write a DETAILED summary (2-4 paragraphs): what was built, technical themes, patterns (e.g. "repeated focus on X"), and the overall nature of their contribution. Be specific—reference concrete work from the commits. Do not be vague.
2. List key_areas: modules/domains they worked in (e.g. 'Authentication', 'API layer', 'UI components').
3. List important_things: 5-12 items. Each item has:
   - title: short label (e.g. "New login flow", "Payment error handling")
   - description: 2-3 sentences on what was done and why it matters
   Focus on features shipped, refactors, fixes, and notable changes. Skip trivial typo-only commits unless they are part of a larger theme.
4. If commit messages are too vague to infer real work, say so in detailed_summary and use empty key_areas and fewer important_things.

Developer: ${username}
Commits (chronological, most recent last):

${promptContext}

Return JSON: detailed_summary (2-4 paragraphs), impact_score (1-10), key_areas (array of strings), important_things (array of { title, description }).`,
    });

    return {
      success: true,
      stats,
      analysis: object,
      commitsPerDay,
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
