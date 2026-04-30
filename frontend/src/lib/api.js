const rawApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

export const API_BASE_URL = rawApiBaseUrl.endsWith("/api")
  ? rawApiBaseUrl
  : `${rawApiBaseUrl}/api`;

export function apiUrl(path) {
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}