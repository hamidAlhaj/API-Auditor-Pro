import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../../contexts/AppContext";
import type { AuthType } from "../../types";
import AuthConfigPanel from "./AuthConfigPanel";
import { Shield, Globe, Lock } from "lucide-react";

export default function Sidebar() {
  const { t } = useTranslation();
  const { env, authType, updateAuthType, updateEnv } = useApp();

  const [baseUrl, setBaseUrl] = useState(env.base_url || "");
  const [token, setToken] = useState(env.token || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync when env loaded from server
  useEffect(() => {
    setBaseUrl(env.base_url || "");
    setToken(env.token || "");
  }, [env.base_url, env.token]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateEnv({ base_url: baseUrl, token });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (err) {
      alert(`Error: ${err}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sidebar-content">
      {" "}
      <h2
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <Shield size={28} color="var(--btn-primary-bg)" /> {t("app_name")}
      </h2>
      <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Globe size={20} /> {t("env_title")}
      </h3>
      <input
        type="text"
        placeholder="Base URL"
        value={baseUrl}
        onChange={(e) => setBaseUrl(e.target.value)}
      />
      <input
        type="password"
        placeholder="Bearer Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button onClick={handleSave} disabled={saving}>
        {saving ? "..." : saved ? "✅" : t("save_env")}
      </button>
      <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Lock size={20} /> {t("auth_title")}
      </h3>
      <select
        value={authType}
        onChange={(e) => updateAuthType(e.target.value as AuthType)}
      >
        <option value="none">{t("auth_none")}</option>
        <option value="bearer">{t("auth_bearer")}</option>
        <option value="basic">{t("auth_basic")}</option>
        <option value="api_key">{t("auth_apikey")}</option>
      </select>
      <AuthConfigPanel />
    </div>
  );
}
