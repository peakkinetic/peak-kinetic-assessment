"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCoachAuth } from "@/context/CoachAuthContext";

export function CoachAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useCoachAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pkp-gray-50">
        <p className="text-sm font-medium text-pkp-gray-500">Checking coach sign-in…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
