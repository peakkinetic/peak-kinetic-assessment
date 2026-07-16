"use client";

import { AssessmentScoreBadge } from "@/components/ui/DataTable";
import { useCoachSession } from "@/context/CoachSessionContext";
import { getOverallMovementScore } from "@/lib/movementMetrics";

export function MovementScreenHeaderBadge() {
  const { movementScores } = useCoachSession();
  const { rating } = getOverallMovementScore(movementScores);

  return <AssessmentScoreBadge score={rating} className="text-sm" />;
}
