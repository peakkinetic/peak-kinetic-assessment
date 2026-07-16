"use client";

import { ClipboardList } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAssessment } from "@/context/AssessmentContext";

import { performanceTestLabels } from "@/lib/assessmentAccess";

const statusVariant = {
  scheduled: "warning",
  "in-progress": "red",
  complete: "success",
} as const;

const statusLabel = {
  scheduled: "Scheduled",
  "in-progress": "In Progress",
  complete: "Complete",
} as const;

export function AssessmentSelector() {
  const {
    assessments,
    activeAssessment,
    classification,
    setActiveAssessmentId,
  } = useAssessment();

  return (
    <Card padding="sm" className="mb-6 border-pkp-gray-200 bg-white">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-pkp-red" />
            <p className="pkp-section-label">Active Assessment</p>
          </div>
          <p className="mt-2 text-lg font-bold text-pkp-black">{activeAssessment.label}</p>
          <p className="mt-1 text-sm text-pkp-gray-500">
            {classification.label} · {activeAssessment.date}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[280px]">
          <label htmlFor="assessment-select" className="text-[11px] font-bold uppercase tracking-[0.14em] text-pkp-gray-500">
            Switch Assessment
          </label>
          <select
            id="assessment-select"
            value={activeAssessment.id}
            onChange={(event) => setActiveAssessmentId(event.target.value)}
            className="rounded-lg border border-pkp-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-pkp-black outline-none ring-pkp-red/20 focus:border-pkp-red focus:ring-2"
          >
            {assessments.map((assessment) => (
              <option key={assessment.id} value={assessment.id}>
                {assessment.label} ({assessment.date})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="black">{classification.label}</Badge>
        <Badge variant={statusVariant[activeAssessment.status]}>
          {statusLabel[activeAssessment.status]}
        </Badge>
        {classification.performanceTests?.map((testId) => (
          <Badge key={testId} variant="default">
            {performanceTestLabels[testId]}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
