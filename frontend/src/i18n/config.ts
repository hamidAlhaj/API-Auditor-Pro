import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { ar, en } from "./translations";

const saved = (localStorage.getItem("lang") as "ar" | "en") || "ar";

i18n.use(initReactI18next).init({
  resources: { ar: { translation: ar }, en: { translation: en } },
  lng: saved,
  fallbackLng: "ar",
  interpolation: { escapeValue: false },
});

export default i18n;
