import type { AssessmentClassification, AssessmentResult, MetricItem } from "@/types";
import {
  getActivePerformanceTests,
  performanceTestLabels,
  performanceTestUnits,
} from "@/lib/assessmentAccess";

export function buildPerformanceMetrics(
  classification: AssessmentClassification,
  results: AssessmentResult[]
): MetricItem[] {
  const allowedTests = getActivePerformanceTests(classification);
  const performanceResults = results.filter((result) => result.moduleId === "performance-testing");

  return allowedTests.flatMap((testId) => {
    const result = performanceResults.find((item) => item.testId === testId);
    if (!result) return [];

    return [
      {
        label: performanceTestLabels[testId],
        value: result.value,
        unit: performanceTestUnits[testId],
      },
    ];
  });
}

export function getPerformanceResultValue(
  results: AssessmentResult[],
  testId: string
): number | undefined {
  return results.find(
    (result) => result.moduleId === "performance-testing" && result.testId === testId
  )?.value;
}
