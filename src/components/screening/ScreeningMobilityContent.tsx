"use client";

import { Card, CardHeader } from "@/components/ui/Card";
import { BarChart } from "@/components/charts/BarChart";
import { HideBarChartsForMiddleSchool } from "@/components/assessment/HideBarChartsForMiddleSchool";
import { JointMobilityTable } from "@/components/screening/JointMobilityTable";
import { useCoachSession } from "@/context/CoachSessionContext";
import { brandColors } from "@/lib/brandColors";
import { splitJointMobilityBySide } from "@/lib/screeningMetrics";

export function ScreeningMobilityContent() {
  const { screeningJointMobility, screeningSymmetryIndex, screeningSessionNote } =
    useCoachSession();

  const { left, right } = splitJointMobilityBySide(screeningJointMobility);
  const hasJointData = screeningJointMobility.length > 0;

  return (
    <>
      {!hasJointData && (
        <p className="mb-6 text-sm text-pkp-gray-500">
          No screening mobility scores entered yet. Use the form above to record joint ROM
          measurements.
        </p>
      )}

      <div className="mb-8 space-y-6">
        <Card>
          <CardHeader
            title="Left Side"
            subtitle="ROM recorded in degrees (0–140°)"
          />
          <JointMobilityTable joints={left} />
        </Card>

        <Card>
          <CardHeader
            title="Right Side"
            subtitle="ROM recorded in degrees (0–140°)"
          />
          <JointMobilityTable joints={right} />
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
