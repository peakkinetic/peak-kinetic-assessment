"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAssessment } from "@/context/AssessmentContext";
import { getModuleHref, performanceTestLabels } from "@/lib/assessmentAccess";
import type { AssessmentModuleId } from "@/types";

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

const moduleLabels: Record<AssessmentModuleId, string> = {
  profile: "Athlete Profile",
  "movement-screen": "Movement Screen",
  "screening-mobility": "Screening Mobility",
  "performance-testing": "Performance Testing",
  "hittrax-testing": "Hittrax Testing",
  "blast-testing": "Blast Testing",
  "progress-tracking": "Progress Tracking",
  "coach-report": "Coach Report",
};

export function ActiveAssessmentPanel() {
  const {
    assessments,
    activeAssessment,
    classification,
    setActiveAssessmentId,
  } = useAssessment();

  return (
    <Card accent padding="sm" className="mb-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 shrink-0 text-pkp-red" />
            <p className="pkp-section-label">Active Assessment</p>
          </div>
          <p className="mt-2 text-xl font-bold text-pkp-black">{activeAssessment.label}</p>
          <p className="mt-1 text-sm text-pkp-gray-500">
            {classification.label} · {activeAssessment.date} · {activeAssessment.coach}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
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
        </div>

        <div className="w-full shrink-0 lg:w-72">
          <label
            htmlFor="active-assessment-select"
            className="text-[11px] font-bold uppercase tracking-[0.14em] text-pkp-gray-500"
          >
            Switch Assessment
          </label>
          <select
            id="active-assessment-select"
            value={activeAssessment.id}
            onChange={(event) => setActiveAssessmentId(event.target.value)}
            className="mt-2 w-full rounded-lg border border-pkp-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-pkp-black outline-none ring-pkp-red/20 focus:border-pkp-red focus:ring-2"
          >
            {assessments.map((assessment) => (
              <option key={assessment.id} value={assessment.id}>
                {assessment.label} ({assessment.date})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 border-t border-pkp-gray-100 pt-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-pkp-gray-500">
          Included Modules
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {classification.modules.map((moduleId) => (
            <Link
              key={moduleId}
              href={getModuleHref(moduleId)}
              className="group flex items-center justify-between rounded-lg border border-pkp-gray-200 bg-pkp-gray-50 px-3 py-2.5 text-sm font-semibold text-pkp-black transition-colors hover:border-pkp-red hover:bg-white"
            >
              <span>{moduleLabels[moduleId]}</span>
              <ArrowRight className="h-3.5 w-3.5 text-pkp-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-pkp-red" />
            </Link>
          ))}
        </div>
      </div>
    </Card>
  );
}
