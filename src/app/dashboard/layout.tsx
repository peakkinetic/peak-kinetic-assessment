import { DashboardShell } from "@/components/layout/DashboardShell";
import { AthleteProfileProvider } from "@/context/AthleteProfileContext";
import { CoachSessionGuard } from "@/components/coach/CoachSessionGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AthleteProfileProvider>
      <CoachSessionGuard>
        <DashboardShell>{children}</DashboardShell>
      </CoachSessionGuard>
    </AthleteProfileProvider>
  );
}
