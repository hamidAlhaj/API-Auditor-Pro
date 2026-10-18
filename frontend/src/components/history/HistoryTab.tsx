import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { RequestHistoryItem, ScanHistoryItem } from "../../types";
import * as api from "../../services/api";

export default function HistoryTab() {
  const { t } = useTranslation();
  const [reqHistory, setReqHistory] = useState<RequestHistoryItem[]>([]);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [reqs, scans] = await Promise.all([
          api.getRequestHistory(20),
          api.getScanHistory(10),
        ]);
        setReqHistory(reqs);
        setScanHistory(scans);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div className="card">
      <h3>{t("req_history")}</h3>
      <div className="history-list" style={{ marginBottom: "20px" }}>
        <ul>
          {reqHistory.map((h) => (
            <li key={h.id} style={{ marginBottom: "8px" }}>
              <span
                style={{ color: "var(--btn-primary-bg)", fontWeight: "bold" }}
              >
                {h.method}
              </span>{" "}
              {h.url} - {t("status")} {h.status} ({h.duration.toFixed(2)}s)
            </li>
          ))}
          {reqHistory.length === 0 && <li>No history yet.</li>}
        </ul>
      </div>

      <hr style={{ margin: "20px 0", borderColor: "var(--border-color)" }} />

      <h3>{t("scan_history")}</h3>
      <div className="history-list">
        <ul>
          {scanHistory.map((s) => (
            <li key={s.id} style={{ marginBottom: "8px" }}>
              <strong>{s.target}</strong> - {s.vulnerabilities.length}{" "}
              {t("vulns")} - {s.date}
            </li>
          ))}
          {scanHistory.length === 0 && <li>No scans yet.</li>}
        </ul>
      </div>
    </div>
  );
}
