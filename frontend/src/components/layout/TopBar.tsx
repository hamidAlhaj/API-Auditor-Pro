import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Sun, Moon, Languages, Menu } from "lucide-react";

interface Props {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: Props) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLanguage } = useLanguage();

  return (
    <div className="top-bar">
      {/* زر القائمة يظهر فقط في الشاشات الصغيرة */}
      <button
        onClick={onMenuClick}
        style={{
          display: "flex",
          alignItems: "center",
          background: "transparent",
          border: "none",
          color: "var(--text-primary)",
          cursor: "pointer",
        }}
        className="mobile-menu-btn"
      >
        <Menu size={28} />
      </button>

      <style>{`.mobile-menu-btn { display: none !important; } @media (max-width: 768px) { .mobile-menu-btn { display: block !important; } }`}</style>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={toggleTheme}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          {theme === "dark" ? t("light_mode") : t("dark_mode")}
        </button>
        <button
          onClick={toggleLanguage}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Languages size={18} />
          {lang === "ar" ? "English" : "العربية"}
        </button>
      </div>
    </div>
  );
}
