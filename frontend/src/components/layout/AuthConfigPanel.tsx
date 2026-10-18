import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../../contexts/AppContext";
import * as api from "../../services/api";

export default function AuthConfigPanel() {
  const { t } = useTranslation();
  const { authType } = useApp();

  const [bearerToken, setBearerToken] = useState("");
  const [basicUser, setBasicUser] = useState("");
  const [basicPass, setBasicPass] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiHeader, setApiHeader] = useState("X-API-Key");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleSetBearer = async () => {
    setSaving(true);
    try {
      await api.setBearer(bearerToken);
      flashSaved();
    } catch (err) {
      alert(`Error: ${err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSetBasic = async () => {
    setSaving(true);
    try {
      await api.setBasic(basicUser, basicPass);
      flashSaved();
    } catch (err) {
      alert(`Error: ${err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSetApiKey = async () => {
    setSaving(true);
    try {
      await api.setApiKey(apiKey, apiHeader);
      flashSaved();
    } catch (err) {
      alert(`Error: ${err}`);
    } finally {
      setSaving(false);
    }
  };

  if (authType === "none") return null;

  if (authType === "bearer") {
    return (
      <>
        <input
          type="password"
          placeholder={t("bearer_token") as string}
          value={bearerToken}
          onChange={(e) => setBearerToken(e.target.value)}
        />
        <button onClick={handleSetBearer} disabled={saving}>
          {saving ? "..." : saved ? "✅" : t("set_bearer")}
        </button>
      </>
    );
  }

  if (authType === "basic") {
    return (
      <>
        <input
          type="text"
          placeholder="Username"
          value={basicUser}
          onChange={(e) => setBasicUser(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={basicPass}
          onChange={(e) => setBasicPass(e.target.value)}
        />
        <button onClick={handleSetBasic} disabled={saving}>
          {saving ? "..." : saved ? "✅" : t("set_basic")}
        </button>
      </>
    );
  }

  if (authType === "api_key") {
    return (
      <>
        <input
          type="text"
          placeholder="API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <input
          type="text"
          placeholder="Header Name"
          value={apiHeader}
          onChange={(e) => setApiHeader(e.target.value)}
        />
        <button onClick={handleSetApiKey} disabled={saving}>
          {saving ? "..." : saved ? "✅" : t("set_api_key")}
        </button>
      </>
    );
  }

  return null;
}
