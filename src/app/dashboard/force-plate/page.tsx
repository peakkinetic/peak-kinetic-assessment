import { PageHeader } from "@/components/ui/PageHeader";
import { AthleteHeader } from "@/components/ui/AthleteHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import { brandColors } from "@/lib/brandColors";
import {
  forcePlateMetrics,
  cmjAnalysis,
  dropJumpData,
  asymmetryTrend,
  landingMetrics,
} from "@/data/forcePlate";

export default function ForcePlatePage() {
  return (
    <>
      <PageHeader
        title="Force Plate Analysis"
        subtitle="Ground reaction forces, asymmetry, and reactive strength"
        badge={<Badge variant="warning">Asymmetry: 9.0%</Badge>}
      />

      <AthleteHeader />

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {landingMetrics.map((m) => (
          <Card key={m.metric} padding="sm">
            <p className="text-xs text-pkp-gray-400">{m.metric}</p>
            <p className="mt-1 text-lg font-bold text-pkp-black">{m.value}</p>
            <Badge
              variant={
                m.status === "Elite" || m.status === "Optimal"
                  ? "success"
                  : m.status === "Normal" || m.status === "Acceptable"
                    ? "info"
                    : "warning"
              }
              className="mt-2"
            >
              {m.status}
            </Badge>
          </Card>
        ))}
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader title="Bilateral Force Comparison" subtitle="Left vs right leg metrics" />
          <DataTable
            headers={["Metric", "Left", "Right", "Unit", "Asymmetry %"]}
            rows={forcePlateMetrics.map((m) => [
              m.metric,
              m.left.toLocaleString(),
              m.right.toLocaleString(),
              m.unit,
              <span
                key={m.metric}
                className={m.asymmetry > 10 ? "font-semibold text-pkp-red" : "text-emerald-600"}
              >
                {m.asymmetry}%
              </span>,
            ])}
          />
        </Card>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="CMJ Force-Time Curve" subtitle="Countermovement jump analysis (N)" />
          <LineChart labels={cmjAnalysis.labels} datasets={cmjAnalysis.datasets} fill />
        </Card>

        <Card>
          <CardHeader title="Drop Jump Trials" subtitle="Reactive strength across 6 trials" />
          <BarChart
            labels={dropJumpData.labels}
            datasets={[
              { label: "Jump Height (cm)", data: dropJumpData.datasets[0].data, color: brandColors.red },
              { label: "RSI", data: dropJumpData.datasets[1].data, color: brandColors.black },
            ]}
            height={300}
          />
        </Card>
      </div>

      <Card>
        <CardHeader title="Asymmetry Trend" subtitle="6-month force asymmetry reduction" />
        <LineChart labels={asymmetryTrend.labels} datasets={asymmetryTrend.datasets} />
      </Card>
    </>
  );
}
