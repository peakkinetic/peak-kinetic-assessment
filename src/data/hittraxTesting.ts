import type { HittraxTestId } from "@/types";

export const hittraxTestIds: HittraxTestId[] = [
  "max-exit-velocity",
  "avg-exit-velocity",
  "max-distance",
  "launch-angle",
];

export const hittraxTestLabels: Record<HittraxTestId, string> = {
  "max-exit-velocity": "Max Exit Velocity",
  "avg-exit-velocity": "Avg Exit Velocity",
  "max-distance": "Max Distance",
  "launch-angle": "Launch Angle",
};

export const hittraxTestUnits: Record<HittraxTestId, string> = {
  "max-exit-velocity": "mph",
  "avg-exit-velocity": "mph",
  "max-distance": "ft",
  "launch-angle": "°",
};
