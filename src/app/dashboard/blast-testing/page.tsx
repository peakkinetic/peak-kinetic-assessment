"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { AthleteHeader } from "@/components/ui/AthleteHeader";
import { Badge } from "@/components/ui/Badge";
import { AssessmentModuleGuard } from "@/components/assessment/AssessmentModuleGuard";
import { HittingTestScoreEntry } from "@/components/hitting/HittingTestScoreEntry";
import { HittingTestMetrics } from "@/components/hitting/HittingTestMetrics";
import { blastTestIds, blastTestLabels, blastTestUnits } from "@/data/blastTesting";
import { useCoachSession } from "@/context/CoachSessionContext";

const blastTests = blastTestIds.map((id) => ({
  id,
  label: blastTestLabels[id],
  unit: blastTestUnits[id],
}));

export default function BlastTestingPage() {
  const { blastMetrics, saveBlastResults } = useCoachSession();

  return (
    <>
      <PageHeader
        title="Blast Testing"
        subtitle="Bat speed and swing mechanics metrics"
        badge={<Badge variant="red">Hitting</Badge>}
      />

      <AthleteHeader />

      <AssessmentModuleGuard moduleId="blast-testing">
        <HittingTestScoreEntry
          moduleId="blast-testing"
          title="Enter Blast Scores"
          tests={blastTests}
          onSave={saveBlastResults}
        />
        <HittingTestMetrics
          metrics={blastMetrics}
          emptyMessage="No Blast scores entered yet. Use the form above to record results."
        />
      </AssessmentModuleGuard>
    </>
  );
}
