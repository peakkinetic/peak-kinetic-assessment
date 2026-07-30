import type { AssessmentClassification, AssessmentClassificationGroup } from "@/types";

export const assessmentClassificationGroups: Record<
  AssessmentClassificationGroup,
  { label: string; description: string }
> = {
  development: {
    label: "Development",
    description: "Age-appropriate batteries for youth and prep athletes",
  },
  advanced: {
    label: "Advanced",
    description: "Recruiting and professional-level evaluations",
  },
  specialty: {
    label: "Specialty",
    description: "Position-specific and combine-focused protocols",
  },
};

export const assessmentClassifications: AssessmentClassification[] = [
  {
    id: "middle-school",
    label: "Middle School Assessment",
    group: "development",
    description:
      "Foundational movement screen, mobility, and age-appropriate power testing for developing athletes.",
    modules: [
      "profile",
      "movement-screen",
      "screening-mobility",
      "performance-testing",
      "coach-report",
    ],
    performanceTests: [
      "ten-yard-sprint",
      "assault-runner",
      "vertical-jump",
      "rsi",
      "broad-jump",
      "pro-agility",
    ],
  },
  {
    id: "high-school",
    label: "High School Assessment",
    group: "development",
    description:
      "Full PKP battery with national benchmarks — movement, mobility, performance, progress, and coach report.",
    modules: [
      "profile",
      "movement-screen",
      "screening-mobility",
      "performance-testing",
      "progress-tracking",
      "coach-report",
    ],
  },
  {
    id: "college",
    label: "College Assessment",
    group: "advanced",
    description:
      "Recruiting-ready profile with movement screen, mobility screening, full combine metrics, progress tracking, and coach evaluation.",
    modules: [
      "profile",
      "movement-screen",
      "screening-mobility",
      "performance-testing",
      "progress-tracking",
      "coach-report",
    ],
  },
  {
    id: "pro",
    label: "Pro Assessment",
    group: "advanced",
    description:
      "Elite performance monitoring with mobility screening, full power metrics, and progress tracking.",
    modules: [
      "profile",
      "screening-mobility",
      "performance-testing",
      "progress-tracking",
      "coach-report",
    ],
  },
  {
    id: "hitting",
    label: "Hitting Assessment",
    group: "specialty",
    description:
      "Hitting athlete profile with Hittrax and Blast metrics, progress tracking, and coach evaluation.",
    modules: [
      "profile",
      "hittrax-testing",
      "blast-testing",
      "progress-tracking",
      "coach-report",
    ],
  },
  {
    id: "pitching",
    label: "Pitching Assessment",
    group: "specialty",
    description:
      "Pitcher-focused evaluation — shoulder and hip mobility, movement quality, and lower-body power output.",
    modules: [
      "profile",
      "movement-screen",
      "screening-mobility",
      "performance-testing",
      "coach-report",
    ],
    performanceTests: ["rsi", "vertical-jump", "assault-runner", "ten-yard-sprint"],
  },
  {
    id: "combine-prep",
    label: "Combine Prep Assessment",
    group: "specialty",
    description:
      "Speed and power combine protocol with full sprint and jump battery plus progress tracking.",
    modules: ["profile", "performance-testing", "progress-tracking"],
  },
];

export function getClassificationById(id: string): AssessmentClassification {
  const classification = assessmentClassifications.find((item) => item.id === id);
  if (!classification) {
    throw new Error(`Unknown assessment classification: ${id}`);
  }
  return classification;
}

export function getClassificationsByGroup(group: AssessmentClassificationGroup) {
  return assessmentClassifications.filter((item) => item.group === group);
}

export const assessmentClassificationGroupOrder: AssessmentClassificationGroup[] = [
  "development",
  "advanced",
  "specialty",
];
