"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { AssessmentSelector } from "@/components/assessment/AssessmentSelector";
import { SavedDataStatus } from "@/components/coach/SavedDataStatus";
import { getNavIcon, getNavItemsForClassification } from "./navConfig";
import { useCoachSession } from "@/context/CoachSessionContext";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { classification, endSession } = useCoachSession();
  const visibleNavItems = classification
    ? getNavItemsForClassification(classification.modules)
    : [];
  const showAssessmentSelector = pathname !== "/dashboard/assessments";

  return (
    <div className="flex min-h-screen bg-pkp-gray-50">
      <Sidebar />

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-pkp-black/60" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-pkp-black shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
              <Logo size="sm" showSubtitle={false} href="/dashboard/athlete-profile" variant="dark" />
              <button
                onClick={() => setMenuOpen(false)}
                className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-0.5 p-3">
              {visibleNavItems.map((item) => {
                const Icon = getNavIcon(item.icon);
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                      isActive
                        ? "bg-pkp-red text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon className={cn("h-[18px] w-[18px]", isActive ? "text-white" : "text-white/40")} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-pkp-gray-200 bg-white px-4 md:px-8 lg:hidden print:hidden">
          <button
            onClick={() => setMenuOpen(true)}
            className="rounded-lg p-2 text-pkp-black hover:bg-pkp-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Logo size="sm" showSubtitle={false} href="/dashboard/athlete-profile" />
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 md:px-8 md:py-8 lg:pb-8">
          <div className="mx-auto max-w-7xl animate-slide-up">
            <div className="mb-4 flex justify-end print:hidden">
              <button
                type="button"
                onClick={endSession}
                className="inline-flex items-center gap-2 rounded-lg border border-pkp-gray-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-pkp-gray-600 hover:border-pkp-red hover:text-pkp-red"
              >
                <LogOut className="h-3.5 w-3.5" />
                New Session
              </button>
            </div>
            {showAssessmentSelector && <div className="print:hidden"><AssessmentSelector /></div>}
            <div className="print:hidden"><SavedDataStatus /></div>
            {children}
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
