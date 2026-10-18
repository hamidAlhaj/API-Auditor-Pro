import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Collection, ApiResponse } from "../../types";
import * as api from "../../services/api";

export default function CollectionsTab() {
  const { t } = useTranslation();
  const [collections, setCollections] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [currentColl, setCurrentColl] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const fetchCollections = async () => {
    try {
      const data = await api.listCollections();
      setCollections(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleLoadCollection = async (name: string) => {
    setSelected(name);
    if (!name) {
      setCurrentColl(null);
      return;
    }
    setLoading(true);
    try {
      const data = await api.loadCollection(name);
      setCurrentColl(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendSaved = async (req: any) => {
    let headers = {};
    let body = null;
    try {
      headers = JSON.parse(req.headers);
    } catch {}
    try {
      body = JSON.parse(req.body);
    } catch {
      body = req.body;
    }

    try {
      const res = await api.sendRequest({
        method: req.method,
        url: req.url,
        headers,
        body,
      });
      setResponse(res);
    } catch (err) {
      alert("Request failed");
    }
  };

  return (
    <div className="card">
      <h3>{t("available_collections")}</h3>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <select
          style={{ flex: 1, padding: "10px", borderRadius: "8px" }}
          value={selected}
          onChange={(e) => handleLoadCollection(e.target.value)}
        >
          <option value="">-- Select --</option>
          {collections.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button onClick={fetchCollections}>{t("refresh_btn")}</button>
      </div>

      {loading && <div className="spinner" />}

      {currentColl && (
        <div>
          <h4 style={{ marginBottom: "15px" }}>{currentColl.name}</h4>
          {currentColl.requests.map((req, i) => (
            <div
              key={i}
              style={{
                border: "1px solid var(--border-color)",
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                <span style={{ color: "var(--btn-primary-bg)" }}>
                  {req.method}
                </span>{" "}
                {req.name}
              </div>
              <pre
                style={{
                  fontSize: "12px",
                  background: "var(--input-bg)",
                  padding: "8px",
                  borderRadius: "4px",
                  marginBottom: "8px",
                }}
              >
                {req.url}
              </pre>
              <button onClick={() => handleSendSaved(req)}>{t("send")}</button>
            </div>
          ))}
        </div>
      )}

      {response && (
        <div style={{ marginTop: "20px" }}>
          <h4>{t("results")}</h4>
          <div className="response-box">
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
