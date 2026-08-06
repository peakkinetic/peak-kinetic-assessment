import type {
  Athlete,
  AssessmentClassificationOverride,
  AssessmentRecord,
  AssessmentStatus,
  SaveAssessmentResultInput,
} from "@/types";
import { athlete as seedAthlete } from "@/data/athlete";
import { assessmentRecords as seedAssessments } from "@/data/assessments";
import {
  athleteToLocalRow,
  assessmentToLocalRow,
} from "@/lib/sessionRecords";
import {
  athleteToRow,
  getInitials,
  rowToAssessment,
  rowToAssessmentResult,
  rowToAthlete,
} from "./mappers";
import type { AthleteRow, AssessmentRow, AssessmentResultRow } from "./mappers";

const ATHLETES_KEY = "pkp-local-athletes";
const ASSESSMENTS_KEY = "pkp-local-assessments";
const RESULTS_KEY = "pkp-local-assessment-results";
const SESSION_KEY = "pkp-coach-session";
const CLASSIFICATION_OVERRIDES_KEY = "pkp-classification-overrides";

export const localStoreKeys = {
  athletes: ATHLETES_KEY,
  assessments: ASSESSMENTS_KEY,
  results: RESULTS_KEY,
  session: SESSION_KEY,
  classificationOverrides: CLASSIFICATION_OVERRIDES_KEY,
} as const;

export interface CoachSessionPayload {
  athleteId: string;
  assessmentId: string;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function seedAthletes(): AthleteRow[] {
  return [
    {
      id: seedAthlete.id,
      first_name: seedAthlete.firstName,
      last_name: seedAthlete.lastName,
      position: seedAthlete.position,
      sport: seedAthlete.sport,
      team: seedAthlete.team,
      age: seedAthlete.age,
      height: seedAthlete.height,
      weight: seedAthlete.weight,
      dominant_side: seedAthlete.dominantSide,
      jersey_number: seedAthlete.jerseyNumber,
      gender: seedAthlete.gender,
      status: seedAthlete.status,
      headshot_initials: seedAthlete.headshotInitials,
      coach: seedAthlete.coach,
    },
  ];
}

function seedAssessmentRows(): AssessmentRow[] {
  return seedAssessments.map((record) => ({
    id: record.id,
    athlete_id: record.athleteId,
    classification_id: record.classificationId,
    label: record.label,
    status: record.status,
    coach: record.coach,
    assessed_at: new Date(record.date).toISOString(),
  }));
}

function getAthleteRows(): AthleteRow[] {
  const existing = readJson<AthleteRow[] | null>(ATHLETES_KEY, null);
  if (existing?.length) return existing;
  const seeded = seedAthletes();
  writeJson(ATHLETES_KEY, seeded);
  return seeded;
}

function getAssessmentRows(): AssessmentRow[] {
  const existing = readJson<AssessmentRow[] | null>(ASSESSMENTS_KEY, null);
  if (existing?.length) return existing;
  const seeded = seedAssessmentRows();
  writeJson(ASSESSMENTS_KEY, seeded);
  return seeded;
}

function getResultRows(): AssessmentResultRow[] {
  return readJson<AssessmentResultRow[]>(RESULTS_KEY, []);
}

function writeResultRows(rows: AssessmentResultRow[]) {
  writeJson(RESULTS_KEY, rows);
}

export const localStore = {
  isAvailable(): boolean {
    return typeof window !== "undefined";
  },

  listAthletes(): Athlete[] {
    return getAthleteRows().map(rowToAthlete);
  },

  createAthlete(input: {
    firstName: string;
    lastName: string;
    gender: Athlete["gender"];
    sport?: string;
    team?: string;
    age?: number;
    position?: string;
    coach?: string;
  }): Athlete {
    const rows = getAthleteRows();
    const row: AthleteRow = {
      id: `athlete-${Date.now()}`,
      ...athleteToRow({
        firstName: input.firstName,
        lastName: input.lastName,
        gender: input.gender,
        sport: input.sport ?? "",
        team: input.team ?? "",
        age: input.age ?? 0,
        position: input.position ?? "Athlete",
        coach: input.coach ?? "Coach Moody",
        headshotInitials: getInitials(input.firstName, input.lastName),
      }),
    };
    writeJson(ATHLETES_KEY, [row, ...rows]);
    return rowToAthlete(row);
  },

  updateAthlete(
    athleteId: string,
    updates: Partial<Pick<Athlete, "firstName" | "lastName" | "height" | "weight" | "age">>
  ): Athlete {
    const rows = getAthleteRows();
    const index = rows.findIndex((row) => row.id === athleteId);
    if (index === -1) {
      throw new Error("Athlete not found");
    }

    const current = rows[index];
    const firstName =
      updates.firstName !== undefined ? updates.firstName.trim() : current.first_name;
    const lastName = updates.lastName !== undefined ? updates.lastName.trim() : current.last_name;

    const nextRow: AthleteRow = {
      ...current,
      first_name: firstName,
      last_name: lastName,
      height: updates.height !== undefined ? updates.height || null : current.height,
      weight: updates.weight !== undefined ? updates.weight || null : current.weight,
      age: updates.age !== undefined ? updates.age || null : current.age,
      headshot_initials:
        updates.firstName !== undefined || updates.lastName !== undefined
          ? getInitials(firstName, lastName)
          : current.headshot_initials,
    };

    const nextRows = [...rows];
    nextRows[index] = nextRow;
    writeJson(ATHLETES_KEY, nextRows);
    return rowToAthlete(nextRow);
  },

  deleteAthlete(athleteId: string) {
    const athleteAssessments = getAssessmentRows().filter((row) => row.athlete_id === athleteId);
    const assessmentIds = new Set(athleteAssessments.map((row) => row.id));

    writeJson(
      ATHLETES_KEY,
      getAthleteRows().filter((row) => row.id !== athleteId)
    );
    writeJson(
      ASSESSMENTS_KEY,
      getAssessmentRows().filter((row) => row.athlete_id !== athleteId)
    );
    writeResultRows(
      getResultRows().filter((row) => !assessmentIds.has(row.assessment_id))
    );

    const session = readJson<CoachSessionPayload | null>(SESSION_KEY, null);
    if (session?.athleteId === athleteId) {
      localStorage.removeItem(SESSION_KEY);
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem(`pkp-athlete-photo-${athleteId}`);
    }
  },

  listAssessmentsForAthlete(athleteId: string): AssessmentRecord[] {
    return getAssessmentRows()
      .filter((row) => row.athlete_id === athleteId)
      .map(rowToAssessment);
  },

  createAssessment(input: {
    athleteId: string;
    classificationId: string;
    label: string;
    coach?: string;
  }): AssessmentRecord {
    const rows = getAssessmentRows();
    const row: AssessmentRow = {
      id: `asmnt-${Date.now()}`,
      athlete_id: input.athleteId,
      classification_id: input.classificationId,
      label: input.label,
      status: "in-progress",
      coach: input.coach ?? "Coach Moody",
      assessed_at: new Date().toISOString(),
    };
    writeJson(ASSESSMENTS_KEY, [row, ...rows]);
    return rowToAssessment(row);
  },

  updateAssessment(
    assessmentId: string,
    updates: Partial<Pick<AssessmentRecord, "label" | "status" | "coach">>
  ): AssessmentRecord {
    const rows = getAssessmentRows();
    const index = rows.findIndex((row) => row.id === assessmentId);
    if (index === -1) {
      throw new Error("Assessment not found");
    }

    const nextRow: AssessmentRow = {
      ...rows[index],
      label: updates.label ?? rows[index].label,
      status: updates.status ?? rows[index].status,
      coach: updates.coach ?? rows[index].coach,
    };

    const nextRows = [...rows];
    nextRows[index] = nextRow;
    writeJson(ASSESSMENTS_KEY, nextRows);
    return rowToAssessment(nextRow);
  },

  deleteAssessment(assessmentId: string) {
    writeJson(
      ASSESSMENTS_KEY,
      getAssessmentRows().filter((row) => row.id !== assessmentId)
    );
    writeResultRows(getResultRows().filter((row) => row.assessment_id !== assessmentId));
  },

  getSession(): CoachSessionPayload | null {
    return readJson<CoachSessionPayload | null>(SESSION_KEY, null);
  },

  saveSession(session: CoachSessionPayload) {
    writeJson(SESSION_KEY, session);
  },

  clearSession() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(SESSION_KEY);
  },

  listResultsForAssessment(assessmentId: string) {
    return getResultRows()
      .filter((row) => row.assessment_id === assessmentId)
      .map(rowToAssessmentResult);
  },

  listAssessmentHistory(athleteId: string) {
    const assessments = getAssessmentRows()
      .filter((row) => row.athlete_id === athleteId)
      .sort(
        (a, b) => new Date(a.assessed_at).getTime() - new Date(b.assessed_at).getTime()
      );

    const allResults = getResultRows();

    return assessments.map((row) => ({
      assessment: rowToAssessment(row),
      results: allResults
        .filter((result) => result.assessment_id === row.id)
        .map(rowToAssessmentResult),
    }));
  },

  upsertResults(
    assessmentId: string,
    moduleId: SaveAssessmentResultInput["moduleId"],
    results: SaveAssessmentResultInput[]
  ) {
    const rows = getResultRows();
    const preserved = rows.filter(
      (row) => row.assessment_id !== assessmentId || row.module_id !== moduleId
    );
    const existingForModule = rows.filter(
      (row) => row.assessment_id === assessmentId && row.module_id === moduleId
    );

    const nextRows = results.map((result, index) => {
      const existing = existingForModule.find(
        (row) => row.module_id === result.moduleId && row.test_id === result.testId
      );

      const row: AssessmentResultRow = {
        id: existing?.id ?? `result-${Date.now()}-${index}-${result.testId}`,
        assessment_id: assessmentId,
        module_id: result.moduleId,
        test_id: result.testId,
        value: result.value,
        unit: result.unit,
        notes: result.notes ?? null,
      };

      return row;
    });

    writeResultRows([...preserved, ...nextRows]);
    return nextRows.map(rowToAssessmentResult);
  },

  syncAthlete(athlete: Athlete) {
    const rows = getAthleteRows();
    const row = athleteToLocalRow(athlete);
    const index = rows.findIndex((item) => item.id === athlete.id);
    const nextRows = [...rows];
    if (index === -1) {
      nextRows.unshift(row);
    } else {
      nextRows[index] = { ...nextRows[index], ...row };
    }
    writeJson(ATHLETES_KEY, nextRows);
  },

  syncAssessment(record: AssessmentRecord, assessedAt?: string) {
    const rows = getAssessmentRows();
    const row = assessmentToLocalRow(record, assessedAt);
    const index = rows.findIndex((item) => item.id === record.id);
    const nextRows = [...rows];
    if (index === -1) {
      nextRows.unshift(row);
    } else {
      nextRows[index] = { ...nextRows[index], ...row };
    }
    writeJson(ASSESSMENTS_KEY, nextRows);
  },

  listClassificationOverrides(): AssessmentClassificationOverride[] {
    return readJson<AssessmentClassificationOverride[]>(CLASSIFICATION_OVERRIDES_KEY, []);
  },

  saveClassificationOverride(
    override: AssessmentClassificationOverride
  ): AssessmentClassificationOverride {
    const rows = readJson<AssessmentClassificationOverride[]>(CLASSIFICATION_OVERRIDES_KEY, []);
    const nextOverride = {
      classificationId: override.classificationId,
      label: override.label.trim(),
      description: override.description.trim(),
    };
    const index = rows.findIndex((item) => item.classificationId === override.classificationId);
    const nextRows = [...rows];

    if (index === -1) {
      nextRows.push(nextOverride);
    } else {
      nextRows[index] = nextOverride;
    }

    writeJson(CLASSIFICATION_OVERRIDES_KEY, nextRows);
    return nextOverride;
  },

  subscribeToChanges(onChange: () => void) {
    if (typeof window === "undefined") return () => undefined;

    const keys = Object.values(localStoreKeys);
    const handleStorage = (event: StorageEvent) => {
      if (event.key && keys.includes(event.key as (typeof keys)[number])) {
        onChange();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  },
};
