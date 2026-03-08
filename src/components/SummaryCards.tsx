import { motion } from "framer-motion";
import { Activity, Shield, AlertTriangle, Percent } from "lucide-react";
import { TrafficRecord } from "@/lib/detection";

interface SummaryCardsProps {
  data: TrafficRecord[];
}

const SummaryCards = ({ data }: SummaryCardsProps) => {
  const total = data.length;
  const normal = data.filter((r) => r.prediction === "Normal").length;
  const attacks = data.filter((r) => r.prediction === "Attack").length;
  const attackPct = total > 0 ? ((attacks / total) * 100).toFixed(1) : "0";

  const cards = [
    {
      label: "Total Records",
      value: total.toLocaleString(),
      icon: Activity,
      color: "text-accent",
      bg: "bg-accent/10",
      border: "border-accent/20",
    },
    {
      label: "Normal Traffic",
      value: normal.toLocaleString(),
      icon: Shield,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    {
      label: "Detected Attacks",
      value: attacks.toLocaleString(),
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/20",
    },
    {
      label: "Attack Rate",
      value: `${attackPct}%`,
      icon: Percent,
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`bg-card border ${card.border} rounded-lg p-5`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">{card.label}</span>
            <div className={`${card.bg} ${card.color} p-2 rounded-md`}>
              <card.icon className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-bold font-mono ${card.color}`}>{card.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default SummaryCards;
