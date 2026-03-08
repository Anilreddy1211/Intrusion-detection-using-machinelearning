import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, LogOut, Upload as UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import SummaryCards from "@/components/SummaryCards";
import AttackDistributionChart from "@/components/AttackDistributionChart";
import ProtocolChart from "@/components/ProtocolChart";
import CorrelationHeatmap from "@/components/CorrelationHeatmap";
import AttackTable from "@/components/AttackTable";
import { TrafficRecord } from "@/lib/detection";

interface DashboardPageProps {
  username: string;
  onLogout: () => void;
}

const DashboardPage = ({ username, onLogout }: DashboardPageProps) => {
  const [data, setData] = useState<TrafficRecord[] | null>(null);

  const handleDataProcessed = (records: TrafficRecord[]) => {
    setData(records);
  };

  const attacks = data?.filter((r) => r.prediction === "Attack") || [];

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">IDS Dashboard</h1>
              <p className="text-xs text-muted-foreground font-mono">Network Security Monitor</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Welcome, <span className="text-foreground font-medium">{username}</span>
            </span>
            <Button variant="outline" size="sm" onClick={onLogout} className="gap-1.5 text-xs">
              <LogOut className="w-3 h-3" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Upload Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <UploadIcon className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Upload Network Traffic</h2>
          </div>
          <FileUpload onDataProcessed={handleDataProcessed} />
        </motion.section>

        {/* Dashboard */}
        {data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Alert banner if attacks detected */}
            {attacks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center animate-pulse-glow">
                  <Shield className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-bold text-destructive">
                    🚨 {attacks.length.toLocaleString()} Attack(s) Detected!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Immediate review recommended. Download attack data below.
                  </p>
                </div>
              </motion.div>
            )}

            <SummaryCards data={data} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AttackDistributionChart data={data} />
              <ProtocolChart data={data} />
            </div>

            <CorrelationHeatmap data={data} />

            <AttackTable data={data} />
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
