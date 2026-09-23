const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'ma_dashboard_token';
const SITE_KEY = 'ma_dashboard_site';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getSite() {
  try {
    return JSON.parse(localStorage.getItem(SITE_KEY) || 'null');
  } catch {
    return null;
  }
}

export function setSession(token, site) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(SITE_KEY, JSON.stringify(site));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SITE_KEY);
}

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// Centralizes auth header injection, JSON parsing, and error handling so
// every page/component calls one thing instead of re-implementing fetch.
export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearSession();
    if (window.location.pathname !== '/login') {
      window.location.assign('/login');
    }
    throw new ApiError('Unauthorized', 401);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    // Prefer the human-readable `message` (e.g. "You've reached today's AI
    // question limit...") over the short machine-readable `error` code
    // (e.g. "site_limit") — callers that want the code specifically can
    // still read it off the response body via a failed apiRequest's cause,
    // but nothing in this app currently does.
    throw new ApiError(data.message || data.error || 'Request failed', res.status);
  }
  return data;
}

export function apiGet(path) {
  return apiRequest(path);
}

export function apiPost(path, body) {
  return apiRequest(path, { method: 'POST', body: JSON.stringify(body) });
}

export function apiPatch(path, body) {
  return apiRequest(path, { method: 'PATCH', body: JSON.stringify(body) });
}

export function apiDelete(path, body) {
  return apiRequest(path, { method: 'DELETE', ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
}

// apiRequest always parses the response as JSON, which the export endpoint
// isn't (it's a streamed NDJSON file) — this fetches it directly, still with
// the auth header, and triggers a normal browser file download from the
// resulting blob.
export async function downloadFile(path, filename) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(data.message || data.error || 'Download failed', res.status);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
