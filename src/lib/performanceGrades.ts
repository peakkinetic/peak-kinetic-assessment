import type { MetricItem } from "@/types";
import type { PerformanceTier } from "@/lib/normComparison";

export interface PerformanceCategoryGrade {
  category: "Speed" | "Power";
  grade: string;
  score: number;
  maxScore: number;
  testCount: number;
}

export const TIER_POINT_VALUES: Record<PerformanceTier, number> = {
  Elite: 5,
  Good: 4,
  Average: 3,
  "Below Average": 2,
};

export const CATEGORY_POINT_MAX = 15;

export function getTierPointValue(tier: PerformanceTier): number {
  return TIER_POINT_VALUES[tier];
}

export function getLetterGradeFromCategoryScore(score: number, maxScore: number): string {
  if (maxScore === 0) return "F";

  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 20) return "D";
  return "F";
}

export function getCategoryGrade(
  metrics: MetricItem[],
  category: "Speed" | "Power",
  maxTests = 3
): PerformanceCategoryGrade | null {
  const scored = metrics.filter((metric) => metric.tier !== undefined);
  if (scored.length === 0) return null;

  const score = scored.reduce(
    (total, metric) => total + getTierPointValue(metric.tier as PerformanceTier),
    0
  );
  const maxScore = maxTests * 5;

  return {
    category,
    grade: getLetterGradeFromCategoryScore(score, maxScore),
    score,
    maxScore,
    testCount: scored.length,
  };
}
