"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { AthleteHeader } from "@/components/ui/AthleteHeader";
import { Badge } from "@/components/ui/Badge";
import { AssessmentModuleGuard } from "@/components/assessment/AssessmentModuleGuard";
import { HittingTestScoreEntry } from "@/components/hitting/HittingTestScoreEntry";
import { HittingTestMetrics } from "@/components/hitting/HittingTestMetrics";
import {
  hittraxTestIds,
  hittraxTestLabels,
  hittraxTestUnits,
} from "@/data/hittraxTesting";
import { useCoachSession } from "@/context/CoachSessionContext";

const hittraxTests = hittraxTestIds.map((id) => ({
  id,
  label: hittraxTestLabels[id],
  unit: hittraxTestUnits[id],
}));

export default function HittraxTestingPage() {
  const { hittraxMetrics, saveHittraxResults } = useCoachSession();

  return (
    <>
      <PageHeader
        title="Hittrax Testing"
        subtitle="Batted ball metrics rated vs national high school hitter Hittrax benchmarks"
        badge={<Badge variant="red">Hitting</Badge>}
      />

      <AthleteHeader />

      <AssessmentModuleGuard moduleId="hittrax-testing">
        <HittingTestScoreEntry
          moduleId="hittrax-testing"
          title="Enter Hittrax Scores"
          tests={hittraxTests}
          onSave={saveHittraxResults}
        />
        <HittingTestMetrics
          metrics={hittraxMetrics}
          emptyMessage="No Hittrax scores entered yet. Use the form above to record results."
          showNationalComparison
        />
      </AssessmentModuleGuard>
    </>
  );
}
