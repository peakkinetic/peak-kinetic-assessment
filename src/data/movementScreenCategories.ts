export const movementScreenCategories = [
  { id: "toe-touch", label: "Toe Touch" },
  { id: "overhead-squat", label: "Overhead Squat" },
  { id: "split-squat", label: "Split Squat" },
  { id: "scratch-test", label: "Scratch Test" },
  { id: "t-spine-extension", label: "T-Spine Extension" },
  { id: "t-spine-rotation", label: "T-Spine Rotation" },
] as const;

export type MovementScreenId = (typeof movementScreenCategories)[number]["id"];

export const movementScreenLabels: Record<MovementScreenId, string> = Object.fromEntries(
  movementScreenCategories.map((item) => [item.id, item.label])
) as Record<MovementScreenId, string>;
