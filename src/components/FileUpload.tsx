import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import Papa from "papaparse";
import { TrafficRecord, processCSV } from "@/lib/detection";

interface FileUploadProps {
  onDataProcessed: (records: TrafficRecord[]) => void;
}

const FileUpload = ({ onDataProcessed }: FileUploadProps) => {
  const [status, setStatus] = useState<"idle" | "parsing" | "done" | "error">("idle");
  const [fileName, setFileName] = useState("");
  const [recordCount, setRecordCount] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".csv")) {
        setStatus("error");
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setStatus("error");
        return;
      }
      setFileName(file.name);
      setStatus("parsing");

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data as Record<string, string>[];
          const processed = processCSV(data);
          setRecordCount(processed.length);
          setStatus("done");
          onDataProcessed(processed);
        },
        error: () => setStatus("error"),
      });
    },
    [onDataProcessed]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
        ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"}
        ${status === "done" ? "border-primary/50 bg-primary/5" : ""}
        ${status === "error" ? "border-destructive/50 bg-destructive/5" : ""}
      `}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById("csv-upload")?.click()}
    >
      <input
        id="csv-upload"
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleInputChange}
      />

      {status === "idle" && (
        <div className="space-y-3">
          <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
          <p className="text-foreground font-medium">
            Drop a CSV file here or click to upload
          </p>
          <p className="text-sm text-muted-foreground">
            Network traffic data (.csv, max 50MB)
          </p>
        </div>
      )}

      {status === "parsing" && (
        <div className="space-y-3">
          <div className="w-10 h-10 mx-auto border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-foreground font-medium">Processing {fileName}...</p>
          <p className="text-sm text-muted-foreground">Analyzing network traffic patterns</p>
        </div>
      )}

      {status === "done" && (
        <div className="space-y-3">
          <CheckCircle className="w-10 h-10 mx-auto text-primary" />
          <p className="text-foreground font-medium flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" />
            {fileName}
          </p>
          <p className="text-sm text-primary font-mono">
            ✓ {recordCount.toLocaleString()} records processed
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-3">
          <AlertCircle className="w-10 h-10 mx-auto text-destructive" />
          <p className="text-foreground font-medium">Upload failed</p>
          <p className="text-sm text-muted-foreground">Please upload a valid CSV file</p>
        </div>
      )}
    </motion.div>
  );
};

export default FileUpload;
