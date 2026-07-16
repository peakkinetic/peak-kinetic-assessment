import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn, getTrendColor } from "@/lib/utils";
import { Card } from "./Card";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  percentile?: number;
  percentileCaption?: string;
  trend?: "up" | "down" | "neutral";
  change?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  unit,
  percentile,
  percentileCaption,
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
        {percentile !== undefined && (
          <div>
            <span className="rounded-md bg-pkp-black px-2.5 py-0.5 text-xs font-semibold text-white">
              {percentile}th pct
            </span>
            {percentileCaption && (
              <p className="mt-1.5 text-[10px] font-medium leading-snug text-pkp-gray-400">
                vs. {percentileCaption}
              </p>
            )}
          </div>
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
