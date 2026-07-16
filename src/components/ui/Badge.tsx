import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "red" | "black" | "success" | "warning" | "info";
  className?: string;
}

const variantMap = {
  default: "bg-pkp-gray-100 text-pkp-gray-700 border-pkp-gray-200",
  red: "bg-pkp-red-muted text-pkp-red border-pkp-red/20",
  black: "bg-pkp-black text-white border-pkp-black",
  success: "bg-emerald-50 text-emerald-800 border-emerald-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  info: "bg-pkp-gray-100 text-pkp-black border-pkp-gray-300",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        variantMap[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
