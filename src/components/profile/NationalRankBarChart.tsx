"use client";

import { BarChart } from "@/components/charts/BarChart";
import { NationalRankChartNote, NationalRankLegend } from "@/components/profile/NationalRankLegend";
import { getPercentileBarColor } from "@/lib/normComparison";

interface NationalRankBarChartProps {
  labels: string[];
  percentiles: number[];
  title?: string;
  height?: number;
}

export function NationalRankBarChart({
  labels,
  percentiles,
  title = "National Rank by Test",
  height = 320,
}: NationalRankBarChartProps) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-pkp-black">{title}</p>
      <BarChart
        labels={labels}
        datasets={[
          {
            label: "National Percentile",
            data: percentiles,
            barColors: percentiles.map((percentile) => getPercentileBarColor(percentile)),
          },
        ]}
        horizontal
        height={height}
        maxValue={100}
        valueSuffix="%"
        yAxisLabel="National Percentile"
      />
      <NationalRankLegend />
      <NationalRankChartNote>
        Percentile rank is estimated from PKP national benchmark ranges. Higher is better relative
        to high school athletes nationally.
      </NationalRankChartNote>
    </div>
  );
}
