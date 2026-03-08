export interface TrafficRecord {
  duration: number;
  protocol_type: string;
  service: string;
  flag: string;
  src_bytes: number;
  dst_bytes: number;
  land: number;
  wrong_fragment: number;
  urgent: number;
  hot: number;
  num_failed_logins: number;
  logged_in: number;
  num_compromised: number;
  root_shell: number;
  su_attempted: number;
  num_root: number;
  num_file_creations: number;
  num_shells: number;
  num_access_files: number;
  num_outbound_cmds: number;
  is_host_login: number;
  is_guest_login: number;
  count: number;
  srv_count: number;
  serror_rate: number;
  srv_serror_rate: number;
  rerror_rate: number;
  srv_rerror_rate: number;
  same_srv_rate: number;
  diff_srv_rate: number;
  srv_diff_host_rate: number;
  dst_host_count: number;
  dst_host_srv_count: number;
  dst_host_same_srv_rate: number;
  dst_host_diff_srv_rate: number;
  dst_host_same_src_port_rate: number;
  dst_host_srv_diff_host_rate: number;
  dst_host_serror_rate: number;
  dst_host_srv_serror_rate: number;
  dst_host_rerror_rate: number;
  dst_host_srv_rerror_rate: number;
  class?: string;
  prediction?: "Normal" | "Attack";
}

// Heuristic-based detection mimicking LSTM/GRU model behavior
// Rules derived from analysis of normal vs attack traffic patterns
export function detectIntrusion(record: TrafficRecord): "Normal" | "Attack" {
  let score = 0;

  // High error rates indicate SYN flood / port scan
  if (record.serror_rate > 0.5) score += 3;
  if (record.srv_serror_rate > 0.5) score += 3;
  if (record.rerror_rate > 0.5) score += 2;
  if (record.srv_rerror_rate > 0.5) score += 2;
  if (record.dst_host_serror_rate > 0.5) score += 2;
  if (record.dst_host_srv_serror_rate > 0.5) score += 2;
  if (record.dst_host_rerror_rate > 0.5) score += 2;

  // S0 flag = connection attempted but not established (SYN flood)
  if (record.flag === "S0") score += 4;
  if (record.flag === "REJ") score += 2;
  if (record.flag === "RSTO" || record.flag === "RSTOS0") score += 1;

  // Zero bytes with connection = suspicious
  if (record.src_bytes === 0 && record.dst_bytes === 0) score += 2;

  // Very high duration = potential slow attack
  if (record.duration > 5000) score += 1;

  // Root shell or compromise indicators
  if (record.root_shell > 0) score += 5;
  if (record.num_compromised > 0) score += 3;
  if (record.su_attempted > 0) score += 3;
  if (record.num_shells > 0) score += 3;

  // Failed logins
  if (record.num_failed_logins > 0) score += 2;

  // Land attack
  if (record.land > 0) score += 4;
  if (record.wrong_fragment > 0) score += 2;

  // Low same_srv_rate with high count = port scan
  if (record.same_srv_rate < 0.1 && record.count > 100) score += 3;

  // Very high count = flood
  if (record.count > 300) score += 2;

  // Suspicious services
  const suspiciousServices = ["telnet", "ftp", "imap4", "ssh", "finger", "whois"];
  if (suspiciousServices.includes(record.service) && record.logged_in === 0) score += 1;

  return score >= 4 ? "Attack" : "Normal";
}

export function processCSV(records: Record<string, string>[]): TrafficRecord[] {
  return records.map((row) => {
    const record: TrafficRecord = {
      duration: Number(row.duration) || 0,
      protocol_type: row.protocol_type || "tcp",
      service: row.service || "http",
      flag: row.flag || "SF",
      src_bytes: Number(row.src_bytes) || 0,
      dst_bytes: Number(row.dst_bytes) || 0,
      land: Number(row.land) || 0,
      wrong_fragment: Number(row.wrong_fragment) || 0,
      urgent: Number(row.urgent) || 0,
      hot: Number(row.hot) || 0,
      num_failed_logins: Number(row.num_failed_logins) || 0,
      logged_in: Number(row.logged_in) || 0,
      num_compromised: Number(row.num_compromised) || 0,
      root_shell: Number(row.root_shell) || 0,
      su_attempted: Number(row.su_attempted) || 0,
      num_root: Number(row.num_root) || 0,
      num_file_creations: Number(row.num_file_creations) || 0,
      num_shells: Number(row.num_shells) || 0,
      num_access_files: Number(row.num_access_files) || 0,
      num_outbound_cmds: Number(row.num_outbound_cmds) || 0,
      is_host_login: Number(row.is_host_login) || 0,
      is_guest_login: Number(row.is_guest_login) || 0,
      count: Number(row.count) || 0,
      srv_count: Number(row.srv_count) || 0,
      serror_rate: Number(row.serror_rate) || 0,
      srv_serror_rate: Number(row.srv_serror_rate) || 0,
      rerror_rate: Number(row.rerror_rate) || 0,
      srv_rerror_rate: Number(row.srv_rerror_rate) || 0,
      same_srv_rate: Number(row.same_srv_rate) || 0,
      diff_srv_rate: Number(row.diff_srv_rate) || 0,
      srv_diff_host_rate: Number(row.srv_diff_host_rate) || 0,
      dst_host_count: Number(row.dst_host_count) || 0,
      dst_host_srv_count: Number(row.dst_host_srv_count) || 0,
      dst_host_same_srv_rate: Number(row.dst_host_same_srv_rate) || 0,
      dst_host_diff_srv_rate: Number(row.dst_host_diff_srv_rate) || 0,
      dst_host_same_src_port_rate: Number(row.dst_host_same_src_port_rate) || 0,
      dst_host_srv_diff_host_rate: Number(row.dst_host_srv_diff_host_rate) || 0,
      dst_host_serror_rate: Number(row.dst_host_serror_rate) || 0,
      dst_host_srv_serror_rate: Number(row.dst_host_srv_serror_rate) || 0,
      dst_host_rerror_rate: Number(row.dst_host_rerror_rate) || 0,
      dst_host_srv_rerror_rate: Number(row.dst_host_srv_rerror_rate) || 0,
      class: row.class,
    };
    record.prediction = detectIntrusion(record);
    return record;
  });
}

export function generateAttackCSV(attacks: TrafficRecord[]): string {
  if (attacks.length === 0) return "";
  const headers = ["duration", "protocol_type", "service", "flag", "src_bytes", "dst_bytes", "count", "srv_count", "serror_rate", "prediction"];
  const rows = attacks.map((r) =>
    [r.duration, r.protocol_type, r.service, r.flag, r.src_bytes, r.dst_bytes, r.count, r.srv_count, r.serror_rate, r.prediction].join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}
