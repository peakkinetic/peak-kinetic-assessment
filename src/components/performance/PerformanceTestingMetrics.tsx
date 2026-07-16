"use client";

import { speedTestIds, powerTestIds } from "@/data/performanceTesting";
import { StatCard } from "@/components/ui/StatCard";
import { useCoachSession } from "@/context/CoachSessionContext";
import { getPerformanceTestId, performanceTestLabels } from "@/lib/assessmentAccess";
import { enrichMetricsWithNationalPercentiles } from "@/lib/normComparison";
import { getNormPoolLabel, getNormPoolForClassification } from "@/data/nationalNorms";
import type { MetricItem, PerformanceTestId } from "@/types";

function filterMetricsByTestIds(metrics: MetricItem[], testIds: PerformanceTestId[]): MetricItem[] {
  return metrics.filter((metric) => {
    const testId = getPerformanceTestId(metric.label);
    return testId ? testIds.includes(testId) : false;
  });
}

export function PerformanceTestingMetrics() {
  const { athlete, classification, activePerformanceTests, performanceMetrics } = useCoachSession();

  if (!classification || !athlete) {
    return null;
  }

  const metrics = enrichMetricsWithNationalPercentiles(performanceMetrics, classification.id);
  const speed = filterMetricsByTestIds(metrics, speedTestIds);
  const power = filterMetricsByTestIds(metrics, powerTestIds);
  const poolId = getNormPoolForClassification(classification.id);
  const poolLabel = getNormPoolLabel(poolId, athlete.gender);
  const percentileCaption = `${poolLabel} nationally`;

  if (metrics.length === 0) {
    return (
      <p className="mb-4 text-sm text-pkp-gray-500">
        No scores entered yet. Use the form above to add this athlete&apos;s test results.
      </p>
    );
  }

  return (
    <>
      {speed.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-pkp-black">Speed</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {speed.map((metric) => (
              <StatCard key={metric.label} {...metric} percentileCaption={percentileCaption} />
            ))}
          </div>
        </div>
      )}

      {power.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-pkp-black">Power</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {power.map((metric) => (
              <StatCard key={metric.label} {...metric} percentileCaption={percentileCaption} />
            ))}
          </div>
        </div>
      )}

      <p className="mb-2 text-xs text-pkp-gray-500">
        Percentiles compare each result to the national average for {poolLabel.toLowerCase()}. The
        50th percentile is the national average for that age group.
      </p>

      <p className="text-xs text-pkp-gray-500">
        Active tests: {activePerformanceTests.map((id) => performanceTestLabels[id]).join(" · ")}
      </p>
    </>
  );
}
