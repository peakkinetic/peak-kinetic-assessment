import type { HittraxTestId } from "@/types";
import type { NormTierRanges, TestNorm } from "@/data/nationalNorms";

/**
 * PKP national Hittrax benchmarks for high school hitters.
 * Thresholds reflect typical national Hittrax batted-ball data for prep hitters.
 */
export const highSchoolHittraxNorms: TestNorm[] = [
  {
    id: "max-exit-velocity",
    label: "Max Exit Velocity",
    unit: "mph",
    higherIsBetter: true,
    ranges: {
      elite: "≥ 92",
      good: "86 – 91",
      average: "78 – 85",
      needsImprovement: "< 78",
    },
    boundaries: { elite: 92, good: 86, average: 78 },
  },
  {
    id: "avg-exit-velocity",
    label: "Avg Exit Velocity",
    unit: "mph",
    higherIsBetter: true,
    ranges: {
      elite: "≥ 82",
      good: "76 – 81",
      average: "68 – 75",
      needsImprovement: "< 68",
    },
    boundaries: { elite: 82, good: 76, average: 68 },
  },
  {
    id: "max-distance",
    label: "Max Distance",
    unit: "ft",
    higherIsBetter: true,
    ranges: {
      elite: "≥ 340",
      good: "300 – 339",
      average: "260 – 299",
      needsImprovement: "< 260",
    },
    boundaries: { elite: 340, good: 300, average: 260 },
  },
  {
    id: "launch-angle",
    label: "Launch Angle",
    unit: "°",
    higherIsBetter: true,
    ranges: {
      elite: "15° – 25°",
      good: "12° – 14° or 26° – 28°",
      average: "8° – 11° or 29° – 32°",
      needsImprovement: "< 8° or > 32°",
    },
    boundaries: { elite: 20, good: 15, average: 10 },
  },
];

export const hittraxNormPoolLabel = "High School Hitters (National Hittrax)";

export const hittraxTestIdByLabel: Record<string, HittraxTestId> = {
  "Max Exit Velocity": "max-exit-velocity",
  "Avg Exit Velocity": "avg-exit-velocity",
  "Max Distance": "max-distance",
  "Launch Angle": "launch-angle",
};

export function classifyHittraxLaunchAngle(value: number): "Elite" | "Good" | "Average" | "Below Average" {
  if (value >= 15 && value <= 25) return "Elite";
  if ((value >= 12 && value <= 14) || (value >= 26 && value <= 28)) return "Good";
  if ((value >= 8 && value <= 11) || (value >= 29 && value <= 32)) return "Average";
  return "Below Average";
}

export function getHittraxNormById(testId: HittraxTestId): TestNorm {
  const norm = highSchoolHittraxNorms.find((item) => item.id === testId);
  if (!norm) {
    throw new Error(`Missing Hittrax norms for test: ${testId}`);
  }
  return norm;
}

export function getHittraxLaunchAngleRanges(): NormTierRanges {
  return getHittraxNormById("launch-angle").ranges;
}
