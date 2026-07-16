"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getNavIcon, getNavItemsForClassification } from "./navConfig";
import { useCoachSession } from "@/context/CoachSessionContext";

export function MobileNav() {
  const pathname = usePathname();
  const { classification } = useCoachSession();
  const visibleNavItems = classification
    ? getNavItemsForClassification(classification.modules).filter(
        (item) => item.moduleId !== "assessments"
      )
    : [];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-pkp-black lg:hidden print:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {visibleNavItems.slice(0, 5).map((item) => {
          const Icon = getNavIcon(item.icon);
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 transition-colors",
                isActive ? "text-pkp-red" : "text-white/45"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-semibold leading-none">
                {item.label.split(" ")[0]}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
