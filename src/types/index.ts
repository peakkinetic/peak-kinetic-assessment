export interface Athlete {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  sport: string;
  team: string;
  age: number;
  height: string;
  weight: string;
  dominantSide: "Left" | "Right";
  jerseyNumber: number;
  gender: "Male" | "Female";
  status: "Active" | "Rehab" | "Evaluating";
  headshotInitials: string;
  profilePhotoUrl?: string;
  coach: string;
  lastAssessment: string;
  nextAssessment: string;
}

export interface MetricItem {
  label: string;
  value: number | string;
  unit?: string;
  percentile?: number;
  tier?: "Elite" | "Good" | "Average" | "Below Average";
  trend?: "up" | "down" | "neutral";
  change?: string;
}

export interface ChartDataset {
  label: string;
  data: number[];
  color?: string;
}

export type AssessmentModuleId =
  | "profile"
  | "movement-screen"
  | "screening-mobility"
  | "performance-testing"
  | "hittrax-testing"
  | "blast-testing"
  | "progress-tracking"
  | "coach-report";

export type HittraxTestId =
  | "max-exit-velocity"
  | "avg-exit-velocity"
  | "max-distance"
  | "launch-angle";

export type BlastTestId =
  | "avg-bat-speed"
  | "max-bat-speed"
  | "avg-attack-angle"
  | "avg-rotational-acceleration"
  | "avg-early-connection"
  | "avg-power-kw"
  | "max-power-kw"
  | "avg-time-to-contact"
  | "avg-peak-hand-speed"
  | "max-peak-hand-speed"
  | "avg-vertical-bat-angle";

export type PerformanceTestId =
  | "ten-yard-sprint"
  | "assault-runner"
  | "vertical-jump"
  | "rsi"
  | "broad-jump"
  | "pro-agility";

export type AssessmentClassificationGroup = "development" | "advanced" | "specialty";

export interface AssessmentClassification {
  id: string;
  label: string;
  description: string;
  group: AssessmentClassificationGroup;
  modules: AssessmentModuleId[];
  performanceTests?: PerformanceTestId[];
}

export interface AssessmentClassificationOverride {
  classificationId: string;
  label: string;
  description: string;
}

export type AssessmentStatus = "scheduled" | "in-progress" | "complete";

export interface AssessmentRecord {
  id: string;
  athleteId: string;
  classificationId: string;
  label: string;
  date: string;
  status: AssessmentStatus;
  coach: string;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  moduleId: AssessmentModuleId;
  testId: string;
  value: number;
  unit: string;
  notes?: string;
}

export interface SaveAssessmentResultInput {
  moduleId: AssessmentModuleId;
  testId: string;
  value: number;
  unit: string;
  notes?: string;
}

export interface MovementScreenEntryInput {
  score: AssessmentScoreValue;
  notes?: string;
}

export interface ScreeningMobilityEntryInput {
  degrees?: number;
  notes?: string;
}

export interface CreateAthleteInput {
  firstName: string;
  lastName: string;
  gender: "Male" | "Female";
  sport?: string;
  team?: string;
  age?: number;
  position?: string;
  coach?: string;
}

export interface AthleteGoal {
  id: string;
  title: string;
}

export interface AthleteInjuryEntry {
  id: string;
  description: string;
}

export interface AthleteFocusAreas {
  primary: string;
  secondary: string;
}

export interface CoachSessionState {
  athleteId: string;
  assessmentId: string;
  classificationId: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  description: string;
  moduleId: AssessmentModuleId | "assessments";
}

export type AssessmentRating = 1 | 2 | 3;
export type AssessmentScoreValue = AssessmentRating | "NA";

export interface AssessmentScore {
  category: string;
  score: AssessmentScoreValue;
  notes?: string;
}

export interface ForcePlateMetric {
  metric: string;
  left: number;
  right: number;
  unit: string;
  asymmetry: number;
}

export interface ProgressEntry {
  date: string;
  metric: string;
  value: number;
  target: number;
}

export interface JointMobilityMeasurement {
  joint: string;
  degrees: number;
  notes?: string;
  side?: "left" | "right";
}

export type CoachTraitRating = 1 | 2 | 3 | 4 | 5;

export interface CoachTraitGrade {
  trait: string;
  score: CoachTraitRating;
  description: string;
}

export interface CoachReportContent {
  lastUpdated: string;
  traitGrades: CoachTraitGrade[];
  overallSummary: string;
  strengths: string;
  areasForDevelopment: string;
}
