"use client";

import { CoachSessionProvider } from "@/context/CoachSessionContext";
import { CoachAuthProvider } from "@/context/CoachAuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CoachAuthProvider>
      <CoachSessionProvider>{children}</CoachSessionProvider>
    </CoachAuthProvider>
  );
}
