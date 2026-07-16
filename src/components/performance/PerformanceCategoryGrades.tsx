"use client";

import { speedTestIds, powerTestIds } from "@/data/performanceTesting";
import { GradeBadge } from "@/components/ui/DataTable";
import { useCoachSession } from "@/context/CoachSessionContext";
import { getPerformanceTestId } from "@/lib/assessmentAccess";
import { enrichMetricsWithNationalPercentiles } from "@/lib/normComparison";
import { getCategoryGrade } from "@/lib/performanceGrades";
import type { MetricItem, PerformanceTestId } from "@/types";

function filterMetricsByTestIds(metrics: MetricItem[], testIds: PerformanceTestId[]): MetricItem[] {
  return metrics.filter((metric) => {
    const testId = getPerformanceTestId(metric.label);
    return testId ? testIds.includes(testId) : false;
  });
}

export function PerformanceCategoryGrades() {
  const { classification, performanceMetrics } = useCoachSession();

  if (!classification) {
    return null;
  }

  const metrics = enrichMetricsWithNationalPercentiles(performanceMetrics, classification.id);
  const grades = [
    getCategoryGrade(filterMetricsByTestIds(metrics, speedTestIds), "Speed"),
    getCategoryGrade(filterMetricsByTestIds(metrics, powerTestIds), "Power"),
  ].filter((grade): grade is NonNullable<typeof grade> => grade !== null);

  if (grades.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 mt-8 flex flex-wrap gap-3">
      {grades.map((grade) => (
        <div
          key={grade.category}
          className="flex items-center gap-3 rounded-xl border border-pkp-gray-200 bg-white px-4 py-3 shadow-[var(--shadow-card)]"
        >
          <GradeBadge grade={grade.grade} />
          <div>
            <p className="text-sm font-semibold">{grade.category}</p>
            <p className="text-xs text-pkp-gray-400">
              {grade.score}/100 avg national pct · {grade.testCount} tests
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
