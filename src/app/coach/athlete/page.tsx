import { Suspense } from "react";
import { AthleteSessionForm } from "@/components/coach/AthleteSessionForm";

export default function CoachAthletePage() {
  return (
    <Suspense
      fallback={<p className="text-sm text-pkp-gray-500">Loading assessment setup…</p>}
    >
      <AthleteSessionForm />
    </Suspense>
  );
}
