import type { AssessmentResult, MetricItem } from "@/types";

export function buildHittingTestMetrics(
  moduleId: "hittrax-testing" | "blast-testing",
  results: AssessmentResult[],
  tests: readonly { id: string; label: string; unit: string }[]
): MetricItem[] {
  const moduleResults = results.filter((result) => result.moduleId === moduleId);

  return tests.flatMap((test) => {
    const result = moduleResults.find((item) => item.testId === test.id);
    if (!result) return [];

    return [
      {
        label: test.label,
        value: result.value,
        unit: test.unit,
      },
    ];
  });
}

export function getHittingTestResultValue(
  results: AssessmentResult[],
  moduleId: "hittrax-testing" | "blast-testing",
  testId: string
): number | undefined {
  return results.find(
    (result) => result.moduleId === moduleId && result.testId === testId
  )?.value;
}
