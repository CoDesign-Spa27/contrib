"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { motion } from "motion/react";

interface FileAreasChartProps {
  areas: { path: string; count: number }[];
}

export function FileAreasChart({ areas }: FileAreasChartProps) {
  const top = areas.slice(0, 8);
  const max = Math.max(1, ...top.map((a) => a.count));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>Top file areas</CardTitle>
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
                <span className="tabular-nums font-bold">{count}</span>
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
