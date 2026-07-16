"use client";

import { brandColors } from "@/lib/brandColors";
import { cn } from "@/lib/utils";

interface MetricRingProps {
  value: number;
  max?: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function MetricRing({
  value,
  max = 100,
  label,
  size = 120,
  strokeWidth = 8,
  className,
}: MetricRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((value / max) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f5f5f5"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={brandColors.red}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-pkp-black">{Math.round(percentage)}</span>
        </div>
      </div>
      <span className="mt-2 text-xs font-medium text-pkp-gray-500">{label}</span>
    </div>
  );
}
