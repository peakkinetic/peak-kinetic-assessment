"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ActiveAssessmentPanel } from "@/components/assessment/ActiveAssessmentPanel";
import { useCoachSession } from "@/context/CoachSessionContext";
import { assessmentClassifications } from "@/data/assessmentClassifications";

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

export default function AssessmentsPage() {
  const { assessments, activeAssessment, setActiveAssessmentId, athlete } = useCoachSession();

  return (
    <>
      <PageHeader
        title="Session History"
        subtitle={`Past assessments for ${athlete?.firstName} ${athlete?.lastName}`}
        badge={<Badge variant="black">Coach Use Only</Badge>}
        action={
          <Link
            href="/coach"
            className="inline-flex items-center gap-2 rounded-lg bg-pkp-red px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-pkp-red-dark"
          >
            <Plus className="h-3.5 w-3.5" />
            New Assessment
          </Link>
        }
      />

      <ActiveAssessmentPanel />

      <Card accent className="mt-8">
        <CardHeader
          title="Athlete Assessment History"
          subtitle="Each session is saved with its assessment type and athlete"
        />
        <div className="space-y-2">
          {assessments.map((assessment) => {
            const isActive = assessment.id === activeAssessment?.id;
            const itemClassification = assessmentClassifications.find(
              (item) => item.id === assessment.classificationId
            );

            return (
              <button
                key={assessment.id}
                type="button"
                onClick={() => setActiveAssessmentId(assessment.id)}
                className={`flex w-full flex-col gap-2 rounded-lg border px-4 py-3 text-left transition-colors ${
                  isActive
                    ? "border-pkp-red bg-pkp-red-muted"
                    : "border-pkp-gray-200 bg-white hover:border-pkp-gray-300 hover:bg-pkp-gray-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-pkp-black">{assessment.label}</p>
                  {isActive && (
                    <span className="shrink-0 rounded-full bg-pkp-red px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-pkp-gray-500">
                  {itemClassification?.label} · {assessment.date}
                </p>
                <Badge variant={statusVariant[assessment.status]} className="w-fit">
                  {statusLabel[assessment.status]}
                </Badge>
              </button>
            );
          })}
        </div>
      </Card>
    </>
  );
}
