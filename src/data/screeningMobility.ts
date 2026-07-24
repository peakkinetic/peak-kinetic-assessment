import type { JointMobilityMeasurement } from "@/types";

export const jointMobility: JointMobilityMeasurement[] = [
  { joint: "Ankle DF (L)", degrees: 38, notes: "5° below normative" },
  { joint: "Ankle DF (R)", degrees: 42, notes: "Within normal range" },
  { joint: "Hip IR (L)", degrees: 32, notes: "Adequate for sport demands" },
  { joint: "Hip IR (R)", degrees: 35, notes: "Good internal rotation" },
  { joint: "Hip ER (L)", degrees: 40, notes: "Excellent external rotation" },
  { joint: "Hip ER (R)", degrees: 38, notes: "Slight asymmetry vs left" },
  { joint: "Hip Flexion (L)", degrees: 118, notes: "Full flexion range" },
  { joint: "Hip Flexion (R)", degrees: 122, notes: "Within normal range" },
  { joint: "Shoulder ER (L)", degrees: 88, notes: "Full overhead range" },
  { joint: "Shoulder IR (L)", degrees: 45, notes: "Adequate internal rotation" },
  { joint: "Shoulder ER (R)", degrees: 90, notes: "Throwing arm — excellent" },
  { joint: "Shoulder IR (R)", degrees: 48, notes: "Within normal range" },
];

export const symmetryIndex = [
  { joint: "Ankle DF", left: 38, right: 42, unit: "°", difference: 4 },
  { joint: "Hip IR", left: 32, right: 35, unit: "°", difference: 3 },
  { joint: "Hip ER", left: 40, right: 38, unit: "°", difference: 2 },
  { joint: "Hip Flexion", left: 118, right: 122, unit: "°", difference: 4 },
  { joint: "Shoulder ER", left: 88, right: 90, unit: "°", difference: 2 },
  { joint: "Shoulder IR", left: 45, right: 48, unit: "°", difference: 3 },
  { joint: "Hamstring", left: 72, right: 78, unit: "°", difference: 6 },
];

export const screeningNotes = [
  { date: "Jun 28, 2026", provider: "Dr. Chen, DPT", note: "Left ankle dorsiflexion improving — up 3° from last eval. Continue current protocol." },
  { date: "May 15, 2026", provider: "Dr. Chen, DPT", note: "Initial eval flagged left ankle restriction. Prescribed daily mobility work." },
  { date: "Apr 02, 2026", provider: "Coach Rivera", note: "Pre-season baseline assessment completed. No acute concerns." },
];
