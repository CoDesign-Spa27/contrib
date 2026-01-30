1. The Model Strategy
Based on the table you provided, here is the breakdown:

The Bottleneck is TPM (Tokens Per Minute) Most "analyzers" fail here. A single git commit history can easily exceed 6,000 tokens if you aren't careful.

Example: 50 commits with diffs ≈ 15,000 tokens (Crash).

Example: 50 commits (messages only) ≈ 1,500 tokens (Safe).

Recommended Model: llama-3.3-70b-versatile

Why: It is significantly "smarter" than the 8b models. For "Analytical Summaries" (detecting patterns, grouping features), you need reasoning, not just speed.

Limits: 12,000 TPM is manageable if we strictly limit the input size.

Alternative (High Volume): meta-llama/llama-4-scout-17b-16e-instruct. If this model is available to you, use it. The 30K TPM limit allows for much larger commit histories (approx. 2.5x more data per request than the 70b model).

2. The "Full Proof" Plan (Groq Optimized)
We will use Next.js Server Actions to keep secrets safe and manage the API logic.

Phase 1: Dependencies
Bash
npm install octokit @ai-sdk/openai ai zod
# We use @ai-sdk/openai because it's compatible with Groq's OpenAI-compatible endpoint
Phase 2: The Data Handling Strategy (Crucial)
To survive the Free Tier, we must compress the data before sending it to Groq.

Fetch Full Data: Get everything from GitHub (files, stats, messages).

Calculate Stats Locally: Don't ask AI to count commits or files. It's bad at math and costs tokens. Do this in TypeScript.

Compress for AI: Send only the commit messages and dates to the AI. Strip out huge file patches/diffs.

Phase 3: Implementation
1. Configure Groq Client (lib/ai.ts) Create a custom provider instance pointing to Groq.

TypeScript
// lib/ai.ts
import { createOpenAI } from '@ai-sdk/openai';

export const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});
2. The Analyzer Action (actions/analyze.ts) This is the brain. It fetches data, compresses it, and calls Groq with strict token management.

TypeScript
'use server'
import { groq } from '@/lib/ai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { Octokit } from 'octokit';

// Define the shape of our AI response
const AnalysisSchema = z.object({
  summary: z.string().describe("A professional executive summary of the work."),
  impact_score: z.number().min(1).max(10),
  key_features: z.array(z.string()).describe("List of distinct features worked on."),
  tech_stack_inferred: z.array(z.string()).describe("Languages/libs detected."),
  developer_persona: z.string().describe("E.g. 'The Refactorer', 'Feature SHIPPER'"),
});

export async function analyzeCommits(repoUrl: string, branch: string, username: string, token: string) {
  const octokit = new Octokit({ auth: token });
  const [owner, repo] = repoUrl.split('/'); // valid for "owner/repo" format

  try {
    // 1. Fetch Commits (Limit to last 50-70 to stay under 6k/12k TPM)
    const { data: commits } = await octokit.request('GET /repos/{owner}/{repo}/commits', {
      owner, repo, sha: branch, author: username, per_page: 60 
    });

    if (commits.length === 0) return { error: "No commits found for this user." };

    // 2. Local "Hard" Analytics (Zero Token Cost)
    const stats = {
      totalCommits: commits.length,
      filesChanged: new Set(commits.flatMap(c => c.files?.map(f => f.filename) || [])).size,
      activeDays: new Set(commits.map(c => c.commit.author?.date?.split('T')[0])).size,
    };

    // 3. Token Preservation Strategy: Compress History
    // We ONLY send the message and date. No diffs.
    const promptContext = commits.map(c => 
      `[${c.commit.author?.date?.split('T')[0]}] ${c.commit.message.slice(0, 100)}` // Truncate long messages
    ).join('\n');

    // 4. Call Groq AI
    const { object } = await generateObject({
      model: groq('llama-3.3-70b-versatile'), // Or 'llama-3.1-8b-instant' if you hit limits
      schema: AnalysisSchema,
      prompt: `
        Analyze these commit messages for user ${username}.
        Context (Last ${commits.length} commits):
        ${promptContext}
        
        Task:
        1. Group related commits into "Key Features".
        2. Ignore typos/merges in the summary.
        3. Infer the persona based on whether they build new stuff or fix bugs.
      `,
    });

    return { success: true, stats, analysis: object };

  } catch (error: any) {
    console.error(error);
    // Handle Rate Limits Gracefully
    if (error.message.includes('429')) {
      return { error: "AI usage limit reached. Please wait 1 minute." };
    }
    return { error: "Failed to analyze repo." };
  }
}
3. The UI Component (components/analysis-dashboard.tsx) A clean Shadcn UI to trigger the action and display results.

TypeScript
'use client'
import { useState } from 'react';
import { analyzeCommits } from '@/actions/analyze';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

export function AnalysisDashboard({ token }: { token: string }) {
  const [repo, setRepo] = useState(''); // e.g., "facebook/react"
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    const res = await analyzeCommits(repo, 'main', user, token);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Input Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Input placeholder="owner/repo" value={repo} onChange={e => setRepo(e.target.value)} />
        <Input placeholder="GitHub Username" value={user} onChange={e => setUser(e.target.value)} />
        <Button onClick={handleAnalyze} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Analyzing...' : 'Generate Report'}
        </Button>
      </div>

      {/* Error State */}
      {result?.error && (
        <div className="p-4 text-red-500 bg-red-50 rounded-md border border-red-200">
          {result.error}
        </div>
      )}

      {/* Success State */}
      {result?.success && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard title="Total Commits" value={result.stats.totalCommits} />
            <StatsCard title="Active Days" value={result.stats.activeDays} />
            <StatsCard title="Impact Score" value={`${result.analysis.impact_score}/10`} />
          </div>

          {/* Main Analysis */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Left: Summary */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Executive Summary
                  <Badge variant="outline">{result.analysis.developer_persona}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {result.analysis.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.analysis.tech_stack_inferred.map((t: string) => (
                    <Badge key={t} variant="secondary">{t}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Right: Features List */}
            <Card>
              <CardHeader><CardTitle>Key Features</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.analysis.key_features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-1">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function StatsCard({ title, value }: { title: string, value: string | number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
3. Environment Setup
.env.local:

Code snippet
GROQ_API_KEY=gsk_...
GITHUB_ID=...
GITHUB_SECRET=...
NEXTAUTH_SECRET=...
Next Steps for You
Copy-paste the actions/analyze.ts code. It is specifically tuned to truncate messages to 100 characters and limit history to 60 commits, ensuring you stay under the 12,000 TPM limit of the llama-3.3-70b model.

If you hit rate limits frequently, swap the model string in actions/analyze.ts to meta-llama/llama-4-scout-17b-16e-instruct (if valid for your account) or llama-3.1-8b-instant.