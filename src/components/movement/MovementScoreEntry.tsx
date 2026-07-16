"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { useCoachSession } from "@/context/CoachSessionContext";
import {
  movementScreenCategories,
  movementScreenLabels,
  type MovementScreenId,
} from "@/data/movementScreenCategories";
import { getMovementResult } from "@/lib/movementMetrics";
import type { AssessmentScoreValue } from "@/types";

type FormEntry = {
  score: AssessmentScoreValue | "";
  notes: string;
};

export function MovementScoreEntry() {
  const { activeAssessment, assessmentResults, saveMovementResults } = useCoachSession();

  const [entries, setEntries] = useState<Record<string, FormEntry>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const initialEntries = useMemo(() => {
    const next: Record<string, FormEntry> = {};

    for (const category of movementScreenCategories) {
      const result = getMovementResult(assessmentResults, category.id);
      next[category.id] = {
        score: result ? (result.value as AssessmentScoreValue) : "NA",
        notes: result?.notes ?? "",
      };
    }

    return next;
  }, [assessmentResults]);

  useEffect(() => {
    setEntries(initialEntries);
  }, [initialEntries]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!activeAssessment) return;

    setIsSaving(true);
    setError(null);
    setSavedMessage(null);

    try {
      const payload: Partial<
        Record<MovementScreenId, { score: AssessmentScoreValue; notes?: string }>
      > = {};

      for (const category of movementScreenCategories) {
        const entry = entries[category.id];
        if (!entry || !entry.score) continue;

        payload[category.id] = {
          score:
            entry.score === "NA" ? "NA" : (Number(entry.score) as 1 | 2 | 3),
          notes: entry.notes.trim() || undefined,
        };
      }

      await saveMovementResults(payload);
      setSavedMessage(
        "Movement scores saved. Charts and tables on this page update immediately — other tabs reflect them too."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save movement scores.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!activeAssessment) {
    return null;
  }

  return (
    <Card accent className="mb-8">
      <CardHeader
        title="Enter Movement Scores"
        subtitle={`1 = Bad · 2 = Moderate · 3 = Good · Saved to ${activeAssessment.label}`}
      />
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        {movementScreenCategories.map((category) => (
          <div
            key={category.id}
            className="rounded-xl border border-pkp-gray-100 bg-pkp-gray-50/40 p-4"
          >
            <label className="block text-sm">
              <span className="mb-2 block font-semibold text-pkp-black">
                {movementScreenLabels[category.id]}
              </span>
              <select
                value={entries[category.id]?.score ?? "NA"}
                onChange={(event) =>
                  setEntries((current) => ({
                    ...current,
                    [category.id]: {
                      ...current[category.id],
                      score: event.target.value as AssessmentScoreValue,
                      notes: current[category.id]?.notes ?? "",
                    },
                  }))
                }
                className="w-full rounded-lg border border-pkp-gray-200 bg-white px-3 py-2.5"
              >
                <option value="NA">Not Assessed</option>
                <option value="1">1 — Bad</option>
                <option value="2">2 — Moderate</option>
                <option value="3">3 — Good</option>
              </select>
            </label>
            <label className="mt-3 block text-sm">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-pkp-gray-500">
                Notes
              </span>
              <textarea
                rows={2}
                value={entries[category.id]?.notes ?? ""}
                onChange={(event) =>
                  setEntries((current) => ({
                    ...current,
                    [category.id]: {
                      score: current[category.id]?.score ?? "NA",
                      notes: event.target.value,
                    },
                  }))
                }
                className="w-full rounded-lg border border-pkp-gray-200 bg-white px-3 py-2.5"
                placeholder="Optional coach notes"
              />
            </label>
          </div>
        ))}
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-pkp-red px-4 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-pkp-red-dark disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save Movement Scores"}
          </button>
        </div>
      </form>
      {savedMessage && <p className="mt-4 text-sm font-medium text-emerald-700">{savedMessage}</p>}
      {error && <p className="mt-4 text-sm font-medium text-pkp-red">{error}</p>}
    </Card>
  );
}
