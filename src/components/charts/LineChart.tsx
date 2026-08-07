"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { brandColors } from "@/lib/brandColors";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const defaultColors = [brandColors.red, brandColors.black, brandColors.gray, "#525252"];

interface LineChartProps {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
    dashed?: boolean;
    pointRadius?: number;
    tension?: number;
  }[];
  height?: number;
  fill?: boolean;
  yAxisLabel?: string;
  minValue?: number;
  maxValue?: number;
  valueSuffix?: string;
}

export function LineChart({
  labels,
  datasets,
  height = 280,
  fill = false,
  yAxisLabel,
  minValue,
  maxValue,
  valueSuffix,
}: LineChartProps) {
  const data = {
    labels,
    datasets: datasets.map((ds, i) => ({
      label: ds.label,
      data: ds.data,
      borderColor: ds.color || defaultColors[i % defaultColors.length],
      backgroundColor: fill
        ? `${ds.color || defaultColors[i % defaultColors.length]}15`
        : "transparent",
      borderWidth: 2,
      pointRadius: ds.pointRadius ?? 4,
      pointHoverRadius: (ds.pointRadius ?? 4) + 2,
      pointBackgroundColor: "#FFFFFF",
      pointBorderWidth: 2,
      tension: ds.tension ?? 0.35,
      fill,
      borderDash: ds.dashed ? [6, 4] : undefined,
    })),
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
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
        titleFont: { size: 12, family: "Inter, sans-serif" },
        bodyFont: { size: 12, family: "Inter, sans-serif" },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: valueSuffix
          ? {
              label: (context) => {
                const rawValue = context.parsed.y;
                if (rawValue == null) return context.dataset.label ?? "";
                return `${context.dataset.label}: ${rawValue}${valueSuffix}`;
              },
            }
          : undefined,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 }, color: "#a3a3a3" },
        border: { display: false },
      },
      y: {
        min: minValue,
        max: maxValue,
        grid: { color: "#f5f5f5" },
        ticks: {
          font: { size: 11 },
          color: "#a3a3a3",
          callback: valueSuffix ? (value) => `${value}${valueSuffix}` : undefined,
        },
        border: { display: false },
        title: yAxisLabel
          ? { display: true, text: yAxisLabel, font: { size: 11 }, color: "#a3a3a3" }
          : undefined,
      },
    },
  };

  return (
    <div style={{ height }}>
      <Line data={data} options={options} />
    </div>
  );
}
