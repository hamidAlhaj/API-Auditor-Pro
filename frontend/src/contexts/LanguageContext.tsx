import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

type Lang = "ar" | "en";
interface LanguageContextValue {
  lang: Lang;
  toggleLanguage: () => void;
}
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const lang = (i18n.language as Lang) || "ar";

  useEffect(() => {
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);
    document.body.classList.toggle("ltr", lang === "en");
    localStorage.setItem("lang", lang);
  }, [lang]);

  const toggleLanguage = () => i18n.changeLanguage(lang === "ar" ? "en" : "ar");

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
