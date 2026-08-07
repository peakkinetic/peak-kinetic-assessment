import type { BlastTestId } from "@/types";

export const blastTestIds: BlastTestId[] = [
  "avg-bat-speed",
  "max-bat-speed",
  "avg-attack-angle",
  "avg-rotational-acceleration",
  "avg-early-connection",
  "avg-connection-at-impact",
  "avg-power-kw",
  "max-power-kw",
  "avg-time-to-contact",
  "avg-peak-hand-speed",
  "max-peak-hand-speed",
  "avg-vertical-bat-angle",
];

export const blastTestLabels: Record<BlastTestId, string> = {
  "avg-bat-speed": "Average Bat Speed",
  "max-bat-speed": "Max Bat Speed",
  "avg-attack-angle": "Average Attack Angle",
  "avg-rotational-acceleration": "Average Rotational Acceleration",
  "avg-early-connection": "Early Connection",
  "avg-connection-at-impact": "Connection at Impact",
  "avg-power-kw": "Avg Power",
  "max-power-kw": "Max Power",
  "avg-time-to-contact": "Average Time to Contact",
  "avg-peak-hand-speed": "Average Peak Hand Speed",
  "max-peak-hand-speed": "Max Peak Hand Speed",
  "avg-vertical-bat-angle": "Average Vertical Bat Angle",
};

export const blastTestUnits: Record<BlastTestId, string> = {
  "avg-bat-speed": "mph",
  "max-bat-speed": "mph",
  "avg-attack-angle": "°",
  "avg-rotational-acceleration": "g",
  "avg-early-connection": "°",
  "avg-connection-at-impact": "°",
  "avg-power-kw": "kW",
  "max-power-kw": "kW",
  "avg-time-to-contact": "s",
  "avg-peak-hand-speed": "mph",
  "max-peak-hand-speed": "mph",
  "avg-vertical-bat-angle": "°",
};
