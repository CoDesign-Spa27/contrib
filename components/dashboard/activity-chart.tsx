"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BarChart3 } from "lucide-react";
import { motion } from "motion/react";

interface ActivityChartProps {
  data: Record<string, number>;
}

export function ActivityChart({ data }: ActivityChartProps) {
  const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b));
  const slice = entries.slice(-28);
  const max = Math.max(1, ...slice.map(([, v]) => v));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="size-4 text-primary" />
          Commits per day
        </CardTitle>
        <CardDescription>Last 28 days</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={200} skipDelayDuration={100}>
          <div className="flex items-end gap-1 h-36">
            {slice.map(([date, count], i) => {
              const pct = (count / max) * 100;
              const label = `${date}: ${count} commit${count !== 1 ? "s" : ""}`;
              return (
                <Tooltip key={date}>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ height: 0, opacity: 0.6 }}
                      animate={{ height: `${Math.max(pct, 4)}%`, opacity: 1 }}
                      transition={{ delay: i * 0.02, duration: 0.35, ease: "easeOut" }}
                      className="flex-1 min-w-0 flex flex-col justify-end group cursor-default"
                    >
                      <div
                        className="w-full rounded-t-md bg-linear-to-t from-chart-4 to-chart-2 transition-all hover:from-chart-3 hover:to-chart-1 min-h-[6px]"
                        style={{ height: "100%" }}
                      />
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="font-normal">
                    {label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
        <div className="mt-3 flex justify-between text-[10px] text-muted-foreground">
          <span>{slice[0]?.[0] ?? "—"}</span>
          <span>{slice[slice.length - 1]?.[0] ?? "—"}</span>
        </div>
      </CardContent>
    </Card>
  );
}
