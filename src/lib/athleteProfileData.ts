import type {
  AssessmentResult,
  AthleteFocusAreas,
  AthleteGoal,
  AthleteInjuryEntry,
  SaveAssessmentResultInput,
} from "@/types";

export const ATHLETE_GOAL_TEST_ID_PREFIX = "goal-";
export const ATHLETE_INJURY_TEST_ID_PREFIX = "injury-";
export const FOCUS_PRIMARY_TEST_ID = "focus-primary";
export const FOCUS_SECONDARY_TEST_ID = "focus-secondary";

export const emptyAthleteFocusAreas: AthleteFocusAreas = {
  primary: "",
  secondary: "",
};

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

export function buildAthleteFocusAreas(results: AssessmentResult[]): AthleteFocusAreas {
  const primary =
    results.find(
      (result) => result.moduleId === "profile" && result.testId === FOCUS_PRIMARY_TEST_ID
    )?.notes ?? "";
  const secondary =
    results.find(
      (result) => result.moduleId === "profile" && result.testId === FOCUS_SECONDARY_TEST_ID
    )?.notes ?? "";

  return { primary, secondary };
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

export function focusAreasToSaveInputs(focusAreas: AthleteFocusAreas): SaveAssessmentResultInput[] {
  const entries: SaveAssessmentResultInput[] = [];

  if (focusAreas.primary.trim()) {
    entries.push({
      moduleId: "profile",
      testId: FOCUS_PRIMARY_TEST_ID,
      value: 1,
      unit: "focus",
      notes: focusAreas.primary.trim(),
    });
  }

  if (focusAreas.secondary.trim()) {
    entries.push({
      moduleId: "profile",
      testId: FOCUS_SECONDARY_TEST_ID,
      value: 2,
      unit: "focus",
      notes: focusAreas.secondary.trim(),
    });
  }

  return entries;
}

export function profileDataToSaveInputs(
  goals: AthleteGoal[],
  injuries: AthleteInjuryEntry[],
  focusAreas: AthleteFocusAreas = emptyAthleteFocusAreas
): SaveAssessmentResultInput[] {
  return [
    ...goalsToSaveInputs(goals),
    ...injuriesToSaveInputs(injuries),
    ...focusAreasToSaveInputs(focusAreas),
  ];
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
