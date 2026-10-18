import { useTranslation } from "react-i18next";
import type { TabId } from "../../types";
import { FileText, Folder, Search, History, Settings } from "lucide-react";

const tabs: { id: TabId; labelKey: string; icon: React.ReactNode }[] = [
  { id: "builder", labelKey: "tab_builder", icon: <FileText size={18} /> },
  {
    id: "collections",
    labelKey: "tab_collections",
    icon: <Folder size={18} />,
  },
  { id: "scanner", labelKey: "tab_scanner", icon: <Search size={18} /> },
  { id: "history", labelKey: "tab_history", icon: <History size={18} /> },
  { id: "envs", labelKey: "tab_envs", icon: <Settings size={18} /> },
];

interface Props {
  active: TabId;
  onChange: (id: TabId) => void;
}

export default function Tabs({ active, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-btn${active === tab.id ? " active" : ""}`}
          onClick={() => onChange(tab.id)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            justifyContent: "center",
          }}
        >
          {tab.icon}
          <span>{t(tab.labelKey)}</span>
        </button>
      ))}
    </div>
  );
}
