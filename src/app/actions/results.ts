"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isUuid } from "@/lib/uuid";
import { rowToAssessment, rowToAssessmentResult } from "@/lib/db/mappers";
import type { AssessmentResult, SaveAssessmentResultInput } from "@/types";

export async function listAssessmentResultsAction(
  assessmentId: string
): Promise<AssessmentResult[]> {
  if (!isSupabaseConfigured() || !isUuid(assessmentId)) return [];

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("assessment_results")
    .select("*")
    .eq("assessment_id", assessmentId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToAssessmentResult);
}

export async function listAssessmentHistoryAction(athleteId: string) {
  if (!isSupabaseConfigured() || !isUuid(athleteId)) return [];

  const supabase = createServiceClient();
  const { data: assessments, error: assessmentError } = await supabase
    .from("assessments")
    .select("*")
    .eq("athlete_id", athleteId)
    .order("assessed_at", { ascending: true });

  if (assessmentError) throw new Error(assessmentError.message);
  if (!assessments?.length) return [];

  const assessmentIds = assessments.map((row) => row.id);
  const { data: results, error: resultsError } = await supabase
    .from("assessment_results")
    .select("*")
    .in("assessment_id", assessmentIds);

  if (resultsError) throw new Error(resultsError.message);

  return assessments.map((row) => ({
    assessment: rowToAssessment(row),
    results: (results ?? [])
      .filter((result) => result.assessment_id === row.id)
      .map(rowToAssessmentResult),
  }));
}

export async function saveAssessmentResultsAction(
  assessmentId: string,
  moduleId: SaveAssessmentResultInput["moduleId"],
  results: SaveAssessmentResultInput[]
): Promise<AssessmentResult[]> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  if (!isUuid(assessmentId)) {
    throw new Error("This assessment must be saved locally. Start a new session from the coach page.");
  }

  const supabase = createServiceClient();

  const { error: deleteError } = await supabase
    .from("assessment_results")
    .delete()
    .eq("assessment_id", assessmentId)
    .eq("module_id", moduleId);

  if (deleteError) throw new Error(deleteError.message);

  if (results.length === 0) return [];

  const { data, error } = await supabase
    .from("assessment_results")
    .insert(
      results.map((result) => ({
        assessment_id: assessmentId,
        module_id: result.moduleId,
        test_id: result.testId,
        value: result.value,
        unit: result.unit,
        notes: result.notes ?? null,
      }))
    )
    .select("*");

  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToAssessmentResult);
}
