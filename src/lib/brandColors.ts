export const brandColors = {
  red: "#B31942",
  black: "#000000",
  gray: "#737373",
  green: "#10B981",
  amber: "#F59E0B",
  blue: "#3B82F6",
} as const;

export const hittraxTierColors = {
  athlete: brandColors.black,
  elite: brandColors.green,
  good: brandColors.blue,
  average: brandColors.amber,
  belowAverage: brandColors.red,
} as const;
