"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { useCoachSession } from "@/context/CoachSessionContext";

export function ProfileDeleteAthleteSection() {
  const { athlete, deleteAthlete } = useCoachSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!athlete) return null;

  async function handleDelete() {
    if (!athlete) return;

    const confirmed = window.confirm(
      `Delete ${athlete.firstName} ${athlete.lastName}?\n\nThis removes the athlete profile, all assessments, and all saved scores. This cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteAthlete(athlete.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete athlete profile.");
      setIsDeleting(false);
    }
  }

  return (
    <Card className="border-pkp-red/20">
      <CardHeader
        title="Delete Athlete Profile"
        subtitle="Permanently remove this athlete and all assessment history"
      />

      <p className="text-sm text-pkp-gray-600">
        Deleting {athlete.firstName} {athlete.lastName} removes every assessment session,
        performance score, movement screen entry, mobility measurement, goals, and injury history
        linked to this profile.
      </p>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-pkp-red/30 bg-pkp-red/5 px-4 py-3 text-sm font-bold uppercase tracking-wide text-pkp-red hover:bg-pkp-red hover:text-white disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
        {isDeleting ? "Deleting…" : "Delete Athlete Profile"}
      </button>

      {error && <p className="mt-4 text-sm font-medium text-pkp-red">{error}</p>}
    </Card>
  );
}
