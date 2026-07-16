import type { ForcePlateMetric } from "@/types";

export const forcePlateMetrics: ForcePlateMetric[] = [
  { metric: "Peak Force", left: 2840, right: 3120, unit: "N", asymmetry: 9.0 },
  { metric: "Rate of Force Dev", left: 8420, right: 9180, unit: "N/s", asymmetry: 8.3 },
  { metric: "Impulse", left: 420, right: 445, unit: "N·s", asymmetry: 5.6 },
  { metric: "Contact Time", left: 0.22, right: 0.21, unit: "s", asymmetry: 4.5 },
  { metric: "Flight Time", left: 0.48, right: 0.51, unit: "s", asymmetry: 6.0 },
  { metric: "RSI", left: 2.18, right: 2.43, unit: "", asymmetry: 10.3 },
];

export const cmjAnalysis = {
  labels: ["0", "50", "100", "150", "200", "250", "300", "350", "400"],
  datasets: [
    { label: "Left Leg", data: [0, 1200, 2400, 2840, 2100, 1400, 800, 200, 0] },
    { label: "Right Leg", data: [0, 1350, 2600, 3120, 2300, 1550, 900, 250, 0] },
  ],
};

export const dropJumpData = {
  labels: ["Trial 1", "Trial 2", "Trial 3", "Trial 4", "Trial 5", "Trial 6"],
  datasets: [
    { label: "Jump Height (cm)", data: [68.2, 69.5, 70.1, 69.8, 71.2, 70.8] },
    { label: "RSI", data: [2.62, 2.71, 2.78, 2.74, 2.84, 2.80] },
  ],
};

export const asymmetryTrend = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    { label: "Force Asymmetry %", data: [14.2, 12.8, 11.5, 10.8, 9.8, 9.0] },
    { label: "Target", data: [10, 10, 10, 10, 10, 10] },
  ],
};

export const landingMetrics = [
  { metric: "Peak Landing Force", value: "3.2× BW", status: "Normal" },
  { metric: "Landing Asymmetry", value: "7.4%", status: "Acceptable" },
  { metric: "Stiffness Index", value: "18.4 kN/m", status: "Optimal" },
  { metric: "Reactive Strength", value: "2.84", status: "Elite" },
];
