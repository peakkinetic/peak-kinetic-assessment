"use client";

import { useCoachSession } from "@/context/CoachSessionContext";

function formatSavedTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function SavedDataStatus() {
  const { activeAssessment, savedEntryCount, lastSavedAt, isSupabaseConnected } =
    useCoachSession();

  if (!activeAssessment) return null;

  const storageLabel = isSupabaseConnected ? "cloud database" : "this browser";

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-900">
      <span className="font-semibold">Saved to {storageLabel}</span>
      <span className="text-emerald-700">·</span>
      <span>
        {savedEntryCount > 0
          ? `${savedEntryCount} score${savedEntryCount === 1 ? "" : "s"} for ${activeAssessment.label}`
          : `No scores saved yet for ${activeAssessment.label}`}
      </span>
      {lastSavedAt && (
        <>
          <span className="text-emerald-700">·</span>
          <span>Last saved {formatSavedTime(lastSavedAt)}</span>
        </>
      )}
      <span className="w-full text-xs text-emerald-800/80">
        After you click Save, open any dashboard tab to see your updated results. Data persists when
        you refresh this page.
      </span>
    </div>
  );
}
