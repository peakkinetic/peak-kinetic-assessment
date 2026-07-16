import { cn } from "@/lib/utils";
import { getCoachTraitColor, getCoachTraitLabel } from "@/lib/coachGrades";
import type { CoachTraitRating } from "@/types";

interface CoachTraitGradeBarProps {
  trait: string;
  score: CoachTraitRating;
  description: string;
  className?: string;
}

export function CoachTraitGradeBar({ trait, score, description, className }: CoachTraitGradeBarProps) {
  return (
    <div className={cn("rounded-xl border border-pkp-gray-100 bg-white p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-pkp-black">{trait}</p>
          <p className="mt-0.5 text-xs text-pkp-gray-500">{description}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums text-pkp-black">{score}</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-pkp-gray-400">/ 5</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <div key={value} className="flex-1">
            <div
              className={cn(
                "h-2 rounded-full transition-colors",
                value <= score ? getCoachTraitColor(score) : "bg-pkp-gray-100"
              )}
            />
            <p
              className={cn(
                "mt-1 text-center text-[10px] font-medium",
                value === score ? "text-pkp-black" : "text-pkp-gray-400"
              )}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs font-semibold text-pkp-gray-600">{getCoachTraitLabel(score)}</p>
    </div>
  );
}
