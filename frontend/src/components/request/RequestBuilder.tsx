import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { HttpMethod, ApiResponse } from "../../types";
import * as api from "../../services/api";
import ResponseBox from "./ResponseBox";
import { Send } from "lucide-react";

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "DELETE", "PATCH"];

export default function RequestBuilder() {
  const { t } = useTranslation();

  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("");
  const [headersText, setHeadersText] = useState(
    '{"Content-Type": "application/json"}',
  );
  const [bodyText, setBodyText] = useState('{"key": "value"}');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const [collName, setCollName] = useState("");
  const [reqName, setReqName] = useState("");
  const [savingColl, setSavingColl] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setResponse(null);
    try {
      let headers: Record<string, string> = {};
      let body: unknown = null;
      try {
        headers = JSON.parse(headersText);
      } catch {
        /* ignore */
      }
      try {
        body = JSON.parse(bodyText);
      } catch {
        body = bodyText;
      }

      const res = await api.sendRequest({ method, url, headers, body });
      setResponse(res);
    } catch (err) {
      setResponse({
        status_code: 0,
        headers: {},
        body: String(err),
        json: null,
        url,
        duration: 0,
        error: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToCollection = async () => {
    if (!collName || !reqName) {
      alert("Enter collection and request name");
      return;
    }
    setSavingColl(true);
    try {
      await api.addToCollection(collName, {
        name: reqName,
        method,
        url,
        headers: headersText,
        body: bodyText,
        created_at: new Date().toISOString(),
      });
      alert(t("save_btn"));
      setReqName("");
    } catch (err) {
      alert(`Error: ${err}`);
    } finally {
      setSavingColl(false);
    }
  };

  return (
    <div className="card">
      <div className="request-builder">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as HttpMethod)}
        >
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="https://api.example.com/users/{{user_id}}"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <textarea
        rows={3}
        placeholder={t("headers_placeholder") as string}
        value={headersText}
        onChange={(e) => setHeadersText(e.target.value)}
      />
      <textarea
        rows={5}
        placeholder={t("body_placeholder") as string}
        value={bodyText}
        onChange={(e) => setBodyText(e.target.value)}
      />

      <button
        className="send-btn"
        onClick={handleSend}
        disabled={loading}
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        {loading ? (
          <span
            className="spinner"
            style={{ width: "16px", height: "16px", borderWidth: "2px" }}
          />
        ) : (
          <Send size={18} />
        )}
        {t("send_btn")}
      </button>

      <ResponseBox response={response} loading={loading} />

      <hr style={{ margin: "20px 0" }} />

      <h3>{t("save_to_collection")}</h3>
      <input
        type="text"
        placeholder={t("collection_name") as string}
        value={collName}
        onChange={(e) => setCollName(e.target.value)}
      />
      <input
        type="text"
        placeholder={t("request_name") as string}
        value={reqName}
        onChange={(e) => setReqName(e.target.value)}
      />
      <button onClick={handleSaveToCollection} disabled={savingColl}>
        {savingColl ? "..." : t("save_btn")}
      </button>
    </div>
  );
}
