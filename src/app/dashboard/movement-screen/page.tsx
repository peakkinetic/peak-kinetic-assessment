import { PageHeader } from "@/components/ui/PageHeader";
import { AthleteHeader } from "@/components/ui/AthleteHeader";
import { AssessmentModuleGuard } from "@/components/assessment/AssessmentModuleGuard";
import { MovementScoreEntry } from "@/components/movement/MovementScoreEntry";
import { MovementScreenContent } from "@/components/movement/MovementScreenContent";
import { MovementScreenHeaderBadge } from "@/components/movement/MovementScreenHeaderBadge";

export default function MovementScreenPage() {
  return (
    <>
      <PageHeader
        title="Movement Screen"
        subtitle="Functional movement assessment and pattern analysis"
        badge={<MovementScreenHeaderBadge />}
      />

      <AthleteHeader />

      <AssessmentModuleGuard moduleId="movement-screen">
        <MovementScoreEntry />
        <MovementScreenContent />
      </AssessmentModuleGuard>
    </>
  );
}
