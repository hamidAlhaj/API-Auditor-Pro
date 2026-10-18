import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { EnvironmentVars, AuthType } from "../types";
import * as api from "../services/api";

interface AppContextValue {
  env: EnvironmentVars;
  authType: AuthType;
  refreshEnv: () => Promise<void>;
  updateEnv: (vars: Record<string, string>) => Promise<void>;
  updateAuthType: (t: AuthType) => void;
}
const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [env, setEnvState] = useState<EnvironmentVars>({
    base_url: "",
    token: "",
    username: "",
    password: "",
  });
  const [authType, setAuthType] = useState<AuthType>(
    () => (localStorage.getItem("auth_type") as AuthType) || "none",
  );

  const refreshEnv = useCallback(async () => {
    try {
      const e = await api.getEnvironment();
      setEnvState(e);
    } catch (err) {
      console.error("Failed to fetch env", err);
    }
  }, []);

  const updateEnv = useCallback(async (vars: Record<string, string>) => {
    await api.saveEnvironment(vars);
    setEnvState((prev) => ({ ...prev, ...vars }));
  }, []);

  const updateAuthType = useCallback((t: AuthType) => {
    setAuthType(t);
    localStorage.setItem("auth_type", t);
  }, []);

  useEffect(() => {
    refreshEnv();
  }, [refreshEnv]);

  return (
    <AppContext.Provider
      value={{ env, authType, refreshEnv, updateEnv, updateAuthType }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
