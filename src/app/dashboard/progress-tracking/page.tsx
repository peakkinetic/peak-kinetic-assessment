import { PageHeader } from "@/components/ui/PageHeader";
import { AthleteHeader } from "@/components/ui/AthleteHeader";
import { Badge } from "@/components/ui/Badge";
import { AssessmentModuleGuard } from "@/components/assessment/AssessmentModuleGuard";
import { ProgressTrackingContent } from "@/components/progress/ProgressTrackingContent";

export default function ProgressTrackingPage() {
  return (
    <>
      <PageHeader
        title="Progress Tracking"
        subtitle="Goal progress and milestone tracking"
        badge={<Badge variant="success">On Track</Badge>}
      />

      <AthleteHeader />

      <AssessmentModuleGuard moduleId="progress-tracking">
        <ProgressTrackingContent />
      </AssessmentModuleGuard>
    </>
  );
}
