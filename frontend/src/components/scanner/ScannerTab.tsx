import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Vulnerability, ScanConfig, AIAnalysisResult } from "../../types";
import * as api from "../../services/api";
import { downloadBlob, downloadText } from "../../utils/download";
import {
  Bot,
  FileText,
  FileDown,
  FileJson,
  FileSpreadsheet,
} from "lucide-react";

export default function ScannerTab() {
  const { t } = useTranslation();

  // Form state
  const [target, setTarget] = useState("");
  const [sqlEndpoint, setSqlEndpoint] = useState("");
  const [sqlParam, setSqlParam] = useState("");
  const [sqlMethod, setSqlMethod] = useState("GET");
  const [sqlPoint, setSqlPoint] = useState<"query" | "body">("query");

  const [idorEndpoint, setIdorEndpoint] = useState("");
  const [idorMethod, setIdorMethod] = useState("GET");

  const [rateEndpoint, setRateEndpoint] = useState("");

  const [massEndpoint, setMassEndpoint] = useState("");
  const [massMethod, setMassMethod] = useState("PUT");

  const [authLoginEndpoint, setAuthLoginEndpoint] = useState("");
  const [authLoginMethod, setAuthLoginMethod] = useState("POST");
  const [authUserField, setAuthUserField] = useState("username");
  const [authPassField, setAuthPassField] = useState("password");

  // Checkboxes
  const [testWeak, setTestWeak] = useState(true);
  const [testEnum, setTestEnum] = useState(true);
  const [testRate, setTestRate] = useState(true);
  const [testReset, setTestReset] = useState(false);

  // Results state
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<Vulnerability[]>([]);

  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);

  const handleScan = async () => {
    setScanning(true);
    setResults([]);
    setAiResult(null);

    const config: ScanConfig = {
      target_base: target,
      sql: sqlEndpoint
        ? {
            endpoint: sqlEndpoint,
            param: sqlParam,
            method: sqlMethod,
            injection_point: sqlPoint,
          }
        : null,
      idor: idorEndpoint
        ? { endpoint: idorEndpoint, method: idorMethod }
        : null,
      rate: rateEndpoint ? { endpoint: rateEndpoint, method: "GET" } : null,
      mass: massEndpoint
        ? { endpoint: massEndpoint, method: massMethod }
        : null,
      broken_auth: authLoginEndpoint
        ? {
            login_endpoint: authLoginEndpoint,
            login_method: authLoginMethod,
            username_field: authUserField,
            password_field: authPassField,
            test_weak_password: testWeak,
            test_username_enum: testEnum,
            test_rate_limit: testRate,
            test_reset: testReset,
          }
        : null,
    };

    try {
      const res = await api.runScan(config);
      setResults(res);
      if (res.length > 0) {
        triggerAI(res);
      }
    } catch (err) {
      alert("Scan failed: " + err);
    } finally {
      setScanning(false);
    }
  };

  const triggerAI = async (vulns: Vulnerability[]) => {
    setAiLoading(true);
    try {
      const aiRes = await api.analyzeWithAI(vulns);
      setAiResult(aiRes);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleExport = async (format: "html" | "pdf" | "json" | "csv") => {
    try {
      const { type, data } = await api.exportReport(format, results, target);

      if (format === "html") {
        const win = window.open();
        win?.document.write(data as string);
      } else if (format === "pdf") {
        downloadBlob(data as Blob, "report.pdf");
      } else if (format === "json") {
        downloadText(
          JSON.stringify(data, null, 2),
          "report.json",
          "application/json",
        );
      } else if (format === "csv") {
        downloadText(data as string, "report.csv", "text/csv");
      }
    } catch (err) {
      alert("Export failed");
    }
  };

  return (
    <div className="card">
      <h3>{t("scan_title")}</h3>

      <input
        type="text"
        placeholder={t("target_base_url") as string}
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid var(--input-border)",
          background: "var(--input-bg)",
          color: "var(--text-primary)",
        }}
      />

      <div className="scanner-grid">
        {/* SQL */}
        <div className="scanner-card">
          <h4>{t("sql_title")}</h4>
          <input
            type="text"
            placeholder="Endpoint"
            value={sqlEndpoint}
            onChange={(e) => setSqlEndpoint(e.target.value)}
          />
          <input
            type="text"
            placeholder="Parameter"
            value={sqlParam}
            onChange={(e) => setSqlParam(e.target.value)}
          />
          <select
            value={sqlMethod}
            onChange={(e) => setSqlMethod(e.target.value)}
          >
            <option>GET</option>
            <option>POST</option>
          </select>
          <select
            value={sqlPoint}
            onChange={(e) => setSqlPoint(e.target.value as any)}
          >
            <option value="query">Query</option>
            <option value="body">Body</option>
          </select>
        </div>

        {/* IDOR */}
        <div className="scanner-card">
          <h4>{t("idor_title")}</h4>
          <input
            type="text"
            placeholder="Endpoint e.g. /users/{}"
            value={idorEndpoint}
            onChange={(e) => setIdorEndpoint(e.target.value)}
          />
          <select
            value={idorMethod}
            onChange={(e) => setIdorMethod(e.target.value)}
          >
            <option>GET</option>
            <option>POST</option>
          </select>
        </div>

        {/* Rate Limit */}
        <div className="scanner-card">
          <h4>{t("rate_title")}</h4>
          <input
            type="text"
            placeholder="Endpoint e.g. /ping"
            value={rateEndpoint}
            onChange={(e) => setRateEndpoint(e.target.value)}
          />
        </div>

        {/* Mass Assignment */}
        <div className="scanner-card">
          <h4>{t("mass_title")}</h4>
          <input
            type="text"
            placeholder="Endpoint e.g. /users/{}"
            value={massEndpoint}
            onChange={(e) => setMassEndpoint(e.target.value)}
          />
          <select
            value={massMethod}
            onChange={(e) => setMassMethod(e.target.value)}
          >
            <option>PUT</option>
            <option>POST</option>
          </select>
        </div>

        {/* Broken Auth */}
        <div className="scanner-card">
          <h4>{t("broken_auth_title")}</h4>
          <input
            type="text"
            placeholder="Login endpoint"
            value={authLoginEndpoint}
            onChange={(e) => setAuthLoginEndpoint(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username field"
            value={authUserField}
            onChange={(e) => setAuthUserField(e.target.value)}
          />
          <input
            type="text"
            placeholder="Password field"
            value={authPassField}
            onChange={(e) => setAuthPassField(e.target.value)}
          />
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <label>
              <input
                type="checkbox"
                checked={testWeak}
                onChange={(e) => setTestWeak(e.target.checked)}
              />{" "}
              {t("auth_weak_test")}
            </label>
            <label>
              <input
                type="checkbox"
                checked={testEnum}
                onChange={(e) => setTestEnum(e.target.checked)}
              />{" "}
              {t("auth_enum_test")}
            </label>
            <label>
              <input
                type="checkbox"
                checked={testRate}
                onChange={(e) => setTestRate(e.target.checked)}
              />{" "}
              {t("auth_rate_test")}
            </label>
            <label>
              <input
                type="checkbox"
                checked={testReset}
                onChange={(e) => setTestReset(e.target.checked)}
              />{" "}
              {t("auth_reset_test")}
            </label>
          </div>
        </div>
      </div>

      <button className="send-btn" onClick={handleScan} disabled={scanning}>
        {scanning ? (
          <span
            className="spinner"
            style={{ display: "inline-block", marginRight: "10px" }}
          />
        ) : null}
        {t("start_scan")}
      </button>

      {/* Results */}
      {results.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h3>
            {t("results")} ({results.length})
          </h3>

          {/* Export Buttons */}
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <strong>{t("export_report")}: </strong>
            <button
              onClick={() => handleExport("html")}
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <FileText size={16} /> HTML
            </button>
            <button
              onClick={() => handleExport("pdf")}
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <FileDown size={16} /> PDF
            </button>
            <button
              onClick={() => handleExport("json")}
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <FileJson size={16} /> JSON
            </button>
            <button
              onClick={() => handleExport("csv")}
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <FileSpreadsheet size={16} /> CSV
            </button>
          </div>

          {results.map((v, i) => {
            const cls = `vuln-${v.severity.toLowerCase()}`;
            return (
              <div key={i} className={`vuln-card ${cls}`}>
                <strong>{v.vulnerability}</strong> ({v.severity})<br />
                {v.description}
                <br />
                <em>
                  {t("fix")}: {v.fix}
                </em>
              </div>
            );
          })}

          {/* AI Analysis */}
          <div
            style={{
              marginTop: "30px",
              borderTop: "1px solid var(--border-color)",
              paddingTop: "20px",
            }}
          >
            <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Bot size={24} /> {t("ai_title")}
            </h3>{" "}
            {aiLoading && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div className="spinner" /> <span>{t("ai_analyzing")}</span>
              </div>
            )}
            {aiResult && (
              <div
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border-color)",
                  padding: "15px",
                  borderRadius: "8px",
                  whiteSpace: "pre-wrap",
                }}
              >
                <div style={{ color: "#28a745", marginBottom: "10px" }}>
                  ✅ {t("ai_completed")}
                </div>
                {aiResult.analysis}
              </div>
            )}
          </div>
        </div>
      )}

      {results.length === 0 && !scanning && !aiLoading && target && (
        <div
          style={{ marginTop: "20px", color: "#28a745", fontWeight: "bold" }}
        >
          ✅ {t("no_vulns")}
        </div>
      )}
    </div>
  );
}
