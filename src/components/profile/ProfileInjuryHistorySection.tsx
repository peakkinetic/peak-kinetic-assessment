"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ReportSection } from "@/components/profile/ReportSection";
import { useCoachSession } from "@/context/CoachSessionContext";
import { createEmptyInjuryEntry } from "@/lib/athleteProfileData";
import type { AthleteInjuryEntry } from "@/types";

function InjuryHistoryDisplay({ entries }: { entries: AthleteInjuryEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-pkp-gray-200 bg-pkp-gray-50/60 px-4 py-6 text-sm text-pkp-gray-500">
        No injury history recorded for this assessment yet.
      </p>
    );
  }

  return (
    <ul className="space-y-2 rounded-xl border border-pkp-gray-100 bg-white px-5 py-4">
      {entries.map((entry) => (
        <li key={entry.id} className="flex gap-3 text-sm leading-relaxed text-pkp-gray-700">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-pkp-gray-400" />
          <span>{entry.description}</span>
        </li>
      ))}
    </ul>
  );
}

export function ProfileInjuryHistorySection() {
  const { injuryHistory, saveInjuryHistory } = useCoachSession();
  const [draftEntries, setDraftEntries] = useState<AthleteInjuryEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    setDraftEntries(injuryHistory.length > 0 ? injuryHistory : [createEmptyInjuryEntry()]);
  }, [injuryHistory]);

  function updateEntry(id: string, description: string) {
    setDraftEntries((current) =>
      current.map((entry) => (entry.id === id ? { ...entry, description } : entry))
    );
  }

  function addEntry() {
    setDraftEntries((current) => [...current, createEmptyInjuryEntry()]);
  }

  function removeEntry(id: string) {
    setDraftEntries((current) => {
      const next = current.filter((entry) => entry.id !== id);
      return next.length > 0 ? next : [createEmptyInjuryEntry()];
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setSavedMessage(null);

    try {
      const entries = draftEntries.filter((entry) => entry.description.trim().length > 0);
      await saveInjuryHistory(entries);
      setSavedMessage("Injury history saved for this assessment.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save injury history.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ReportSection title="Injury History" subtitle="Past and current injuries relevant to this athlete">
      <InjuryHistoryDisplay entries={injuryHistory} />

      <form onSubmit={handleSubmit} className="print:hidden mt-6 space-y-4">
        <p className="text-sm font-bold uppercase tracking-wide text-pkp-black">Edit Injury History</p>

        {draftEntries.map((entry, index) => (
          <div
            key={entry.id}
            className="rounded-xl border border-pkp-gray-200 bg-pkp-gray-50/40 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wide text-pkp-gray-400">
                Entry {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeEntry(entry.id)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-pkp-gray-400 hover:text-pkp-red"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>

            <label className="block text-sm">
              <textarea
                rows={2}
                value={entry.description}
                onChange={(event) => updateEntry(entry.id, event.target.value)}
                className="w-full rounded-lg border border-pkp-gray-200 bg-white px-3 py-2.5"
                placeholder="e.g. Right ankle sprain — March 2025, cleared for full activity"
              />
            </label>
          </div>
        ))}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={addEntry}
            className="inline-flex items-center gap-2 rounded-lg border border-pkp-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-pkp-black hover:border-pkp-red hover:text-pkp-red"
          >
            <Plus className="h-4 w-4" />
            Add Entry
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-pkp-red px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-pkp-red-dark disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save Injury History"}
          </button>
        </div>

        {savedMessage && <p className="text-sm font-medium text-emerald-700">{savedMessage}</p>}
        {error && <p className="text-sm font-medium text-pkp-red">{error}</p>}
      </form>
    </ReportSection>
  );
}
