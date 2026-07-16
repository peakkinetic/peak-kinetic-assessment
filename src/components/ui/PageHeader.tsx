import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, badge, action, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        <div className="mb-3 flex items-center gap-3">
          <div className="pkp-accent-bar" />
          <p className="pkp-section-label">Peak Kinetic Performance</p>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
          {badge}
        </div>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-pkp-gray-500 md:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
