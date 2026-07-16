"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { brandColors } from "@/lib/brandColors";
import { Radar } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface RadarChartProps {
  labels: string[];
  datasets: { label: string; data: number[]; color?: string }[];
  height?: number;
  maxValue?: number;
}

export function RadarChart({ labels, datasets, height = 320, maxValue = 100 }: RadarChartProps) {
  const colors = [brandColors.red, brandColors.black, brandColors.gray];

  const data = {
    labels,
    datasets: datasets.map((ds, i) => {
      const color = ds.color || colors[i % colors.length];
      return {
        label: ds.label,
        data: ds.data,
        borderColor: color,
        backgroundColor: `${color}20`,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: color,
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
      };
    }),
  };

  const options: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          boxWidth: 8,
          boxHeight: 8,
          usePointStyle: true,
          pointStyle: "circle",
          padding: 16,
          font: { size: 12, family: "Inter, sans-serif" },
          color: "#737373",
        },
      },
      tooltip: {
        backgroundColor: brandColors.black,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      r: {
        min: 0,
        max: maxValue,
        ticks: { display: false, stepSize: 20 },
        grid: { color: "#e5e5e5" },
        angleLines: { color: "#e5e5e5" },
        pointLabels: {
          font: { size: 11, family: "Inter, sans-serif" },
          color: "#737373",
        },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Radar data={data} options={options} />
    </div>
  );
}
