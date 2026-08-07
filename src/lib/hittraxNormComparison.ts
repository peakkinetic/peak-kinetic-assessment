import type { MetricItem, Athlete } from "@/types";
import {
  classifyHittraxLaunchAngle,
  highSchoolHittraxNorms,
  hittraxNormPoolLabel,
  hittraxTestIdByLabel,
} from "@/data/hittraxNorms";
import type { HittraxTestId } from "@/types";
import {
  calculateNationalRankPercentile,
  classifyPerformance,
  compareToNationalNorms,
  getDifference,
  getTierScore,
  type NormComparisonResult,
  type PerformanceTier,
} from "@/lib/normComparison";

function classifyHittraxMetric(testId: HittraxTestId, value: number): PerformanceTier {
  if (testId === "launch-angle") {
    return classifyHittraxLaunchAngle(value);
  }

  const norm = highSchoolHittraxNorms.find((item) => item.id === testId);
  if (!norm) {
    throw new Error(`Missing Hittrax norms for test: ${testId}`);
  }

  return classifyPerformance(value, norm.boundaries, norm.higherIsBetter);
}

function getHittraxDifferences(testId: HittraxTestId, value: number) {
  const norm = highSchoolHittraxNorms.find((item) => item.id === testId);
  if (!norm) {
    throw new Error(`Missing Hittrax norms for test: ${testId}`);
  }

  if (testId === "launch-angle") {
    const optimal = 20;
    const vsElite = Math.abs(value - optimal);
    const vsGood = Math.max(0, vsElite - 5);
    const vsAverage = Math.max(0, vsElite - 10);
    return {
      vsAverage: -vsAverage,
      vsGood: -vsGood,
      vsElite: -vsElite,
    };
  }

  return {
    vsAverage: getDifference(value, norm.boundaries.average, norm.higherIsBetter),
    vsGood: getDifference(value, norm.boundaries.good, norm.higherIsBetter),
    vsElite: getDifference(value, norm.boundaries.elite, norm.higherIsBetter),
  };
}

export function enrichHittraxMetricsWithTiers(metrics: MetricItem[]): MetricItem[] {
  return metrics.map((metric) => {
    const testId = hittraxTestIdByLabel[metric.label];
    if (!testId) {
      return metric;
    }

    const tier = classifyHittraxMetric(testId, Number(metric.value));
    return { ...metric, tier };
  });
}

export function getHittraxNationalComparison(metrics: MetricItem[], gender: Athlete["gender"]) {
  if (metrics.length === 0) {
    return {
      comparisons: [] as NormComparisonResult[],
      averageTierScore: 0,
      tierScoreSum: 0,
      poolLabel: `${gender} ${hittraxNormPoolLabel}`,
    };
  }

  const standardResults = metrics.flatMap((metric) => {
    const testId = hittraxTestIdByLabel[metric.label];
    if (!testId || testId === "launch-angle") return [];
    return [{ id: testId, value: Number(metric.value) }];
  });

  const standardComparisons = compareToNationalNorms(standardResults, highSchoolHittraxNorms);

  const launchMetric = metrics.find((metric) => hittraxTestIdByLabel[metric.label] === "launch-angle");
  const launchComparison: NormComparisonResult[] = launchMetric
    ? (() => {
        const value = Number(launchMetric.value);
        const norm = highSchoolHittraxNorms.find((item) => item.id === "launch-angle")!;
        const tier = classifyHittraxLaunchAngle(value);
        const differences = getHittraxDifferences("launch-angle", value);

        return [
          {
            testId: norm.id,
            label: norm.label,
            unit: norm.unit,
            athleteValue: value,
            ranges: norm.ranges,
            boundaries: norm.boundaries,
            tier,
            tierScore: getTierScore(tier),
            nationalRankPercentile: calculateNationalRankPercentile(
              value,
              norm.boundaries,
              norm.higherIsBetter
            ),
            ...differences,
          },
        ];
      })()
    : [];

  const order = highSchoolHittraxNorms.map((item) => item.id);
  const comparisons = [...standardComparisons, ...launchComparison].sort(
    (a, b) => order.indexOf(a.testId) - order.indexOf(b.testId)
  );

  const tierScoreSum = comparisons.reduce((sum, item) => sum + item.tierScore, 0);
  const averageTierScore =
    comparisons.length > 0 ? Math.round(tierScoreSum / comparisons.length) : 0;

  return {
    comparisons,
    averageTierScore,
    tierScoreSum,
    poolLabel: `${gender} ${hittraxNormPoolLabel}`,
  };
}
