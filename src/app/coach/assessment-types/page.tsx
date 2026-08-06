import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AssessmentTypesEditor } from "@/components/assessment/AssessmentTypesEditor";

export default function AssessmentTypesPage() {
  return (
    <div>
      <Link
        href="/coach"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-pkp-gray-500 hover:text-pkp-black"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to assessment types
      </Link>

      <div className="mb-8">
        <p className="pkp-section-label">Coach Settings</p>
        <h1 className="mt-2 text-2xl font-bold text-pkp-black md:text-3xl">Assessment Types</h1>
        <p className="mt-2 max-w-2xl text-sm text-pkp-gray-500 md:text-base">
          Edit display names and descriptions shown when coaches pick an assessment. Use reset to
          restore the built-in defaults.
        </p>
      </div>

      <AssessmentTypesEditor />
    </div>
  );
}
