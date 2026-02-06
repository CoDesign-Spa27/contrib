"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { User, FolderGit2, GitBranch, ExternalLink } from "lucide-react";
import type { GitHubUser } from "@/lib/github";

interface ContributorCardProps {
  user: GitHubUser | null;
  inputs: { repo: string; branch: string; username: string };
}

export function ContributorCard({ user, inputs }: ContributorCardProps) {
  return (
    <Card className="overflow-hidden border-border/50 font-bricolage-grotesque">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 px-6 py-0">
          <div className="flex items-center gap-4 shrink-0">
            {user?.avatar_url ? (
              <div className="relative size-16 rounded-full overflow-hidden ring-2 ring-primary/20 bg-muted">
                <Image
                  src={user.avatar_url}
                  alt={`${user.login} avatar`}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex size-16 sm:size-20 rounded-full bg-muted items-center justify-center ring-2 ring-primary/20">
                <User className="size-8 sm:size-10 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-bold text-xl font-instrument-serif truncate">
                {user?.name ?? inputs.username}
              </p>
              <a
                href={user?.html_url ?? `https://github.com/${inputs.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1 mt-0.5"
              >
                @{inputs.username}
                <ExternalLink className="size-3.5 shrink-0" />
              </a>
            </div>
          </div>
          <div className="flex-1 grid gap-3 sm:grid-cols-2 min-w-0 border-t sm:border-t-0 sm:border-l border-border/60 pt-4 sm:pt-0 sm:pl-6">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FolderGit2 className="size-3.5" />
                Repository
              </p>
              <a
                href={`https://github.com/${inputs.repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-foreground hover:text-primary hover:underline truncate block"
              >
                {inputs.repo}
              </a>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <GitBranch className="size-3.5" />
                Branch
              </p>
              <p className="text-sm font-medium text-foreground">{inputs.branch}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
