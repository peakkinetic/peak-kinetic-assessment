import type { AssessmentResult, JointMobilityMeasurement } from "@/types";
import {
  screeningMobilityCategories,
  SCREENING_SESSION_NOTE_ID,
  type ScreeningMobilityId,
} from "@/data/screeningMobilityCategories";

export interface SymmetryIndexEntry {
  joint: string;
  left: number;
  right: number;
  unit: string;
  difference: number;
}

export function getScreeningResult(
  results: AssessmentResult[],
  testId: string
): AssessmentResult | undefined {
  return results.find(
    (result) => result.moduleId === "screening-mobility" && result.testId === testId
  );
}

export function buildJointMobility(results: AssessmentResult[]): JointMobilityMeasurement[] {
  return screeningMobilityCategories.flatMap((category) => {
    const result = getScreeningResult(results, category.id);
    if (!result) return [];

    return [
      {
        joint: category.label,
        degrees: result.value,
        notes: result.notes,
        side: category.side,
      },
    ];
  });
}

export function splitJointMobilityBySide(measurements: JointMobilityMeasurement[]) {
  const getSide = (measurement: JointMobilityMeasurement): "left" | "right" | null => {
    if (measurement.side) return measurement.side;
    if (measurement.joint.includes("(L)")) return "left";
    if (measurement.joint.includes("(R)")) return "right";
    return null;
  };

  return {
    left: measurements.filter((measurement) => getSide(measurement) === "left"),
    right: measurements.filter((measurement) => getSide(measurement) === "right"),
  };
}

export function buildSymmetryIndex(results: AssessmentResult[]): SymmetryIndexEntry[] {
  const groups = new Map<string, { left?: number; right?: number }>();

  for (const category of screeningMobilityCategories) {
    const result = getScreeningResult(results, category.id);
    if (!result) continue;

    const current = groups.get(category.symmetryGroup) ?? {};
    if (category.side === "left") current.left = result.value;
    if (category.side === "right") current.right = result.value;
    groups.set(category.symmetryGroup, current);
  }

  return Array.from(groups.entries()).flatMap(([joint, values]) => {
    if (values.left === undefined || values.right === undefined) return [];

    return [
      {
        joint,
        left: values.left,
        right: values.right,
        unit: "°",
        difference: Math.abs(values.left - values.right),
      },
    ];
  });
}

export function getScreeningSessionNote(results: AssessmentResult[]): string | null {
  const result = getScreeningResult(results, SCREENING_SESSION_NOTE_ID);
  return result?.notes?.trim() || null;
}

export function getScreeningMobilityValue(
  results: AssessmentResult[],
  testId: ScreeningMobilityId
): number | undefined {
  return getScreeningResult(results, testId)?.value;
}
