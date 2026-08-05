"use client";

import { FormEvent, useEffect, useState } from "react";
import { ReportSection } from "@/components/profile/ReportSection";
import { useCoachSession } from "@/context/CoachSessionContext";
import { emptyAthleteFocusAreas } from "@/lib/athleteProfileData";
import type { AthleteFocusAreas } from "@/types";

function FocusAreasDisplay({ focusAreas }: { focusAreas: AthleteFocusAreas }) {
  const hasPrimary = focusAreas.primary.trim().length > 0;
  const hasSecondary = focusAreas.secondary.trim().length > 0;

  if (!hasPrimary && !hasSecondary) {
    return (
      <p className="rounded-xl border border-dashed border-pkp-gray-200 bg-pkp-gray-50/60 px-4 py-6 text-sm text-pkp-gray-500">
        No focus areas added for this assessment yet.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-pkp-gray-100 bg-white px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-wide text-pkp-red">Primary Focus</p>
        <p className="mt-2 text-sm leading-relaxed text-pkp-gray-700">
          {hasPrimary ? focusAreas.primary : "—"}
        </p>
      </div>
      <div className="rounded-xl border border-pkp-gray-100 bg-white px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-wide text-pkp-gray-500">
          Secondary Focus
        </p>
        <p className="mt-2 text-sm leading-relaxed text-pkp-gray-700">
          {hasSecondary ? focusAreas.secondary : "—"}
        </p>
      </div>
    </div>
  );
}

export function ProfileFocusAreasSection() {
  const { athleteFocusAreas, saveAthleteFocusAreas } = useCoachSession();
  const [draft, setDraft] = useState<AthleteFocusAreas>(emptyAthleteFocusAreas);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    setDraft(athleteFocusAreas);
  }, [athleteFocusAreas]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setSavedMessage(null);

    try {
      await saveAthleteFocusAreas({
        primary: draft.primary.trim(),
        secondary: draft.secondary.trim(),
      });
      setSavedMessage("Focus areas saved for this assessment.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save focus areas.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ReportSection
      title="Areas of Focus"
      subtitle="Primary and secondary development priorities for this athlete"
    >
      <FocusAreasDisplay focusAreas={athleteFocusAreas} />

      <form onSubmit={handleSubmit} className="print:hidden mt-6 space-y-4">
        <p className="text-sm font-bold uppercase tracking-wide text-pkp-black">
          Edit Focus Areas
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-2 block font-semibold text-pkp-black">Primary Area of Focus</span>
            <textarea
              rows={3}
              value={draft.primary}
              onChange={(event) =>
                setDraft((current) => ({ ...current, primary: event.target.value }))
              }
              className="w-full rounded-lg border border-pkp-gray-200 bg-white px-3 py-2.5"
              placeholder="e.g. Improve hip-shoulder separation and bat speed"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-2 block font-semibold text-pkp-black">Secondary Area of Focus</span>
            <textarea
              rows={3}
              value={draft.secondary}
              onChange={(event) =>
                setDraft((current) => ({ ...current, secondary: event.target.value }))
              }
              className="w-full rounded-lg border border-pkp-gray-200 bg-white px-3 py-2.5"
              placeholder="e.g. Strengthen core stability and lower-half sequencing"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-pkp-red px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-pkp-red-dark disabled:opacity-50"
        >
          {isSaving ? "Saving…" : "Save Focus Areas"}
        </button>

        {savedMessage && <p className="text-sm font-medium text-emerald-700">{savedMessage}</p>}
        {error && <p className="text-sm font-medium text-pkp-red">{error}</p>}
      </form>
    </ReportSection>
  );
}
