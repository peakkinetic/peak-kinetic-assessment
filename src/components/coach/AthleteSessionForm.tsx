"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, UserPlus } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getClassificationById } from "@/data/assessmentClassifications";
import { useCoachSession } from "@/context/CoachSessionContext";
import { athleteBelongsToCoach, useCoachAuth } from "@/context/CoachAuthContext";

export function AthleteSessionForm() {
  const searchParams = useSearchParams();
  const classificationId = searchParams.get("classification");

  const { athletes, loadAthletes, createAthlete, startSession } = useCoachSession();
  const { coach } = useCoachAuth();

  const visibleAthletes = athletes.filter((item) => athleteBelongsToCoach(item.coach, coach));

  const [mode, setMode] = useState<"select" | "add">("select");
  const [startingAthleteId, setStartingAthleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "Male" as "Male" | "Female",
    sport: "",
    team: "",
    age: "",
    position: "Athlete",
  });

  const classification = useMemo(() => {
    if (!classificationId) return null;
    try {
      return getClassificationById(classificationId);
    } catch {
      return null;
    }
  }, [classificationId]);

  useEffect(() => {
    loadAthletes();
  }, [loadAthletes]);

  useEffect(() => {
    if (visibleAthletes.length === 0) {
      setMode("add");
    }
  }, [visibleAthletes.length]);

  async function beginSession(athleteId: string) {
    if (!classification) return;

    setStartingAthleteId(athleteId);
    setIsSubmitting(true);
    setError(null);

    try {
      await startSession(athleteId, classification.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start session.");
      setStartingAthleteId(null);
      setIsSubmitting(false);
    }
  }

  async function handleAddAthlete(event: FormEvent) {
    event.preventDefault();
    if (!classification) return;
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First and last name are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const athlete = await createAthlete({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        gender: form.gender,
        sport: form.sport.trim(),
        team: form.team.trim(),
        age: form.age ? Number(form.age) : undefined,
        position: form.position.trim() || "Athlete",
      });
      await startSession(athlete.id, classification.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add athlete.");
      setIsSubmitting(false);
    }
  }

  if (!classification) {
    return (
      <Card accent>
        <p className="text-sm text-pkp-gray-600">No assessment type selected.</p>
        <Link href="/coach" className="mt-4 inline-flex text-sm font-bold text-pkp-red">
          ← Back to assessment types
        </Link>
      </Card>
    );
  }

  return (
    <div>
      <Link
        href="/coach"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-pkp-gray-500 hover:text-pkp-black"
      >
        <ArrowLeft className="h-4 w-4" />
        Change assessment type
      </Link>

      <div className="mb-8">
        <p className="pkp-section-label">Step 2 of 2</p>
        <h1 className="mt-2 text-2xl font-bold text-pkp-black md:text-3xl">Add Athlete to Session</h1>
        <p className="mt-2 text-sm text-pkp-gray-500">
          Tap an athlete to open their dashboard, or add a new one below.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="black">{classification.label}</Badge>
          <Badge variant="red">{classification.modules.length} modules</Badge>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("select")}
          disabled={visibleAthletes.length === 0}
          className={`rounded-lg px-4 py-2 text-sm font-bold disabled:opacity-40 ${
            mode === "select" ? "bg-pkp-black text-white" : "bg-white text-pkp-gray-600 ring-1 ring-pkp-gray-200"
          }`}
        >
          Select Existing
        </button>
        <button
          type="button"
          onClick={() => setMode("add")}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold ${
            mode === "add" ? "bg-pkp-black text-white" : "bg-white text-pkp-gray-600 ring-1 ring-pkp-gray-200"
          }`}
        >
          <UserPlus className="h-4 w-4" />
          Add New Athlete
        </button>
      </div>

      {mode === "select" ? (
        <Card accent>
          <CardHeader
            title="Select Athlete"
            subtitle="Click an athlete to start this assessment session"
          />
          <div className="space-y-2">
            {visibleAthletes.length === 0 ? (
              <p className="text-sm text-pkp-gray-500">
                No athletes yet for {coach?.displayName ?? "this coach"}. Use Add New Athlete to create one.
              </p>
            ) : (
              visibleAthletes.map((item) => {
                const isStarting = startingAthleteId === item.id && isSubmitting;

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => beginSession(item.id)}
                    className="group flex w-full items-center justify-between rounded-lg border border-pkp-gray-200 bg-white px-4 py-3 text-left transition-colors hover:border-pkp-red hover:bg-pkp-red-muted disabled:opacity-60"
                  >
                    <div>
                      <p className="text-sm font-bold text-pkp-black">
                        {item.firstName} {item.lastName}
                      </p>
                      <p className="text-xs text-pkp-gray-500">
                        {item.team || "No team"} · {item.sport || "No sport"} · {item.gender}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-pkp-red">
                      {isStarting ? "Opening…" : "Open"}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </Card>
      ) : (
        <Card accent>
          <CardHeader title="New Athlete" subtitle="Add athlete and start this assessment" />
          <form onSubmit={handleAddAthlete} className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-pkp-black">First Name</span>
              <input
                required
                value={form.firstName}
                onChange={(e) => setForm((current) => ({ ...current, firstName: e.target.value }))}
                className="w-full rounded-lg border border-pkp-gray-200 px-3 py-2.5"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-pkp-black">Last Name</span>
              <input
                required
                value={form.lastName}
                onChange={(e) => setForm((current) => ({ ...current, lastName: e.target.value }))}
                className="w-full rounded-lg border border-pkp-gray-200 px-3 py-2.5"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-pkp-black">Gender</span>
              <select
                value={form.gender}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    gender: e.target.value as "Male" | "Female",
                  }))
                }
                className="w-full rounded-lg border border-pkp-gray-200 px-3 py-2.5"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-pkp-black">Age</span>
              <input
                type="number"
                min={8}
                max={99}
                value={form.age}
                onChange={(e) => setForm((current) => ({ ...current, age: e.target.value }))}
                className="w-full rounded-lg border border-pkp-gray-200 px-3 py-2.5"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block font-semibold text-pkp-black">Team / School</span>
              <input
                value={form.team}
                onChange={(e) => setForm((current) => ({ ...current, team: e.target.value }))}
                className="w-full rounded-lg border border-pkp-gray-200 px-3 py-2.5"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block font-semibold text-pkp-black">Sport</span>
              <input
                value={form.sport}
                onChange={(e) => setForm((current) => ({ ...current, sport: e.target.value }))}
                className="w-full rounded-lg border border-pkp-gray-200 px-3 py-2.5"
              />
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-pkp-red px-4 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-pkp-red-dark disabled:opacity-50"
              >
                {isSubmitting ? "Opening dashboard…" : "Add Athlete & Start Assessment"}
              </button>
            </div>
          </form>
        </Card>
      )}

      {error && <p className="mt-4 text-sm font-medium text-pkp-red">{error}</p>}
    </div>
  );
}
