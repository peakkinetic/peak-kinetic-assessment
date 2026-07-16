"use client";

import { getNationalComparisonFromMetrics } from "@/lib/normComparison";
import { Badge } from "@/components/ui/Badge";
import { AthleteAvatar } from "@/components/ui/AthleteAvatar";
import { useCoachSession } from "@/context/CoachSessionContext";

export function AthleteHeader() {
  const { athlete, classification, includesModule, performanceMetrics } = useCoachSession();

  if (!athlete || !classification) return null;

  const comparison = includesModule("performance-testing")
    ? getNationalComparisonFromMetrics(
        performanceMetrics,
        athlete.gender,
        classification.id
      )
    : null;

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-pkp-gray-200 bg-pkp-black shadow-[var(--shadow-card)]">
      <div className="h-1 bg-pkp-red" />
      <div className="flex items-center gap-4 p-4 md:p-5">
        <AthleteAvatar />
        <div className="min-w-0 flex-1">
          <p className="pkp-section-label text-pkp-red">Active Athlete</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-white md:text-xl">
              {athlete.firstName} {athlete.lastName}
            </h2>
            {athlete.jerseyNumber > 0 && (
              <Badge variant="red" className="border-pkp-red/30 bg-pkp-red/20 text-white">
                #{athlete.jerseyNumber}
              </Badge>
            )}
            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/90">
              {athlete.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-white/60">
            {athlete.position} · {athlete.sport} · {athlete.team} · {athlete.gender}
          </p>
        </div>
        {comparison && comparison.comparisons.length > 0 && (
          <div className="hidden rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-right md:block">
            <p className="text-3xl font-bold tabular-nums text-pkp-red">{comparison.averageTierScore}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
              Benchmark Score
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
