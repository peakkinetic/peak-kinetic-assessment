"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type {
  AssessmentClassification,
  AssessmentModuleId,
  AssessmentRecord,
  AssessmentResult,
  AssessmentScore,
  Athlete,
  AthleteGoal,
  AthleteInjuryEntry,
  AthleteFocusAreas,
  CreateAthleteInput,
  MetricItem,
  MovementScreenEntryInput,
  PerformanceTestId,
  SaveAssessmentResultInput,
  ScreeningMobilityEntryInput,
  JointMobilityMeasurement,
  AssessmentClassificationOverride,
} from "@/types";
import {
  getClassificationById,
} from "@/data/assessmentClassifications";
import {
  getMergedClassificationById,
  mergeAllClassifications,
} from "@/lib/assessmentClassificationOverrides";
import {
  listClassificationOverridesAction,
  saveClassificationOverrideAction,
} from "@/app/actions/classifications";
import { movementScreenCategories, type MovementScreenId } from "@/data/movementScreenCategories";
import {
  screeningMobilityCategories,
  SCREENING_SESSION_NOTE_ID,
  type ScreeningMobilityId,
} from "@/data/screeningMobilityCategories";
import {
  classificationIncludesModule,
  getActivePerformanceTests,
  performanceTestUnits,
} from "@/lib/assessmentAccess";
import { blastTestIds, blastTestLabels, blastTestUnits } from "@/data/blastTesting";
import { hittraxTestIds, hittraxTestLabels, hittraxTestUnits } from "@/data/hittraxTesting";
import { buildHittingTestMetrics } from "@/lib/hittingTestMetrics";
import { localStore } from "@/lib/db/local-store";
import { buildMovementScores } from "@/lib/movementMetrics";
import { buildPerformanceMetrics } from "@/lib/performanceMetrics";
import {
  buildJointMobility,
  buildSymmetryIndex,
  getScreeningSessionNote,
  type SymmetryIndexEntry,
} from "@/lib/screeningMetrics";
import {
  buildNationalRankProgress,
  buildProgressMetrics,
  buildProgressMilestones,
  type AssessmentHistoryEntry,
  type NationalRankProgressView,
  type ProgressMetricView,
  type ProgressMilestoneView,
} from "@/lib/progressMetrics";
import {
  buildAthleteGoals,
  buildAthleteFocusAreas,
  buildInjuryHistory,
  profileDataToSaveInputs,
} from "@/lib/athleteProfileData";
import {
  createAthleteAction,
  deleteAthleteAction,
  getSupabaseStatus,
  listAssessmentsForAthleteAction,
  listAthletesAction,
  startCoachSessionAction,
  updateAthleteAction,
  updateAssessmentAction,
  deleteAssessmentAction,
} from "@/app/actions/coach";
import {
  listAssessmentHistoryAction,
  listAssessmentResultsAction,
  saveAssessmentResultsAction,
} from "@/app/actions/results";
import { getCoachDisplayName } from "@/lib/coachAuthSession";
import { isUuid } from "@/lib/uuid";
import {
  mergeRecordsById,
  resolveActiveAssessment,
} from "@/lib/sessionRecords";

interface CoachSessionContextValue {
  athlete: Athlete | null;
  activeAssessment: AssessmentRecord | null;
  classification: AssessmentClassification | null;
  assessments: AssessmentRecord[];
  athletes: Athlete[];
  classifications: AssessmentClassification[];
  resolveClassificationById: (classificationId: string) => AssessmentClassification;
  isLoading: boolean;
  isSupabaseConnected: boolean;
  pendingClassificationId: string | null;
  setPendingClassificationId: (classificationId: string | null) => void;
  loadAthletes: () => Promise<void>;
  createAthlete: (input: CreateAthleteInput) => Promise<Athlete>;
  updateAthlete: (
    updates: Partial<Pick<Athlete, "firstName" | "lastName" | "height" | "weight" | "age">>
  ) => Promise<Athlete>;
  deleteAthlete: (athleteId: string) => Promise<void>;
  startSession: (athleteId: string, classificationId: string, label?: string) => Promise<void>;
  setActiveAssessmentId: (assessmentId: string) => void;
  updateAssessment: (
    assessmentId: string,
    updates: Partial<Pick<AssessmentRecord, "label" | "status" | "coach">>
  ) => Promise<AssessmentRecord>;
  deleteAssessment: (assessmentId: string) => Promise<void>;
  endSession: () => void;
  includesModule: (moduleId: AssessmentModuleId) => boolean;
  activePerformanceTests: PerformanceTestId[];
  assessmentResults: AssessmentResult[];
  performanceMetrics: MetricItem[];
  hittraxMetrics: MetricItem[];
  blastMetrics: MetricItem[];
  movementScores: AssessmentScore[];
  screeningJointMobility: JointMobilityMeasurement[];
  screeningSymmetryIndex: SymmetryIndexEntry[];
  screeningSessionNote: string | null;
  athleteGoals: AthleteGoal[];
  athleteFocusAreas: AthleteFocusAreas;
  injuryHistory: AthleteInjuryEntry[];
  refreshAssessmentResults: () => Promise<void>;
  savePerformanceResults: (scores: Partial<Record<PerformanceTestId, number>>) => Promise<void>;
  saveHittraxResults: (scores: Partial<Record<string, number>>) => Promise<void>;
  saveBlastResults: (scores: Partial<Record<string, number>>) => Promise<void>;
  saveMovementResults: (
    entries: Partial<Record<MovementScreenId, MovementScreenEntryInput>>
  ) => Promise<void>;
  saveScreeningResults: (input: {
    joints: Partial<Record<ScreeningMobilityId, ScreeningMobilityEntryInput>>;
    sessionNote?: string;
  }) => Promise<void>;
  saveAthleteGoals: (goals: AthleteGoal[]) => Promise<void>;
  saveAthleteFocusAreas: (focusAreas: AthleteFocusAreas) => Promise<void>;
  saveInjuryHistory: (entries: AthleteInjuryEntry[]) => Promise<void>;
  saveClassificationOverride: (
    override: AssessmentClassificationOverride
  ) => Promise<AssessmentClassificationOverride>;
  assessmentHistory: AssessmentHistoryEntry[];
  progressTrackingMetrics: ProgressMetricView[];
  nationalRankProgress: NationalRankProgressView[];
  progressMilestones: ProgressMilestoneView[];
  savedEntryCount: number;
  lastSavedAt: string | null;
}

const CoachSessionContext = createContext<CoachSessionContextValue | null>(null);

const PENDING_CLASSIFICATION_KEY = "pkp-pending-classification";

function readPendingClassification(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(PENDING_CLASSIFICATION_KEY);
}

function writePendingClassification(classificationId: string | null) {
  if (typeof window === "undefined") return;
  if (classificationId) {
    sessionStorage.setItem(PENDING_CLASSIFICATION_KEY, classificationId);
  } else {
    sessionStorage.removeItem(PENDING_CLASSIFICATION_KEY);
  }
}

function loadLocalSession() {
  if (!localStore.isAvailable()) {
    return {
      athlete: null as Athlete | null,
      activeAssessment: null as AssessmentRecord | null,
      assessments: [] as AssessmentRecord[],
      athletes: [] as Athlete[],
    };
  }

  const athletes = localStore.listAthletes();
  const session = localStore.getSession();

  if (!session) {
    return { athlete: null, activeAssessment: null, assessments: [], athletes };
  }

  const athlete = athletes.find((item) => item.id === session.athleteId) ?? null;
  const assessments = athlete ? localStore.listAssessmentsForAthlete(athlete.id) : [];
  const activeAssessment =
    assessments.find((item) => item.id === session.assessmentId) ?? assessments[0] ?? null;

  return { athlete, activeAssessment, assessments, athletes };
}

function goToDashboard() {
  window.location.assign("/dashboard/athlete-profile");
}

async function loadAssessmentResultsForSession(
  assessmentId: string,
  supabaseConfigured: boolean
): Promise<AssessmentResult[]> {
  let cloudResults: AssessmentResult[] = [];

  if (supabaseConfigured && isUuid(assessmentId)) {
    try {
      cloudResults = await listAssessmentResultsAction(assessmentId);
    } catch {
      cloudResults = [];
    }
  }

  if (cloudResults.length > 0) {
    return cloudResults;
  }

  if (localStore.isAvailable()) {
    return localStore.listResultsForAssessment(assessmentId);
  }

  return [];
}

function mirrorModuleResults(
  assessmentId: string,
  moduleId: SaveAssessmentResultInput["moduleId"],
  entries: SaveAssessmentResultInput[]
) {
  if (!localStore.isAvailable() || entries.length === 0) return;
  localStore.upsertResults(assessmentId, moduleId, entries);
}

export function CoachSessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [activeAssessment, setActiveAssessment] = useState<AssessmentRecord | null>(null);
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistoryEntry[]>([]);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [pendingClassificationId, setPendingClassificationIdState] = useState<string | null>(
    null
  );
  const [classificationOverrides, setClassificationOverrides] = useState<
    AssessmentClassificationOverride[]
  >([]);

  const loadClassificationOverrides = useCallback(async () => {
    const status = await getSupabaseStatus();

    if (status.configured) {
      try {
        const overrides = await listClassificationOverridesAction();
        setClassificationOverrides(overrides);
        if (localStore.isAvailable()) {
          for (const override of overrides) {
            localStore.saveClassificationOverride(override);
          }
        }
        return overrides;
      } catch {
        // Fall back to local cache if Supabase table is missing or unreachable.
      }
    }

    if (localStore.isAvailable()) {
      const overrides = localStore.listClassificationOverrides();
      setClassificationOverrides(overrides);
      return overrides;
    }

    setClassificationOverrides([]);
    return [];
  }, []);

  const classifications = useMemo(
    () => mergeAllClassifications(classificationOverrides),
    [classificationOverrides]
  );

  const resolveClassificationById = useCallback(
    (classificationId: string) =>
      getMergedClassificationById(classificationId, classificationOverrides),
    [classificationOverrides]
  );

  const setPendingClassificationId = useCallback((classificationId: string | null) => {
    setPendingClassificationIdState(classificationId);
    writePendingClassification(classificationId);
  }, []);

  const loadAthletes = useCallback(async () => {
    const status = await getSupabaseStatus();
    setIsSupabaseConnected(status.configured);

    if (status.configured) {
      const rows = await listAthletesAction();
      setAthletes(rows);
      return;
    }

    if (localStore.isAvailable()) {
      setAthletes(localStore.listAthletes());
    }
  }, []);

  const hydrateSession = useCallback(async () => {
    setIsLoading(true);
    setPendingClassificationIdState(readPendingClassification());
    void loadClassificationOverrides();

    try {
      const localSnapshot = loadLocalSession();
      const status = await getSupabaseStatus();
      setIsSupabaseConnected(status.configured);

      let athletes = localSnapshot.athletes;
      let athlete = localSnapshot.athlete;
      let assessments = localSnapshot.assessments;
      let activeAssessment = localSnapshot.activeAssessment;

      if (status.configured) {
        try {
          const athleteRows = await listAthletesAction();
          if (athleteRows.length > 0) {
            athletes = athleteRows;
          }

          const session = localStore.getSession();
          if (session?.athleteId && isUuid(session.athleteId)) {
            athlete = athleteRows.find((item) => item.id === session.athleteId) ?? athlete;

            const cloudAssessments = athlete
              ? await listAssessmentsForAthleteAction(athlete.id)
              : [];
            const localAssessments = localStore.isAvailable()
              ? localStore.listAssessmentsForAthlete(session.athleteId)
              : [];

            assessments = mergeRecordsById(cloudAssessments, localAssessments);
            activeAssessment = resolveActiveAssessment(
              session.assessmentId,
              assessments,
              localSnapshot.activeAssessment
            );

            if (athlete && localStore.isAvailable()) {
              localStore.syncAthlete(athlete);
            }
            if (localStore.isAvailable()) {
              for (const assessment of assessments) {
                localStore.syncAssessment(assessment);
              }
            }
          }
        } catch {
          // Keep local snapshot if Supabase is unreachable.
        }
      }

      setAthletes(athletes);
      setAthlete(athlete);
      setAssessments(assessments);
      setActiveAssessment(activeAssessment);

      if (activeAssessment) {
        setAssessmentResults(
          await loadAssessmentResultsForSession(activeAssessment.id, status.configured)
        );
      } else {
        setAssessmentResults([]);
      }

      if (athlete && localStore.isAvailable()) {
        setAssessmentHistory(localStore.listAssessmentHistory(athlete.id));
      }
    } finally {
      setIsLoading(false);
    }
  }, [loadClassificationOverrides]);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  const refreshAssessmentHistory = useCallback(async () => {
    if (!athlete) {
      setAssessmentHistory([]);
      return;
    }

    const status = await getSupabaseStatus();
    setIsSupabaseConnected(status.configured);

    if (status.configured && isUuid(athlete.id)) {
      try {
        const history = await listAssessmentHistoryAction(athlete.id);
        if (history.length > 0) {
          setAssessmentHistory(history);
          return;
        }
      } catch {
        // Fall back to local storage below.
      }
    }

    if (localStore.isAvailable()) {
      setAssessmentHistory(localStore.listAssessmentHistory(athlete.id));
    }
  }, [athlete]);

  const refreshAssessmentResults = useCallback(async () => {
    if (!activeAssessment) {
      setAssessmentResults([]);
      return;
    }

    const status = await getSupabaseStatus();
    setIsSupabaseConnected(status.configured);

    const results = await loadAssessmentResultsForSession(
      activeAssessment.id,
      status.configured
    );
    setAssessmentResults(results);
    await refreshAssessmentHistory();
  }, [activeAssessment, refreshAssessmentHistory]);

  useEffect(() => {
    refreshAssessmentResults();
  }, [refreshAssessmentResults]);

  useEffect(() => {
    refreshAssessmentHistory();
  }, [refreshAssessmentHistory]);

  useEffect(() => {
    return localStore.subscribeToChanges(() => {
      void refreshAssessmentResults();
    });
  }, [refreshAssessmentResults]);

  const markSaved = useCallback(() => {
    setLastSavedAt(new Date().toISOString());
  }, []);

  const savePerformanceResults = useCallback(
    async (scores: Partial<Record<PerformanceTestId, number>>) => {
      if (!activeAssessment) {
        throw new Error("No active assessment session");
      }

      const currentClassification = getClassificationById(activeAssessment.classificationId);
      const allowedTests = getActivePerformanceTests(currentClassification);
      const entries: SaveAssessmentResultInput[] = allowedTests.flatMap((testId) => {
        const value = scores[testId];
        if (value === undefined || Number.isNaN(value)) return [];

        return [
          {
            moduleId: "performance-testing",
            testId,
            value,
            unit: performanceTestUnits[testId],
          },
        ];
      });

      const status = await getSupabaseStatus();
      setIsSupabaseConnected(status.configured);

      if (status.configured && isUuid(activeAssessment.id)) {
        const saved = await saveAssessmentResultsAction(
          activeAssessment.id,
          "performance-testing",
          entries
        );
        mirrorModuleResults(activeAssessment.id, "performance-testing", entries);
        setAssessmentResults((current) => [
          ...current.filter((result) => result.moduleId !== "performance-testing"),
          ...saved,
        ]);
        await refreshAssessmentHistory();
        markSaved();
        return;
      }

      const saved = localStore.upsertResults(
        activeAssessment.id,
        "performance-testing",
        entries
      );
      setAssessmentResults((current) => [
        ...current.filter((result) => result.moduleId !== "performance-testing"),
        ...saved,
      ]);
      await refreshAssessmentHistory();
      markSaved();
    },
    [activeAssessment, refreshAssessmentHistory, markSaved]
  );

  const saveHittingModuleResults = useCallback(
    async (
      moduleId: "hittrax-testing" | "blast-testing",
      testIds: readonly string[],
      units: Record<string, string>,
      scores: Partial<Record<string, number>>
    ) => {
      if (!activeAssessment) {
        throw new Error("No active assessment session");
      }

      const entries: SaveAssessmentResultInput[] = testIds.flatMap((testId) => {
        const value = scores[testId];
        if (value === undefined || Number.isNaN(value)) return [];

        return [
          {
            moduleId,
            testId,
            value,
            unit: units[testId] ?? "",
          },
        ];
      });

      const status = await getSupabaseStatus();
      setIsSupabaseConnected(status.configured);

      if (status.configured && isUuid(activeAssessment.id)) {
        const saved = await saveAssessmentResultsAction(activeAssessment.id, moduleId, entries);
        mirrorModuleResults(activeAssessment.id, moduleId, entries);
        setAssessmentResults((current) => [
          ...current.filter((result) => result.moduleId !== moduleId),
          ...saved,
        ]);
        await refreshAssessmentHistory();
        markSaved();
        return;
      }

      const saved = localStore.upsertResults(activeAssessment.id, moduleId, entries);
      setAssessmentResults((current) => [
        ...current.filter((result) => result.moduleId !== moduleId),
        ...saved,
      ]);
      await refreshAssessmentHistory();
      markSaved();
    },
    [activeAssessment, refreshAssessmentHistory, markSaved]
  );

  const saveHittraxResults = useCallback(
    async (scores: Partial<Record<string, number>>) => {
      await saveHittingModuleResults(
        "hittrax-testing",
        hittraxTestIds,
        hittraxTestUnits,
        scores
      );
    },
    [saveHittingModuleResults]
  );

  const saveBlastResults = useCallback(
    async (scores: Partial<Record<string, number>>) => {
      await saveHittingModuleResults("blast-testing", blastTestIds, blastTestUnits, scores);
    },
    [saveHittingModuleResults]
  );

  const saveMovementResults = useCallback(
    async (entries: Partial<Record<MovementScreenId, MovementScreenEntryInput>>) => {
      if (!activeAssessment) {
        throw new Error("No active assessment session");
      }

      const savedEntries: SaveAssessmentResultInput[] = [];

      for (const category of movementScreenCategories) {
        const entry = entries[category.id];
        if (!entry || entry.score === "NA") continue;

        savedEntries.push({
          moduleId: "movement-screen",
          testId: category.id,
          value: entry.score,
          unit: "score",
          notes: entry.notes,
        });
      }

      const status = await getSupabaseStatus();
      setIsSupabaseConnected(status.configured);

      if (status.configured && isUuid(activeAssessment.id)) {
        const saved = await saveAssessmentResultsAction(
          activeAssessment.id,
          "movement-screen",
          savedEntries
        );
        mirrorModuleResults(activeAssessment.id, "movement-screen", savedEntries);
        setAssessmentResults((current) => [
          ...current.filter((result) => result.moduleId !== "movement-screen"),
          ...saved,
        ]);
        await refreshAssessmentHistory();
        markSaved();
        return;
      }

      const saved = localStore.upsertResults(
        activeAssessment.id,
        "movement-screen",
        savedEntries
      );
      setAssessmentResults((current) => [
        ...current.filter((result) => result.moduleId !== "movement-screen"),
        ...saved,
      ]);
      await refreshAssessmentHistory();
      markSaved();
    },
    [activeAssessment, refreshAssessmentHistory, markSaved]
  );

  const saveScreeningResults = useCallback(
    async (input: {
      joints: Partial<Record<ScreeningMobilityId, ScreeningMobilityEntryInput>>;
      sessionNote?: string;
    }) => {
      if (!activeAssessment) {
        throw new Error("No active assessment session");
      }

      const savedEntries: SaveAssessmentResultInput[] = [];

      for (const category of screeningMobilityCategories) {
        const entry = input.joints[category.id];
        if (entry?.degrees === undefined || Number.isNaN(entry.degrees)) continue;

        savedEntries.push({
          moduleId: "screening-mobility",
          testId: category.id,
          value: entry.degrees,
          unit: "deg",
          notes: entry.notes,
        });
      }

      const sessionNote = input.sessionNote?.trim();
      if (sessionNote) {
        savedEntries.push({
          moduleId: "screening-mobility",
          testId: SCREENING_SESSION_NOTE_ID,
          value: 1,
          unit: "note",
          notes: sessionNote,
        });
      }

      const status = await getSupabaseStatus();
      setIsSupabaseConnected(status.configured);

      if (status.configured && isUuid(activeAssessment.id)) {
        const saved = await saveAssessmentResultsAction(
          activeAssessment.id,
          "screening-mobility",
          savedEntries
        );
        mirrorModuleResults(activeAssessment.id, "screening-mobility", savedEntries);
        setAssessmentResults((current) => [
          ...current.filter((result) => result.moduleId !== "screening-mobility"),
          ...saved,
        ]);
        await refreshAssessmentHistory();
        markSaved();
        return;
      }

      const saved = localStore.upsertResults(
        activeAssessment.id,
        "screening-mobility",
        savedEntries
      );
      setAssessmentResults((current) => [
        ...current.filter((result) => result.moduleId !== "screening-mobility"),
        ...saved,
      ]);
      await refreshAssessmentHistory();
      markSaved();
    },
    [activeAssessment, refreshAssessmentHistory, markSaved]
  );

  const saveAthleteGoals = useCallback(
    async (goals: AthleteGoal[]) => {
      if (!activeAssessment) {
        throw new Error("No active assessment session");
      }

      const currentInjuries = buildInjuryHistory(assessmentResults);
      const currentFocusAreas = buildAthleteFocusAreas(assessmentResults);
      const savedEntries = profileDataToSaveInputs(goals, currentInjuries, currentFocusAreas);
      const status = await getSupabaseStatus();
      setIsSupabaseConnected(status.configured);

      if (status.configured && isUuid(activeAssessment.id)) {
        const saved = await saveAssessmentResultsAction(
          activeAssessment.id,
          "profile",
          savedEntries
        );
        mirrorModuleResults(activeAssessment.id, "profile", savedEntries);
        setAssessmentResults((current) => [
          ...current.filter((result) => result.moduleId !== "profile"),
          ...saved,
        ]);
        await refreshAssessmentHistory();
        markSaved();
        return;
      }

      const saved = localStore.upsertResults(activeAssessment.id, "profile", savedEntries);
      setAssessmentResults((current) => [
        ...current.filter((result) => result.moduleId !== "profile"),
        ...saved,
      ]);
      await refreshAssessmentHistory();
      markSaved();
    },
    [activeAssessment, assessmentResults, refreshAssessmentHistory, markSaved]
  );

  const saveInjuryHistory = useCallback(
    async (entries: AthleteInjuryEntry[]) => {
      if (!activeAssessment) {
        throw new Error("No active assessment session");
      }

      const currentGoals = buildAthleteGoals(assessmentResults);
      const currentFocusAreas = buildAthleteFocusAreas(assessmentResults);
      const savedEntries = profileDataToSaveInputs(currentGoals, entries, currentFocusAreas);
      const status = await getSupabaseStatus();
      setIsSupabaseConnected(status.configured);

      if (status.configured && isUuid(activeAssessment.id)) {
        const saved = await saveAssessmentResultsAction(
          activeAssessment.id,
          "profile",
          savedEntries
        );
        mirrorModuleResults(activeAssessment.id, "profile", savedEntries);
        setAssessmentResults((current) => [
          ...current.filter((result) => result.moduleId !== "profile"),
          ...saved,
        ]);
        await refreshAssessmentHistory();
        markSaved();
        return;
      }

      const saved = localStore.upsertResults(activeAssessment.id, "profile", savedEntries);
      setAssessmentResults((current) => [
        ...current.filter((result) => result.moduleId !== "profile"),
        ...saved,
      ]);
      await refreshAssessmentHistory();
      markSaved();
    },
    [activeAssessment, assessmentResults, refreshAssessmentHistory, markSaved]
  );

  const saveAthleteFocusAreas = useCallback(
    async (focusAreas: AthleteFocusAreas) => {
      if (!activeAssessment) {
        throw new Error("No active assessment session");
      }

      const currentGoals = buildAthleteGoals(assessmentResults);
      const currentInjuries = buildInjuryHistory(assessmentResults);
      const savedEntries = profileDataToSaveInputs(currentGoals, currentInjuries, focusAreas);
      const status = await getSupabaseStatus();
      setIsSupabaseConnected(status.configured);

      if (status.configured && isUuid(activeAssessment.id)) {
        const saved = await saveAssessmentResultsAction(
          activeAssessment.id,
          "profile",
          savedEntries
        );
        mirrorModuleResults(activeAssessment.id, "profile", savedEntries);
        setAssessmentResults((current) => [
          ...current.filter((result) => result.moduleId !== "profile"),
          ...saved,
        ]);
        await refreshAssessmentHistory();
        markSaved();
        return;
      }

      const saved = localStore.upsertResults(activeAssessment.id, "profile", savedEntries);
      setAssessmentResults((current) => [
        ...current.filter((result) => result.moduleId !== "profile"),
        ...saved,
      ]);
      await refreshAssessmentHistory();
      markSaved();
    },
    [activeAssessment, assessmentResults, refreshAssessmentHistory, markSaved]
  );

  const saveClassificationOverride = useCallback(
    async (override: AssessmentClassificationOverride) => {
      const status = await getSupabaseStatus();
      setIsSupabaseConnected(status.configured);

      let saved = override;

      if (status.configured) {
        try {
          saved = await saveClassificationOverrideAction(override);
        } catch {
          // Keep going with local storage if the overrides table is not ready yet.
        }
      }

      if (localStore.isAvailable()) {
        saved = localStore.saveClassificationOverride(saved);
      }

      setClassificationOverrides((current) => {
        const next = current.filter((item) => item.classificationId !== saved.classificationId);
        if (saved.label.trim() || saved.description.trim()) {
          next.push(saved);
        }
        return next;
      });

      return saved;
    },
    []
  );

  const createAthlete = useCallback(
    async (input: CreateAthleteInput) => {
      const status = await getSupabaseStatus();
      setIsSupabaseConnected(status.configured);

      if (status.configured) {
        const created = await createAthleteAction({
          ...input,
          coach: getCoachDisplayName(),
        });
        setAthletes((current) => [created, ...current]);
        return created;
      }

      const created = localStore.createAthlete({
        ...input,
        coach: getCoachDisplayName(),
      });
      setAthletes((current) => [created, ...current]);
      return created;
    },
    []
  );

  const updateAthlete = useCallback(
    async (
      updates: Partial<Pick<Athlete, "firstName" | "lastName" | "height" | "weight" | "age">>
    ) => {
      if (!athlete) {
        throw new Error("No active athlete");
      }

      const status = await getSupabaseStatus();
      setIsSupabaseConnected(status.configured);

      if (status.configured && isUuid(athlete.id)) {
        const updated = await updateAthleteAction(athlete.id, updates);
        setAthlete(updated);
        setAthletes((current) =>
          current.map((item) => (item.id === updated.id ? updated : item))
        );
        return updated;
      }

      const updated = localStore.updateAthlete(athlete.id, updates);
      setAthlete(updated);
      setAthletes((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
      return updated;
    },
    [athlete]
  );

  const deleteAthlete = useCallback(
    async (athleteId: string) => {
      const status = await getSupabaseStatus();
      setIsSupabaseConnected(status.configured);

      if (localStore.isAvailable()) {
        localStore.deleteAthlete(athleteId);
      }

      if (status.configured && isUuid(athleteId)) {
        await deleteAthleteAction(athleteId);
      }

      setAthletes((current) => current.filter((item) => item.id !== athleteId));

      if (athlete?.id === athleteId) {
        setAthlete(null);
        setActiveAssessment(null);
        setAssessments([]);
        setAssessmentResults([]);
        setAssessmentHistory([]);
        localStore.clearSession();
        setPendingClassificationId(null);
        router.push("/coach");
      }
    },
    [athlete, router, setPendingClassificationId]
  );

  const startSession = useCallback(
    async (athleteId: string, classificationId: string, label?: string) => {
      const status = await getSupabaseStatus();
      setIsSupabaseConnected(status.configured);

      if (status.configured) {
        const result = await startCoachSessionAction({
          athleteId,
          classificationId,
          label,
          coach: getCoachDisplayName(),
        });
        localStore.syncAthlete(result.athlete);
        localStore.syncAssessment(result.assessment);
        localStore.saveSession({
          athleteId: result.athlete.id,
          assessmentId: result.assessment.id,
        });
        setPendingClassificationId(null);
        goToDashboard();
        return;
      }

      const currentAthlete =
        localStore.listAthletes().find((item) => item.id === athleteId) ?? null;
      if (!currentAthlete) {
        throw new Error("Athlete not found");
      }

      const classification = resolveClassificationById(classificationId);
      const assessment = localStore.createAssessment({
        athleteId,
        classificationId,
        label:
          label ??
          `${classification.label} — ${new Date().toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}`,
        coach: getCoachDisplayName(),
      });

      localStore.saveSession({ athleteId, assessmentId: assessment.id });
      setPendingClassificationId(null);
      goToDashboard();
    },
    [resolveClassificationById, setPendingClassificationId]
  );

  const refreshAssessments = useCallback(async () => {
    if (!athlete) {
      setAssessments([]);
      return [];
    }

    const status = await getSupabaseStatus();
    setIsSupabaseConnected(status.configured);

    if (status.configured && isUuid(athlete.id)) {
      const cloudRows = await listAssessmentsForAthleteAction(athlete.id);
      const localRows = localStore.isAvailable()
        ? localStore.listAssessmentsForAthlete(athlete.id)
        : [];
      const rows = mergeRecordsById(cloudRows, localRows);
      setAssessments(rows);
      return rows;
    }

    if (localStore.isAvailable()) {
      const rows = localStore.listAssessmentsForAthlete(athlete.id);
      setAssessments(rows);
      return rows;
    }

    return [];
  }, [athlete]);

  const setActiveAssessmentId = useCallback(
    (assessmentId: string) => {
      const assessment = assessments.find((item) => item.id === assessmentId);
      if (!assessment || !athlete) return;

      setActiveAssessment(assessment);
      localStore.saveSession({ athleteId: athlete.id, assessmentId });
      void loadAssessmentResultsForSession(assessmentId, isSupabaseConnected).then(
        setAssessmentResults
      );
    },
    [assessments, athlete, isSupabaseConnected]
  );

  const updateAssessment = useCallback(
    async (
      assessmentId: string,
      updates: Partial<Pick<AssessmentRecord, "label" | "status" | "coach">>
    ) => {
      const status = await getSupabaseStatus();
      setIsSupabaseConnected(status.configured);

      let updated: AssessmentRecord;
      if (status.configured && isUuid(assessmentId)) {
        updated = await updateAssessmentAction(assessmentId, updates);
      } else {
        updated = localStore.updateAssessment(assessmentId, updates);
      }

      setAssessments((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
      if (activeAssessment?.id === updated.id) {
        setActiveAssessment(updated);
      }
      await refreshAssessmentHistory();
      return updated;
    },
    [activeAssessment, refreshAssessmentHistory]
  );

  const deleteAssessment = useCallback(
    async (assessmentId: string) => {
      if (!athlete) {
        throw new Error("No active athlete");
      }

      const status = await getSupabaseStatus();
      setIsSupabaseConnected(status.configured);

      if (localStore.isAvailable()) {
        localStore.deleteAssessment(assessmentId);
      }

      if (status.configured && isUuid(assessmentId)) {
        await deleteAssessmentAction(assessmentId);
      }

      setAssessments((current) => current.filter((item) => item.id !== assessmentId));

      const remaining = await refreshAssessments();
      await refreshAssessmentHistory();

      if (activeAssessment?.id === assessmentId) {
        const nextAssessment = remaining[0] ?? null;
        if (nextAssessment) {
          setActiveAssessment(nextAssessment);
          localStore.saveSession({ athleteId: athlete.id, assessmentId: nextAssessment.id });
          await refreshAssessmentResults();
        } else {
          setActiveAssessment(null);
          setAssessmentResults([]);
          localStore.clearSession();
          router.push("/coach");
        }
      }
    },
    [
      athlete,
      activeAssessment,
      refreshAssessments,
      refreshAssessmentHistory,
      refreshAssessmentResults,
      router,
    ]
  );

  const endSession = useCallback(() => {
    setAthlete(null);
    setActiveAssessment(null);
    setAssessments([]);
    setAssessmentResults([]);
    setAssessmentHistory([]);
    localStore.clearSession();
    setPendingClassificationId(null);
    router.push("/coach");
  }, [router, setPendingClassificationId]);

  const classification = useMemo(() => {
    if (!activeAssessment) return null;
    return resolveClassificationById(activeAssessment.classificationId);
  }, [activeAssessment, resolveClassificationById]);

  const performanceMetrics = useMemo(() => {
    if (!classification) return [];
    return buildPerformanceMetrics(classification, assessmentResults);
  }, [classification, assessmentResults]);

  const hittraxMetrics = useMemo(
    () =>
      buildHittingTestMetrics(
        "hittrax-testing",
        assessmentResults,
        hittraxTestIds.map((id) => ({
          id,
          label: hittraxTestLabels[id],
          unit: hittraxTestUnits[id],
        }))
      ),
    [assessmentResults]
  );

  const blastMetrics = useMemo(
    () =>
      buildHittingTestMetrics(
        "blast-testing",
        assessmentResults,
        blastTestIds.map((id) => ({
          id,
          label: blastTestLabels[id],
          unit: blastTestUnits[id],
        }))
      ),
    [assessmentResults]
  );

  const movementScores = useMemo(
    () => buildMovementScores(assessmentResults),
    [assessmentResults]
  );

  const screeningJointMobility = useMemo(
    () => buildJointMobility(assessmentResults),
    [assessmentResults]
  );

  const screeningSymmetryIndex = useMemo(
    () => buildSymmetryIndex(assessmentResults),
    [assessmentResults]
  );

  const screeningSessionNote = useMemo(
    () => getScreeningSessionNote(assessmentResults),
    [assessmentResults]
  );

  const athleteGoals = useMemo(() => buildAthleteGoals(assessmentResults), [assessmentResults]);

  const athleteFocusAreas = useMemo(
    () => buildAthleteFocusAreas(assessmentResults),
    [assessmentResults]
  );

  const injuryHistory = useMemo(() => buildInjuryHistory(assessmentResults), [assessmentResults]);

  const progressTrackingMetrics = useMemo(() => {
    if (!classification || !activeAssessment) return [];
    return buildProgressMetrics(classification, assessmentHistory, activeAssessment.id);
  }, [classification, assessmentHistory, activeAssessment]);

  const nationalRankProgress = useMemo(() => {
    if (!classification || !activeAssessment) return [];
    return buildNationalRankProgress(classification, assessmentHistory, activeAssessment.id);
  }, [classification, assessmentHistory, activeAssessment]);

  const progressMilestones = useMemo(() => {
    if (!classification) return [];
    return buildProgressMilestones(classification, assessmentHistory);
  }, [classification, assessmentHistory]);

  const savedEntryCount = assessmentResults.length;

  const value = useMemo(
    () => ({
      athlete,
      activeAssessment,
      classification,
      assessments,
      athletes,
      classifications,
      resolveClassificationById,
      isLoading,
      isSupabaseConnected,
      pendingClassificationId,
      setPendingClassificationId,
      loadAthletes,
      createAthlete,
      updateAthlete,
      deleteAthlete,
      startSession,
      setActiveAssessmentId,
      updateAssessment,
      deleteAssessment,
      endSession,
      includesModule: (moduleId: AssessmentModuleId) =>
        classification ? classificationIncludesModule(classification, moduleId) : false,
      activePerformanceTests: classification ? getActivePerformanceTests(classification) : [],
      assessmentResults,
      performanceMetrics,
      hittraxMetrics,
      blastMetrics,
      movementScores,
      screeningJointMobility,
      screeningSymmetryIndex,
      screeningSessionNote,
      athleteGoals,
      athleteFocusAreas,
      injuryHistory,
      assessmentHistory,
      progressTrackingMetrics,
      nationalRankProgress,
      progressMilestones,
      savedEntryCount,
      lastSavedAt,
      refreshAssessmentResults,
      savePerformanceResults,
      saveHittraxResults,
      saveBlastResults,
      saveMovementResults,
      saveScreeningResults,
      saveAthleteGoals,
      saveAthleteFocusAreas,
      saveInjuryHistory,
      saveClassificationOverride,
    }),
    [
      athlete,
      activeAssessment,
      classification,
      assessments,
      athletes,
      classifications,
      resolveClassificationById,
      isLoading,
      isSupabaseConnected,
      pendingClassificationId,
      setPendingClassificationId,
      loadAthletes,
      createAthlete,
      updateAthlete,
      deleteAthlete,
      startSession,
      setActiveAssessmentId,
      updateAssessment,
      deleteAssessment,
      endSession,
      assessmentResults,
      performanceMetrics,
      hittraxMetrics,
      blastMetrics,
      movementScores,
      screeningJointMobility,
      screeningSymmetryIndex,
      screeningSessionNote,
      athleteGoals,
      athleteFocusAreas,
      injuryHistory,
      assessmentHistory,
      progressTrackingMetrics,
      nationalRankProgress,
      progressMilestones,
      savedEntryCount,
      lastSavedAt,
      refreshAssessmentResults,
      savePerformanceResults,
      saveHittraxResults,
      saveBlastResults,
      saveMovementResults,
      saveScreeningResults,
      saveAthleteGoals,
      saveAthleteFocusAreas,
      saveInjuryHistory,
      saveClassificationOverride,
    ]
  );

  return <CoachSessionContext.Provider value={value}>{children}</CoachSessionContext.Provider>;
}

export function useCoachSession() {
  const context = useContext(CoachSessionContext);
  if (!context) {
    throw new Error("useCoachSession must be used within CoachSessionProvider");
  }
  return context;
}

/** @deprecated Use useCoachSession — kept for existing dashboard components */
export function useAssessment() {
  const session = useCoachSession();
  return {
    assessments: session.assessments,
    activeAssessment: session.activeAssessment!,
    classification: session.classification!,
    classifications: session.classifications,
    setActiveAssessmentId: session.setActiveAssessmentId,
    startAssessment: async (classificationId: string, label: string) => {
      if (!session.athlete) return;
      await session.startSession(session.athlete.id, classificationId, label);
    },
    includesModule: session.includesModule,
    activePerformanceTests: session.activePerformanceTests,
  };
}

export function AssessmentProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
