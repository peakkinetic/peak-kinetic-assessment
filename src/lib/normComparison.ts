import type { MetricItem, Athlete } from "@/types";
import { profileMetrics } from "@/data/athlete";
import {
  getNormPoolForClassification,
  getNormPoolLabel,
  getTestNormsForPool,
  highSchoolTestNorms,
  type NormBoundaries,
  type NormPoolId,
  type NormTierRanges,
  type TestNorm,
} from "@/data/nationalNorms";

export type PerformanceTier = "Needs Improvement" | "Average" | "Good" | "Elite";

export interface NormComparisonResult {
  testId: string;
  label: string;
  unit: string;
  athleteValue: number;
  ranges: NormTierRanges;
  boundaries: NormBoundaries;
  tier: PerformanceTier;
  tierScore: number;
  nationalRankPercentile: number;
  vsAverage: number;
  vsGood: number;
  vsElite: number;
}

const metricToNormId: Record<string, string> = {
  "10-Yard Laser Sprint": "ten-yard-sprint",
  "Assault Runner": "assault-runner",
  "Assault Runner Max": "assault-runner",
  "Counter Movement Jump": "counter-movement-jump",
  "Counter-Movement Jump": "counter-movement-jump",
  "Vertical Jump": "vertical-jump",
  "Reactive Strength Index": "rsi",
  "Broad Jump": "broad-jump",
  "Pro Agility": "pro-agility",
  "Pro-Agility Test": "pro-agility",
};

export function classifyPerformance(
  value: number,
  boundaries: NormBoundaries,
  higherIsBetter: boolean
): PerformanceTier {
  if (higherIsBetter) {
    if (value >= boundaries.elite) return "Elite";
    if (value >= boundaries.good) return "Good";
    if (value >= boundaries.average) return "Average";
    return "Needs Improvement";
  }

  if (value <= boundaries.elite) return "Elite";
  if (value <= boundaries.good) return "Good";
  if (value <= boundaries.average) return "Average";
  return "Needs Improvement";
}

function getTierScore(tier: PerformanceTier): number {
  switch (tier) {
    case "Elite":
      return 100;
    case "Good":
      return 75;
    case "Average":
      return 50;
    default:
      return 25;
  }
}

function getDifference(value: number, benchmark: number, higherIsBetter: boolean): number {
  const raw = value - benchmark;
  return higherIsBetter ? raw : -raw;
}

function interpolatePercentile(
  value: number,
  lowerValue: number,
  upperValue: number,
  lowerPercentile: number,
  upperPercentile: number
): number {
  if (upperValue === lowerValue) return upperPercentile;
  const ratio = (value - lowerValue) / (upperValue - lowerValue);
  return lowerPercentile + ratio * (upperPercentile - lowerPercentile);
}

export function calculateNationalRankPercentile(
  value: number,
  boundaries: NormBoundaries,
  higherIsBetter: boolean
): number {
  const span = Math.max(
    Math.abs(boundaries.good - boundaries.average),
    Math.abs(boundaries.elite - boundaries.good),
    0.01
  );

  if (higherIsBetter) {
    const anchors = [
      { value: boundaries.average - span, percentile: 1 },
      { value: boundaries.average, percentile: 25 },
      { value: boundaries.good, percentile: 50 },
      { value: boundaries.elite, percentile: 75 },
      { value: boundaries.elite + span, percentile: 99 },
    ];

    if (value <= anchors[0].value) return 1;
    if (value >= anchors[anchors.length - 1].value) return 99;

    for (let index = 0; index < anchors.length - 1; index += 1) {
      const current = anchors[index];
      const next = anchors[index + 1];
      if (value >= current.value && value <= next.value) {
        return Math.round(
          interpolatePercentile(
            value,
            current.value,
            next.value,
            current.percentile,
            next.percentile
          )
        );
      }
    }

    return 1;
  }

  const anchors = [
    { value: boundaries.average + span, percentile: 1 },
    { value: boundaries.average, percentile: 25 },
    { value: boundaries.good, percentile: 50 },
    { value: boundaries.elite, percentile: 75 },
    { value: boundaries.elite - span, percentile: 99 },
  ];

  if (value >= anchors[0].value) return 1;
  if (value <= anchors[anchors.length - 1].value) return 99;

  for (let index = 0; index < anchors.length - 1; index += 1) {
    const current = anchors[index];
    const next = anchors[index + 1];
    if (value <= current.value && value >= next.value) {
      return Math.round(
        interpolatePercentile(
          value,
          current.value,
          next.value,
          current.percentile,
          next.percentile
        )
      );
    }
  }

  return 1;
}

import { brandColors } from "@/lib/brandColors";

export function getPercentileBarColor(percentile: number): string {
  if (percentile >= 75) return brandColors.green;
  if (percentile >= 50) return brandColors.black;
  if (percentile >= 25) return brandColors.amber;
  return brandColors.red;
}

export function formatNationalRank(percentile: number): string {
  const suffix =
    percentile % 100 >= 11 && percentile % 100 <= 13
      ? "th"
      : percentile % 10 === 1
        ? "st"
        : percentile % 10 === 2
          ? "nd"
          : percentile % 10 === 3
            ? "rd"
            : "th";

  return `${percentile}${suffix} percentile`;
}

export function getNationalRankForTest(
  testId: string,
  value: number,
  poolId: NormPoolId = "high-school"
): number {
  const norms = getTestNormsForPool(poolId);
  const norm = norms.find((test) => test.id === testId);
  if (!norm) {
    throw new Error(`Missing national norms for test: ${testId}`);
  }

  return calculateNationalRankPercentile(value, norm.boundaries, norm.higherIsBetter);
}

export function compareToNationalNorms(
  athleteResults: { id: string; value: number }[],
  norms: TestNorm[] = highSchoolTestNorms
): NormComparisonResult[] {
  return athleteResults.map((result) => {
    const norm = norms.find((test) => test.id === result.id);
    if (!norm) {
      throw new Error(`Missing national norms for test: ${result.id}`);
    }

    const tier = classifyPerformance(result.value, norm.boundaries, norm.higherIsBetter);

    return {
      testId: norm.id,
      label: norm.label,
      unit: norm.unit,
      athleteValue: result.value,
      ranges: norm.ranges,
      boundaries: norm.boundaries,
      tier,
      tierScore: getTierScore(tier),
      nationalRankPercentile: calculateNationalRankPercentile(
        result.value,
        norm.boundaries,
        norm.higherIsBetter
      ),
      vsAverage: getDifference(result.value, norm.boundaries.average, norm.higherIsBetter),
      vsGood: getDifference(result.value, norm.boundaries.good, norm.higherIsBetter),
      vsElite: getDifference(result.value, norm.boundaries.elite, norm.higherIsBetter),
    };
  });
}

export function enrichMetricsWithNationalPercentiles(
  metrics: MetricItem[],
  classificationId: string
): MetricItem[] {
  const poolId = getNormPoolForClassification(classificationId);
  const norms = getTestNormsForPool(poolId);

  return metrics.map((metric) => {
    const testId = metricToNormId[metric.label];
    if (!testId) {
      throw new Error(`Missing norm mapping for metric: ${metric.label}`);
    }

    const norm = norms.find((test) => test.id === testId);
    if (!norm) {
      throw new Error(`Missing national norms for test: ${testId}`);
    }

    const percentile = calculateNationalRankPercentile(
      Number(metric.value),
      norm.boundaries,
      norm.higherIsBetter
    );

    return { ...metric, percentile };
  });
}

export function getNationalComparisonFromMetrics(
  metrics: MetricItem[],
  gender: Athlete["gender"],
  classificationId?: string
) {
  const poolId = classificationId
    ? getNormPoolForClassification(classificationId)
    : "high-school";

  if (metrics.length === 0) {
    return {
      comparisons: [],
      averageTierScore: 0,
      tierScoreSum: 0,
      poolLabel: getNormPoolLabel(poolId, gender),
      poolId,
    };
  }

  const norms = getTestNormsForPool(poolId);
  const athleteResults = metrics.map((metric) => {
    const id = metricToNormId[metric.label];
    if (!id) {
      throw new Error(`Missing norm mapping for metric: ${metric.label}`);
    }

    return { id, value: Number(metric.value) };
  });

  const comparisons = compareToNationalNorms(athleteResults, norms);
  const tierScoreSum = comparisons.reduce((sum, item) => sum + item.tierScore, 0);
  const averageTierScore = Math.round(tierScoreSum / comparisons.length);

  return {
    comparisons,
    averageTierScore,
    tierScoreSum,
    poolLabel: getNormPoolLabel(poolId, gender),
    poolId,
  };
}

export function getNationalComparisonFromNorms(
  gender: Athlete["gender"],
  classificationId?: string
) {
  return getNationalComparisonFromMetrics(profileMetrics, gender, classificationId);
}

export function formatSignedDifference(value: number, unit: string): string {
  const prefix = value > 0 ? "+" : "";
  const formatted = Number.isInteger(value) ? value.toString() : value.toFixed(2);
  return `${prefix}${formatted}${unit ? ` ${unit}` : ""}`;
}

export function getTierBadgeVariant(tier: PerformanceTier): "success" | "info" | "warning" | "red" {
  switch (tier) {
    case "Elite":
      return "success";
    case "Good":
      return "info";
    case "Average":
      return "warning";
    default:
      return "red";
  }
}

export function getNormDirection(testId: string, poolId: NormPoolId = "high-school"): boolean {
  const norms = getTestNormsForPool(poolId);
  const norm = norms.find((test) => test.id === testId);
  if (!norm) {
    throw new Error(`Missing national norms for test: ${testId}`);
  }
  return norm.higherIsBetter;
}
