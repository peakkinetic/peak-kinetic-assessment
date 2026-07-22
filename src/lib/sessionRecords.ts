import type { AssessmentRecord, Athlete } from "@/types";

export function mergeRecordsById<T extends { id: string }>(
  primary: T[],
  secondary: T[]
): T[] {
  const map = new Map<string, T>();
  for (const item of secondary) {
    map.set(item.id, item);
  }
  for (const item of primary) {
    map.set(item.id, item);
  }
  return Array.from(map.values());
}

export function resolveActiveAssessment(
  sessionAssessmentId: string | undefined,
  assessments: AssessmentRecord[],
  localFallback: AssessmentRecord | null
): AssessmentRecord | null {
  if (!sessionAssessmentId) {
    return assessments[0] ?? localFallback;
  }

  const match = assessments.find((assessment) => assessment.id === sessionAssessmentId);
  if (match) return match;

  if (localFallback?.id === sessionAssessmentId) {
    return localFallback;
  }

  return assessments[0] ?? localFallback;
}

export function athleteToLocalRow(athlete: Athlete) {
  return {
    id: athlete.id,
    first_name: athlete.firstName,
    last_name: athlete.lastName,
    position: athlete.position || null,
    sport: athlete.sport || null,
    team: athlete.team || null,
    age: athlete.age || null,
    height: athlete.height || null,
    weight: athlete.weight || null,
    dominant_side: athlete.dominantSide,
    jersey_number: athlete.jerseyNumber,
    gender: athlete.gender,
    status: athlete.status,
    headshot_initials: athlete.headshotInitials,
    coach: athlete.coach || null,
  };
}

export function assessmentToLocalRow(record: AssessmentRecord, assessedAt?: string) {
  let parsed = assessedAt;
  if (!parsed) {
    const fromLabel = Date.parse(record.date);
    parsed = Number.isNaN(fromLabel) ? new Date().toISOString() : new Date(fromLabel).toISOString();
  }

  return {
    id: record.id,
    athlete_id: record.athleteId,
    classification_id: record.classificationId,
    label: record.label,
    status: record.status,
    coach: record.coach || null,
    assessed_at: parsed,
  };
}
