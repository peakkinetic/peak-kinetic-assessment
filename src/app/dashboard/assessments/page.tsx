"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ActiveAssessmentPanel } from "@/components/assessment/ActiveAssessmentPanel";
import { AssessmentHistoryList } from "@/components/assessment/AssessmentHistoryList";
import { useCoachSession } from "@/context/CoachSessionContext";

export default function AssessmentsPage() {
  const { athlete } = useCoachSession();

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
          subtitle="Edit session labels and status, or delete sessions you no longer need"
        />
        <AssessmentHistoryList />
      </Card>
    </>
  );
}
