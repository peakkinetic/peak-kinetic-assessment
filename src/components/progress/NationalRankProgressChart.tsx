"use client";

import { BarChart } from "@/components/charts/BarChart";
import { Card, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { NationalRankChartNote, NationalRankLegend } from "@/components/profile/NationalRankLegend";
import { useCoachSession } from "@/context/CoachSessionContext";
import { getNormPoolForClassification, getTestNormsForPool } from "@/data/nationalNorms";
import {
  formatNationalRank,
  getNationalRankForTest,
  getPercentileBarColor,
  getTierBadgeVariant,
  classifyPerformance,
} from "@/lib/normComparison";

export function NationalRankProgressChart() {
  const { classification, nationalRankProgress } = useCoachSession();

  if (!classification || nationalRankProgress.length === 0) {
    return null;
  }

  const poolId = getNormPoolForClassification(classification.id);
  const norms = getTestNormsForPool(poolId);

  const entries = nationalRankProgress.map((entry) => {
    const norm = norms.find((test) => test.id === entry.testId);
    if (!norm) {
      throw new Error(`Missing national norms for test: ${entry.testId}`);
    }

    const startPercentile = getNationalRankForTest(entry.testId, entry.startValue, poolId);
    const currentPercentile = getNationalRankForTest(entry.testId, entry.currentValue, poolId);
    const currentTier = classifyPerformance(
      entry.currentValue,
      norm.boundaries,
      norm.higherIsBetter
    );
    const change = currentPercentile - startPercentile;

    return {
      ...entry,
      startPercentile,
      currentPercentile,
      currentTier,
      change,
    };
  });

  const startLabel = entries[0]?.startLabel ?? "Start";
  const currentLabel = entries[0]?.currentLabel ?? "Latest";

  return (
    <Card className="mb-8">
      <CardHeader
        title="National Rank Progress"
        subtitle={`Estimated percentile rank from ${startLabel} baseline to ${currentLabel} results`}
      />

      <div className="mb-8">
        <p className="mb-3 text-sm font-semibold text-pkp-black">Rank Change by Test</p>
        <DataTable
          headers={["Test", "Start", "Latest", "Start Rank", "Latest Rank", "Change", "Rating"]}
          rows={entries.map((entry) => [
            entry.label,
            `${entry.startValue} ${entry.unit}`,
            `${entry.currentValue} ${entry.unit}`,
            formatNationalRank(entry.startPercentile),
            formatNationalRank(entry.currentPercentile),
            `${entry.change >= 0 ? "+" : ""}${entry.change} pts`,
            <Badge key={entry.testId} variant={getTierBadgeVariant(entry.currentTier)}>
              {entry.currentTier}
            </Badge>,
          ])}
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-pkp-black">National Rank by Test</p>
        <BarChart
          labels={entries.map((entry) => entry.label)}
          datasets={[
            {
              label: `${startLabel} Rank`,
              data: entries.map((entry) => entry.startPercentile),
              color: "#D4D4D4",
            },
            {
              label: `${currentLabel} Rank`,
              data: entries.map((entry) => entry.currentPercentile),
              barColors: entries.map((entry) => getPercentileBarColor(entry.currentPercentile)),
            },
          ]}
          horizontal
          height={360}
          maxValue={100}
          valueSuffix="%"
          yAxisLabel="National Percentile"
        />
        <NationalRankLegend />
        <NationalRankChartNote>
          Gray bars show where the athlete ranked nationally at their first saved assessment.
          Colored bars show their most recent saved scores for this session.
        </NationalRankChartNote>
      </div>
    </Card>
  );
}
