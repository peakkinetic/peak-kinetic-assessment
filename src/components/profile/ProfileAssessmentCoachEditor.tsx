"use client";

import { FormEvent, useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { useCoachSession } from "@/context/CoachSessionContext";

export function ProfileAssessmentCoachEditor() {
  const { activeAssessment, updateAssessment } = useCoachSession();
  const [coach, setCoach] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!activeAssessment) return;
    setCoach(activeAssessment.coach);
  }, [activeAssessment]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!activeAssessment) return;

    setIsSaving(true);
    setError(null);
    setSavedMessage(null);

    try {
      await updateAssessment(activeAssessment.id, {
        coach: coach.trim(),
      });
      setSavedMessage("Assessment coach saved. It will appear on the report below.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save assessment coach.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!activeAssessment) return null;

  return (
    <Card>
      <CardHeader
        title="Assessment Coach"
        subtitle="Shows on the athlete report for this assessment"
      />

      <form onSubmit={handleSubmit} className="max-w-md">
        <label className="block text-sm">
          <span className="mb-1 flex items-center gap-2 font-semibold text-pkp-black">
            <ClipboardList className="h-4 w-4 text-pkp-gray-500" />
            Coach running this assessment
          </span>
          <input
            type="text"
            value={coach}
            onChange={(event) => setCoach(event.target.value)}
            className="w-full rounded-lg border border-pkp-gray-200 px-3 py-2.5"
            placeholder="e.g. Coach Moody"
          />
        </label>

        <button
          type="submit"
          disabled={isSaving}
          className="mt-4 rounded-lg bg-pkp-red px-4 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-pkp-red-dark disabled:opacity-50"
        >
          {isSaving ? "Saving…" : "Save Coach"}
        </button>
      </form>

      {savedMessage && <p className="mt-4 text-sm font-medium text-emerald-700">{savedMessage}</p>}
      {error && <p className="mt-4 text-sm font-medium text-pkp-red">{error}</p>}
    </Card>
  );
}
