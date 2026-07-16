"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { AthleteAvatar } from "@/components/ui/AthleteAvatar";
import { useCoachSession } from "@/context/CoachSessionContext";
import { getNavIcon, getNavItemsForClassification } from "./navConfig";

export function Sidebar() {
  const pathname = usePathname();
  const { classification, athlete } = useCoachSession();
  const visibleNavItems = classification
    ? getNavItemsForClassification(classification.modules)
    : [];

  return (
    <aside className="hidden h-screen w-64 flex-shrink-0 flex-col bg-pkp-black lg:flex print:hidden">
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <Logo size="md" href="/dashboard/athlete-profile" variant="dark" />
      </div>

      <div className="px-5 py-4">
        <p className="pkp-section-label text-white/50">Coach Portal</p>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {visibleNavItems.map((item) => {
          const Icon = getNavIcon(item.icon);
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-pkp-red text-white shadow-[var(--shadow-brand)]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px] flex-shrink-0",
                  isActive ? "text-white" : "text-white/40 group-hover:text-white/80"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
          <AthleteAvatar size="sm" />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white">
              {athlete?.firstName} {athlete?.lastName}
            </p>
            <p className="truncate text-[11px] text-white/50">
              {athlete?.position} · #{athlete?.jerseyNumber}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
