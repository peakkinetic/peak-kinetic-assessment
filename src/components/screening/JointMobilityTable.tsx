"use client";

import { DataTable } from "@/components/ui/DataTable";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { JointMobilityMeasurement } from "@/types";

interface JointMobilityTableProps {
  joints: JointMobilityMeasurement[];
  notesHeader?: string;
}

export function JointMobilityTable({
  joints,
  notesHeader = "Screening Notes",
}: JointMobilityTableProps) {
  if (joints.length === 0) {
    return <p className="text-sm text-pkp-gray-500">No measurements saved yet.</p>;
  }

  return (
    <DataTable
      headers={["Joint", "Measurement", notesHeader]}
      rows={joints.map((joint) => [
        joint.joint,
        <div key={`${joint.joint}-measurement`} className="min-w-[160px]">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold tabular-nums text-pkp-black">{joint.degrees}</span>
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
  );
}
