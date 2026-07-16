"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCoachSession } from "@/context/CoachSessionContext";

export function CoachSessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { athlete, activeAssessment, isLoading } = useCoachSession();

  useEffect(() => {
    if (isLoading) return;

    const onCoachRoute = pathname.startsWith("/coach");
    if (onCoachRoute) return;

    if (!athlete || !activeAssessment) {
      router.replace("/coach");
    }
  }, [athlete, activeAssessment, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-medium text-pkp-gray-500">Loading session…</p>
      </div>
    );
  }

  if (!athlete || !activeAssessment) {
    return null;
  }

  return children;
}
