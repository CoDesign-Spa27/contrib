"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, GitBranch, User, FolderGit2 } from "lucide-react";

interface AnalysisFormProps {
  repo: string;
  onRepoChange: (value: string) => void;
  onRepoBlur: () => void;
  branch: string;
  onBranchChange: (value: string) => void;
  branches: { name: string }[];
  branchLoading: boolean;
  username: string;
  onUsernameChange: (value: string) => void;
  canAnalyze: boolean;
  isPending: boolean;
  onAnalyze: () => void;
}

export function AnalysisForm({
  repo,
  onRepoChange,
  onRepoBlur,
  branch,
  onBranchChange,
  branches,
  branchLoading,
  username,
  onUsernameChange,
  canAnalyze,
  isPending,
  onAnalyze,
}: AnalysisFormProps) {
  return (
    <section className="space-y-2">
      <Card className="border-border/50">
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
            {/* Repository input */}
            <div className="space-y-2 lg:col-span-4">
              <Label htmlFor="repo" className="flex items-center gap-1.5 font-bold text-base">
                <FolderGit2 className="size-3.5" />
                Repository
              </Label>
              <Input
                id="repo"
                placeholder="owner/repo"
                value={repo}
                onChange={(e) => onRepoChange(e.target.value)}
                onBlur={onRepoBlur}
              />
            </div>

            {/* Branch select */}
            <div className="space-y-2 lg:col-span-3">
              <Label htmlFor="branch" className="flex items-center gap-1.5 text-base font-bold">
                <GitBranch className="size-3.5" />
                Branch
              </Label>
              {branchLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-7 w-full animate-pulse rounded-2xl bg-muted" />
                </div>
              ) : (
                <Select
                  value={branch}
                  onValueChange={onBranchChange}
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
              )}
            </div>

            {/* Username input */}
            <div className="space-y-2 lg:col-span-3">
              <Label htmlFor="username" className="flex items-center gap-1.5 text-base font-bold">
                <User className="size-3.5" />
                GitHub username
              </Label>
              <Input
                id="username"
                placeholder="username"
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
              />
            </div>

            {/* Submit button */}
            <div className="flex items-end lg:col-span-2">
              <Button
                onClick={onAnalyze}
                disabled={!canAnalyze || isPending}
                className="w-full lg:w-auto text-white"
              >
                {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                {isPending ? "Analyzing…" : "Generate report"}
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18px" height="18px" viewBox="0 0 18 18">
                  <path d="M5.65802 2.98996L4.39502 2.56894L3.97402 1.30606C3.83702 0.898061 3.16202 0.898061 3.02502 1.30606L2.60402 2.56894L1.34103 2.98996C1.13703 3.05796 0.999023 3.24896 0.999023 3.46396C0.999023 3.67896 1.13703 3.86996 1.34103 3.93796L2.60402 4.35898L3.02502 5.62198C3.09302 5.82598 3.28502 5.96396 3.50002 5.96396C3.71502 5.96396 3.90602 5.82598 3.97502 5.62198L4.39603 4.35898L5.65902 3.93796C5.86302 3.86996 6.00102 3.67896 6.00102 3.46396C6.00102 3.24896 5.86202 3.05796 5.65802 2.98996Z" fill="#F7F8F8"></path>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.50007 2C9.80783 2.00003 10.0843 2.18808 10.1975 2.47429L11.99 7.00903L16.5258 8.80255C16.812 8.91571 17 9.19224 17 9.5C17 9.80776 16.812 10.0843 16.5258 10.1975L11.99 11.9909L10.1975 16.5257C10.0843 16.8119 9.80783 17 9.50007 17C9.1923 17 8.91575 16.812 8.80256 16.5258L7.00905 11.991L2.47417 10.1974C2.18799 10.0843 2 9.80774 2 9.5C2 9.19226 2.18799 8.91575 2.47417 8.80256L7.00905 7.00903L8.80256 2.47417C8.91575 2.18797 9.1923 1.99997 9.50007 2Z" fill="#F7F8F8" fill-opacity="0.4" data-color="color-2"></path>
                </svg>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
