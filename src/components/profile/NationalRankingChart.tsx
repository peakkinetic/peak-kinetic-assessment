"use client";

import { Card, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import type { Athlete, MetricItem } from "@/types";
import {
  formatSignedDifference,
  getNationalComparisonFromMetrics,
  getTierBadgeVariant,
} from "@/lib/normComparison";
import { useCoachSession } from "@/context/CoachSessionContext";

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

  if (comparison.comparisons.length === 0) {
    return null;
  }

  return (
    <Card accent>
      <CardHeader
        title="Benchmark Comparison"
        subtitle={`Athlete results vs PKP ${comparison.poolLabel.toLowerCase()} standards`}
        action={<Badge variant="black">{gender}</Badge>}
      />

      <div className="mb-6 overflow-hidden rounded-xl border border-pkp-gray-200 bg-pkp-black p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
          Overall Category Points
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
        <p className="mb-3 text-sm font-bold uppercase tracking-wide text-pkp-black">Benchmark Ranges</p>
        <DataTable
          headers={["Test", "Athlete", "Average", "Good", "Elite", "Rating"]}
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
    </Card>
  );
}
