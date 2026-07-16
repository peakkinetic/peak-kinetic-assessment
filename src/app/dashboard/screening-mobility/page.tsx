import { PageHeader } from "@/components/ui/PageHeader";
import { AthleteHeader } from "@/components/ui/AthleteHeader";
import { AssessmentModuleGuard } from "@/components/assessment/AssessmentModuleGuard";
import { ScreeningScoreEntry } from "@/components/screening/ScreeningScoreEntry";
import { ScreeningMobilityContent } from "@/components/screening/ScreeningMobilityContent";
import { ScreeningMobilityHeaderBadge } from "@/components/screening/ScreeningMobilityHeaderBadge";

export default function ScreeningMobilityPage() {
  return (
    <>
      <PageHeader
        title="Screening Mobility"
        subtitle="Joint range of motion and bilateral symmetry analysis"
        badge={<ScreeningMobilityHeaderBadge />}
      />

      <AthleteHeader />

      <AssessmentModuleGuard moduleId="screening-mobility">
        <ScreeningScoreEntry />
        <ScreeningMobilityContent />
      </AssessmentModuleGuard>
    </>
  );
}
