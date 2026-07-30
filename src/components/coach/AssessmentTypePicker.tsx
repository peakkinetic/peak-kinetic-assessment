"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  assessmentClassificationGroupOrder,
  assessmentClassificationGroups,
  assessmentClassifications,
} from "@/data/assessmentClassifications";
import { useCoachSession } from "@/context/CoachSessionContext";
import { performanceTestLabels } from "@/lib/assessmentAccess";
import type { AssessmentModuleId } from "@/types";

const moduleLabels: Record<AssessmentModuleId, string> = {
  profile: "Profile",
  "movement-screen": "Movement",
  "screening-mobility": "Mobility",
  "performance-testing": "Performance",
  "hittrax-testing": "Hittrax",
  "blast-testing": "Blast",
  "progress-tracking": "Progress",
  "coach-report": "Coach Report",
};

export function AssessmentTypePicker() {
  const router = useRouter();
  const { setPendingClassificationId, isSupabaseConnected } = useCoachSession();

  return (
    <div>
      {!isSupabaseConnected && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Running in local demo mode. Add Supabase credentials to `.env.local` to save athletes and
          assessments to the cloud.
        </div>
      )}

      <div className="mb-8">
        <p className="pkp-section-label">Step 1 of 2</p>
        <h1 className="mt-2 text-2xl font-bold text-pkp-black md:text-3xl">
          Choose Assessment Type
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-pkp-gray-500 md:text-base">
          Select the protocol you need to run. Next, you&apos;ll add or select the athlete for this
          session.
        </p>
      </div>

      <div className="space-y-8">
        {assessmentClassificationGroupOrder.map((groupId) => {
          const group = assessmentClassificationGroups[groupId];
          const items = assessmentClassifications.filter((item) => item.group === groupId);

          return (
            <section key={groupId}>
              <div className="mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wide text-pkp-black">
                  {group.label}
                </h2>
                <p className="text-xs text-pkp-gray-500">{group.description}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setPendingClassificationId(item.id);
                      router.push(`/coach/athlete?classification=${item.id}`);
                    }}
                    className="group text-left"
                  >
                    <Card
                      padding="sm"
                      hover
                      className="flex h-full flex-col transition-colors group-hover:border-pkp-red/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-sm font-bold text-pkp-black">{item.label}</h3>
                        <ArrowRight className="h-4 w-4 shrink-0 text-pkp-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-pkp-red" />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-pkp-gray-500 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.modules.slice(0, 4).map((moduleId) => (
                          <Badge key={moduleId} variant="default" className="text-[10px]">
                            {moduleLabels[moduleId]}
                          </Badge>
                        ))}
                        {item.modules.length > 4 && (
                          <Badge variant="default" className="text-[10px]">
                            +{item.modules.length - 4}
                          </Badge>
                        )}
                      </div>
                      {item.performanceTests && (
                        <p className="mt-2 text-xs text-pkp-gray-500">
                          {item.performanceTests.map((id) => performanceTestLabels[id]).join(" · ")}
                        </p>
                      )}
                    </Card>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
