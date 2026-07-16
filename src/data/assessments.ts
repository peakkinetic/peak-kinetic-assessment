import type { AssessmentRecord } from "@/types";

export const assessmentRecords: AssessmentRecord[] = [
  {
    id: "asmnt-001",
    athleteId: "pkp-0001",
    classificationId: "high-school",
    label: "May 2026 Baseline",
    date: "May 28, 2026",
    status: "complete",
    coach: "Coach Moody",
  },
  {
    id: "asmnt-002",
    athleteId: "pkp-0001",
    classificationId: "hitting",
    label: "June Hitting Eval",
    date: "Jun 14, 2026",
    status: "complete",
    coach: "Coach Moody",
  },
  {
    id: "asmnt-003",
    athleteId: "pkp-0001",
    classificationId: "combine-prep",
    label: "July Combine Prep",
    date: "Jul 8, 2026",
    status: "in-progress",
    coach: "Coach Moody",
  },
];

export const defaultAssessmentId = "asmnt-001";
