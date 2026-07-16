import { cn, getAssessmentRatingColor, getAssessmentRatingDotColor, getAssessmentRatingLabel } from "@/lib/utils";
import type { AssessmentRating, AssessmentScoreValue } from "@/types";

interface DataTableProps {
  headers: string[];
  rows: (string | number | React.ReactNode)[][];
  className?: string;
}

export function DataTable({ headers, rows, className }: DataTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-pkp-black bg-pkp-gray-50">
            {headers.map((header) => (
              <th
                key={header}
                className="pb-3 pr-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-pkp-black"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-pkp-gray-50 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="py-3.5 pr-4 font-medium text-pkp-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface GradeBadgeProps {
  grade: string;
  className?: string;
}

export function GradeBadge({ grade, className }: GradeBadgeProps) {
  const color =
    grade.startsWith("A")
      ? "bg-emerald-50 text-emerald-700"
      : grade.startsWith("B")
        ? "bg-blue-50 text-blue-700"
        : grade.startsWith("C")
          ? "bg-amber-50 text-amber-700"
          : "bg-red-50 text-pkp-red";

  return (
    <span className={cn("inline-flex rounded-lg px-2.5 py-1 text-xs font-bold", color, className)}>
      {grade}
    </span>
  );
}

interface AssessmentScoreBadgeProps {
  score: AssessmentScoreValue;
  className?: string;
  showLabel?: boolean;
}

export function AssessmentScoreBadge({ score, className, showLabel = true }: AssessmentScoreBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-2.5 py-1 text-xs font-bold",
        getAssessmentRatingColor(score),
        className
      )}
    >
      {score !== "NA" && (
        <span className={cn("h-2 w-2 rounded-full", getAssessmentRatingDotColor(score))} />
      )}
      <span>{score}</span>
      {showLabel && <span className="font-semibold">{getAssessmentRatingLabel(score)}</span>}
    </span>
  );
}

export function AssessmentScoreLegend({ className }: { className?: string }) {
  const items: AssessmentRating[] = [1, 2, 3];

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {items.map((score) => (
        <AssessmentScoreBadge key={score} score={score} />
      ))}
    </div>
  );
}
