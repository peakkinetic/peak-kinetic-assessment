"use client";

import { Badge } from "@/components/ui/Badge";
import { formatNationalRank, getTierBadgeVariant } from "@/lib/normComparison";
import { hittraxTierColors } from "@/lib/brandColors";
import type { NormComparisonResult } from "@/lib/normComparison";

const tierSegments = [
  {
    label: "Below Average",
    color: hittraxTierColors.belowAverage,
    rangeKey: "needsImprovement" as const,
  },
  {
    label: "Average",
    color: hittraxTierColors.average,
    rangeKey: "average" as const,
  },
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
    <div className="hittrax-rank-chart rounded-xl border border-pkp-gray-200 bg-white p-4">
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

      <div className="relative pb-2 pt-6">
        <div
          className="hittrax-rank-marker absolute top-0 z-10 flex w-0 flex-col items-center"
          style={{ left: `${percentile}%` }}
          aria-label={`Athlete ranks at the ${comparison.nationalRankPercentile}th percentile`}
        >
          <div className="h-4 w-1 rounded-full bg-pkp-black" />
          <div className="hittrax-rank-marker-tip h-0 w-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-pkp-black" />
        </div>

        <div className="hittrax-rank-bar flex h-4 overflow-hidden rounded-full border border-pkp-gray-300">
          {tierSegments.map((segment) => (
            <div
              key={segment.label}
              className="h-full w-1/4"
              style={{ backgroundColor: segment.color }}
            />
          ))}
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
