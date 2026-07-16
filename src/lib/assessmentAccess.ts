import type { MetricItem } from "@/types";
import type { AssessmentClassification, AssessmentModuleId, PerformanceTestId } from "@/types";
import { profileMetrics } from "@/data/athlete";
import { getClassificationById } from "@/data/assessmentClassifications";
import { assessmentRecords, defaultAssessmentId } from "@/data/assessments";

export const performanceTestLabels: Record<PerformanceTestId, string> = {
  "ten-yard-sprint": "10-Yard Laser Sprint",
  "assault-runner": "Assault Runner Max",
  "counter-movement-jump": "Counter Movement Jump",
  "vertical-jump": "Vertical Jump",
  rsi: "Reactive Strength Index",
  "broad-jump": "Broad Jump",
  "pro-agility": "Pro Agility",
};

export const performanceTestUnits: Record<PerformanceTestId, string> = {
  "ten-yard-sprint": "s",
  "assault-runner": "mph",
  "counter-movement-jump": "in",
  "vertical-jump": "in",
  rsi: "RSI",
  "broad-jump": "in",
  "pro-agility": "s",
};

const labelToPerformanceTestId: Record<string, PerformanceTestId> = {
  "10-Yard Laser Sprint": "ten-yard-sprint",
  "Assault Runner": "assault-runner",
  "Assault Runner Max": "assault-runner",
  "Counter-Movement Jump": "counter-movement-jump",
  "Counter Movement Jump": "counter-movement-jump",
  "Vertical Jump": "vertical-jump",
  "Reactive Strength Index": "rsi",
  "Broad Jump": "broad-jump",
  "Pro-Agility Test": "pro-agility",
  "Pro Agility": "pro-agility",
};

export function getPerformanceTestId(label: string): PerformanceTestId | undefined {
  return labelToPerformanceTestId[label];
}

export function getActivePerformanceTests(classification: AssessmentClassification): PerformanceTestId[] {
  if (classification.performanceTests?.length) {
    return classification.performanceTests;
  }

  if (classification.modules.includes("performance-testing")) {
    return Object.keys(performanceTestLabels) as PerformanceTestId[];
  }

  return [];
}

export function classificationIncludesModule(
  classification: AssessmentClassification,
  moduleId: AssessmentModuleId
): boolean {
  return classification.modules.includes(moduleId);
}

export function filterMetricsByClassification(
  metrics: MetricItem[],
  classification: AssessmentClassification
): MetricItem[] {
  const allowedTests = getActivePerformanceTests(classification);
  if (allowedTests.length === 0) return [];

  return metrics.filter((metric) => {
    const testId = getPerformanceTestId(metric.label);
    return testId ? allowedTests.includes(testId) : false;
  });
}

export function getProfileMetricsForClassification(classification: AssessmentClassification): MetricItem[] {
  return filterMetricsByClassification(profileMetrics, classification);
}

export function getAssessmentRecordById(id: string) {
  const record = assessmentRecords.find((item) => item.id === id);
  if (!record) {
    throw new Error(`Unknown assessment record: ${id}`);
  }
  return record;
}

export function getDefaultAssessmentRecord() {
  return getAssessmentRecordById(defaultAssessmentId);
}

export function getClassificationForAssessment(assessmentId: string): AssessmentClassification {
  const record = getAssessmentRecordById(assessmentId);
  return getClassificationById(record.classificationId);
}

export function getAssessmentsForAthlete(athleteId: string) {
  return assessmentRecords.filter((record) => record.athleteId === athleteId);
}

export function getModuleHref(moduleId: AssessmentModuleId): string {
  const hrefMap: Record<AssessmentModuleId, string> = {
    profile: "/dashboard/athlete-profile",
    "movement-screen": "/dashboard/movement-screen",
    "screening-mobility": "/dashboard/screening-mobility",
    "performance-testing": "/dashboard/performance-testing",
    "progress-tracking": "/dashboard/progress-tracking",
    "coach-report": "/dashboard/coach-report",
  };

  return hrefMap[moduleId];
}

export function isMiddleSchoolAssessment(classificationId: string): boolean {
  return classificationId === "middle-school";
}

export function shouldShowBarCharts(classificationId: string): boolean {
  return !isMiddleSchoolAssessment(classificationId);
}
