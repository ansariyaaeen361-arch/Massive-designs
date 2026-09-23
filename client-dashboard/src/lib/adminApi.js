const API_URL = import.meta.env.VITE_API_URL;
const ADMIN_KEY_STORAGE = 'ma_admin_key';

// A deliberately separate auth realm from the tenant JWT in api.js — the
// agency owner authenticates with the server's ADMIN_API_KEY, never a
// per-site login, and this never touches the tenant session's storage keys.
export function getAdminKey() {
  return localStorage.getItem(ADMIN_KEY_STORAGE);
}

export function setAdminKey(key) {
  localStorage.setItem(ADMIN_KEY_STORAGE, key);
}

export function clearAdminKey() {
  localStorage.removeItem(ADMIN_KEY_STORAGE);
}

class AdminApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function adminRequest(path, options = {}) {
  const key = getAdminKey();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (key) headers['x-admin-key'] = key;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (res.status === 403) {
    clearAdminKey();
    throw new AdminApiError('Invalid admin key.', 403);
  }
  if (!res.ok || data.success === false) {
    throw new AdminApiError(data.message || data.error || 'Request failed', res.status);
  }
  return data;
}

export function adminGet(path) {
  return adminRequest(path);
}

export function adminPost(path, body) {
  return adminRequest(path, { method: 'POST', body: JSON.stringify(body) });
}
