"use client";

import { Card, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { NationalRankBarChart } from "@/components/profile/NationalRankBarChart";
import type { Athlete, MetricItem } from "@/types";
import {
  formatNationalRank,
  formatSignedDifference,
  getNationalComparisonFromMetrics,
  getTierBadgeVariant,
} from "@/lib/normComparison";
import { useCoachSession } from "@/context/CoachSessionContext";
import { shouldShowBarCharts } from "@/lib/assessmentAccess";

interface NationalRankingChartProps {
  gender: Athlete["gender"];
  metrics: MetricItem[];
  classificationId?: string;
}

export function NationalRankingChart({ gender, metrics, classificationId }: NationalRankingChartProps) {
  const { activeAssessment } = useCoachSession();
  const comparison = getNationalComparisonFromMetrics(
    metrics,
    gender,
    classificationId ?? activeAssessment?.classificationId
  );
  const showBarChart =
    activeAssessment && shouldShowBarCharts(activeAssessment.classificationId);

  if (comparison.comparisons.length === 0) {
    return null;
  }

  return (
    <Card accent>
      <CardHeader
        title="National Comparison"
        subtitle={`Athlete results vs PKP ${comparison.poolLabel.toLowerCase()} benchmarks`}
        action={<Badge variant="black">{gender}</Badge>}
      />

      <div className="mb-6 overflow-hidden rounded-xl border border-pkp-gray-200 bg-pkp-black p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
          Overall Benchmark Rating
        </p>
        <p className="mt-2 text-4xl font-bold tabular-nums text-pkp-red">{comparison.averageTierScore}</p>
        <p className="mt-3 text-xs leading-relaxed text-white/60">
          Tier scores: Needs Improvement = 25 · Average = 50 · Good = 75 · Elite = 100
        </p>
      </div>

      <div className="mb-8">
        <p className="mb-3 text-sm font-bold uppercase tracking-wide text-pkp-black">Benchmark Ranges</p>
        <DataTable
          headers={["Test", "Athlete", "Average", "Good", "Elite", "Rating", "National Rank"]}
          rows={comparison.comparisons.map((item) => [
            item.label,
            `${item.athleteValue}${item.unit ? ` ${item.unit}` : ""}`,
            item.ranges.average,
            item.ranges.good,
            item.ranges.elite,
            <Badge key={`${item.testId}-tier`} variant={getTierBadgeVariant(item.tier)}>
              {item.tier}
            </Badge>,
            formatNationalRank(item.nationalRankPercentile),
          ])}
        />
      </div>

      <div className="mb-8">
        <p className="mb-3 text-sm font-semibold text-pkp-black">Distance From Tier Thresholds</p>
        <DataTable
          headers={["Test", "vs Average", "vs Good", "vs Elite"]}
          rows={comparison.comparisons.map((item) => [
            item.label,
            formatSignedDifference(item.vsAverage, item.unit),
            formatSignedDifference(item.vsGood, item.unit),
            formatSignedDifference(item.vsElite, item.unit),
          ])}
        />
        <p className="mt-2 text-xs text-pkp-gray-500">
          Positive values mean better than that tier&apos;s entry threshold. Sprint times use
          lower-is-better logic, so a positive value means faster than the threshold.
        </p>
      </div>

      {showBarChart && (
        <NationalRankBarChart
          labels={comparison.comparisons.map((item) => item.label)}
          percentiles={comparison.comparisons.map((item) => item.nationalRankPercentile)}
        />
      )}
    </Card>
  );
}
