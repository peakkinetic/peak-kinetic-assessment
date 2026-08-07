"use client";

import { HittraxMetricRankChart } from "@/components/hitting/HittraxMetricRankChart";
import { getHittraxNationalComparison } from "@/lib/hittraxNormComparison";
import { hittraxTierColors } from "@/lib/brandColors";
import type { Athlete, MetricItem } from "@/types";

interface HittraxMetricRankChartsProps {
  metrics: MetricItem[];
  gender: Athlete["gender"];
}

const tierLegend = [
  { label: "Athlete", color: hittraxTierColors.athlete },
  { label: "Elite", color: hittraxTierColors.elite },
  { label: "Good", color: hittraxTierColors.good },
  { label: "Average", color: hittraxTierColors.average },
  { label: "Below Average", color: hittraxTierColors.belowAverage },
] as const;

export function HittraxMetricRankCharts({ metrics, gender }: HittraxMetricRankChartsProps) {
  const comparison = getHittraxNationalComparison(metrics, gender);

  if (comparison.comparisons.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="mb-1 text-sm font-semibold text-pkp-black">National Rank by Metric</p>
      <p className="mb-3 text-xs text-pkp-gray-500">
        Each graphic shows where the athlete ranks against national high school hitter benchmarks.
        The black marker is their estimated percentile; colored bands match the tier ranges listed
        below.
      </p>

      <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2">
        {tierLegend.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs text-pkp-gray-600">
            {item.label === "Athlete" ? (
              <span className="inline-flex h-3 w-3 items-center justify-center">
                <span className="h-2.5 w-2.5 rotate-45 bg-pkp-black" />
              </span>
            ) : (
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
            )}
            {item.label}
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {comparison.comparisons.map((item) => (
          <HittraxMetricRankChart key={item.testId} comparison={item} />
        ))}
      </div>
    </div>
  );
}
