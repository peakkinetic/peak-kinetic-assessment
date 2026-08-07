"use client";

import { StatCard } from "@/components/ui/StatCard";
import { HittraxBenchmarkComparison } from "@/components/hitting/HittraxBenchmarkComparison";
import { enrichHittraxMetricsWithTiers } from "@/lib/hittraxNormComparison";
import type { MetricItem } from "@/types";

export function HittingTestMetrics({
  metrics,
  emptyMessage,
  showNationalComparison = false,
}: {
  metrics: MetricItem[];
  emptyMessage: string;
  showNationalComparison?: boolean;
}) {
  if (metrics.length === 0) {
    return <p className="mb-4 text-sm text-pkp-gray-500">{emptyMessage}</p>;
  }

  const ratedMetrics = showNationalComparison ? enrichHittraxMetricsWithTiers(metrics) : metrics;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ratedMetrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </div>

      {showNationalComparison && (
        <>
          <p className="mt-4 text-xs text-pkp-gray-500">
            Each metric is rated Elite, Good, Average, or Below Average against national high school
            Hittrax benchmarks for hitters across the country.
          </p>
          <HittraxBenchmarkComparison metrics={metrics} />
        </>
      )}
    </>
  );
}
