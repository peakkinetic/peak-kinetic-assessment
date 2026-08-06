"use client";

import { FormEvent, useState } from "react";
import { Pencil, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import {
  assessmentClassificationGroupOrder,
  assessmentClassificationGroups,
} from "@/data/assessmentClassifications";
import { useCoachSession } from "@/context/CoachSessionContext";
import type { AssessmentClassification } from "@/types";

export function AssessmentTypesEditor() {
  const { classifications, saveClassificationOverride } = useCoachSession();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(classification: AssessmentClassification) {
    setEditingId(classification.id);
    setEditLabel(classification.label);
    setEditDescription(classification.description);
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setError(null);
  }

  async function handleSave(event: FormEvent, classificationId: string) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await saveClassificationOverride({
        classificationId,
        label: editLabel.trim(),
        description: editDescription.trim(),
      });
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save assessment info.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReset(classificationId: string) {
    setIsSaving(true);
    setError(null);

    try {
      await saveClassificationOverride({
        classificationId,
        label: "",
        description: "",
      });
      if (editingId === classificationId) {
        setEditingId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset assessment info.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {assessmentClassificationGroupOrder.map((groupId) => {
        const group = assessmentClassificationGroups[groupId];
        const items = classifications.filter((item) => item.group === groupId);

        return (
          <section key={groupId}>
            <div className="mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wide text-pkp-black">
                {group.label}
              </h2>
              <p className="text-xs text-pkp-gray-500">{group.description}</p>
            </div>

            <div className="space-y-2">
              {items.map((item) => {
                const isEditing = editingId === item.id;

                return (
                  <div
                    key={item.id}
                    className="rounded-lg border border-pkp-gray-200 bg-white px-4 py-3"
                  >
                    {isEditing ? (
                      <form onSubmit={(event) => handleSave(event, item.id)} className="space-y-3">
                        <label className="block text-sm">
                          <span className="mb-1 block font-semibold text-pkp-black">
                            Display name
                          </span>
                          <input
                            type="text"
                            value={editLabel}
                            onChange={(event) => setEditLabel(event.target.value)}
                            className="w-full rounded-lg border border-pkp-gray-200 px-3 py-2.5"
                            required
                          />
                        </label>
                        <label className="block text-sm">
                          <span className="mb-1 block font-semibold text-pkp-black">
                            Description
                          </span>
                          <textarea
                            value={editDescription}
                            onChange={(event) => setEditDescription(event.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-pkp-gray-200 px-3 py-2.5"
                            required
                          />
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
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-pkp-black">{item.label}</p>
                          <p className="mt-1 text-sm text-pkp-gray-500">{item.description}</p>
                          <Badge variant="default" className="mt-2 w-fit text-[10px]">
                            {item.modules.length} modules
                          </Badge>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="rounded-lg border border-pkp-gray-200 p-2 text-pkp-gray-500 hover:border-pkp-black hover:text-pkp-black"
                            aria-label={`Edit ${item.label}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleReset(item.id)}
                            disabled={isSaving}
                            className="rounded-lg border border-pkp-gray-200 p-2 text-pkp-gray-500 hover:border-pkp-red hover:text-pkp-red disabled:opacity-50"
                            aria-label={`Reset ${item.label} to defaults`}
                            title="Reset to defaults"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {error && <p className="text-sm font-medium text-pkp-red">{error}</p>}
    </div>
  );
}
