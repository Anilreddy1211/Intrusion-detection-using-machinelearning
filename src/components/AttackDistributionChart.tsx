import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { TrafficRecord } from "@/lib/detection";

interface Props {
  data: TrafficRecord[];
}

const COLORS = ["hsl(160, 100%, 45%)", "hsl(0, 80%, 55%)"];

const AttackDistributionChart = ({ data }: Props) => {
  const normal = data.filter((r) => r.prediction === "Normal").length;
  const attacks = data.filter((r) => r.prediction === "Attack").length;
  const chartData = [
    { name: "Normal", value: normal },
    { name: "Attack", value: attacks },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Attack Distribution</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "hsl(220, 18%, 10%)",
              border: "1px solid hsl(220, 14%, 18%)",
              borderRadius: "8px",
              color: "hsl(210, 20%, 92%)",
              fontSize: "12px",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", color: "hsl(215, 15%, 55%)" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttackDistributionChart;
