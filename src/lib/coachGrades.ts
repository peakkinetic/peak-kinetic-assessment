export function getCoachTraitLabel(score: 1 | 2 | 3 | 4 | 5): string {
  if (score === 5) return "Excellent";
  if (score === 4) return "Strong";
  if (score === 3) return "Adequate";
  if (score === 2) return "Needs Improvement";
  return "Concern";
}

export function getCoachTraitColor(score: 1 | 2 | 3 | 4 | 5): string {
  if (score >= 4) return "bg-emerald-500";
  if (score === 3) return "bg-amber-400";
  return "bg-pkp-red";
}

export function getOverallLetterGrade(average: number): string {
  if (average >= 4.7) return "A+";
  if (average >= 4.3) return "A";
  if (average >= 4.0) return "A-";
  if (average >= 3.7) return "B+";
  if (average >= 3.3) return "B";
  if (average >= 3.0) return "B-";
  if (average >= 2.7) return "C+";
  if (average >= 2.3) return "C";
  if (average >= 2.0) return "C-";
  if (average >= 1.7) return "D+";
  if (average >= 1.3) return "D";
  return "F";
}
