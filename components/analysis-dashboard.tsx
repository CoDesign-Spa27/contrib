"use client";

import { useState, useTransition } from "react";
import { analyzeCommits, type AnalyzeResult } from "@/actions/analyze";
import { fetchBranches } from "@/actions/github";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, GitBranch, User, FolderGit2, BarChart3 } from "lucide-react";

function StatsCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card size="sm" className="overflow-hidden">
      <CardHeader className="pb-1 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </CardTitle>
          {Icon && <Icon className="size-4 text-muted-foreground" />}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-2xl font-bold tabular-nums">{value}</div>
      </CardContent>
    </Card>
  );
}

function ActivityChart({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b));
  const max = Math.max(1, ...entries.map(([, v]) => v));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <BarChart3 className="size-4" />
          Commits per day
        </CardTitle>
        <CardDescription>Chronological activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-0.5 h-32">
          {entries.slice(-30).map(([date, count]) => (
            <div
              key={date}
              className="flex-1 min-w-0 h-full flex flex-col justify-end"
              title={`${date}: ${count} commit${count !== 1 ? "s" : ""}`}
            >
              <div
                className="w-full min-h-[4px] rounded-t bg-primary/80 transition-all hover:bg-primary"
                style={{ height: `${(count / max) * 100}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          <span>{entries[0]?.[0] ?? "—"}</span>
          <span>{entries[entries.length - 1]?.[0] ?? "—"}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function AnalysisDashboard({ accessToken }: { accessToken: string | null }) {
  const [repo, setRepo] = useState("");
  const [branch, setBranch] = useState("main");
  const [username, setUsername] = useState("");
  const [branches, setBranches] = useState<{ name: string }[]>([]);
  const [branchLoading, setBranchLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadBranches = () => {
    if (!repo.trim() || !accessToken) return;
    setBranchLoading(true);
    fetchBranches(repo.trim(), accessToken).then((res) => {
      setBranchLoading(false);
      if (Array.isArray(res)) {
        setBranches(res);
        if (res.length && !res.some((b) => b.name === branch)) {
          setBranch(res[0].name);
        }
      }
    });
  };

  const handleAnalyze = () => {
    if (!repo.trim() || !username.trim() || !accessToken) return;
    setResult(null);
    startTransition(async () => {
      const res = await analyzeCommits(repo.trim(), branch, username.trim(), accessToken);
      setResult(res);
    });
  };

  const canAnalyze = !!repo.trim() && !!username.trim() && !!accessToken;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Analyze contributions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="repo" className="flex items-center gap-1.5 text-xs">
              <FolderGit2 className="size-3.5" />
              Repository
            </Label>
            <div className="flex gap-2">
              <Input
                id="repo"
                placeholder="owner/repo"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                onBlur={loadBranches}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch" className="flex items-center gap-1.5 text-xs">
              <GitBranch className="size-3.5" />
              Branch
            </Label>
            <Select
              value={branch}
              onValueChange={setBranch}
              disabled={branchLoading || branches.length === 0}
            >
              <SelectTrigger id="branch" className="w-full">
                <SelectValue placeholder={branchLoading ? "Loading…" : "Select branch"} />
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b.name} value={b.name}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username" className="flex items-center gap-1.5 text-xs">
              <User className="size-3.5" />
              GitHub username
            </Label>
            <Input
              id="username"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleAnalyze}
              disabled={!canAnalyze || isPending}
              className="w-full sm:w-auto"
            >
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isPending ? "Analyzing…" : "Generate report"}
            </Button>
          </div>
        </div>
      </div>

      {result?.success === false && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-4">
            <p className="text-sm text-destructive">{result.error}</p>
          </CardContent>
        </Card>
      )}

      {result?.success === true && (
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Total commits" value={result.stats.totalCommits} />
            <StatsCard title="Features shipped" value={result.stats.featuresShipped} />
            <StatsCard title="Active days" value={result.stats.activeDays} />
            <StatsCard
              title="Impact score"
              value={`${result.analysis.impact_score}/10`}
            />
          </div>

          <div className="grid gap-2 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Detailed summary</CardTitle>
                  <CardDescription>AI-generated analytical overview from commit history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {"detailed_summary" in result.analysis
                      ? result.analysis.detailed_summary
                      : (result.analysis as { summary?: string }).summary ?? ""}
                  </div>
                  {result.stats.topFileAreas.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {result.stats.topFileAreas.slice(0, 10).map(({ path, count }) => (
                        <Badge key={path} variant="secondary" className="text-xs">
                          {path} ({count})
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {"important_things" in result.analysis && result.analysis.important_things?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Important things</CardTitle>
                    <CardDescription>Concrete work items and their significance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.analysis.important_things.map((item, i) => (
                        <li key={i} className="border-l-2 border-primary/30 pl-4">
                          <p className="font-medium text-foreground text-sm">{item.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Key areas worked on</CardTitle>
                </CardHeader>
                <CardContent>
                  {result.analysis.key_areas.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No specific areas inferred.</p>
                  ) : (
                    <ul className="space-y-2">
                      {result.analysis.key_areas.map((area, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-0.5">✓</span>
                          {area}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <ActivityChart data={result.commitsPerDay} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
