"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CoachLoginForm } from "@/components/auth/CoachLoginForm";
import { Logo } from "@/components/ui/Logo";
import { useCoachAuth } from "@/context/CoachAuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useCoachAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/coach");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pkp-gray-50">
        <p className="text-sm font-medium text-pkp-gray-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pkp-gray-50">
      <header className="border-b border-pkp-gray-200 bg-pkp-black">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-8">
          <Logo size="sm" showSubtitle={false} href="/login" variant="dark" />
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-pkp-red">
            Coach Portal
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-16">
        <div className="mb-8 text-center">
          <p className="pkp-section-label text-pkp-red">Peak Kinetic Performance</p>
          <h1 className="mt-2 text-2xl font-bold text-pkp-black md:text-3xl">Coach Login</h1>
          <p className="mt-2 text-sm text-pkp-gray-500">
            Sign in with your PKP coach email and password.
          </p>
        </div>
        <CoachLoginForm />
      </main>
    </div>
  );
}
