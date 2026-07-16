import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  className?: string;
  href?: string;
  variant?: "light" | "dark";
}

const sizeMap = {
  sm: { width: 88, height: 36, subtitle: false },
  md: { width: 112, height: 44, subtitle: true },
  lg: { width: 140, height: 56, subtitle: true },
};

export function Logo({
  size = "md",
  showSubtitle = true,
  className,
  href,
  variant = "light",
}: LogoProps) {
  const { width, height, subtitle } = sizeMap[size];
  const isDark = variant === "dark";

  const content = (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src="/pkp-logo.png"
        alt="Peak Kinetic Performance"
        width={width}
        height={height}
        className={cn(
          "block h-auto w-auto object-contain",
          isDark && "brightness-0 invert"
        )}
        priority
      />
      {showSubtitle && subtitle && (
        <div className="min-w-0 border-l border-pkp-red pl-3">
          <p
            className={cn(
              "text-[10px] font-bold uppercase tracking-[0.22em]",
              isDark ? "text-white/60" : "text-pkp-gray-500"
            )}
          >
            Performance
          </p>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
