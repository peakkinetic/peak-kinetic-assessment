"use client";

import { CoachSessionProvider } from "@/context/CoachSessionContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <CoachSessionProvider>{children}</CoachSessionProvider>;
}
