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
  CreateAthleteInput,
  MetricItem,
  MovementScreenEntryInput,
  PerformanceTestId,
  SaveAssessmentResultInput,
  ScreeningMobilityEntryInput,
  JointMobilityMeasurement,
} from "@/types";
import {
  assessmentClassifications,
  getClassificationById,
} from "@/data/assessmentClassifications";
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
  createAthleteAction,
  getSupabaseStatus,
  listAssessmentsForAthleteAction,
  listAthletesAction,
  startCoachSessionAction,
  updateAthleteAction,
} from "@/app/actions/coach";
import {
  listAssessmentHistoryAction,
  listAssessmentResultsAction,
  saveAssessmentResultsAction,
} from "@/app/actions/results";

interface CoachSessionContextValue {
  athlete: Athlete | null;
  activeAssessment: AssessmentRecord | null;
  classification: AssessmentClassification | null;
  assessments: AssessmentRecord[];
  athletes: Athlete[];
  classifications: AssessmentClassification[];
  isLoading: boolean;
  isSupabaseConnected: boolean;
  pendingClassificationId: string | null;
  setPendingClassificationId: (classificationId: string | null) => void;
  loadAthletes: () => Promise<void>;
  createAthlete: (input: CreateAthleteInput) => Promise<Athlete>;
  updateAthlete: (updates: Partial<Pick<Athlete, "height" | "weight" | "age">>) => Promise<Athlete>;
  startSession: (athleteId: string, classificationId: string, label?: string) => Promise<void>;
  setActiveAssessmentId: (assessmentId: string) => void;
  endSession: () => void;
  includesModule: (moduleId: AssessmentModuleId) => boolean;
  activePerformanceTests: PerformanceTestId[];
  assessmentResults: AssessmentResult[];
  performanceMetrics: MetricItem[];
  movementScores: AssessmentScore[];
  screeningJointMobility: JointMobilityMeasurement[];
  screeningSymmetryIndex: SymmetryIndexEntry[];
  screeningSessionNote: string | null;
  refreshAssessmentResults: () => Promise<void>;
  savePerformanceResults: (scores: Partial<Record<PerformanceTestId, number>>) => Promise<void>;
  saveMovementResults: (
    entries: Partial<Record<MovementScreenId, MovementScreenEntryInput>>
  ) => Promise<void>;
  saveScreeningResults: (input: {
    joints: Partial<Record<ScreeningMobilityId, ScreeningMobilityEntryInput>>;
    sessionNote?: string;
  }) => Promise<void>;
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

    try {
      const localSnapshot = loadLocalSession();
      setAthletes(localSnapshot.athletes);
      setAthlete(localSnapshot.athlete);
      setAssessments(localSnapshot.assessments);
      setActiveAssessment(localSnapshot.activeAssessment);

      if (localStore.isAvailable()) {
        if (localSnapshot.activeAssessment) {
          setAssessmentResults(
            localStore.listResultsForAssessment(localSnapshot.activeAssessment.id)
          );
        }
        if (localSnapshot.athlete) {
          setAssessmentHistory(localStore.listAssessmentHistory(localSnapshot.athlete.id));
        }
      }

      const status = await getSupabaseStatus();
      setIsSupabaseConnected(status.configured);

      if (status.configured) {
        try {
          const athleteRows = await listAthletesAction();
          setAthletes(athleteRows);

          const session = localStore.getSession();
          if (session) {
            const currentAthlete =
              athleteRows.find((item) => item.id === session.athleteId) ??
              localSnapshot.athlete;
            const athleteAssessments = currentAthlete
              ? await listAssessmentsForAthleteAction(currentAthlete.id)
              : localSnapshot.assessments;
            const assessment =
              athleteAssessments.find((item) => item.id === session.assessmentId) ??
              athleteAssessments[0] ??
              localSnapshot.activeAssessment;

            setAthlete(currentAthlete);
            setAssessments(athleteAssessments);
            setActiveAssessment(assessment);
          }
        } catch {
          // Keep local snapshot if Supabase is unreachable.
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

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

    if (status.configured) {
      try {
        const history = await listAssessmentHistoryAction(athlete.id);
        setAssessmentHistory(history);
        return;
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

    if (status.configured) {
      try {
        const results = await listAssessmentResultsAction(activeAssessment.id);
        setAssessmentResults(results);
        await refreshAssessmentHistory();
        return;
      } catch {
        // Fall back to local storage below.
      }
    }

    if (localStore.isAvailable()) {
      setAssessmentResults(localStore.listResultsForAssessment(activeAssessment.id));
      await refreshAssessmentHistory();
    }
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

      if (status.configured) {
        const saved = await saveAssessmentResultsAction(
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

      if (status.configured) {
        const saved = await saveAssessmentResultsAction(
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

      if (status.configured) {
        const saved = await saveAssessmentResultsAction(
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

  const createAthlete = useCallback(
    async (input: CreateAthleteInput) => {
      const status = await getSupabaseStatus();
      setIsSupabaseConnected(status.configured);

      if (status.configured) {
        const created = await createAthleteAction(input);
        setAthletes((current) => [created, ...current]);
        return created;
      }

      const created = localStore.createAthlete(input);
      setAthletes((current) => [created, ...current]);
      return created;
    },
    []
  );

  const updateAthlete = useCallback(
    async (updates: Partial<Pick<Athlete, "height" | "weight" | "age">>) => {
      if (!athlete) {
        throw new Error("No active athlete");
      }

      const status = await getSupabaseStatus();
      setIsSupabaseConnected(status.configured);

      if (status.configured) {
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

  const startSession = useCallback(
    async (athleteId: string, classificationId: string, label?: string) => {
      const status = await getSupabaseStatus();
      setIsSupabaseConnected(status.configured);

      if (status.configured) {
        const result = await startCoachSessionAction({
          athleteId,
          classificationId,
          label,
        });
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

      const classification = getClassificationById(classificationId);
      const assessment = localStore.createAssessment({
        athleteId,
        classificationId,
        label:
          label ??
          `${classification.label} — ${new Date().toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}`,
        coach: currentAthlete.coach,
      });

      localStore.saveSession({ athleteId, assessmentId: assessment.id });
      setPendingClassificationId(null);
      goToDashboard();
    },
    [setPendingClassificationId]
  );

  const setActiveAssessmentId = useCallback(
    (assessmentId: string) => {
      const assessment = assessments.find((item) => item.id === assessmentId);
      if (!assessment || !athlete) return;

      setActiveAssessment(assessment);
      localStore.saveSession({ athleteId: athlete.id, assessmentId });
    },
    [assessments, athlete]
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
    return getClassificationById(activeAssessment.classificationId);
  }, [activeAssessment]);

  const performanceMetrics = useMemo(() => {
    if (!classification) return [];
    return buildPerformanceMetrics(classification, assessmentResults);
  }, [classification, assessmentResults]);

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
      classifications: assessmentClassifications,
      isLoading,
      isSupabaseConnected,
      pendingClassificationId,
      setPendingClassificationId,
      loadAthletes,
      createAthlete,
      updateAthlete,
      startSession,
      setActiveAssessmentId,
      endSession,
      includesModule: (moduleId: AssessmentModuleId) =>
        classification ? classificationIncludesModule(classification, moduleId) : false,
      activePerformanceTests: classification ? getActivePerformanceTests(classification) : [],
      assessmentResults,
      performanceMetrics,
      movementScores,
      screeningJointMobility,
      screeningSymmetryIndex,
      screeningSessionNote,
      assessmentHistory,
      progressTrackingMetrics,
      nationalRankProgress,
      progressMilestones,
      savedEntryCount,
      lastSavedAt,
      refreshAssessmentResults,
      savePerformanceResults,
      saveMovementResults,
      saveScreeningResults,
    }),
    [
      athlete,
      activeAssessment,
      classification,
      assessments,
      athletes,
      isLoading,
      isSupabaseConnected,
      pendingClassificationId,
      setPendingClassificationId,
      loadAthletes,
      createAthlete,
      updateAthlete,
      startSession,
      setActiveAssessmentId,
      endSession,
      assessmentResults,
      performanceMetrics,
      movementScores,
      screeningJointMobility,
      screeningSymmetryIndex,
      screeningSessionNote,
      assessmentHistory,
      progressTrackingMetrics,
      nationalRankProgress,
      progressMilestones,
      savedEntryCount,
      lastSavedAt,
      refreshAssessmentResults,
      savePerformanceResults,
      saveMovementResults,
      saveScreeningResults,
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
