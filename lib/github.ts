import { Octokit } from "octokit";

const MAX_COMMITS = 1000;
const PER_PAGE = 100;
const COMMITS_FOR_AI = 80;

export type CommitListItem = {
  sha: string;
  date: string;
  message: string;
  author: string | null;
};

export type HardStats = {
  totalCommits: number;
  changesShipped: number;
  activeDays: number;
  mergeCommits: number;
  topFileAreas: { path: string; count: number }[];
};

export type CompressedCommit = string;

function parseRepoInput(repoInput: string): { owner: string; repo: string } {
  const trimmed = repoInput.trim().replace(/^https:\/\/github\.com\/?/, "").replace(/\.git$/, "");
  const [owner, repo] = trimmed.split("/").filter(Boolean);
  if (!owner || !repo) throw new Error("Repository must be in form owner/repo");
  return { owner, repo };
}

function isMergeCommit(message: string): boolean {
  const firstLine = message.split("\n")[0];
  return /^Merge pull request #\d+/i.test(firstLine) || firstLine.startsWith("Merge branch");
}

function extractTopFileAreas(commits: { files?: { filename: string }[] }[]): { path: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const c of commits) {
    const files = c.files ?? [];
    for (const f of files) {
      const top = f.filename.split("/").slice(0, 2).join("/");
      if (top) counts.set(top, (counts.get(top) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);
}

export async function fetchCommits(
  token: string,
  repoInput: string,
  branch: string,
  username: string
): Promise<{
  commits: CommitListItem[];
  stats: HardStats;
  compressedForAi: CompressedCommit[];
}> {
  const octokit = new Octokit({ auth: token });
  const { owner, repo } = parseRepoInput(repoInput);

  const allCommits: CommitListItem[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && allCommits.length < MAX_COMMITS) {
    const { data } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      sha: branch,
      author: username,
      per_page: PER_PAGE,
      page,
    });

    for (const c of data) {
      const date = c.commit?.author?.date?.split("T")[0] ?? "";
      const message = c.commit?.message ?? "";
      allCommits.push({
        sha: c.sha,
        date,
        message,
        author: c.commit?.author?.name ?? null,
      });
    }

    hasMore = data.length === PER_PAGE;
    page++;
  }

  const commitsForStats = allCommits.slice(0, MAX_COMMITS);
  const totalCommits = commitsForStats.length;
  // Count every commit as shipped (every message = one change shipped)
  const changesShipped = totalCommits;
  const mergeCommits = commitsForStats.filter((c) => isMergeCommit(c.message)).length;
  const activeDays = new Set(commitsForStats.map((c) => c.date).filter(Boolean)).size;

  const commitsForAi = allCommits.slice(0, COMMITS_FOR_AI);
  const compressedForAi = commitsForAi.map((c) => {
    const lines = c.message.split("\n").map((l) => l.trim()).filter(Boolean);
    const subject = (lines[0] ?? "").slice(0, 220);
    const body = lines.length > 1 ? lines.slice(1).join(" ").slice(0, 200) : "";
    return body ? `[${c.date}] ${subject}\n  > ${body}` : `[${c.date}] ${subject}`;
  });

  const topFileAreas: { path: string; count: number }[] = [];
  try {
    const fullCommits: { files?: { filename: string }[] }[] = [];
    for (let i = 0; i < Math.min(25, commitsForAi.length); i++) {
      const { data } = await octokit.rest.repos.getCommit({
        owner,
        repo,
        ref: commitsForAi[i].sha,
      });
      fullCommits.push({ files: (data.files ?? []).map((f: { filename: string }) => ({ filename: f.filename })) });
    }
    topFileAreas.push(...extractTopFileAreas(fullCommits));
  } catch {
    // Ignore; file stats are optional
  }

  const stats: HardStats = {
    totalCommits,
    changesShipped,
    activeDays,
    mergeCommits,
    topFileAreas,
  };

  return { commits: allCommits, stats, compressedForAi };
}

export async function getBranches(
  token: string,
  repoInput: string
): Promise<{ name: string }[]> {
  const octokit = new Octokit({ auth: token });
  const { owner, repo } = parseRepoInput(repoInput);
  const { data } = await octokit.rest.repos.listBranches({ owner, repo });
  return data.map((b) => ({ name: b.name }));
}

export type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
};

export async function fetchUserByUsername(
  token: string,
  username: string
): Promise<GitHubUser | null> {
  try {
    const octokit = new Octokit({ auth: token });
    const { data } = await octokit.rest.users.getByUsername({
      username: username.trim(),
    });
    return {
      login: data.login,
      name: data.name ?? null,
      avatar_url: data.avatar_url ?? "",
      html_url: data.html_url ?? `https://github.com/${data.login}`,
    };
  } catch {
    return null;
  }
}
