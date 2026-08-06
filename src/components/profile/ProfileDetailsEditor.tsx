"use client";

import { FormEvent, useEffect, useState } from "react";
import { Calendar, Ruler, User, Weight } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { useCoachSession } from "@/context/CoachSessionContext";

export function ProfileDetailsEditor() {
  const { athlete, updateAthlete } = useCoachSession();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!athlete) return;
    setFirstName(athlete.firstName);
    setLastName(athlete.lastName);
    setHeight(athlete.height);
    setWeight(athlete.weight);
  }, [athlete]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!athlete) return;

    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSavedMessage(null);

    try {
      await updateAthlete({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        height: height.trim(),
        weight: weight.trim(),
      });
      setSavedMessage("Athlete profile saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile details.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!athlete) return null;

  return (
    <Card className="mb-8">
      <CardHeader
        title="Athlete Details"
        subtitle="Update the athlete name, height, and weight for this profile"
      />

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 flex items-center gap-2 font-semibold text-pkp-black">
            <User className="h-4 w-4 text-pkp-gray-500" />
            First Name
          </span>
          <input
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="w-full rounded-lg border border-pkp-gray-200 px-3 py-2.5"
            required
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 flex items-center gap-2 font-semibold text-pkp-black">
            <User className="h-4 w-4 text-pkp-gray-500" />
            Last Name
          </span>
          <input
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="w-full rounded-lg border border-pkp-gray-200 px-3 py-2.5"
            required
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 flex items-center gap-2 font-semibold text-pkp-black">
            <Ruler className="h-4 w-4 text-pkp-gray-500" />
            Height
          </span>
          <input
            type="text"
            value={height}
            onChange={(event) => setHeight(event.target.value)}
            className="w-full rounded-lg border border-pkp-gray-200 px-3 py-2.5"
            placeholder={`e.g. 5'10" or 178 cm`}
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 flex items-center gap-2 font-semibold text-pkp-black">
            <Weight className="h-4 w-4 text-pkp-gray-500" />
            Weight
          </span>
          <input
            type="text"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            className="w-full rounded-lg border border-pkp-gray-200 px-3 py-2.5"
            placeholder="e.g. 150 lbs or 68 kg"
          />
        </label>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-pkp-red px-4 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-pkp-red-dark disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save Details"}
          </button>
        </div>
      </form>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
        {[
          { icon: Calendar, label: "Age", value: athlete.age ? `${athlete.age} yrs` : "—" },
          { icon: Ruler, label: "Height", value: athlete.height || "—" },
          { icon: Weight, label: "Weight", value: athlete.weight || "—" },
          { icon: User, label: "Gender", value: athlete.gender },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-pkp-gray-100 bg-pkp-gray-50/60 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
                <Icon className="h-4 w-4 text-pkp-gray-500" />
              </div>
              <div>
                <p className="text-xs text-pkp-gray-400">{label}</p>
                <p className="text-sm font-bold">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {savedMessage && <p className="mt-4 text-sm font-medium text-emerald-700">{savedMessage}</p>}
      {error && <p className="mt-4 text-sm font-medium text-pkp-red">{error}</p>}
    </Card>
  );
}
