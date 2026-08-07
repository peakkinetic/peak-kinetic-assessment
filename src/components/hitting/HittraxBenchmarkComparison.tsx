"use client";

import { Card, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import type { MetricItem } from "@/types";
import {
  formatSignedDifference,
  getTierBadgeVariant,
} from "@/lib/normComparison";
import { HittraxMetricRankCharts } from "@/components/hitting/HittraxMetricRankCharts";
import { getHittraxNationalComparison } from "@/lib/hittraxNormComparison";
import { useCoachSession } from "@/context/CoachSessionContext";

interface HittraxBenchmarkComparisonProps {
  metrics: MetricItem[];
}

export function HittraxBenchmarkComparison({ metrics }: HittraxBenchmarkComparisonProps) {
  const { athlete } = useCoachSession();
  if (!athlete || metrics.length === 0) {
    return null;
  }

  const comparison = getHittraxNationalComparison(metrics, athlete.gender);

  if (comparison.comparisons.length === 0) {
    return null;
  }

  return (
    <Card accent className="mt-8">
      <CardHeader
        title="National Hittrax Comparison"
        subtitle={`Athlete results vs ${comparison.poolLabel} benchmarks`}
        action={<Badge variant="black">{athlete.gender}</Badge>}
      />

      <div className="mb-6 overflow-hidden rounded-xl border border-pkp-gray-200 bg-pkp-black p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
          Overall Hitting Profile
        </p>
        <p className="mt-2 text-4xl font-bold tabular-nums text-pkp-red">
          {comparison.averageTierScore}
          <span className="text-lg font-semibold text-white/50"> / 5 avg</span>
        </p>
        <p className="mt-3 text-xs leading-relaxed text-white/60">
          Elite = 5 · Good = 4 · Average = 3 · Below Average = 2
        </p>
      </div>

      <div className="mb-8">
        <HittraxMetricRankCharts metrics={metrics} gender={athlete.gender} />
      </div>

      <div className="mb-8">
        <p className="mb-3 text-sm font-bold uppercase tracking-wide text-pkp-black">
          Benchmark Ranges
        </p>
        <DataTable
          headers={["Metric", "Athlete", "Average", "Good", "Elite", "Rating"]}
          rows={comparison.comparisons.map((item) => [
            item.label,
            `${item.athleteValue}${item.unit ? ` ${item.unit}` : ""}`,
            item.ranges.average,
            item.ranges.good,
            item.ranges.elite,
            <Badge key={`${item.testId}-tier`} variant={getTierBadgeVariant(item.tier)}>
              {item.tier}
            </Badge>,
          ])}
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-pkp-black">Distance From Tier Thresholds</p>
        <p className="mb-3 text-xs text-pkp-gray-500">
          Exit velocity and distance use standard higher-is-better thresholds. Launch angle
          compares distance from the optimal attack window (15°–25°).
        </p>
        <DataTable
          headers={["Metric", "vs Average", "vs Good", "vs Elite"]}
          rows={comparison.comparisons.map((item) => [
            item.label,
            formatSignedDifference(item.vsAverage, item.unit),
            formatSignedDifference(item.vsGood, item.unit),
            formatSignedDifference(item.vsElite, item.unit),
          ])}
        />
      </div>
    </Card>
  );
}
