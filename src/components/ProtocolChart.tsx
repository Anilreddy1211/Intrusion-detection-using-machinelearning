import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { TrafficRecord } from "@/lib/detection";

interface Props {
  data: TrafficRecord[];
}

const PROTOCOL_COLORS: Record<string, string> = {
  tcp: "hsl(200, 100%, 50%)",
  udp: "hsl(38, 92%, 50%)",
  icmp: "hsl(280, 80%, 60%)",
};

const ProtocolChart = ({ data }: Props) => {
  const counts: Record<string, number> = {};
  data.forEach((r) => {
    counts[r.protocol_type] = (counts[r.protocol_type] || 0) + 1;
  });
  const chartData = Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Protocol Distribution</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
          <XAxis dataKey="name" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} />
          <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "hsl(220, 18%, 10%)",
              border: "1px solid hsl(220, 14%, 18%)",
              borderRadius: "8px",
              color: "hsl(210, 20%, 92%)",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={PROTOCOL_COLORS[entry.name] || "hsl(200, 100%, 50%)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProtocolChart;
