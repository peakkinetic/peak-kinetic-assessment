"use client";

import { FormEvent, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { useCoachSession } from "@/context/CoachSessionContext";
import {
  leftScreeningMobilityCategories,
  rightScreeningMobilityCategories,
  screeningMobilityCategories,
  screeningMobilityLabels,
  type ScreeningMobilityCategory,
  type ScreeningMobilityId,
} from "@/data/screeningMobilityCategories";
import { getScreeningSessionNote } from "@/lib/screeningMetrics";

type JointFormEntry = {
  degrees: string;
  notes: string;
};

function JointEntryGrid({
  categories,
  joints,
  setJoints,
}: {
  categories: ScreeningMobilityCategory[];
  joints: Record<string, JointFormEntry>;
  setJoints: Dispatch<SetStateAction<Record<string, JointFormEntry>>>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="rounded-xl border border-pkp-gray-100 bg-pkp-gray-50/40 p-4"
        >
          <label className="block text-sm">
            <span className="mb-2 block font-semibold text-pkp-black">
              {screeningMobilityLabels[category.id]}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={180}
                step="1"
                value={joints[category.id]?.degrees ?? ""}
                onChange={(event) =>
                  setJoints((current) => ({
                    ...current,
                    [category.id]: {
                      degrees: event.target.value,
                      notes: current[category.id]?.notes ?? "",
                    },
                  }))
                }
                className="w-full rounded-lg border border-pkp-gray-200 bg-white px-3 py-2.5"
                placeholder="Degrees"
              />
              <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-pkp-gray-400">
                °
              </span>
            </div>
          </label>
          <label className="mt-3 block text-sm">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-pkp-gray-500">
              Notes
            </span>
            <textarea
              rows={2}
              value={joints[category.id]?.notes ?? ""}
              onChange={(event) =>
                setJoints((current) => ({
                  ...current,
                  [category.id]: {
                    degrees: current[category.id]?.degrees ?? "",
                    notes: event.target.value,
                  },
                }))
              }
              className="w-full rounded-lg border border-pkp-gray-200 bg-white px-3 py-2.5"
              placeholder="Optional screening notes"
            />
          </label>
        </div>
      ))}
    </div>
  );
}

export function ScreeningScoreEntry() {
  const { activeAssessment, assessmentResults, saveScreeningResults } = useCoachSession();

  const [joints, setJoints] = useState<Record<string, JointFormEntry>>({});
  const [sessionNote, setSessionNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const initialState = useMemo(() => {
    const nextJoints: Record<string, JointFormEntry> = {};

    for (const category of screeningMobilityCategories) {
      const result = assessmentResults.find(
        (item) =>
          item.moduleId === "screening-mobility" && item.testId === category.id
      );
      nextJoints[category.id] = {
        degrees: result ? String(result.value) : "",
        notes: result?.notes ?? "",
      };
    }

    return {
      joints: nextJoints,
      sessionNote: getScreeningSessionNote(assessmentResults) ?? "",
    };
  }, [assessmentResults]);

  useEffect(() => {
    setJoints(initialState.joints);
    setSessionNote(initialState.sessionNote);
  }, [initialState]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!activeAssessment) return;

    setIsSaving(true);
    setError(null);
    setSavedMessage(null);

    try {
      const payload: Partial<
        Record<ScreeningMobilityId, { degrees?: number; notes?: string }>
      > = {};

      for (const category of screeningMobilityCategories) {
        const entry = joints[category.id];
        if (!entry) continue;

        const rawDegrees = entry.degrees.trim();
        if (!rawDegrees) continue;

        const degrees = Number(rawDegrees);
        if (Number.isNaN(degrees)) {
          throw new Error(`Enter a valid degree value for ${screeningMobilityLabels[category.id]}.`);
        }
        if (degrees < 0 || degrees > 180) {
          throw new Error(`${screeningMobilityLabels[category.id]} must be between 0 and 180°.`);
        }

        payload[category.id] = {
          degrees,
          notes: entry.notes.trim() || undefined,
        };
      }

      await saveScreeningResults({
        joints: payload,
        sessionNote: sessionNote.trim() || undefined,
      });
      setSavedMessage(
        "Screening scores saved. Joint mobility tables and symmetry charts update immediately."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save screening scores.");
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
        title="Enter Screening Mobility"
        subtitle={`ROM in degrees (0–180°) · Saved to ${activeAssessment.label}`}
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-8">
          <section>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-pkp-black">
              Left Side
            </h3>
            <JointEntryGrid
              categories={leftScreeningMobilityCategories}
              joints={joints}
              setJoints={setJoints}
            />
          </section>

          <section>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-pkp-black">
              Right Side
            </h3>
            <JointEntryGrid
              categories={rightScreeningMobilityCategories}
              joints={joints}
              setJoints={setJoints}
            />
          </section>
        </div>

        <label className="block text-sm">
          <span className="mb-2 block font-semibold text-pkp-black">Session Screening Note</span>
          <textarea
            rows={3}
            value={sessionNote}
            onChange={(event) => setSessionNote(event.target.value)}
            className="w-full rounded-lg border border-pkp-gray-200 px-3 py-2.5"
            placeholder="Overall screening summary for this assessment"
          />
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-pkp-red px-4 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-pkp-red-dark disabled:opacity-50"
        >
          {isSaving ? "Saving…" : "Save Screening Scores"}
        </button>
      </form>
      {savedMessage && <p className="mt-4 text-sm font-medium text-emerald-700">{savedMessage}</p>}
      {error && <p className="mt-4 text-sm font-medium text-pkp-red">{error}</p>}
    </Card>
  );
}
