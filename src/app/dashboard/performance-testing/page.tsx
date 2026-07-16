import { PageHeader } from "@/components/ui/PageHeader";
import { AthleteHeader } from "@/components/ui/AthleteHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BarChart } from "@/components/charts/BarChart";
import { PerformanceScoreEntry } from "@/components/performance/PerformanceScoreEntry";
import { PerformanceTestingMetrics } from "@/components/performance/PerformanceTestingMetrics";
import { PerformanceCategoryGrades } from "@/components/performance/PerformanceCategoryGrades";
import { AssessmentModuleGuard } from "@/components/assessment/AssessmentModuleGuard";
import { HideBarChartsForMiddleSchool } from "@/components/assessment/HideBarChartsForMiddleSchool";
import { sprintPhases } from "@/data/performanceTesting";

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

        <HideBarChartsForMiddleSchool>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader title="10-Yard Laser Sprint" subtitle="Trial-by-trial split times (seconds)" />
              <BarChart labels={sprintPhases.labels} datasets={sprintPhases.datasets} height={300} />
            </Card>
          </div>
        </HideBarChartsForMiddleSchool>
      </AssessmentModuleGuard>
    </>
  );
}
