"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import type { AnalysisResult } from "@/actions/analyze";

interface AnalysisResultsProps {
  analysis: AnalysisResult;
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  return (
    <div className="space-y-2 lg:col-span-8">
      {/* Detailed Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Detailed summary</CardTitle>
          <CardDescription>
            AI-generated analytical overview from commit history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {"detailed_summary" in analysis
              ? analysis.detailed_summary
              : (analysis as { summary?: string }).summary ?? ""}
          </div>
        </CardContent>
      </Card>

      {/* Important Things */}
      {"important_things" in analysis &&
        analysis.important_things?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Important things</CardTitle>
              <CardDescription>Concrete work items and their significance</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {analysis.important_things.map((item, i) => (
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
  );
}

interface KeyAreasSidebarProps {
  analysis: AnalysisResult;
  commitsPerDay: Record<string, number>;
  topFileAreas: { path: string; count: number }[];
}

export function KeyAreasSidebar({ analysis }: KeyAreasSidebarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Key areas</CardTitle>
      </CardHeader>
      <CardContent>
        {analysis.key_areas.length === 0 ? (
          <p className="text-xs text-muted-foreground">No specific areas inferred.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {analysis.key_areas.map((area, i) => (
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
  );
}
