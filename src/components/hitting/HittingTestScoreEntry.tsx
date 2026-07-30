"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { useCoachSession } from "@/context/CoachSessionContext";
import { getHittingTestResultValue } from "@/lib/hittingTestMetrics";
import type { AssessmentModuleId } from "@/types";

interface HittingTestDefinition {
  id: string;
  label: string;
  unit: string;
}

interface HittingTestScoreEntryProps {
  moduleId: Extract<AssessmentModuleId, "hittrax-testing" | "blast-testing">;
  title: string;
  tests: readonly HittingTestDefinition[];
  onSave: (scores: Partial<Record<string, number>>) => Promise<void>;
}

export function HittingTestScoreEntry({
  moduleId,
  title,
  tests,
  onSave,
}: HittingTestScoreEntryProps) {
  const { activeAssessment, assessmentResults } = useCoachSession();
  const [scores, setScores] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const initialScores = useMemo(() => {
    const next: Record<string, string> = {};
    for (const test of tests) {
      const value = getHittingTestResultValue(assessmentResults, moduleId, test.id);
      next[test.id] = value !== undefined ? String(value) : "";
    }
    return next;
  }, [assessmentResults, moduleId, tests]);

  useEffect(() => {
    setScores(initialScores);
  }, [initialScores]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!activeAssessment) return;

    setIsSaving(true);
    setError(null);
    setSavedMessage(null);

    try {
      const parsed: Partial<Record<string, number>> = {};

      for (const test of tests) {
        const raw = scores[test.id]?.trim();
        if (!raw) continue;
        const value = Number(raw);
        if (Number.isNaN(value)) {
          throw new Error(`Enter a valid number for ${test.label}.`);
        }
        parsed[test.id] = value;
      }

      await onSave(parsed);
      setSavedMessage("Scores saved for this assessment.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save scores.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!activeAssessment) {
    return null;
  }

  return (
    <Card accent className="mb-8">
      <CardHeader title={title} subtitle={`Saved to ${activeAssessment.label}`} />
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        {tests.map((test) => (
          <label key={test.id} className="block text-sm">
            <span className="mb-1 block font-semibold text-pkp-black">{test.label}</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="any"
                value={scores[test.id] ?? ""}
                onChange={(event) =>
                  setScores((current) => ({
                    ...current,
                    [test.id]: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-pkp-gray-200 px-3 py-2.5"
                placeholder={`Enter ${test.unit}`}
              />
              <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-pkp-gray-400">
                {test.unit}
              </span>
            </div>
          </label>
        ))}
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-pkp-red px-4 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-pkp-red-dark disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save Scores"}
          </button>
        </div>
      </form>
      {savedMessage && <p className="mt-4 text-sm font-medium text-emerald-700">{savedMessage}</p>}
      {error && <p className="mt-4 text-sm font-medium text-pkp-red">{error}</p>}
    </Card>
  );
}
