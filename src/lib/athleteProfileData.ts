import type { AssessmentResult, AthleteGoal, AthleteInjuryEntry, SaveAssessmentResultInput } from "@/types";

export const ATHLETE_GOAL_TEST_ID_PREFIX = "goal-";
export const ATHLETE_INJURY_TEST_ID_PREFIX = "injury-";

export function buildAthleteGoals(results: AssessmentResult[]): AthleteGoal[] {
  return results
    .filter(
      (result) =>
        result.moduleId === "profile" && result.testId.startsWith(ATHLETE_GOAL_TEST_ID_PREFIX)
    )
    .sort((a, b) => a.value - b.value)
    .map((result) => ({
      id: result.testId.slice(ATHLETE_GOAL_TEST_ID_PREFIX.length),
      title: result.notes ?? "",
    }))
    .filter((goal) => goal.title.trim().length > 0);
}

export function buildInjuryHistory(results: AssessmentResult[]): AthleteInjuryEntry[] {
  return results
    .filter(
      (result) =>
        result.moduleId === "profile" && result.testId.startsWith(ATHLETE_INJURY_TEST_ID_PREFIX)
    )
    .sort((a, b) => a.value - b.value)
    .map((result) => ({
      id: result.testId.slice(ATHLETE_INJURY_TEST_ID_PREFIX.length),
      description: result.notes ?? "",
    }))
    .filter((entry) => entry.description.trim().length > 0);
}

export function goalsToSaveInputs(goals: AthleteGoal[]): SaveAssessmentResultInput[] {
  return goals
    .filter((goal) => goal.title.trim().length > 0)
    .map((goal, index) => ({
      moduleId: "profile",
      testId: `${ATHLETE_GOAL_TEST_ID_PREFIX}${goal.id}`,
      value: index + 1,
      unit: "goal",
      notes: goal.title.trim(),
    }));
}

export function injuriesToSaveInputs(entries: AthleteInjuryEntry[]): SaveAssessmentResultInput[] {
  return entries
    .filter((entry) => entry.description.trim().length > 0)
    .map((entry, index) => ({
      moduleId: "profile",
      testId: `${ATHLETE_INJURY_TEST_ID_PREFIX}${entry.id}`,
      value: index + 1,
      unit: "injury",
      notes: entry.description.trim(),
    }));
}

export function profileDataToSaveInputs(
  goals: AthleteGoal[],
  injuries: AthleteInjuryEntry[]
): SaveAssessmentResultInput[] {
  return [...goalsToSaveInputs(goals), ...injuriesToSaveInputs(injuries)];
}

export function createEmptyGoal(): AthleteGoal {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: "",
  };
}

export function createEmptyInjuryEntry(): AthleteInjuryEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    description: "",
  };
}
