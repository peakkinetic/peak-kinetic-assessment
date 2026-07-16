"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { brandColors } from "@/lib/brandColors";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const defaultColors = [brandColors.red, brandColors.black, brandColors.gray];

interface BarChartProps {
  labels: string[];
  datasets: { label: string; data: number[]; color?: string; barColors?: string[] }[];
  height?: number;
  horizontal?: boolean;
  maxValue?: number;
  minValue?: number;
  colorByScore?: boolean;
  yAxisLabel?: string;
  valueSuffix?: string;
}

const scoreColors: Record<number, string> = {
  1: brandColors.red,
  2: "#F59E0B",
  3: "#10B981",
};

export function BarChart({
  labels,
  datasets,
  height = 280,
  horizontal = false,
  maxValue,
  minValue = 0,
  colorByScore = false,
  yAxisLabel,
  valueSuffix,
}: BarChartProps) {
  const data = {
    labels,
    datasets: datasets.map((ds, i) => ({
      label: ds.label,
      data: ds.data,
      backgroundColor: ds.barColors
        ? ds.barColors
        : colorByScore
          ? ds.data.map((value) => scoreColors[value] || defaultColors[i % defaultColors.length])
          : ds.color || defaultColors[i % defaultColors.length],
      borderRadius: 6,
      borderSkipped: false,
      maxBarThickness: 48,
    })),
  };

  const valueAxis = horizontal ? "x" : "y";
  const categoryAxis = horizontal ? "y" : "x";

  const options: ChartOptions<"bar"> = {
    indexAxis: horizontal ? "y" : "x",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: datasets.length > 1,
        position: "top",
        align: "end",
        labels: {
          boxWidth: 8,
          boxHeight: 8,
          usePointStyle: true,
          pointStyle: "rectRounded",
          padding: 16,
          font: { size: 12, family: "Inter, sans-serif" },
          color: "#737373",
        },
      },
      tooltip: {
        backgroundColor: brandColors.black,
        padding: 12,
        cornerRadius: 8,
        callbacks: valueSuffix
          ? {
              label: (context) => {
                const rawValue = horizontal ? context.parsed.x : context.parsed.y;
                return `${context.dataset.label}: ${rawValue}${valueSuffix}`;
              },
            }
          : undefined,
      },
    },
    scales: {
      [categoryAxis]: {
        grid: { display: false },
        ticks: { font: { size: 11 }, color: "#a3a3a3" },
        border: { display: false },
      },
      [valueAxis]: {
        min: minValue,
        max: maxValue,
        grid: { color: "#f5f5f5" },
        ticks: {
          font: { size: 11 },
          color: "#a3a3a3",
          stepSize: maxValue === 3 ? 1 : maxValue === 100 ? 25 : undefined,
          callback: valueSuffix
            ? (value) => `${value}${valueSuffix}`
            : undefined,
        },
        border: { display: false },
        title: yAxisLabel
          ? {
              display: true,
              text: yAxisLabel,
              font: { size: 11 },
              color: "#a3a3a3",
            }
          : undefined,
      },
    },
  };

  return (
    <div style={{ height }}>
      <Bar data={data} options={options} />
    </div>
  );
}
