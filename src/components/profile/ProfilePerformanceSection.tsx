"use client";

import { StatCard } from "@/components/ui/StatCard";
import { NationalRankingChart } from "@/components/profile/NationalRankingChart";
import { useCoachSession } from "@/context/CoachSessionContext";
import { enrichMetricsWithPerformanceTiers } from "@/lib/normComparison";

export function ProfilePerformanceSection() {
  const { athlete, classification, performanceMetrics } = useCoachSession();

  if (!athlete || !classification || !classification.modules.includes("performance-testing")) {
    return null;
  }

  const metrics = enrichMetricsWithPerformanceTiers(performanceMetrics, classification.id);

  if (metrics.length === 0) {
    return (
      <p className="mb-8 text-sm text-pkp-gray-500">
        No performance scores saved for this assessment yet. Enter them on the Performance Testing
        page.
      </p>
    );
  }

  return (
    <>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="mb-8 lg:col-span-2">
        <NationalRankingChart
          gender={athlete.gender}
          metrics={metrics}
          classificationId={classification.id}
        />
      </div>
    </>
  );
}
