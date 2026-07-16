"use client";

import { Card, CardHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { DataTable, AssessmentScoreBadge, AssessmentScoreLegend } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { BarChart } from "@/components/charts/BarChart";
import { HideBarChartsForMiddleSchool } from "@/components/assessment/HideBarChartsForMiddleSchool";
import { useCoachSession } from "@/context/CoachSessionContext";
import {
  buildMovementPatterns,
  getFlaggedMovementAreas,
  getOverallMovementScore,
} from "@/lib/movementMetrics";
import {
  getAssessmentProgressColor,
  getAssessmentRatingLabel,
  getAssessmentRiskLabel,
  isScoredAssessment,
} from "@/lib/utils";

export function MovementScreenContent() {
  const { movementScores } = useCoachSession();
  const movementPatterns = buildMovementPatterns(movementScores);
  const { average: overallScore } = getOverallMovementScore(movementScores);
  const flaggedAreas = getFlaggedMovementAreas(movementScores);
  const scoredPatterns = movementPatterns.filter((pattern) => isScoredAssessment(pattern.score));
  const hasScores = movementScores.some((score) => isScoredAssessment(score.score));

  return (
    <>
      <AssessmentScoreLegend className="mb-6" />

      {!hasScores && (
        <p className="mb-6 text-sm text-pkp-gray-500">
          No movement scores entered yet. Use the form above to score each movement pattern.
        </p>
      )}

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Assessment Scores"
            subtitle={`1 = Bad · 2 = Moderate · 3 = Good · Avg: ${overallScore}/3`}
          />
          <DataTable
            headers={["Movement", "Score", "Rating", "Notes"]}
            rows={movementScores.map((score) => [
              score.category,
              <AssessmentScoreBadge key={`${score.category}-score`} score={score.score} showLabel={false} />,
              getAssessmentRatingLabel(score.score),
              <span key={`${score.category}-notes`} className="text-pkp-gray-500">
                {score.notes || "—"}
              </span>,
            ])}
          />
        </Card>

        <HideBarChartsForMiddleSchool>
          {scoredPatterns.length > 0 && (
            <Card>
              <CardHeader
                title="Movement Patterns"
                subtitle="Each pattern mirrors its assessment score (1–3 scale)"
              />
              <BarChart
                labels={scoredPatterns.map((pattern) => pattern.pattern)}
                datasets={[
                  {
                    label: "Assessment Score",
                    data: scoredPatterns.map((pattern) => pattern.score as number),
                  },
                ]}
                height={300}
                maxValue={3}
                colorByScore
              />
            </Card>
          )}
        </HideBarChartsForMiddleSchool>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {movementPatterns.map((pattern) => (
          <Card key={pattern.pattern} padding="sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold">{pattern.pattern}</span>
              <AssessmentScoreBadge score={pattern.score} showLabel={false} />
            </div>
            {pattern.notes && <p className="mt-2 text-xs text-pkp-gray-500">{pattern.notes}</p>}
            {isScoredAssessment(pattern.score) ? (
              <>
                <ProgressBar
                  value={pattern.score}
                  max={3}
                  label={getAssessmentRatingLabel(pattern.score)}
                  className="mt-3"
                  color={getAssessmentProgressColor(pattern.score)}
                />
                <div className="mt-3">
                  <Badge
                    variant={
                      pattern.score === 3 ? "success" : pattern.score === 2 ? "warning" : "red"
                    }
                  >
                    {getAssessmentRiskLabel(pattern.score)} Risk
                  </Badge>
                </div>
              </>
            ) : (
              <p className="mt-3 text-xs font-medium text-pkp-gray-500">Not assessed this session</p>
            )}
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <Card>
          <CardHeader title="Flagged Areas" subtitle="Assessments scored below 2 (Bad)" />
          <div className="space-y-4">
            {flaggedAreas.length === 0 ? (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-sm text-emerald-700">
                No areas flagged. All assessments scored moderate or good.
              </div>
            ) : (
              flaggedAreas.map((area) => (
                <div key={area.area} className="rounded-xl border border-red-100 bg-red-50/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-semibold text-pkp-black">{area.area}</h4>
                    <AssessmentScoreBadge score={area.score} />
                  </div>
                  <p className="mt-2 text-sm text-pkp-gray-600">{area.recommendation}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
