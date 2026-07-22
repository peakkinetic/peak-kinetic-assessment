import { DashboardShell } from "@/components/layout/DashboardShell";
import { AthleteProfileProvider } from "@/context/AthleteProfileContext";
import { CoachAuthGuard } from "@/components/auth/CoachAuthGuard";
import { CoachSessionGuard } from "@/components/coach/CoachSessionGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <CoachAuthGuard>
      <AthleteProfileProvider>
        <CoachSessionGuard>
          <DashboardShell>{children}</DashboardShell>
        </CoachSessionGuard>
      </AthleteProfileProvider>
    </CoachAuthGuard>
  );
}
