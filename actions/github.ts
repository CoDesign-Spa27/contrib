"use server";

import { getBranches } from "@/lib/github";

export async function fetchBranches(repoInput: string, token: string): Promise<{ name: string }[] | { error: string }> {
  if (!token) return { error: "Not authenticated." };
  try {
    const branches = await getBranches(token, repoInput);
    return branches;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("404")) return { error: "Repository not found or no access." };
    return { error: "Failed to load branches." };
  }
}
