import { TrafficRecord, generateAttackCSV } from "@/lib/detection";
import { Download, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  data: TrafficRecord[];
}

const AttackTable = ({ data }: Props) => {
  const attacks = data.filter((r) => r.prediction === "Attack");
  const displayed = attacks.slice(0, 100);

  const handleDownload = () => {
    const csv = generateAttackCSV(attacks);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attacks.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (attacks.length === 0) {
    return (
      <div className="bg-card border border-primary/20 rounded-lg p-8 text-center">
        <Shield className="w-10 h-10 mx-auto text-primary mb-3" />
        <p className="text-foreground font-medium">No attacks detected</p>
        <p className="text-sm text-muted-foreground">All traffic appears normal</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <h3 className="text-sm font-semibold text-foreground">
            Detected Attacks ({attacks.length.toLocaleString()})
          </h3>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDownload}
          className="text-xs gap-1.5"
        >
          <Download className="w-3 h-3" />
          Download CSV
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["#", "Duration", "Protocol", "Service", "Flag", "Src Bytes", "Dst Bytes", "Prediction"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs text-muted-foreground font-medium font-mono">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.map((r, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-destructive/5 transition-colors">
                <td className="px-4 py-2.5 text-muted-foreground font-mono text-xs">{i + 1}</td>
                <td className="px-4 py-2.5 font-mono">{r.duration}</td>
                <td className="px-4 py-2.5">
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-secondary text-secondary-foreground">
                    {r.protocol_type}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-mono text-xs">{r.service}</td>
                <td className="px-4 py-2.5 font-mono text-xs">{r.flag}</td>
                <td className="px-4 py-2.5 font-mono">{r.src_bytes.toLocaleString()}</td>
                <td className="px-4 py-2.5 font-mono">{r.dst_bytes.toLocaleString()}</td>
                <td className="px-4 py-2.5">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-destructive/20 text-destructive">
                    Attack
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {attacks.length > 100 && (
        <p className="text-xs text-muted-foreground p-4 text-center font-mono">
          Showing 100 of {attacks.length.toLocaleString()} attacks
        </p>
      )}
    </div>
  );
};

// Need Shield import for the no-attacks case
import { Shield } from "lucide-react";

export default AttackTable;
