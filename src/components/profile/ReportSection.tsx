"use client";

import { ReactNode } from "react";

interface ReportSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function ReportSection({ title, subtitle, children, className }: ReportSectionProps) {
  return (
    <section className={className}>
      <div className="mb-5 flex items-start gap-3">
        <div className="mt-1 h-8 w-1 shrink-0 rounded-full bg-pkp-red" />
        <div>
          <h2 className="text-lg font-bold text-pkp-black md:text-xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-pkp-gray-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}
