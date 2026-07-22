"use client";

import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn, getTrendColor } from "@/lib/utils";
import { getTierBadgeVariant } from "@/lib/normComparison";
import { Badge } from "./Badge";
import { Card } from "./Card";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  tier?: "Elite" | "Good" | "Average" | "Below Average";
  trend?: "up" | "down" | "neutral";
  change?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  unit,
  tier,
  trend,
  change,
  className,
}: StatCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <Card hover accent className={cn("animate-fade-in", className)}>
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-pkp-gray-500">{label}</p>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-3xl font-bold tabular-nums tracking-tight">{value}</span>
        {unit && <span className="text-sm font-semibold text-pkp-gray-400">{unit}</span>}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        {tier && (
          <Badge variant={getTierBadgeVariant(tier)}>{tier}</Badge>
        )}
        {trend && change && (
          <span className={cn("flex items-center gap-1 text-xs font-semibold", getTrendColor(trend))}>
            <TrendIcon className="h-3 w-3" />
            {change}
          </span>
        )}
      </div>
    </Card>
  );
}
