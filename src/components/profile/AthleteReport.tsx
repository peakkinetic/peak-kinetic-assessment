"use client";

import { Calendar, ClipboardList, Printer, Ruler, User, Weight } from "lucide-react";
import { AthleteAvatar } from "@/components/ui/AthleteAvatar";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable, AssessmentScoreBadge, AssessmentScoreLegend, GradeBadge } from "@/components/ui/DataTable";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { BarChart } from "@/components/charts/BarChart";
import { NationalRankingChart } from "@/components/profile/NationalRankingChart";
import { ReportSection } from "@/components/profile/ReportSection";
import { ProfileGoalsSection } from "@/components/profile/ProfileGoalsSection";
import { ProfileInjuryHistorySection } from "@/components/profile/ProfileInjuryHistorySection";
import { JointMobilityTable } from "@/components/screening/JointMobilityTable";
import { HideBarChartsForMiddleSchool } from "@/components/assessment/HideBarChartsForMiddleSchool";
import { useCoachSession } from "@/context/CoachSessionContext";
import { speedTestIds, powerTestIds } from "@/data/performanceTesting";
import { getPerformanceTestId } from "@/lib/assessmentAccess";
import { enrichMetricsWithPerformanceTiers, getNationalComparisonFromMetrics } from "@/lib/normComparison";
import { getCategoryGrade } from "@/lib/performanceGrades";
import {
  buildMovementPatterns,
  getOverallMovementScore,
} from "@/lib/movementMetrics";
import {
  getAssessmentProgressColor,
  getAssessmentRatingLabel,
  getAssessmentRiskLabel,
  isScoredAssessment,
} from "@/lib/utils";
import { brandColors } from "@/lib/brandColors";
import { splitJointMobilityBySide } from "@/lib/screeningMetrics";
import type { MetricItem, PerformanceTestId } from "@/types";

function filterMetricsByTestIds(metrics: MetricItem[], testIds: PerformanceTestId[]): MetricItem[] {
  return metrics.filter((metric) => {
    const testId = getPerformanceTestId(metric.label);
    return testId ? testIds.includes(testId) : false;
  });
}

function EmptySection({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-dashed border-pkp-gray-200 bg-pkp-gray-50/60 px-4 py-6 text-sm text-pkp-gray-500">
      {message}
    </p>
  );
}

export function PrintReportButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden inline-flex items-center gap-2 rounded-lg border border-pkp-gray-200 bg-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-pkp-black hover:border-pkp-red hover:text-pkp-red"
    >
      <Printer className="h-4 w-4" />
      Print Report
    </button>
  );
}

export function AthleteReport() {
  const {
    athlete,
    activeAssessment,
    classification,
    includesModule,
    performanceMetrics,
    movementScores,
    screeningJointMobility,
    screeningSymmetryIndex,
    screeningSessionNote,
  } = useCoachSession();

  if (!athlete || !classification || !activeAssessment) return null;

  const metrics = includesModule("performance-testing")
    ? enrichMetricsWithPerformanceTiers(performanceMetrics, classification.id)
    : [];
  const speed = filterMetricsByTestIds(metrics, speedTestIds);
  const power = filterMetricsByTestIds(metrics, powerTestIds);
  const categoryGrades = [
    getCategoryGrade(speed, "Speed", speedTestIds.length),
    getCategoryGrade(power, "Power", powerTestIds.length),
  ].filter((grade): grade is NonNullable<typeof grade> => grade !== null);
  const comparison =
    metrics.length > 0
      ? getNationalComparisonFromMetrics(metrics, athlete.gender, classification.id)
      : null;

  const movementPatterns = buildMovementPatterns(movementScores);
  const { average: overallMovementScore } = getOverallMovementScore(movementScores);
  const hasMovementScores = movementScores.some((score) => isScoredAssessment(score.score));
  const screeningBySide = splitJointMobilityBySide(screeningJointMobility);

  return (
    <article className="athlete-report space-y-10 md:space-y-12">
      <ReportSection
        title="Athlete Information"
        subtitle={`${classification.label} · ${activeAssessment.label}`}
      >
        <Card padding="lg" className="overflow-hidden">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <AthleteAvatar size="lg" />
            <div className="min-w-0 flex-1">
              <p className="pkp-section-label text-pkp-red">Peak Kinetic Performance</p>
              <h3 className="mt-1 text-2xl font-bold text-pkp-black md:text-3xl">
                {athlete.firstName} {athlete.lastName}
              </h3>
              <p className="mt-2 text-sm text-pkp-gray-600">
                {athlete.position}
                {athlete.sport ? ` · ${athlete.sport}` : ""}
                {athlete.team ? ` · ${athlete.team}` : ""}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="black">{athlete.gender}</Badge>
                {athlete.jerseyNumber > 0 && <Badge variant="red">#{athlete.jerseyNumber}</Badge>}
                <Badge>{activeAssessment.date}</Badge>
              </div>
            </div>
            {comparison && comparison.comparisons.length > 0 && (
              <div className="rounded-xl border border-pkp-gray-200 bg-pkp-gray-50 px-6 py-4 text-center md:text-right">
                <p className="text-3xl font-bold tabular-nums text-pkp-red">
                  {comparison.averageTierScore}
                  <span className="text-lg text-pkp-gray-400">/5</span>
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-pkp-gray-500">
                  Avg Tier Points
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { icon: Calendar, label: "Age", value: athlete.age ? `${athlete.age} yrs` : "—" },
              { icon: Ruler, label: "Height", value: athlete.height || "—" },
              { icon: Weight, label: "Weight", value: athlete.weight || "—" },
              { icon: User, label: "Gender", value: athlete.gender },
              {
                icon: ClipboardList,
                label: "Assessment Coach",
                value: activeAssessment.coach || "—",
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-xl border border-pkp-gray-100 bg-pkp-gray-50/60 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
                    <Icon className="h-4 w-4 text-pkp-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-pkp-gray-400">{label}</p>
                    <p className="text-sm font-bold">{value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </ReportSection>

      <ProfileGoalsSection />

      <ProfileInjuryHistorySection />

      {includesModule("performance-testing") && (
        <ReportSection
          title="Performance Testing"
          subtitle="Speed and power results vs PKP benchmarks"
        >
          {metrics.length === 0 ? (
            <EmptySection message="No performance scores recorded for this assessment." />
          ) : (
            <div className="space-y-6">
              {categoryGrades.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {categoryGrades.map((grade) => (
                    <div
                      key={grade.category}
                      className="flex items-center gap-3 rounded-xl border border-pkp-gray-200 bg-white px-4 py-3 shadow-[var(--shadow-card)]"
                    >
                      <GradeBadge grade={grade.grade} />
                      <div>
                        <p className="text-sm font-semibold">{grade.category}</p>
                        <p className="text-xs text-pkp-gray-400">
                          {grade.score}/{grade.maxScore} · {grade.testCount} tests scored
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {speed.length > 0 && (
                <div>
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-pkp-black">
                    Speed
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {speed.map((metric) => (
                      <StatCard key={metric.label} {...metric} />
                    ))}
                  </div>
                </div>
              )}

              {power.length > 0 && (
                <div>
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-pkp-black">
                    Power
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {power.map((metric) => (
                      <StatCard key={metric.label} {...metric} />
                    ))}
                  </div>
                </div>
              )}

              <NationalRankingChart
                gender={athlete.gender}
                metrics={metrics}
                classificationId={classification.id}
              />
            </div>
          )}
        </ReportSection>
      )}

      {includesModule("movement-screen") && (
        <ReportSection
          title="Movement Screen"
          subtitle={`Functional movement patterns · Overall avg ${overallMovementScore}/3`}
        >
          {!hasMovementScores ? (
            <EmptySection message="No movement screen scores recorded for this assessment." />
          ) : (
            <div className="space-y-6">
              <AssessmentScoreLegend />

              <Card>
                <DataTable
                  headers={["Movement", "Score", "Rating", "Notes"]}
                  rows={movementScores.map((score) => [
                    score.category,
                    <AssessmentScoreBadge
                      key={`${score.category}-score`}
                      score={score.score}
                      showLabel={false}
                    />,
                    getAssessmentRatingLabel(score.score),
                    <span key={`${score.category}-notes`} className="text-pkp-gray-500">
                      {score.notes || "—"}
                    </span>,
                  ])}
                />
              </Card>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {movementPatterns.map((pattern) => (
                  <Card key={pattern.pattern} padding="sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold">{pattern.pattern}</span>
                      <AssessmentScoreBadge score={pattern.score} showLabel={false} />
                    </div>
                    {isScoredAssessment(pattern.score) ? (
                      <>
                        <ProgressBar
                          value={pattern.score}
                          max={3}
                          label={getAssessmentRatingLabel(pattern.score)}
                          className="mt-3"
                          color={getAssessmentProgressColor(pattern.score)}
                        />
                        <p className="mt-2 text-xs font-medium text-pkp-gray-500">
                          {getAssessmentRiskLabel(pattern.score)} risk
                        </p>
                      </>
                    ) : (
                      <p className="mt-3 text-xs font-medium text-pkp-gray-500">
                        Not assessed this session
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </ReportSection>
      )}

      {includesModule("screening-mobility") && (
        <ReportSection
          title="Screening Mobility"
          subtitle="Joint range of motion and bilateral symmetry"
        >
          {screeningJointMobility.length === 0 && !screeningSessionNote ? (
            <EmptySection message="No screening mobility scores recorded for this assessment." />
          ) : (
            <div className="space-y-6">
              {screeningJointMobility.length > 0 && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader title="Left Side" />
                    <JointMobilityTable joints={screeningBySide.left} notesHeader="Notes" />
                  </Card>
                  <Card>
                    <CardHeader title="Right Side" />
                    <JointMobilityTable joints={screeningBySide.right} notesHeader="Notes" />
                  </Card>
                </div>
              )}

              <HideBarChartsForMiddleSchool>
                {screeningSymmetryIndex.length > 0 && (
                  <Card>
                    <BarChart
                      labels={screeningSymmetryIndex.map((entry) => entry.joint)}
                      datasets={[
                        {
                          label: "Left (°)",
                          data: screeningSymmetryIndex.map((entry) => entry.left),
                          color: brandColors.black,
                        },
                        {
                          label: "Right (°)",
                          data: screeningSymmetryIndex.map((entry) => entry.right),
                          color: brandColors.red,
                        },
                      ]}
                      height={300}
                      yAxisLabel="Degrees (°)"
                      valueSuffix="°"
                    />
                  </Card>
                )}
              </HideBarChartsForMiddleSchool>

              {screeningSessionNote && (
                <Card padding="lg">
                  <p className="text-xs font-bold uppercase tracking-wider text-pkp-gray-400">
                    Screening Summary
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-pkp-gray-700">
                    {screeningSessionNote}
                  </p>
                </Card>
              )}
            </div>
          )}
        </ReportSection>
      )}

      <footer className="border-t border-pkp-gray-200 pt-6 text-center print:pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pkp-gray-400">
          Peak Kinetic Performance
        </p>
        <p className="mt-1 text-xs text-pkp-gray-400">
          Assessment report for {athlete.firstName} {athlete.lastName} · {activeAssessment.date}
        </p>
      </footer>
    </article>
  );
}
