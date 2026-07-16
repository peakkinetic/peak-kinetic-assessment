import { CoachFlowShell } from "@/components/coach/CoachFlowShell";

export default function CoachLayout({ children }: { children: React.ReactNode }) {
  return <CoachFlowShell>{children}</CoachFlowShell>;
}
