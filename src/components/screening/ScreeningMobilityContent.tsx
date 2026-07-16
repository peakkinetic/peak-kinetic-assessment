"use client";

import { Card, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { BarChart } from "@/components/charts/BarChart";
import { HideBarChartsForMiddleSchool } from "@/components/assessment/HideBarChartsForMiddleSchool";
import { useCoachSession } from "@/context/CoachSessionContext";
import { brandColors } from "@/lib/brandColors";

export function ScreeningMobilityContent() {
  const { screeningJointMobility, screeningSymmetryIndex, screeningSessionNote } =
    useCoachSession();

  const hasJointData = screeningJointMobility.length > 0;

  return (
    <>
      {!hasJointData && (
        <p className="mb-6 text-sm text-pkp-gray-500">
          No screening mobility scores entered yet. Use the form above to record joint ROM
          measurements.
        </p>
      )}

      <div className="mb-8">
        <Card>
          <CardHeader
            title="Joint Mobility Measurements"
            subtitle="ROM recorded in degrees (0–140°)"
          />
          {hasJointData ? (
            <DataTable
              headers={["Joint", "Measurement", "Screening Notes"]}
              rows={screeningJointMobility.map((joint) => [
                joint.joint,
                <div key={`${joint.joint}-measurement`} className="min-w-[160px]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold tabular-nums text-pkp-black">
                      {joint.degrees}
                    </span>
                    <span className="text-sm text-pkp-gray-400">°</span>
                    <span className="ml-auto text-xs text-pkp-gray-400">/ 140°</span>
                  </div>
                  <ProgressBar
                    value={joint.degrees}
                    max={140}
                    showValue={false}
                    size="sm"
                    color="black"
                    animated={false}
                    className="mt-2"
                  />
                </div>,
                <span key={`${joint.joint}-notes`} className="text-pkp-gray-500">
                  {joint.notes || "—"}
                </span>,
              ])}
            />
          ) : (
            <p className="text-sm text-pkp-gray-500">No joint measurements saved yet.</p>
          )}
        </Card>
      </div>

      <HideBarChartsForMiddleSchool>
        {screeningSymmetryIndex.length > 0 && (
          <div className="mb-8">
            <Card>
              <CardHeader title="Symmetry Index" subtitle="Bilateral ROM comparison in degrees" />
              <BarChart
                labels={screeningSymmetryIndex.map((entry) => entry.joint)}
                datasets={[
                  {
                    label: "Left (°)",
                    data: screeningSymmetryIndex.map((entry) => entry.left),
                    color: brandColors.black,
                  },
                  {
                    label: "Right (°)",
                    data: screeningSymmetryIndex.map((entry) => entry.right),
                    color: brandColors.red,
                  },
                ]}
                height={320}
                yAxisLabel="Degrees (°)"
                valueSuffix="°"
              />
            </Card>
          </div>
        )}
      </HideBarChartsForMiddleSchool>

      <Card>
        <CardHeader title="Screening Notes" subtitle="Session screening summary" />
        {screeningSessionNote ? (
          <p className="text-sm leading-relaxed text-pkp-gray-700">{screeningSessionNote}</p>
        ) : (
          <p className="text-sm text-pkp-gray-500">No session screening note saved yet.</p>
        )}
      </Card>
    </>
  );
}
