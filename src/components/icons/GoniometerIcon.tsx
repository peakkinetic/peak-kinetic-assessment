import { cn } from "@/lib/utils";

interface GoniometerIconProps {
  className?: string;
}

export function GoniometerIcon({ className }: GoniometerIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
      aria-hidden="true"
    >
      <path d="M4 20c6-1 10-5 11-11" />
      <path d="M4 20V9" />
      <path d="M4 9h11" />
      <path d="M7.5 20 15 4.5" />
      <circle cx="4" cy="20" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="15" cy="4.5" r="1.25" fill="currentColor" stroke="none" />
      <path d="M6.5 16.5c2-2.5 4.5-4 7.5-4.5" />
    </svg>
  );
}
