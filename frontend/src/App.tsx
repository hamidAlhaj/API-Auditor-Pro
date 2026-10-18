import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AppProvider } from "./contexts/AppContext";
import Layout from "./components/layout/Layout.tsx";

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppProvider>
          <Layout />
        </AppProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
