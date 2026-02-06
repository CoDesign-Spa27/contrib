"use client";

import { useState, useTransition } from "react";
import { analyzeCommits, type AnalyzeResult } from "@/actions/analyze";
import { fetchBranches } from "@/actions/github";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Sparkles } from "lucide-react";
import { motion } from "motion/react";

import { AnalysisForm } from "./analysis-form";
import { StatsCard } from "./stats-card";
import { ActivityChart } from "./activity-chart";
import { FileAreasChart } from "./file-areas-chart";
import { ContributorCard } from "./contributor-card";
import { AnalysisResults, KeyAreasSidebar } from "./analysis-results";
import { LoadingState } from "./loading-state";

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
    <div className="space-y-2">
      {/* Input form */}
      <AnalysisForm
        repo={repo}
        onRepoChange={setRepo}
        onRepoBlur={loadBranches}
        branch={branch}
        onBranchChange={setBranch}
        branches={branches}
        branchLoading={branchLoading}
        username={username}
        onUsernameChange={setUsername}
        canAnalyze={canAnalyze}
        isPending={isPending}
        onAnalyze={handleAnalyze}
      />
 
      {!result && (
        <Card className="border-muted font-bricolage-grotesque">
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <span className="font-bold font-instrument-serif text-base text-yellow-500">Note:</span> Analysis may take a moment to generate as we process commit history and generate AI insights.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error state */}
      {result?.success === false && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="pt-4">
            <p className="text-sm text-destructive">{result.error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {isPending && <LoadingState />}

      {/* Results */}
      {result?.success === true && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          {/* Contributor profile */}
          <ContributorCard user={result.user} inputs={result.inputs} />

          {/* Stats grid */}
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total commits"
              value={result.stats.totalCommits}
            />
            <StatsCard
              title="Changes shipped"
              value={result.stats.changesShipped}
            />
            <StatsCard
              title="Active days"
              value={result.stats.activeDays}
            />
            <StatsCard
              title="Impact score"
              value={`${result.analysis.impact_score}/10`}
            />
          </div>

          {/* Main content grid */}
          <div className="grid gap-2 lg:grid-cols-12">
            {/* Left column: Summary + Important things */}
            <AnalysisResults analysis={result.analysis} />

            {/* Right column: Key areas, Activity chart, File areas */}
            <div className="space-y-2 lg:col-span-4">
              <KeyAreasSidebar
                analysis={result.analysis}
                commitsPerDay={result.commitsPerDay}
                topFileAreas={result.stats.topFileAreas}
              />
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
