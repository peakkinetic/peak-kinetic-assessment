"use client";

import { FormEvent, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useCoachSession } from "@/context/CoachSessionContext";
import { assessmentClassifications } from "@/data/assessmentClassifications";
import type { AssessmentRecord, AssessmentStatus } from "@/types";

const statusVariant = {
  scheduled: "warning",
  "in-progress": "red",
  complete: "success",
} as const;

const statusLabel = {
  scheduled: "Scheduled",
  "in-progress": "In Progress",
  complete: "Complete",
} as const;

export function AssessmentHistoryList() {
  const {
    assessments,
    activeAssessment,
    setActiveAssessmentId,
    updateAssessment,
    deleteAssessment,
  } = useCoachSession();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editStatus, setEditStatus] = useState<AssessmentStatus>("in-progress");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function startEdit(assessment: AssessmentRecord) {
    setEditingId(assessment.id);
    setEditLabel(assessment.label);
    setEditStatus(assessment.status);
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setError(null);
  }

  async function handleSave(event: FormEvent, assessmentId: string) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await updateAssessment(assessmentId, {
        label: editLabel.trim(),
        status: editStatus,
      });
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update assessment.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(assessment: AssessmentRecord) {
    const confirmed = window.confirm(
      `Delete "${assessment.label}"?\n\nThis removes the session and all saved scores for it. This cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(assessment.id);
    setError(null);

    try {
      await deleteAssessment(assessment.id);
      if (editingId === assessment.id) {
        setEditingId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete assessment.");
    } finally {
      setDeletingId(null);
    }
  }

  if (assessments.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-pkp-gray-200 bg-pkp-gray-50/60 px-4 py-6 text-sm text-pkp-gray-500">
        No assessment sessions yet. Start a new assessment to build this athlete&apos;s history.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {assessments.map((assessment) => {
        const isActive = assessment.id === activeAssessment?.id;
        const isEditing = editingId === assessment.id;
        const itemClassification = assessmentClassifications.find(
          (item) => item.id === assessment.classificationId
        );

        return (
          <div
            key={assessment.id}
            className={`rounded-lg border px-4 py-3 transition-colors ${
              isActive
                ? "border-pkp-red bg-pkp-red-muted"
                : "border-pkp-gray-200 bg-white"
            }`}
          >
            {isEditing ? (
              <form onSubmit={(event) => handleSave(event, assessment.id)} className="space-y-3">
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-pkp-black">Session label</span>
                  <input
                    type="text"
                    value={editLabel}
                    onChange={(event) => setEditLabel(event.target.value)}
                    className="w-full rounded-lg border border-pkp-gray-200 px-3 py-2.5"
                    required
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-pkp-black">Status</span>
                  <select
                    value={editStatus}
                    onChange={(event) => setEditStatus(event.target.value as AssessmentStatus)}
                    className="w-full rounded-lg border border-pkp-gray-200 bg-white px-3 py-2.5"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in-progress">In Progress</option>
                    <option value="complete">Complete</option>
                  </select>
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-lg bg-pkp-red px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-pkp-red-dark disabled:opacity-50"
                  >
                    {isSaving ? "Saving…" : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-lg border border-pkp-gray-200 px-4 py-2 text-xs font-bold uppercase tracking-wide text-pkp-gray-600 hover:bg-pkp-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveAssessmentId(assessment.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-pkp-black">{assessment.label}</p>
                      {isActive && (
                        <span className="shrink-0 rounded-full bg-pkp-red px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-pkp-gray-500">
                      {itemClassification?.label} · {assessment.date}
                    </p>
                    <Badge variant={statusVariant[assessment.status]} className="mt-2 w-fit">
                      {statusLabel[assessment.status]}
                    </Badge>
                  </button>

                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        startEdit(assessment);
                      }}
                      className="rounded-lg border border-pkp-gray-200 p-2 text-pkp-gray-500 hover:border-pkp-black hover:text-pkp-black"
                      aria-label={`Edit ${assessment.label}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        void handleDelete(assessment);
                      }}
                      disabled={deletingId === assessment.id}
                      className="rounded-lg border border-pkp-gray-200 p-2 text-pkp-gray-500 hover:border-pkp-red hover:text-pkp-red disabled:opacity-50"
                      aria-label={`Delete ${assessment.label}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}

      {error && <p className="text-sm font-medium text-pkp-red">{error}</p>}
    </div>
  );
}
