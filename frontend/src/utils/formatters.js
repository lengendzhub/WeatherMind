export function toFahrenheit(celsius) {
  if (celsius === null || celsius === undefined) return null;
  return (celsius * 9) / 5 + 32;
}

export function formatTemp(celsius, unit = 'C') {
  if (celsius === null || celsius === undefined) return '--';
  const val = unit === 'F' ? toFahrenheit(celsius) : celsius;
  return `${Math.round(val)}°${unit}`;
}

export function formatWind(kmh, unit = 'C') {
  if (kmh === null || kmh === undefined) return '--';
  if (unit === 'F') {
    const mph = kmh * 0.621371;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatDate(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDayName(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((d - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}

export function formatTime(isoDateTime) {
  if (!isoDateTime) return '--:--';
  const d = new Date(isoDateTime);
  if (isNaN(d.getTime())) return isoDateTime.split('T')[1] || isoDateTime;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function getUvCategory(uv) {
  if (uv === null || uv === undefined) return { label: 'N/A', color: 'gray' };
  if (uv < 3) return { label: 'Low', color: '#10b981' };
  if (uv < 6) return { label: 'Moderate', color: '#f59e0b' };
  if (uv < 8) return { label: 'High', color: '#f97316' };
  if (uv < 11) return { label: 'Very High', color: '#ef4444' };
  return { label: 'Extreme', color: '#8b5cf6' };
}
