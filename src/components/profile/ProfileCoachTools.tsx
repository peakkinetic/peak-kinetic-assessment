"use client";

import { ProfilePhotoEditor } from "@/components/profile/ProfilePhotoEditor";
import { ProfileDetailsEditor } from "@/components/profile/ProfileDetailsEditor";
import { ProfileAssessmentCoachEditor } from "@/components/profile/ProfileAssessmentCoachEditor";

export function ProfileCoachTools() {
  return (
    <details className="print:hidden mb-8 rounded-xl border border-pkp-gray-200 bg-white">
      <summary className="cursor-pointer list-none px-5 py-4 text-sm font-bold uppercase tracking-wide text-pkp-gray-600 marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-3">
          Coach Tools — update photo, coach &amp; athlete details
          <span className="text-xs font-semibold normal-case tracking-normal text-pkp-gray-400">
            Click to expand
          </span>
        </span>
      </summary>
      <div className="space-y-6 border-t border-pkp-gray-100 px-5 py-5">
        <ProfileAssessmentCoachEditor />
        <ProfilePhotoEditor />
        <ProfileDetailsEditor />
      </div>
    </details>
  );
}
