import { TrafficRecord } from "@/lib/detection";
import { useMemo } from "react";

interface Props {
  data: TrafficRecord[];
}

const FEATURES = [
  "duration", "src_bytes", "dst_bytes", "count", "srv_count",
  "serror_rate", "rerror_rate", "same_srv_rate", "dst_host_count", "dst_host_srv_count"
] as const;

function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n === 0) return 0;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, denX = 0, denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  const den = Math.sqrt(denX * denY);
  return den === 0 ? 0 : num / den;
}

function getColor(v: number): string {
  // -1 = red, 0 = dark, 1 = green
  if (v > 0) {
    const intensity = Math.min(v, 1);
    return `hsl(160, ${Math.round(intensity * 100)}%, ${20 + Math.round(intensity * 25)}%)`;
  } else {
    const intensity = Math.min(Math.abs(v), 1);
    return `hsl(0, ${Math.round(intensity * 80)}%, ${20 + Math.round(intensity * 25)}%)`;
  }
}

const CorrelationHeatmap = ({ data }: Props) => {
  const matrix = useMemo(() => {
    const sample = data.slice(0, 1000); // sample for performance
    const vectors: Record<string, number[]> = {};
    FEATURES.forEach((f) => {
      vectors[f] = sample.map((r) => r[f] as number);
    });
    return FEATURES.map((f1) =>
      FEATURES.map((f2) => pearsonCorrelation(vectors[f1], vectors[f2]))
    );
  }, [data]);

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Feature Correlation</h3>
      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Header */}
          <div className="flex">
            <div className="w-24 shrink-0" />
            {FEATURES.map((f) => (
              <div key={f} className="flex-1 text-[9px] text-muted-foreground font-mono text-center truncate px-0.5">
                {f.replace("dst_host_", "dh_").replace("_rate", "_r")}
              </div>
            ))}
          </div>
          {/* Rows */}
          {FEATURES.map((f1, i) => (
            <div key={f1} className="flex items-center">
              <div className="w-24 shrink-0 text-[9px] text-muted-foreground font-mono truncate pr-1 text-right">
                {f1.replace("dst_host_", "dh_").replace("_rate", "_r")}
              </div>
              {FEATURES.map((f2, j) => (
                <div
                  key={`${f1}-${f2}`}
                  className="flex-1 aspect-square m-0.5 rounded-sm flex items-center justify-center"
                  style={{ backgroundColor: getColor(matrix[i][j]) }}
                  title={`${f1} vs ${f2}: ${matrix[i][j].toFixed(2)}`}
                >
                  <span className="text-[8px] text-foreground/70 font-mono">
                    {matrix[i][j].toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CorrelationHeatmap;
