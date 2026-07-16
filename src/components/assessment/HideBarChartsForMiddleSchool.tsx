"use client";

import { useCoachSession } from "@/context/CoachSessionContext";
import { shouldShowBarCharts } from "@/lib/assessmentAccess";

export function HideBarChartsForMiddleSchool({ children }: { children: React.ReactNode }) {
  const { activeAssessment } = useCoachSession();

  if (!activeAssessment || !shouldShowBarCharts(activeAssessment.classificationId)) {
    return null;
  }

  return <>{children}</>;
}
