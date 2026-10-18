import { useTranslation } from "react-i18next";
import type { ApiResponse } from "../../types";

interface Props {
  response: ApiResponse | null;
  loading: boolean;
}

export default function ResponseBox({ response, loading }: Props) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="response-box">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="spinner" />
          <span>{t("loading")}</span>
        </div>
      </div>
    );
  }

  if (!response) {
    return <div className="response-box">{t("response_placeholder")}</div>;
  }

  return (
    <div className="response-box">
      <pre
        style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}
      >
        {JSON.stringify(response, null, 2)}
      </pre>
    </div>
  );
}
