export const screeningMobilityCategories = [
  { id: "ankle-df-l", label: "Ankle DF (L)", symmetryGroup: "Ankle DF", side: "left" as const },
  { id: "ankle-df-r", label: "Ankle DF (R)", symmetryGroup: "Ankle DF", side: "right" as const },
  { id: "hip-ir-l", label: "Hip IR (L)", symmetryGroup: "Hip IR", side: "left" as const },
  { id: "hip-ir-r", label: "Hip IR (R)", symmetryGroup: "Hip IR", side: "right" as const },
  { id: "hip-er-l", label: "Hip ER (L)", symmetryGroup: "Hip ER", side: "left" as const },
  { id: "hip-er-r", label: "Hip ER (R)", symmetryGroup: "Hip ER", side: "right" as const },
  {
    id: "hip-flexion-l",
    label: "Hip Flexion (L)",
    symmetryGroup: "Hip Flexion",
    side: "left" as const,
  },
  {
    id: "hip-flexion-r",
    label: "Hip Flexion (R)",
    symmetryGroup: "Hip Flexion",
    side: "right" as const,
  },
  {
    id: "shoulder-er-l",
    label: "Shoulder ER (L)",
    symmetryGroup: "Shoulder ER",
    side: "left" as const,
  },
  {
    id: "shoulder-er-r",
    label: "Shoulder ER (R)",
    symmetryGroup: "Shoulder ER",
    side: "right" as const,
  },
  { id: "hamstring-l", label: "Hamstring (L)", symmetryGroup: "Hamstring", side: "left" as const },
  { id: "hamstring-r", label: "Hamstring (R)", symmetryGroup: "Hamstring", side: "right" as const },
] as const;

export type ScreeningMobilityId = (typeof screeningMobilityCategories)[number]["id"];

export const screeningMobilityLabels: Record<ScreeningMobilityId, string> = Object.fromEntries(
  screeningMobilityCategories.map((item) => [item.id, item.label])
) as Record<ScreeningMobilityId, string>;

export const SCREENING_SESSION_NOTE_ID = "session-note";
