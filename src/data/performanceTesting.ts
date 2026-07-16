import type { PerformanceTestId } from "@/types";

export const speedTestIds: PerformanceTestId[] = [
  "ten-yard-sprint",
  "assault-runner",
  "pro-agility",
];

export const powerTestIds: PerformanceTestId[] = [
  "counter-movement-jump",
  "vertical-jump",
  "rsi",
  "broad-jump",
];

export const sprintPhases = {
  labels: ["Trial 1", "Trial 2", "Trial 3", "Trial 4", "Trial 5", "Trial 6"],
  datasets: [
    { label: "10-Yard Laser Sprint (s)", data: [1.56, 1.55, 1.54, 1.53, 1.52, 1.52] },
    { label: "Previous Session", data: [1.58, 1.57, 1.56, 1.55, 1.54, 1.53] },
  ],
};
