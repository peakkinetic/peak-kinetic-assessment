import { CoachFlowShell } from "@/components/coach/CoachFlowShell";
import { CoachAuthGuard } from "@/components/auth/CoachAuthGuard";

export default function CoachLayout({ children }: { children: React.ReactNode }) {
  return (
    <CoachAuthGuard>
      <CoachFlowShell>{children}</CoachFlowShell>
    </CoachAuthGuard>
  );
}
