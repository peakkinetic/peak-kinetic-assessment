import type { Athlete, AssessmentRecord, AssessmentStatus, AssessmentResult } from "@/types";

export interface AthleteRow {
  id: string;
  first_name: string;
  last_name: string;
  position: string | null;
  sport: string | null;
  team: string | null;
  age: number | null;
  height: string | null;
  weight: string | null;
  dominant_side: "Left" | "Right" | null;
  jersey_number: number | null;
  gender: "Male" | "Female";
  status: "Active" | "Rehab" | "Evaluating" | null;
  headshot_initials: string | null;
  coach: string | null;
}

export interface AssessmentRow {
  id: string;
  athlete_id: string;
  classification_id: string;
  label: string;
  status: AssessmentStatus;
  coach: string | null;
  assessed_at: string;
}

export interface AssessmentResultRow {
  id: string;
  assessment_id: string;
  module_id: string;
  test_id: string | null;
  value: number | null;
  unit: string | null;
  notes: string | null;
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function rowToAthlete(row: AthleteRow): Athlete {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    position: row.position ?? "Athlete",
    sport: row.sport ?? "",
    team: row.team ?? "",
    age: row.age ?? 0,
    height: row.height ?? "",
    weight: row.weight ?? "",
    dominantSide: row.dominant_side ?? "Right",
    jerseyNumber: row.jersey_number ?? 0,
    gender: row.gender,
    status: row.status ?? "Active",
    headshotInitials: row.headshot_initials ?? getInitials(row.first_name, row.last_name),
    coach: row.coach ?? "",
    lastAssessment: "",
    nextAssessment: "TBD",
  };
}

export function athleteToRow(athlete: Partial<Athlete> & Pick<Athlete, "firstName" | "lastName" | "gender">) {
  return {
    first_name: athlete.firstName,
    last_name: athlete.lastName,
    position: athlete.position ?? "Athlete",
    sport: athlete.sport ?? "",
    team: athlete.team ?? "",
    age: athlete.age ?? null,
    height: athlete.height ?? null,
    weight: athlete.weight ?? null,
    dominant_side: athlete.dominantSide ?? "Right",
    jersey_number: athlete.jerseyNumber ?? 0,
    gender: athlete.gender,
    status: athlete.status ?? "Active",
    headshot_initials:
      athlete.headshotInitials ?? getInitials(athlete.firstName, athlete.lastName),
    coach: athlete.coach ?? "",
  };
}

export function rowToAssessment(row: AssessmentRow): AssessmentRecord {
  return {
    id: row.id,
    athleteId: row.athlete_id,
    classificationId: row.classification_id,
    label: row.label,
    date: new Date(row.assessed_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    status: row.status,
    coach: row.coach ?? "",
  };
}

export function rowToAssessmentResult(row: AssessmentResultRow): AssessmentResult {
  return {
    id: row.id,
    assessmentId: row.assessment_id,
    moduleId: row.module_id as AssessmentResult["moduleId"],
    testId: row.test_id ?? "",
    value: row.value ?? 0,
    unit: row.unit ?? "",
    notes: row.notes ?? undefined,
  };
}
