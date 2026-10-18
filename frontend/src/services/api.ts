import type {
  EnvironmentVars,
  ApiResponse,
  RequestConfig,
  Collection,
  CollectionRequest,
  ScanConfig,
  Vulnerability,
  AIAnalysisResult,
  RequestHistoryItem,
  ScanHistoryItem,
  ReportFormat,
} from "../types";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json();
}

export const getEnvironment = () =>
  request<EnvironmentVars>("/api/environment");

export const saveEnvironment = (vars: Record<string, string>) =>
  request<{ status: string }>("/api/environment", {
    method: "POST",
    body: JSON.stringify(vars),
  });

export const setBearer = (token: string) =>
  request<{ status: string }>("/api/auth/bearer", {
    method: "POST",
    body: JSON.stringify({ token }),
  });

export const setBasic = (username: string, password: string) =>
  request<{ status: string }>("/api/auth/basic", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

export const setApiKey = (key: string, header: string) =>
  request<{ status: string }>("/api/auth/api_key", {
    method: "POST",
    body: JSON.stringify({ key, header }),
  });

export const sendRequest = (cfg: RequestConfig) =>
  request<ApiResponse>("/api/send_request", {
    method: "POST",
    body: JSON.stringify(cfg),
  });

export const listCollections = () => request<string[]>("/api/collections");

export const loadCollection = (name: string) =>
  request<Collection>(`/api/collections/${encodeURIComponent(name)}`);

export const saveCollection = (name: string, requests: CollectionRequest[]) =>
  request<{ status: string }>(`/api/collections/${encodeURIComponent(name)}`, {
    method: "POST",
    body: JSON.stringify({ requests }),
  });

export const addToCollection = (name: string, req: CollectionRequest) =>
  request<{ status: string }>(
    `/api/collections/${encodeURIComponent(name)}/requests`,
    { method: "POST", body: JSON.stringify(req) },
  );

export const getRequestHistory = (limit = 20) =>
  request<RequestHistoryItem[]>(`/api/history/requests?limit=${limit}`);

export const getScanHistory = (limit = 10) =>
  request<ScanHistoryItem[]>(`/api/history/scans?limit=${limit}`);

export const runScan = (config: ScanConfig) =>
  request<Vulnerability[]>("/api/scan", {
    method: "POST",
    body: JSON.stringify(config),
  });

export async function exportReport(
  format: ReportFormat,
  results: Vulnerability[],
  target: string,
): Promise<{ type: "text" | "blob" | "json"; data: string | Blob | unknown }> {
  const res = await fetch(`/api/report/${format}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ results, target }),
  });
  if (!res.ok) throw new Error(`Export failed: ${res.status}`);
  if (format === "html" || format === "csv")
    return { type: "text", data: await res.text() };
  if (format === "pdf") return { type: "blob", data: await res.blob() };
  return { type: "json", data: await res.json() };
}

export const analyzeWithAI = (vulnerabilities: Vulnerability[]) =>
  request<AIAnalysisResult>("/api/ai/analyze", {
    method: "POST",
    body: JSON.stringify({ vulnerabilities }),
  });

export const getAIStatus = () =>
  request<{ available: boolean; model: string }>("/api/ai/status");
