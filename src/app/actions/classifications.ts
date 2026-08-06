"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { AssessmentClassificationOverride } from "@/types";

interface ClassificationOverrideRow {
  classification_id: string;
  label: string;
  description: string;
}

function rowToOverride(row: ClassificationOverrideRow): AssessmentClassificationOverride {
  return {
    classificationId: row.classification_id,
    label: row.label,
    description: row.description,
  };
}

export async function listClassificationOverridesAction(): Promise<
  AssessmentClassificationOverride[]
> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("assessment_classification_overrides")
    .select("classification_id, label, description");

  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToOverride);
}

export async function saveClassificationOverrideAction(
  override: AssessmentClassificationOverride
): Promise<AssessmentClassificationOverride> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("assessment_classification_overrides")
    .upsert(
      {
        classification_id: override.classificationId,
        label: override.label.trim(),
        description: override.description.trim(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "classification_id" }
    )
    .select("classification_id, label, description")
    .single();

  if (error) throw new Error(error.message);
  return rowToOverride(data);
}
