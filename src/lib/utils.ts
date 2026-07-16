import { clsx, type ClassValue } from "clsx";
import type { AssessmentRating, AssessmentScoreValue } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPercentile(value: number): string {
  return `${value}th`;
}

export function isScoredAssessment(score: AssessmentScoreValue): score is AssessmentRating {
  return score !== "NA";
}

export function getAssessmentRatingLabel(score: AssessmentScoreValue): string {
  if (score === "NA") return "Not Assessed";
  if (score === 3) return "Good";
  if (score === 2) return "Moderate";
  return "Bad";
}

export function getAssessmentRatingColor(score: AssessmentScoreValue): string {
  if (score === "NA") return "bg-pkp-gray-50 text-pkp-gray-600 border-pkp-gray-200";
  if (score === 3) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (score === 2) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-red-50 text-pkp-red border-red-200";
}

export function getAssessmentRatingDotColor(score: AssessmentScoreValue): string {
  if (score === "NA") return "bg-pkp-gray-400";
  if (score === 3) return "bg-emerald-500";
  if (score === 2) return "bg-amber-400";
  return "bg-pkp-red";
}

export function getAssessmentProgressColor(score: AssessmentScoreValue): "red" | "amber" | "emerald" | "black" {
  if (score === "NA") return "black";
  if (score === 3) return "emerald";
  if (score === 2) return "amber";
  return "red";
}

export function getAssessmentRiskLabel(score: AssessmentScoreValue): string {
  if (score === "NA") return "Not Assessed";
  if (score === 3) return "Low";
  if (score === 2) return "Moderate";
  return "High";
}

export function getGradeColor(grade: string): string {
  if (grade.startsWith("A")) return "text-emerald-600 bg-emerald-50";
  if (grade.startsWith("B")) return "text-blue-600 bg-blue-50";
  if (grade.startsWith("C")) return "text-amber-600 bg-amber-50";
  return "text-pkp-red bg-red-50";
}

export function getTrendColor(trend?: "up" | "down" | "neutral"): string {
  if (trend === "up") return "text-emerald-600";
  if (trend === "down") return "text-pkp-red";
  return "text-pkp-gray-500";
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Rehab":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Evaluating":
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-pkp-gray-100 text-pkp-gray-600 border-pkp-gray-200";
  }
}
