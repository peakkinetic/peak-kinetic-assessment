import { PageHeader } from "@/components/ui/PageHeader";
import { AthleteHeader } from "@/components/ui/AthleteHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { GradeBadge } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { CoachTraitGradeBar } from "@/components/coach/CoachTraitGradeBar";
import { AssessmentModuleGuard } from "@/components/assessment/AssessmentModuleGuard";
import { getOverallLetterGrade } from "@/lib/coachGrades";
import { coachReport } from "@/data/coachReport";

export default function CoachReportPage() {
  const averageScore =
    coachReport.traitGrades.reduce((sum, grade) => sum + grade.score, 0) /
    coachReport.traitGrades.length;
  const overallLetterGrade = getOverallLetterGrade(averageScore);

  return (
    <>
      <PageHeader
        title="Coach Report"
        subtitle="Character and performance evaluation"
        badge={<Badge>Updated: {coachReport.lastUpdated}</Badge>}
      />

      <AthleteHeader />

      <AssessmentModuleGuard moduleId="coach-report">
      <div className="mb-8 grid gap-6 lg:grid-cols-[240px_1fr]">
        <Card padding="lg" className="flex flex-col items-center justify-center text-center">
          <GradeBadge grade={overallLetterGrade} className="px-5 py-2 text-xl" />
          <p className="mt-4 text-sm font-semibold text-pkp-black">Overall Letter Grade</p>
          <p className="mt-1 text-xs text-pkp-gray-500">
            Avg trait score: {averageScore.toFixed(1)} / 5
          </p>
          <p className="mt-4 text-[10px] font-medium uppercase tracking-wider text-pkp-gray-400">
            Graded 1–5
          </p>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          {coachReport.traitGrades.map((grade) => (
            <CoachTraitGradeBar
              key={grade.trait}
              trait={grade.trait}
              score={grade.score}
              description={grade.description}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader title="Overall Summary" subtitle="Coach evaluation overview" />
          <p className="text-sm leading-relaxed text-pkp-gray-600">{coachReport.overallSummary}</p>
        </Card>

        <Card>
          <CardHeader title="Strengths" subtitle="Standout qualities and habits" />
          <p className="text-sm leading-relaxed text-pkp-gray-600">{coachReport.strengths}</p>
        </Card>

        <Card>
          <CardHeader title="Areas for Development" subtitle="Focus points for continued growth" />
          <p className="text-sm leading-relaxed text-pkp-gray-600">
            {coachReport.areasForDevelopment}
          </p>
        </Card>
      </div>
      </AssessmentModuleGuard>
    </>
  );
}
