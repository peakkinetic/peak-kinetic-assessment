"use client";

import { Badge } from "@/components/ui/Badge";
import { useCoachSession } from "@/context/CoachSessionContext";

export function ScreeningMobilityHeaderBadge() {
  const { activeAssessment } = useCoachSession();

  if (!activeAssessment) return null;

  return <Badge>Session: {activeAssessment.date}</Badge>;
}
