"use client";

import { StatCard } from "@/components/ui/StatCard";
import type { MetricItem } from "@/types";

export function HittingTestMetrics({
  metrics,
  emptyMessage,
}: {
  metrics: MetricItem[];
  emptyMessage: string;
}) {
  if (metrics.length === 0) {
    return <p className="mb-4 text-sm text-pkp-gray-500">{emptyMessage}</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <StatCard key={metric.label} {...metric} />
      ))}
    </div>
  );
}
