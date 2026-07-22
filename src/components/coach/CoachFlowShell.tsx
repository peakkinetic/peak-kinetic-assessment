"use client";

import { LogOut } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useCoachAuth } from "@/context/CoachAuthContext";
import { localStore } from "@/lib/db/local-store";

export function CoachFlowShell({ children }: { children: React.ReactNode }) {
  const { coach, logout } = useCoachAuth();

  async function handleSignOut() {
    localStore.clearSession();
    await logout();
  }

  return (
    <div className="min-h-screen bg-pkp-gray-50">
      <header className="border-b border-pkp-gray-200 bg-pkp-black">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 md:px-8">
          <Logo size="sm" showSubtitle={false} href="/coach" variant="dark" />
          <div className="flex items-center gap-3">
            {coach && (
              <p className="hidden text-xs font-semibold text-white/70 sm:block">
                Signed in as <span className="text-white">{coach.displayName}</span>
              </p>
            )}
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/80 hover:border-pkp-red hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">{children}</main>
    </div>
  );
}
