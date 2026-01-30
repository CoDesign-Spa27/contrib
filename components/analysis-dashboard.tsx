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
import { Loader2, GitBranch, User, FolderGit2, BarChart3, Sparkles } from "lucide-react";
import { motion } from "motion/react";

function StatsCard({
  title,
  value,
  icon: Icon,
  accent = "primary",
}: {
  title: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  accent?: "primary" | "chart-1" | "chart-2" | "chart-3";
}) {
  const accentBorder = {
    primary: "border-l-primary",
    "chart-1": "border-l-chart-1",
    "chart-2": "border-l-chart-2",
    "chart-3": "border-l-chart-3",
  }[accent];

  return (
    <Card className={`overflow-hidden border-l-4 ${accentBorder} bg-card/50`}>
      <CardHeader className="pb-1 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </CardTitle>
          {Icon && <Icon className="size-4 text-muted-foreground/80" />}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
      </CardContent>
    </Card>
  );
}

function ActivityChart({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b));
  const slice = entries.slice(-28);
  const max = Math.max(1, ...slice.map(([, v]) => v));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <BarChart3 className="size-4 text-primary" />
          Commits per day
        </CardTitle>
        <CardDescription>Last 28 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-1 h-36">
          {slice.map(([date, count], i) => {
            const pct = (count / max) * 100;
            return (
              <motion.div
                key={date}
                initial={{ height: 0, opacity: 0.6 }}
                animate={{ height: `${Math.max(pct, 4)}%`, opacity: 1 }}
                transition={{ delay: i * 0.02, duration: 0.35, ease: "easeOut" }}
                className="flex-1 min-w-0 flex flex-col justify-end group"
                title={`${date}: ${count} commit${count !== 1 ? "s" : ""}`}
              >
                <div
                  className="w-full rounded-t-md bg-linear-to-t from-chart-4 to-chart-2 transition-all hover:from-chart-3 hover:to-chart-1 min-h-[6px]"
                  style={{ height: "100%" }}
                />
              </motion.div>
            );
          })}
        </div>
        <div className="mt-3 flex justify-between text-[10px] text-muted-foreground">
          <span>{slice[0]?.[0] ?? "—"}</span>
          <span>{slice[slice.length - 1]?.[0] ?? "—"}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function FileAreasChart({ areas }: { areas: { path: string; count: number }[] }) {
  const top = areas.slice(0, 8);
  const max = Math.max(1, ...top.map((a) => a.count));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Top file areas</CardTitle>
        <CardDescription>By commit count</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {top.map(({ path, count }, i) => (
            <motion.div
              key={path}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="truncate text-muted-foreground" title={path}>
                  {path}
                </span>
                <span className="tabular-nums font-medium">{count}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / max) * 100}%` }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.4, ease: "easeOut" }}
                  className="h-full rounded-full bg-linear-to-r from-chart-4 to-chart-2"
                />
              </div>
            </motion.div>
          ))}
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
    <div className="space-y-10">
      {/* Section: Input form */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight">Analyze contributions</h2>
        </div>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-12">
              <div className="space-y-2 lg:col-span-4">
                <Label htmlFor="repo" className="flex items-center gap-1.5 text-xs font-medium">
                  <FolderGit2 className="size-3.5" />
                  Repository
                </Label>
                <Input
                  id="repo"
                  placeholder="owner/repo"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  onBlur={loadBranches}
                  className="h-10"
                />
              </div>
              <div className="space-y-2 lg:col-span-3">
                <Label htmlFor="branch" className="flex items-center gap-1.5 text-xs font-medium">
                  <GitBranch className="size-3.5" />
                  Branch
                </Label>
                <Select
                  value={branch}
                  onValueChange={setBranch}
                  disabled={branchLoading || branches.length === 0}
                >
                  <SelectTrigger id="branch" className="h-10 w-full">
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
              <div className="space-y-2 lg:col-span-3">
                <Label htmlFor="username" className="flex items-center gap-1.5 text-xs font-medium">
                  <User className="size-3.5" />
                  GitHub username
                </Label>
                <Input
                  id="username"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="flex items-end lg:col-span-2">
                <Button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze || isPending}
                  className="h-10 w-full lg:w-auto"
                >
                  {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                  {isPending ? "Analyzing…" : "Generate report"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {result?.success === false && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="pt-4">
            <p className="text-sm text-destructive">{result.error}</p>
          </CardContent>
        </Card>
      )}

      {result?.success === true && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Stats row: 4-column grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total commits"
              value={result.stats.totalCommits}
              icon={BarChart3}
              accent="primary"
            />
            <StatsCard
              title="Features shipped"
              value={result.stats.featuresShipped}
              icon={Sparkles}
              accent="chart-1"
            />
            <StatsCard title="Active days" value={result.stats.activeDays} accent="chart-2" />
            <StatsCard
              title="Impact score"
              value={`${result.analysis.impact_score}/10`}
              accent="chart-3"
            />
          </div>

          {/* Main content: 12-col grid */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left: Summary + Important things (8 cols) */}
            <div className="space-y-6 lg:col-span-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Detailed summary</CardTitle>
                  <CardDescription>
                    AI-generated analytical overview from commit history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {"detailed_summary" in result.analysis
                      ? result.analysis.detailed_summary
                      : (result.analysis as { summary?: string }).summary ?? ""}
                  </div>
                </CardContent>
              </Card>

              {"important_things" in result.analysis &&
                result.analysis.important_things?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">Important things</CardTitle>
                      <CardDescription>Concrete work items and their significance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {result.analysis.important_things.map((item, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="border-l-2 border-primary/40 pl-4"
                          >
                            <p className="text-sm font-medium text-foreground">{item.title}</p>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                              {item.description}
                            </p>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
            </div>

            {/* Right: Key areas, Activity chart, File areas (4 cols) */}
            <div className="space-y-6 lg:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Key areas</CardTitle>
                </CardHeader>
                <CardContent>
                  {result.analysis.key_areas.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No specific areas inferred.</p>
                  ) : (
                    <ul className="flex flex-wrap gap-2">
                      {result.analysis.key_areas.map((area, i) => (
                        <motion.li
                          key={area}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.04 }}
                        >
                          <Badge variant="secondary" className="text-xs font-normal">
                            {area}
                          </Badge>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <ActivityChart data={result.commitsPerDay} />

              {result.stats.topFileAreas.length > 0 && (
                <FileAreasChart areas={result.stats.topFileAreas} />
              )}
            </div>
          </div>

        </motion.section>
      )}
    </div>
  );
}
