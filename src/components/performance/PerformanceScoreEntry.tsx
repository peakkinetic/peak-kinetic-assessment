"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { useCoachSession } from "@/context/CoachSessionContext";
import {
  performanceTestLabels,
  performanceTestUnits,
} from "@/lib/assessmentAccess";
import { getPerformanceResultValue } from "@/lib/performanceMetrics";
import type { PerformanceTestId } from "@/types";

export function PerformanceScoreEntry() {
  const {
    activeAssessment,
    activePerformanceTests,
    assessmentResults,
    savePerformanceResults,
  } = useCoachSession();

  const [scores, setScores] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const initialScores = useMemo(() => {
    const next: Record<string, string> = {};
    for (const testId of activePerformanceTests) {
      const value = getPerformanceResultValue(assessmentResults, testId);
      next[testId] = value !== undefined ? String(value) : "";
    }
    return next;
  }, [activePerformanceTests, assessmentResults]);

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
      const parsed: Partial<Record<PerformanceTestId, number>> = {};

      for (const testId of activePerformanceTests) {
        const raw = scores[testId]?.trim();
        if (!raw) continue;
        const value = Number(raw);
        if (Number.isNaN(value)) {
          throw new Error(`Enter a valid number for ${performanceTestLabels[testId]}.`);
        }
        parsed[testId] = value;
      }

      await savePerformanceResults(parsed);
      setSavedMessage(
        "Scores saved. Open Athlete Profile, Progress Tracking, or other tabs to see your updated results."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save scores.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!activeAssessment || activePerformanceTests.length === 0) {
    return null;
  }

  return (
    <Card accent className="mb-8">
      <CardHeader
        title="Enter Performance Scores"
        subtitle={`Saved to ${activeAssessment.label}`}
      />
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activePerformanceTests.map((testId) => (
          <label key={testId} className="block text-sm">
            <span className="mb-1 block font-semibold text-pkp-black">
              {performanceTestLabels[testId]}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="any"
                min={0}
                value={scores[testId] ?? ""}
                onChange={(event) =>
                  setScores((current) => ({
                    ...current,
                    [testId]: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-pkp-gray-200 px-3 py-2.5"
                placeholder="Enter result"
              />
              <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-pkp-gray-400">
                {performanceTestUnits[testId]}
              </span>
            </div>
          </label>
        ))}
        <div className="sm:col-span-2 lg:col-span-3">
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
