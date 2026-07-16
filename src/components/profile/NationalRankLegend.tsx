export function NationalRankLegend() {
  return (
    <div className="mt-3 flex flex-wrap gap-3 text-xs text-pkp-gray-500">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-sm bg-pkp-red" />
        Needs Improvement (&lt; 25th)
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-sm bg-[#F59E0B]" />
        Average (25th–49th)
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-sm bg-pkp-black" />
        Good (50th–74th)
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-sm bg-[#10B981]" />
        Elite (75th+)
      </span>
    </div>
  );
}

import type { ReactNode } from "react";

export function NationalRankChartNote({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-xs text-pkp-gray-500">{children}</p>;
}
