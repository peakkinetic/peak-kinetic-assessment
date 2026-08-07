"use client";

import { Badge } from "@/components/ui/Badge";
import { formatNationalRank, getTierBadgeVariant } from "@/lib/normComparison";
import { hittraxTierColors } from "@/lib/brandColors";
import type { NormComparisonResult } from "@/lib/normComparison";

const tierSegments = [
  { label: "Below Average", color: hittraxTierColors.belowAverage, rangeKey: "needsImprovement" as const },
  { label: "Average", color: hittraxTierColors.average, rangeKey: "average" as const },
  { label: "Good", color: hittraxTierColors.good, rangeKey: "good" as const },
  { label: "Elite", color: hittraxTierColors.elite, rangeKey: "elite" as const },
];

interface HittraxMetricRankChartProps {
  comparison: NormComparisonResult;
}

export function HittraxMetricRankChart({ comparison }: HittraxMetricRankChartProps) {
  const percentile = Math.min(99, Math.max(1, comparison.nationalRankPercentile));
  const unitSuffix = comparison.unit ? ` ${comparison.unit}` : "";

  return (
    <div className="rounded-xl border border-pkp-gray-200 bg-white p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-pkp-black">{comparison.label}</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-pkp-black">
            {comparison.athleteValue}
            {unitSuffix}
          </p>
          <p className="mt-0.5 text-xs text-pkp-gray-500">
            {formatNationalRank(comparison.nationalRankPercentile)} nationally
          </p>
        </div>
        <Badge variant={getTierBadgeVariant(comparison.tier)}>{comparison.tier}</Badge>
      </div>

      <div className="relative pb-6 pt-1">
        <div className="flex h-3 overflow-hidden rounded-full">
          {tierSegments.map((segment) => (
            <div
              key={segment.label}
              className="h-full w-1/4"
              style={{ backgroundColor: segment.color }}
            />
          ))}
        </div>

        <div
          className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
          style={{ left: `${percentile}%` }}
          aria-label={`Athlete ranks at the ${comparison.nationalRankPercentile}th percentile`}
        >
          <div className="h-5 w-1 rounded-full bg-pkp-black shadow-sm" />
          <div className="mt-0.5 h-2.5 w-2.5 rotate-45 bg-pkp-black" />
        </div>

        <div className="mt-3 grid grid-cols-4 gap-1">
          {tierSegments.map((segment) => (
            <div key={segment.label} className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-pkp-gray-500">
                {segment.label}
              </p>
              <p className="mt-0.5 text-[10px] leading-tight text-pkp-gray-400">
                {comparison.ranges[segment.rangeKey]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
