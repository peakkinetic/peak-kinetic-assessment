export interface NormTierRanges {
  elite: string;
  good: string;
  average: string;
  needsImprovement: string;
}

/** Best-tier boundary used for classification and distance calculations. */
export interface NormBoundaries {
  /** For higher-is-better tests: minimum value for Elite. For lower-is-better: maximum value for Elite. */
  elite: number;
  good: number;
  average: number;
}

export interface TestNorm {
  id: string;
  label: string;
  unit: string;
  higherIsBetter: boolean;
  ranges: NormTierRanges;
  boundaries: NormBoundaries;
}

export type NormPoolId = "middle-school" | "high-school";

export const normPoolLabels: Record<NormPoolId, string> = {
  "middle-school": "Middle School Athletes",
  "high-school": "High School Athletes",
};

/**
 * PKP national high school performance benchmarks.
 * Same thresholds apply to male and female athletes unless separate tables are added later.
 */
export const highSchoolTestNorms: TestNorm[] = [
  {
    id: "ten-yard-sprint",
    label: "10-Yard Laser Sprint",
    unit: "s",
    higherIsBetter: false,
    ranges: {
      elite: "≤ 1.55",
      good: "1.56 – 1.65",
      average: "1.65 – 1.80",
      needsImprovement: "> 1.90",
    },
    boundaries: { elite: 1.55, good: 1.65, average: 1.8 },
  },
  {
    id: "assault-runner",
    label: "Assault Runner Max",
    unit: "mph",
    higherIsBetter: true,
    ranges: {
      elite: "≥ 21.0",
      good: "19.5 – 20.9",
      average: "18.0 – 19.4",
      needsImprovement: "< 18.0",
    },
    boundaries: { elite: 21.0, good: 19.5, average: 18.0 },
  },
  {
    id: "counter-movement-jump",
    label: "Counter Movement Jump",
    unit: "in",
    higherIsBetter: true,
    ranges: {
      elite: "≥ 28",
      good: "24 – 27",
      average: "20 – 23",
      needsImprovement: "< 20",
    },
    boundaries: { elite: 28, good: 24, average: 20 },
  },
  {
    id: "vertical-jump",
    label: "Vertical Jump",
    unit: "in",
    higherIsBetter: true,
    ranges: {
      elite: "≥ 32",
      good: "27 – 31",
      average: "22 – 26",
      needsImprovement: "< 22",
    },
    boundaries: { elite: 32, good: 27, average: 22 },
  },
  {
    id: "rsi",
    label: "Reactive Strength Index",
    unit: "RSI",
    higherIsBetter: true,
    ranges: {
      elite: "≥ 3.3",
      good: "2.5 – 3.2",
      average: "1.8 – 2.4",
      needsImprovement: "< 1.8",
    },
    boundaries: { elite: 3.3, good: 2.5, average: 1.8 },
  },
  {
    id: "broad-jump",
    label: "Broad Jump",
    unit: "in",
    higherIsBetter: true,
    ranges: {
      elite: "≥ 113 (9'5\")",
      good: "102 – 112 (8'6\" – 9'4\")",
      average: "92 – 101 (7'8\" – 8'5\")",
      needsImprovement: "< 92",
    },
    boundaries: { elite: 113, good: 102, average: 92 },
  },
  {
    id: "pro-agility",
    label: "Pro Agility",
    unit: "s",
    higherIsBetter: false,
    ranges: {
      elite: "≤ 4.20",
      good: "4.21 – 4.50",
      average: "4.51 – 4.80",
      needsImprovement: "> 4.80",
    },
    boundaries: { elite: 4.2, good: 4.5, average: 4.8 },
  },
];

/** @deprecated Use highSchoolTestNorms */
export const nationalTestNorms = highSchoolTestNorms;

/**
 * PKP national middle school performance benchmarks (ages ~11–14).
 * Same thresholds apply to male and female athletes unless separate tables are added later.
 */
export const middleSchoolTestNorms: TestNorm[] = [
  {
    id: "ten-yard-sprint",
    label: "10-Yard Laser Sprint",
    unit: "s",
    higherIsBetter: false,
    ranges: {
      elite: "≤ 1.72",
      good: "1.73 – 1.82",
      average: "1.83 – 1.95",
      needsImprovement: "> 2.05",
    },
    boundaries: { elite: 1.72, good: 1.82, average: 1.95 },
  },
  {
    id: "assault-runner",
    label: "Assault Runner Max",
    unit: "mph",
    higherIsBetter: true,
    ranges: {
      elite: "≥ 17.5",
      good: "15.5 – 17.4",
      average: "13.5 – 15.4",
      needsImprovement: "< 13.5",
    },
    boundaries: { elite: 17.5, good: 15.5, average: 13.5 },
  },
  {
    id: "counter-movement-jump",
    label: "Counter Movement Jump",
    unit: "in",
    higherIsBetter: true,
    ranges: {
      elite: "≥ 20",
      good: "17 – 19",
      average: "14 – 16",
      needsImprovement: "< 14",
    },
    boundaries: { elite: 20, good: 17, average: 14 },
  },
  {
    id: "vertical-jump",
    label: "Vertical Jump",
    unit: "in",
    higherIsBetter: true,
    ranges: {
      elite: "≥ 24",
      good: "20 – 23",
      average: "16 – 19",
      needsImprovement: "< 16",
    },
    boundaries: { elite: 24, good: 20, average: 16 },
  },
  {
    id: "rsi",
    label: "Reactive Strength Index",
    unit: "RSI",
    higherIsBetter: true,
    ranges: {
      elite: "≥ 2.0",
      good: "1.6 – 1.9",
      average: "1.2 – 1.5",
      needsImprovement: "< 1.2",
    },
    boundaries: { elite: 2.0, good: 1.6, average: 1.2 },
  },
  {
    id: "broad-jump",
    label: "Broad Jump",
    unit: "in",
    higherIsBetter: true,
    ranges: {
      elite: "≥ 90 (7'6\")",
      good: "78 – 89 (6'6\" – 7'5\")",
      average: "66 – 77 (5'6\" – 6'5\")",
      needsImprovement: "< 66",
    },
    boundaries: { elite: 90, good: 78, average: 66 },
  },
  {
    id: "pro-agility",
    label: "Pro Agility",
    unit: "s",
    higherIsBetter: false,
    ranges: {
      elite: "≤ 4.75",
      good: "4.76 – 5.00",
      average: "5.01 – 5.25",
      needsImprovement: "> 5.25",
    },
    boundaries: { elite: 4.75, good: 5.0, average: 5.25 },
  },
];

const normPools: Record<NormPoolId, TestNorm[]> = {
  "middle-school": middleSchoolTestNorms,
  "high-school": highSchoolTestNorms,
};

export function getNormPoolForClassification(classificationId: string): NormPoolId {
  return classificationId === "middle-school" ? "middle-school" : "high-school";
}

export function getTestNormsForPool(poolId: NormPoolId): TestNorm[] {
  return normPools[poolId];
}

export function getNormPoolLabel(poolId: NormPoolId, gender: "Male" | "Female"): string {
  const genderLabel = gender === "Male" ? "Male" : "Female";
  return `${genderLabel} ${normPoolLabels[poolId]}`;
}
