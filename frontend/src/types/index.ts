export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type AuthType = "none" | "bearer" | "basic" | "api_key";
export type Severity = "Critical" | "High" | "Medium" | "Low";
export type TabId = "builder" | "collections" | "scanner" | "history" | "envs";

export interface EnvironmentVars {
  base_url: string;
  token: string;
  username: string;
  password: string;
  [key: string]: string;
}

export interface RequestConfig {
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body?: unknown;
}

export interface ApiResponse {
  status_code: number;
  headers: Record<string, string>;
  body: string;
  json: unknown | null;
  url: string;
  duration: number;
  error?: string | boolean;
}

export interface CollectionRequest {
  name: string;
  method: HttpMethod;
  url: string;
  headers: string;
  body: string;
  created_at: string;
}

export interface Collection {
  name: string;
  requests: CollectionRequest[];
  updated_at: string;
}

export interface Vulnerability {
  vulnerability: string;
  severity: Severity;
  description: string;
  evidence?: string;
  fix: string;
  cvss?: string;
}

export interface ScanConfig {
  target_base: string;
  sql?: {
    endpoint: string;
    param: string;
    method: string;
    injection_point: "query" | "body";
  } | null;
  idor?: { endpoint: string; method: string } | null;
  rate?: { endpoint: string; method: string } | null;
  mass?: { endpoint: string; method: string } | null;
  jwt_token?: string | null;
  broken_auth?: {
    login_endpoint: string;
    login_method: string;
    username_field: string;
    password_field: string;
    test_weak_password: boolean;
    test_username_enum: boolean;
    test_rate_limit: boolean;
    test_reset: boolean;
    reset_endpoint?: string;
    rate_limit_attempts?: number;
    rate_limit_delay?: number;
  } | null;
}

export interface AIAnalysisResult {
  success: boolean;
  analysis: string;
  model?: string;
  analysis_time_seconds?: number;
  predicted_label?: string;
  confidence?: number;
  error?: string;
}

export interface RequestHistoryItem {
  id: number;
  method: string;
  url: string;
  headers: string;
  body: string;
  status: number;
  duration: number;
  timestamp: string;
}

export interface ScanHistoryItem {
  id: number;
  target: string;
  vulnerabilities: Vulnerability[];
  date: string;
}

export type ReportFormat = "html" | "pdf" | "json" | "csv";
