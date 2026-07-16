"use client";

import { Card, CardHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { NationalRankProgressChart } from "@/components/progress/NationalRankProgressChart";
import { useCoachSession } from "@/context/CoachSessionContext";

export function ProgressTrackingContent() {
  const { activePerformanceTests, progressTrackingMetrics, progressMilestones } =
    useCoachSession();

  if (activePerformanceTests.length === 0) {
    return (
      <p className="text-sm text-pkp-gray-500">
        Progress tracking is not available for this assessment classification.
      </p>
    );
  }

  if (progressTrackingMetrics.length === 0) {
    return (
      <p className="text-sm text-pkp-gray-500">
        No performance scores saved yet. Enter results on the Performance Testing page to track
        progress here.
      </p>
    );
  }

  return (
    <>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {progressTrackingMetrics.map((metric) => {
          const lowerIsBetter = metric.unit === "s";
          const progress = lowerIsBetter
            ? Math.min((metric.target / metric.current) * 100, 100)
            : Math.min((metric.current / metric.target) * 100, 100);
          const improved = lowerIsBetter
            ? metric.current < metric.previous
            : metric.current > metric.previous;

          return (
            <Card key={metric.metric} padding="sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{metric.metric}</p>
                <Badge variant={improved ? "success" : "warning"}>
                  {improved ? "Improving" : "Monitor"}
                </Badge>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold">{metric.current}</span>
                <span className="text-xs text-pkp-gray-400">{metric.unit}</span>
                <span className="ml-auto text-xs text-pkp-gray-400">
                  Target: {metric.target}
                </span>
              </div>
              <p className="mt-1 text-xs text-pkp-gray-500">
                Previous: {metric.previous} {metric.unit}
              </p>
              <ProgressBar
                value={Math.min(progress, 100)}
                className="mt-3"
                color="red"
                showValue={false}
              />
            </Card>
          );
        })}
      </div>

      <NationalRankProgressChart />

      <Card>
        <CardHeader title="Recent Milestones" subtitle="Saved scores across assessment sessions" />
        <div className="space-y-3">
          {progressMilestones.length === 0 ? (
            <p className="text-sm text-pkp-gray-500">No milestones recorded for the active tests yet.</p>
          ) : (
            progressMilestones.map((milestone) => (
              <div
                key={`${milestone.date}-${milestone.metric}`}
                className="flex items-center justify-between rounded-xl bg-pkp-gray-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold">{milestone.metric}</p>
                  <p className="text-xs text-pkp-gray-400">{milestone.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-pkp-black">{milestone.value}</p>
                  <p className="text-xs text-pkp-gray-400">/ {milestone.target} target</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </>
  );
}
