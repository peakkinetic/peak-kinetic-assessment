"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { athleteToRow, rowToAthlete, rowToAssessment } from "@/lib/db/mappers";
import type { Athlete, AssessmentRecord } from "@/types";
import { getClassificationById } from "@/data/assessmentClassifications";

export async function getSupabaseStatus() {
  return { configured: isSupabaseConfigured() };
}

export async function listAthletesAction(): Promise<Athlete[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("athletes")
    .select("*")
    .order("last_name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToAthlete);
}

export async function createAthleteAction(input: {
  firstName: string;
  lastName: string;
  gender: Athlete["gender"];
  sport?: string;
  team?: string;
  age?: number;
  position?: string;
  coach?: string;
}): Promise<Athlete> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("athletes")
    .insert(athleteToRow(input))
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return rowToAthlete(data);
}

export async function updateAthleteAction(
  athleteId: string,
  updates: Partial<Pick<Athlete, "height" | "weight" | "age">>
): Promise<Athlete> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const payload: Record<string, string | number | null> = {};
  if (updates.height !== undefined) payload.height = updates.height || null;
  if (updates.weight !== undefined) payload.weight = updates.weight || null;
  if (updates.age !== undefined) payload.age = updates.age || null;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("athletes")
    .update(payload)
    .eq("id", athleteId)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return rowToAthlete(data);
}

export async function listAssessmentsForAthleteAction(
  athleteId: string
): Promise<AssessmentRecord[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("athlete_id", athleteId)
    .order("assessed_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToAssessment);
}

export async function createAssessmentAction(input: {
  athleteId: string;
  classificationId: string;
  label?: string;
  coach?: string;
}): Promise<AssessmentRecord> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const classification = getClassificationById(input.classificationId);
  const label =
    input.label ??
    `${classification.label} — ${new Date().toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })}`;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("assessments")
    .insert({
      athlete_id: input.athleteId,
      classification_id: input.classificationId,
      label,
      status: "in-progress",
      coach: input.coach ?? "",
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return rowToAssessment(data);
}

export async function startCoachSessionAction(input: {
  athleteId: string;
  classificationId: string;
  label?: string;
  coach?: string;
}): Promise<{ athlete: Athlete; assessment: AssessmentRecord }> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const supabase = createServiceClient();

  const { data: athleteRow, error: athleteError } = await supabase
    .from("athletes")
    .select("*")
    .eq("id", input.athleteId)
    .single();

  if (athleteError) throw new Error(athleteError.message);

  const assessment = await createAssessmentAction(input);

  return {
    athlete: rowToAthlete(athleteRow),
    assessment,
  };
}
