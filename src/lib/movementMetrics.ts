import type {
  AssessmentRating,
  AssessmentResult,
  AssessmentScore,
  AssessmentScoreValue,
} from "@/types";
import {
  movementScreenCategories,
  type MovementScreenId,
} from "@/data/movementScreenCategories";
import { isScoredAssessment } from "@/lib/utils";

export interface MovementScreenEntry {
  score: AssessmentScoreValue;
  notes?: string;
}

export interface MovementPatternView {
  pattern: string;
  score: AssessmentScoreValue;
  notes?: string;
  risk: string;
}

export interface FlaggedAreaView {
  area: string;
  score: AssessmentRating;
  recommendation: string;
}

export function getMovementResult(
  results: AssessmentResult[],
  testId: MovementScreenId
): AssessmentResult | undefined {
  return results.find(
    (result) => result.moduleId === "movement-screen" && result.testId === testId
  );
}

export function buildMovementScores(results: AssessmentResult[]): AssessmentScore[] {
  return movementScreenCategories.map((category) => {
    const result = getMovementResult(results, category.id);

    if (!result) {
      return { category: category.label, score: "NA" as const };
    }

    const score = result.value as AssessmentRating;

    return {
      category: category.label,
      score,
      notes: result.notes,
    };
  });
}

export function buildMovementPatterns(scores: AssessmentScore[]): MovementPatternView[] {
  return scores.map((assessment) => ({
    pattern: assessment.category,
    score: assessment.score,
    notes: assessment.notes,
    risk:
      assessment.score === "NA"
        ? "Not Assessed"
        : assessment.score === 3
          ? "Low"
          : assessment.score === 2
            ? "Moderate"
            : "High",
  }));
}

export function getScoredMovementAssessments(scores: AssessmentScore[]): AssessmentScore[] {
  return scores.filter((assessment) => isScoredAssessment(assessment.score));
}

export function getOverallMovementScore(scores: AssessmentScore[]): {
  average: number;
  rating: AssessmentRating;
} {
  const scored = getScoredMovementAssessments(scores);
  const average =
    scored.length === 0
      ? 0
      : Math.round(
          (scored.reduce((sum, item) => sum + (item.score as AssessmentRating), 0) / scored.length) *
            10
        ) / 10;

  return {
    average,
    rating: (Math.round(average) || 1) as AssessmentRating,
  };
}

export function getFlaggedMovementAreas(scores: AssessmentScore[]): FlaggedAreaView[] {
  return scores
    .filter((assessment) => isScoredAssessment(assessment.score) && assessment.score < 2)
    .map((assessment) => ({
      area: assessment.category,
      score: assessment.score as AssessmentRating,
      recommendation: assessment.notes || "Schedule corrective work and re-assessment.",
    }));
}
