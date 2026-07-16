"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAthleteProfile } from "@/context/AthleteProfileContext";
import { useCoachSession } from "@/context/CoachSessionContext";

interface AthleteAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-10 w-10 rounded-xl text-sm",
  md: "h-14 w-14 rounded-2xl text-lg md:h-16 md:w-16 md:text-xl",
  lg: "h-24 w-24 rounded-3xl text-2xl md:h-28 md:w-28 md:text-3xl",
};

export function AthleteAvatar({ size = "md", className }: AthleteAvatarProps) {
  const { profilePhotoUrl } = useAthleteProfile();
  const { athlete } = useCoachSession();

  if (!athlete) return null;

  if (profilePhotoUrl) {
    return (
      <div
        className={cn(
          "relative flex-shrink-0 overflow-hidden border border-pkp-gray-200 bg-pkp-gray-100",
          sizeClasses[size],
          className
        )}
      >
        <Image
          src={profilePhotoUrl}
          alt={`${athlete.firstName} ${athlete.lastName} profile photo`}
          fill
          unoptimized
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-shrink-0 items-center justify-center bg-pkp-black font-bold text-white",
        sizeClasses[size],
        className
      )}
    >
      {athlete.headshotInitials}
    </div>
  );
}
