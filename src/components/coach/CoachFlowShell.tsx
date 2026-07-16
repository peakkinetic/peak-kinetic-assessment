import { Logo } from "@/components/ui/Logo";

export function CoachFlowShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-pkp-gray-50">
      <header className="border-b border-pkp-gray-200 bg-pkp-black">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-8">
          <Logo size="sm" showSubtitle={false} href="/coach" variant="dark" />
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-pkp-red">
            Coach Portal
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">{children}</main>
    </div>
  );
}
