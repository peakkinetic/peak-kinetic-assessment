import type { ProgressEntry } from "@/types";

export interface NationalRankProgressEntry {
  testId: string;
  label: string;
  unit: string;
  startValue: number;
  currentValue: number;
  startLabel: string;
  currentLabel: string;
}

export const nationalRankProgress: NationalRankProgressEntry[] = [
  {
    testId: "ten-yard-sprint",
    label: "10-Yard Laser Sprint",
    unit: "s",
    startValue: 1.58,
    currentValue: 1.52,
    startLabel: "Jan 2026",
    currentLabel: "Jun 2026",
  },
  {
    testId: "assault-runner",
    label: "Assault Runner",
    unit: "mph",
    startValue: 20.2,
    currentValue: 22.4,
    startLabel: "Jan 2026",
    currentLabel: "Jun 2026",
  },
  {
    testId: "vertical-jump",
    label: "Vertical Jump",
    unit: "in",
    startValue: 35.2,
    currentValue: 38.5,
    startLabel: "Jan 2026",
    currentLabel: "Jun 2026",
  },
  {
    testId: "rsi",
    label: "Reactive Strength Index",
    unit: "RSI",
    startValue: 2.52,
    currentValue: 2.84,
    startLabel: "Jan 2026",
    currentLabel: "Jun 2026",
  },
  {
    testId: "broad-jump",
    label: "Broad Jump",
    unit: "in",
    startValue: 116,
    currentValue: 124,
    startLabel: "Jan 2026",
    currentLabel: "Jun 2026",
  },
];

export const progressMetrics = [
  { metric: "10-Yard Laser Sprint", current: 1.52, previous: 1.58, target: 1.48, unit: "s" },
  { metric: "Assault Runner", current: 22.4, previous: 20.8, target: 23.5, unit: "mph" },
  { metric: "Vertical Jump", current: 38.5, previous: 35.2, target: 40.0, unit: "in" },
  { metric: "Reactive Strength Index", current: 2.84, previous: 2.52, target: 3.0, unit: "RSI" },
];

export const milestones: ProgressEntry[] = [
  { date: "Jun 28, 2026", metric: "Vertical Jump", value: 38.5, target: 40.0 },
  { date: "Jun 14, 2026", metric: "10-Yard Laser Sprint", value: 1.53, target: 1.48 },
  { date: "May 30, 2026", metric: "Pro-Agility Test", value: 4.14, target: 4.0 },
  { date: "May 15, 2026", metric: "Reactive Strength Index", value: 2.71, target: 3.0 },
];
