"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { AthleteReport, PrintReportButton } from "@/components/profile/AthleteReport";
import { ProfileCoachTools } from "@/components/profile/ProfileCoachTools";
import { ProfileDeleteAthleteSection } from "@/components/profile/ProfileDeleteAthleteSection";
import { AssessmentModuleGuard } from "@/components/assessment/AssessmentModuleGuard";
import { useCoachSession } from "@/context/CoachSessionContext";

export default function AthleteProfilePage() {
  const { athlete } = useCoachSession();

  if (!athlete) return null;

  return (
    <>
      <PageHeader
        title="Athlete Profile"
        subtitle="Complete assessment report — share with athletes, parents, and agents"
        badge={<Badge variant="black">PKP Report</Badge>}
        action={<PrintReportButton />}
        className="print:hidden"
      />

      <AssessmentModuleGuard moduleId="profile">
        <ProfileCoachTools />
        <AthleteReport />
        <div className="print:hidden mt-10">
          <ProfileDeleteAthleteSection />
        </div>
      </AssessmentModuleGuard>
    </>
  );
}
