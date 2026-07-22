export const screeningMobilityCategories = [
  { id: "hip-ir-l", label: "Hip IR (L)", symmetryGroup: "Hip IR", side: "left" as const },
  { id: "hip-er-l", label: "Hip ER (L)", symmetryGroup: "Hip ER", side: "left" as const },
  {
    id: "hip-flexion-l",
    label: "Hip Flexion (L)",
    symmetryGroup: "Hip Flexion",
    side: "left" as const,
  },
  {
    id: "shoulder-er-l",
    label: "Shoulder ER (L)",
    symmetryGroup: "Shoulder ER",
    side: "left" as const,
  },
  {
    id: "straight-leg-raise-l",
    label: "Straight Leg Raise (L)",
    symmetryGroup: "Straight Leg Raise",
    side: "left" as const,
  },
  { id: "hip-ir-r", label: "Hip IR (R)", symmetryGroup: "Hip IR", side: "right" as const },
  { id: "hip-er-r", label: "Hip ER (R)", symmetryGroup: "Hip ER", side: "right" as const },
  {
    id: "hip-flexion-r",
    label: "Hip Flexion (R)",
    symmetryGroup: "Hip Flexion",
    side: "right" as const,
  },
  {
    id: "shoulder-er-r",
    label: "Shoulder ER (R)",
    symmetryGroup: "Shoulder ER",
    side: "right" as const,
  },
  {
    id: "straight-leg-raise-r",
    label: "Straight Leg Raise (R)",
    symmetryGroup: "Straight Leg Raise",
    side: "right" as const,
  },
] as const;

export const leftScreeningMobilityCategories = screeningMobilityCategories.filter(
  (category) => category.side === "left"
);

export const rightScreeningMobilityCategories = screeningMobilityCategories.filter(
  (category) => category.side === "right"
);

export type ScreeningMobilityId = (typeof screeningMobilityCategories)[number]["id"];
export type ScreeningMobilityCategory = (typeof screeningMobilityCategories)[number];

export const screeningMobilityLabels: Record<ScreeningMobilityId, string> = Object.fromEntries(
  screeningMobilityCategories.map((item) => [item.id, item.label])
) as Record<ScreeningMobilityId, string>;

export const SCREENING_SESSION_NOTE_ID = "session-note";
