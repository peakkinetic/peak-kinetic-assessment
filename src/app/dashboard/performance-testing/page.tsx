import { PageHeader } from "@/components/ui/PageHeader";
import { AthleteHeader } from "@/components/ui/AthleteHeader";
import { Badge } from "@/components/ui/Badge";
import { PerformanceScoreEntry } from "@/components/performance/PerformanceScoreEntry";
import { PerformanceTestingMetrics } from "@/components/performance/PerformanceTestingMetrics";
import { PerformanceCategoryGrades } from "@/components/performance/PerformanceCategoryGrades";
import { AssessmentModuleGuard } from "@/components/assessment/AssessmentModuleGuard";

export default function PerformanceTestingPage() {
  return (
    <>
      <PageHeader
        title="Performance Testing"
        subtitle="Speed and power assessment results"
        badge={<Badge variant="red">Pro Day Ready</Badge>}
      />

      <AthleteHeader />

      <AssessmentModuleGuard moduleId="performance-testing">
        <PerformanceScoreEntry />
        <PerformanceTestingMetrics />

        <PerformanceCategoryGrades />
      </AssessmentModuleGuard>
    </>
  );
}
