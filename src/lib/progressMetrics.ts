import type {
  AssessmentClassification,
  AssessmentRecord,
  AssessmentResult,
  PerformanceTestId,
} from "@/types";
import {
  getActivePerformanceTests,
  getPerformanceTestId,
  performanceTestLabels,
  performanceTestUnits,
} from "@/lib/assessmentAccess";
import { getNormPoolForClassification, getTestNormsForPool } from "@/data/nationalNorms";
import { buildPerformanceMetrics, getPerformanceResultValue } from "@/lib/performanceMetrics";

export interface AssessmentHistoryEntry {
  assessment: AssessmentRecord;
  results: AssessmentResult[];
}

export interface ProgressMetricView {
  metric: string;
  testId: PerformanceTestId;
  current: number;
  previous: number;
  target: number;
  unit: string;
}

export interface NationalRankProgressView {
  testId: PerformanceTestId;
  label: string;
  unit: string;
  startValue: number;
  currentValue: number;
  startLabel: string;
  currentLabel: string;
}

export interface ProgressMilestoneView {
  date: string;
  metric: string;
  value: number;
  target: number;
}

function getTargetForTest(testId: PerformanceTestId, classificationId: string): number {
  const poolId = getNormPoolForClassification(classificationId);
  const norm = getTestNormsForPool(poolId).find((test) => test.id === testId);
  return norm?.boundaries.elite ?? 0;
}

function getPerformanceHistory(history: AssessmentHistoryEntry[]): AssessmentHistoryEntry[] {
  return history.filter((entry) =>
    entry.results.some((result) => result.moduleId === "performance-testing")
  );
}

export function buildProgressMetrics(
  classification: AssessmentClassification,
  history: AssessmentHistoryEntry[],
  activeAssessmentId: string
): ProgressMetricView[] {
  const allowedTests = getActivePerformanceTests(classification);
  const performanceHistory = getPerformanceHistory(history);

  if (performanceHistory.length === 0) return [];

  const baseline = performanceHistory[0];
  const currentEntry =
    performanceHistory.find((entry) => entry.assessment.id === activeAssessmentId) ??
    performanceHistory[performanceHistory.length - 1];
  const currentIndex = performanceHistory.findIndex(
    (entry) => entry.assessment.id === currentEntry.assessment.id
  );
  const previousEntry =
    currentIndex > 0 ? performanceHistory[currentIndex - 1] : baseline;

  return allowedTests.flatMap((testId) => {
    const current = getPerformanceResultValue(currentEntry.results, testId);
    if (current === undefined) return [];

    const previous =
      getPerformanceResultValue(previousEntry.results, testId) ?? current;

    return [
      {
        metric: performanceTestLabels[testId],
        testId,
        current,
        previous,
        target: getTargetForTest(testId, classification.id),
        unit: performanceTestUnits[testId],
      },
    ];
  });
}

export function buildNationalRankProgress(
  classification: AssessmentClassification,
  history: AssessmentHistoryEntry[],
  activeAssessmentId: string
): NationalRankProgressView[] {
  const allowedTests = getActivePerformanceTests(classification);
  const performanceHistory = getPerformanceHistory(history);

  if (performanceHistory.length === 0) return [];

  const baseline = performanceHistory[0];
  const currentEntry =
    performanceHistory.find((entry) => entry.assessment.id === activeAssessmentId) ??
    performanceHistory[performanceHistory.length - 1];

  return allowedTests.flatMap((testId) => {
    const startValue = getPerformanceResultValue(baseline.results, testId);
    const currentValue = getPerformanceResultValue(currentEntry.results, testId);

    if (startValue === undefined || currentValue === undefined) return [];

    return [
      {
        testId,
        label: performanceTestLabels[testId],
        unit: performanceTestUnits[testId],
        startValue,
        currentValue,
        startLabel: baseline.assessment.date,
        currentLabel: currentEntry.assessment.date,
      },
    ];
  });
}

export function buildProgressMilestones(
  classification: AssessmentClassification,
  history: AssessmentHistoryEntry[]
): ProgressMilestoneView[] {
  const milestones: ProgressMilestoneView[] = [];

  for (const entry of [...history].reverse()) {
    const metrics = buildPerformanceMetrics(classification, entry.results);

    for (const metric of metrics) {
      const testId = getPerformanceTestId(metric.label);
      if (!testId) continue;

      milestones.push({
        date: entry.assessment.date,
        metric: metric.label,
        value: Number(metric.value),
        target: getTargetForTest(testId, classification.id),
      });
    }
  }

  return milestones;
}
