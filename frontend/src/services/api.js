// Cloud fallback backend URL hosted on Render
const FALLBACK_PROD_API = 'https://weathermind-u12d.onrender.com/api';

const isBrowser = typeof window !== 'undefined';
const isLocalhost = isBrowser && Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname === '0.0.0.0'
);

// Read and sanitize Vite environment variable
let rawEnv = (import.meta.env.VITE_API_BASE_URL || '').trim();

// If on HTTPS, upgrade http:// to https:// to prevent browser Mixed Content blocking
if (isBrowser && window.location.protocol === 'https:' && rawEnv.startsWith('http://')) {
  rawEnv = rawEnv.replace(/^http:\/\//, 'https://');
}

rawEnv = rawEnv.replace(/\/+$/, '');

export function getResolvedApiBase() {
  if (rawEnv) {
    return rawEnv.endsWith('/api') ? rawEnv : `${rawEnv}/api`;
  }
  // In production (e.g. Render static site, Vercel) or whenever not on localhost, use the cloud backend
  if (!isLocalhost) {
    return FALLBACK_PROD_API;
  }
  // In local development, default to '/api' proxied to http://127.0.0.1:8000 by Vite
  return '/api';
}

let activeApiBase = getResolvedApiBase();

/**
 * Resilient request wrapper:
 * Automatically retries against the live Render cloud backend if the local server is unreachable.
 */
async function apiRequest(path, options = {}) {
  const url = `${activeApiBase}${path}`;
  try {
    const resp = await fetch(url, options);
    return resp;
  } catch (err) {
    // If local dev server failed to connect (e.g., local backend stopped) and we are not already on cloud API:
    if (activeApiBase !== FALLBACK_PROD_API) {
      console.warn(`[WeatherMind] Failed to reach local backend at ${url}. Automatically falling back to live cloud backend: ${FALLBACK_PROD_API}`);
      try {
        const fallbackResp = await fetch(`${FALLBACK_PROD_API}${path}`, options);
        // Lock to cloud API for subsequent requests in this session
        activeApiBase = FALLBACK_PROD_API;
        return fallbackResp;
      } catch (fallbackErr) {
        throw err;
      }
    }
    throw err;
  }
}

export async function searchLocations(query) {
  const resp = await apiRequest(`/locations/search?q=${encodeURIComponent(query)}`);
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: 'Failed to search location' }));
    throw new Error(err.detail || `Search failed with status ${resp.status}`);
  }
  return resp.json();
}

export async function getCurrentWeather(latitude, longitude) {
  const resp = await apiRequest(`/weather/current?latitude=${latitude}&longitude=${longitude}`);
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: 'Failed to fetch current weather' }));
    throw new Error(err.detail || `Weather fetch failed with status ${resp.status}`);
  }
  return resp.json();
}

export async function getForecast(latitude, longitude, days = 5) {
  const resp = await apiRequest(`/weather/forecast?latitude=${latitude}&longitude=${longitude}&days=${days}`);
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: 'Failed to fetch forecast' }));
    throw new Error(err.detail || `Forecast fetch failed with status ${resp.status}`);
  }
  return resp.json();
}

export async function getWeatherOverview(latitude, longitude, days = 5) {
  const resp = await apiRequest(`/weather/overview?latitude=${latitude}&longitude=${longitude}&days=${days}`);
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: 'Failed to fetch weather overview' }));
    throw new Error(err.detail || `Weather overview failed with status ${resp.status}`);
  }
  return resp.json();
}

export async function listRecords() {
  const resp = await apiRequest('/records');
  if (!resp.ok) {
    throw new Error(`Failed to list records: ${resp.statusText}`);
  }
  return resp.json();
}

export async function createRecord(payload) {
  const resp = await apiRequest('/records', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: 'Failed to create record' }));
    throw new Error(err.detail || `Creation failed with status ${resp.status}`);
  }
  return resp.json();
}

export async function updateRecord(id, payload) {
  const resp = await apiRequest(`/records/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: 'Failed to update record' }));
    throw new Error(err.detail || `Update failed with status ${resp.status}`);
  }
  return resp.json();
}

export async function deleteRecord(id) {
  const resp = await apiRequest(`/records/${id}`, {
    method: 'DELETE',
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: 'Failed to delete record' }));
    throw new Error(err.detail || `Delete failed with status ${resp.status}`);
  }
  return resp.json();
}

export function getExportUrl(recordId = null, format = 'json') {
  // If active base is relative '/api' on a remote host, ensure fallback to cloud backend
  const base = (!isLocalhost && activeApiBase === '/api') ? FALLBACK_PROD_API : activeApiBase;
  if (recordId) {
    return `${base}/records/${recordId}/export?format=${format}`;
  }
  return `${base}/records/export?format=${format}`;
}

export async function getMapInfo(latitude, longitude, zoom = 11) {
  const resp = await apiRequest(`/media/map?latitude=${latitude}&longitude=${longitude}&zoom=${zoom}`);
  if (!resp.ok) {
    throw new Error('Failed to load map data');
  }
  return resp.json();
}

export async function getTravelVideos(query) {
  const resp = await apiRequest(`/media/videos?q=${encodeURIComponent(query)}`);
  if (!resp.ok) {
    return { available: false, videos: [] };
  }
  return resp.json();
}
