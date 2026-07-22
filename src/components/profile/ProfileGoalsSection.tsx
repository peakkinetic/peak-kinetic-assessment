"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ReportSection } from "@/components/profile/ReportSection";
import { useCoachSession } from "@/context/CoachSessionContext";
import { createEmptyGoal } from "@/lib/athleteProfileData";
import type { AthleteGoal } from "@/types";

function GoalsDisplay({ goals }: { goals: AthleteGoal[] }) {
  if (goals.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-pkp-gray-200 bg-pkp-gray-50/60 px-4 py-6 text-sm text-pkp-gray-500">
        No goals added for this assessment yet.
      </p>
    );
  }

  return (
    <ul className="space-y-2 rounded-xl border border-pkp-gray-100 bg-white px-5 py-4">
      {goals.map((goal) => (
        <li key={goal.id} className="flex gap-3 text-sm leading-relaxed text-pkp-gray-700">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-pkp-red" />
          <span>{goal.title}</span>
        </li>
      ))}
    </ul>
  );
}

export function ProfileGoalsSection() {
  const { athleteGoals, saveAthleteGoals } = useCoachSession();
  const [draftGoals, setDraftGoals] = useState<AthleteGoal[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    setDraftGoals(athleteGoals.length > 0 ? athleteGoals : [createEmptyGoal()]);
  }, [athleteGoals]);

  function updateGoal(id: string, title: string) {
    setDraftGoals((current) =>
      current.map((goal) => (goal.id === id ? { ...goal, title } : goal))
    );
  }

  function addGoal() {
    setDraftGoals((current) => [...current, createEmptyGoal()]);
  }

  function removeGoal(id: string) {
    setDraftGoals((current) => {
      const next = current.filter((goal) => goal.id !== id);
      return next.length > 0 ? next : [createEmptyGoal()];
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setSavedMessage(null);

    try {
      const goals = draftGoals.filter((goal) => goal.title.trim().length > 0);
      await saveAthleteGoals(goals);
      setSavedMessage("Goals saved for this assessment.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save goals.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ReportSection title="Goals" subtitle="Summary of what this athlete wants to achieve">
      <GoalsDisplay goals={athleteGoals} />

      <form onSubmit={handleSubmit} className="print:hidden mt-6 space-y-4">
        <p className="text-sm font-bold uppercase tracking-wide text-pkp-black">Edit Goals</p>

        {draftGoals.map((goal, index) => (
          <div
            key={goal.id}
            className="rounded-xl border border-pkp-gray-200 bg-pkp-gray-50/40 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wide text-pkp-gray-400">
                Goal {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeGoal(goal.id)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-pkp-gray-400 hover:text-pkp-red"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>

            <label className="block text-sm">
              <textarea
                rows={2}
                value={goal.title}
                onChange={(event) => updateGoal(goal.id, event.target.value)}
                className="w-full rounded-lg border border-pkp-gray-200 bg-white px-3 py-2.5"
                placeholder="e.g. Improve first-step quickness and vertical jump this off-season"
              />
            </label>
          </div>
        ))}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={addGoal}
            className="inline-flex items-center gap-2 rounded-lg border border-pkp-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-pkp-black hover:border-pkp-red hover:text-pkp-red"
          >
            <Plus className="h-4 w-4" />
            Add Goal
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-pkp-red px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-pkp-red-dark disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save Goals"}
          </button>
        </div>

        {savedMessage && <p className="text-sm font-medium text-emerald-700">{savedMessage}</p>}
        {error && <p className="text-sm font-medium text-pkp-red">{error}</p>}
      </form>
    </ReportSection>
  );
}
