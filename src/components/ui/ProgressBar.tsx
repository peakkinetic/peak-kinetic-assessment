import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "red" | "black" | "amber" | "emerald";
  animated?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-3.5",
};

const colorMap = {
  red: "bg-pkp-red",
  black: "bg-pkp-black",
  amber: "bg-amber-400",
  emerald: "bg-emerald-500",
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  size = "md",
  color = "red",
  animated = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between text-sm">
          {label && <span className="font-medium text-pkp-gray-700">{label}</span>}
          {showValue && (
            <span className="tabular-nums text-pkp-gray-500">
              {max === 3 ? `${value}/${max}` : `${Math.round(percentage)}%`}
            </span>
          )}
        </div>
      )}
      <div className={cn("w-full overflow-hidden rounded-full bg-pkp-gray-100", sizeMap[size])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            colorMap[color],
            animated && "animate-progress"
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
