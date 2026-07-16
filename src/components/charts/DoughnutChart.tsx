"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { brandColors } from "@/lib/brandColors";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  labels: string[];
  data: number[];
  colors?: string[];
  height?: number;
}

export function DoughnutChart({
  labels,
  data,
  colors = [brandColors.red, brandColors.black, brandColors.gray, "#d4d4d4", "#a3a3a3"],
  height = 240,
}: DoughnutChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors.slice(0, data.length),
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 8,
          boxHeight: 8,
          usePointStyle: true,
          pointStyle: "circle",
          padding: 12,
          font: { size: 11, family: "Inter, sans-serif" },
          color: "#737373",
        },
      },
      tooltip: {
        backgroundColor: brandColors.black,
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div style={{ height }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
