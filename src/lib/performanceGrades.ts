import type { MetricItem } from "@/types";

export interface PerformanceCategoryGrade {
  category: "Speed" | "Power";
  grade: string;
  score: number;
  testCount: number;
}

export function getLetterGradeFromPercentile(percentile: number): string {
  if (percentile >= 90) return "A";
  if (percentile >= 80) return "B";
  if (percentile >= 60) return "C";
  if (percentile >= 20) return "D";
  return "F";
}

export function getAveragePercentile(metrics: MetricItem[]): number | null {
  const withPercentile = metrics.filter((metric) => metric.percentile !== undefined);
  if (withPercentile.length === 0) return null;

  const sum = withPercentile.reduce((total, metric) => total + (metric.percentile ?? 0), 0);
  return Math.round(sum / withPercentile.length);
}

export function getCategoryGrade(
  metrics: MetricItem[],
  category: "Speed" | "Power"
): PerformanceCategoryGrade | null {
  const score = getAveragePercentile(metrics);
  if (score === null) return null;

  return {
    category,
    grade: getLetterGradeFromPercentile(score),
    score,
    testCount: metrics.filter((metric) => metric.percentile !== undefined).length,
  };
}
