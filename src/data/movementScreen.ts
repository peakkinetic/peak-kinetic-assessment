import type { AssessmentRating, AssessmentScore, AssessmentScoreValue } from "@/types";
import { isScoredAssessment } from "@/lib/utils";

export const movementScores: AssessmentScore[] = [
  { category: "Toe Touch", score: 1, notes: "Reaches mid-shin; mild hamstring restriction" },
  { category: "Overhead Squat", score: 1, notes: "Maintains heel contact; slight forward lean at depth" },
  { category: "Scratch Test", score: "NA", notes: "Not assessed this session" },
  { category: "T-Spine Extension", score: 1, notes: "Limited end-range extension; compensates through lumbar" },
  { category: "T-Spine Rotation", score: 2, notes: "Moderate rotation left; acceptable rotation right" },
];

export interface MovementPattern {
  pattern: string;
  score: AssessmentScoreValue;
  notes?: string;
  risk: string;
}

export const movementPatterns: MovementPattern[] = movementScores.map((assessment) => ({
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

export interface FlaggedArea {
  area: string;
  score: AssessmentRating;
  recommendation: string;
}

export function getScoredAssessments(): AssessmentScore[] {
  return movementScores.filter((assessment) => isScoredAssessment(assessment.score));
}

export function getOverallAssessmentScore(): { average: number; rating: AssessmentRating } {
  const scored = getScoredAssessments();
  const average =
    scored.length === 0
      ? 0
      : Math.round(
          (scored.reduce((sum, item) => sum + (item.score as AssessmentRating), 0) / scored.length) * 10
        ) / 10;

  return {
    average,
    rating: (Math.round(average) || 1) as AssessmentRating,
  };
}

export function getFlaggedAreas(): FlaggedArea[] {
  return movementScores
    .filter((assessment) => isScoredAssessment(assessment.score) && assessment.score < 2)
    .map((assessment) => ({
      area: assessment.category,
      score: assessment.score as AssessmentRating,
      recommendation: assessment.notes || "Schedule corrective work and re-assessment.",
    }));
}
