import type { Athlete, MetricItem } from "@/types";

export const athlete: Athlete = {
  id: "pkp-0001",
  firstName: "Hudson",
  lastName: "Whitley",
  position: "Athlete",
  sport: "Baseball Football Basketball",
  team: "Christian Heritage School",
  age: 13,
  height: "5'7\"",
  weight: "123 lbs",
  dominantSide: "Right",
  jerseyNumber: 0,
  gender: "Male",
  status: "Active",
  headshotInitials: "HW",
  coach: "Coach Moody",
  lastAssessment: "May, 28 2026",
  nextAssessment: "TBD",
};

export const profileMetrics: MetricItem[] = [
  { label: "10-Yard Laser Sprint", value: 1.77, unit: "s", trend: "up", change: "-0.03" },
  { label: "Assault Runner Max", value: 15.9, unit: "mph", trend: "up", change: "+0.6" },
  { label: "Counter Movement Jump", value: 16.8, unit: "in", trend: "up", change: "+0.8" },
  { label: "Vertical Jump", value: 20.2, unit: "in", trend: "up", change: "+1.2" },
  { label: "Reactive Strength Index", value: 1.64, unit: "RSI", trend: "up", change: "+0.12" },
  { label: "Broad Jump", value: 77, unit: "in", trend: "neutral", change: "0.0" },
  { label: "Pro Agility", value: 4.82, unit: "s", trend: "up", change: "-0.05" },
];
