import {
  assessmentClassifications,
  getClassificationById as getStaticClassificationById,
} from "@/data/assessmentClassifications";
import type {
  AssessmentClassification,
  AssessmentClassificationOverride,
} from "@/types";

export function mergeClassificationWithOverride(
  base: AssessmentClassification,
  override?: AssessmentClassificationOverride | null
): AssessmentClassification {
  if (!override) return base;

  const label = override.label.trim();
  const description = override.description.trim();

  return {
    ...base,
    label: label || base.label,
    description: description || base.description,
  };
}

export function mergeAllClassifications(
  overrides: AssessmentClassificationOverride[]
): AssessmentClassification[] {
  const overrideMap = new Map(overrides.map((item) => [item.classificationId, item]));
  return assessmentClassifications.map((item) =>
    mergeClassificationWithOverride(item, overrideMap.get(item.id))
  );
}

export function getMergedClassificationById(
  id: string,
  overrides: AssessmentClassificationOverride[]
): AssessmentClassification {
  const base = getStaticClassificationById(id);
  const override = overrides.find((item) => item.classificationId === id);
  return mergeClassificationWithOverride(base, override);
}
