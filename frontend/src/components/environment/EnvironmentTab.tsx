import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../../contexts/AppContext";

export default function EnvironmentTab() {
  const { t } = useTranslation();
  const { env, updateEnv } = useApp();

  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!key) return;
    setSaving(true);
    try {
      await updateEnv({ [key]: value });
      setKey("");
      setValue("");
    } catch (err) {
      alert("Failed to save variable");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <h3>{t("manage_env")}</h3>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          marginTop: "15px",
        }}
      >
        <input
          type="text"
          placeholder={t("key") as string}
          value={key}
          onChange={(e) => setKey(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid var(--input-border)",
            background: "var(--input-bg)",
            color: "var(--text-primary)",
          }}
        />
        <input
          type="text"
          placeholder={t("value") as string}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid var(--input-border)",
            background: "var(--input-bg)",
            color: "var(--text-primary)",
          }}
        />
        <button onClick={handleAdd} disabled={saving}>
          {saving ? "..." : t("add_var")}
        </button>
      </div>

      <pre
        style={{
          background: "var(--input-bg)",
          padding: "15px",
          borderRadius: "8px",
          overflowX: "auto",
        }}
      >
        {JSON.stringify(env, null, 2)}
      </pre>
    </div>
  );
}
