"use client";

import Link from "next/link";
import type { AssessmentModuleId } from "@/types";
import { Card } from "@/components/ui/Card";
import { useAssessment } from "@/context/AssessmentContext";

interface AssessmentModuleGuardProps {
  moduleId: AssessmentModuleId;
  children: React.ReactNode;
}

export function AssessmentModuleGuard({ moduleId, children }: AssessmentModuleGuardProps) {
  const { includesModule, classification } = useAssessment();

  if (includesModule(moduleId)) {
    return children;
  }

  return (
    <Card accent className="border-dashed">
      <p className="pkp-section-label">Not Included</p>
      <h3 className="mt-2 text-lg font-bold text-pkp-black">Module not part of this assessment</h3>
      <p className="mt-2 max-w-xl text-sm text-pkp-gray-500">
        The active assessment classification ({classification.label}) does not include this section.
        Start or switch to a different assessment type to view these results.
      </p>
      <Link
        href="/dashboard/assessments"
        className="mt-4 inline-flex rounded-lg bg-pkp-red px-4 py-2 text-sm font-bold text-white hover:opacity-90"
      >
        Manage Assessments
      </Link>
    </Card>
  );
}
