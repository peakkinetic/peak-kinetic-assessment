import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
  accent?: boolean;
}

const paddingMap = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ children, className, hover = false, padding = "md", accent = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-pkp-gray-200 bg-white shadow-[var(--shadow-card)]",
        accent && "pkp-card-accent",
        hover && "transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]",
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div
      className={cn(
        "mb-5 flex flex-col gap-3 border-b border-pkp-gray-100 pb-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-bold tracking-tight">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-pkp-gray-500">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 self-start sm:self-center">{action}</div>}
    </div>
  );
}
