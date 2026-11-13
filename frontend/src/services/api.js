// Safely normalize API_BASE: handles trailing slashes, empty local fallbacks, and ensures no duplicate /api
const rawEnvUrl = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
const API_BASE = rawEnvUrl
  ? (rawEnvUrl.endsWith('/api') ? rawEnvUrl : `${rawEnvUrl}/api`)
  : '/api';

export async function searchLocations(query) {
  const resp = await fetch(`${API_BASE}/locations/search?q=${encodeURIComponent(query)}`);
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: 'Failed to search location' }));
    throw new Error(err.detail || `Search failed with status ${resp.status}`);
  }
  return resp.json();
}

export async function getCurrentWeather(latitude, longitude) {
  const resp = await fetch(`${API_BASE}/weather/current?latitude=${latitude}&longitude=${longitude}`);
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: 'Failed to fetch current weather' }));
    throw new Error(err.detail || `Weather fetch failed with status ${resp.status}`);
  }
  return resp.json();
}

export async function getForecast(latitude, longitude, days = 5) {
  const resp = await fetch(`${API_BASE}/weather/forecast?latitude=${latitude}&longitude=${longitude}&days=${days}`);
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: 'Failed to fetch forecast' }));
    throw new Error(err.detail || `Forecast fetch failed with status ${resp.status}`);
  }
  return resp.json();
}

export async function getWeatherOverview(latitude, longitude, days = 5) {
  const resp = await fetch(`${API_BASE}/weather/overview?latitude=${latitude}&longitude=${longitude}&days=${days}`);
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: 'Failed to fetch weather overview' }));
    throw new Error(err.detail || `Weather overview failed with status ${resp.status}`);
  }
  return resp.json();
}

export async function listRecords() {
  const resp = await fetch(`${API_BASE}/records`);
  if (!resp.ok) {
    throw new Error(`Failed to list records: ${resp.statusText}`);
  }
  return resp.json();
}

export async function createRecord(payload) {
  const resp = await fetch(`${API_BASE}/records`, {
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
  const resp = await fetch(`${API_BASE}/records/${id}`, {
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
  const resp = await fetch(`${API_BASE}/records/${id}`, {
    method: 'DELETE',
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: 'Failed to delete record' }));
    throw new Error(err.detail || `Delete failed with status ${resp.status}`);
  }
  return resp.json();
}

export function getExportUrl(recordId = null, format = 'json') {
  if (recordId) {
    return `${API_BASE}/records/${recordId}/export?format=${format}`;
  }
  return `${API_BASE}/records/export?format=${format}`;
}

export async function getMapInfo(latitude, longitude, zoom = 11) {
  const resp = await fetch(`${API_BASE}/media/map?latitude=${latitude}&longitude=${longitude}&zoom=${zoom}`);
  if (!resp.ok) {
    throw new Error('Failed to load map data');
  }
  return resp.json();
}

export async function getTravelVideos(query) {
  const resp = await fetch(`${API_BASE}/media/videos?q=${encodeURIComponent(query)}`);
  if (!resp.ok) {
    return { available: false, videos: [] };
  }
  return resp.json();
}

