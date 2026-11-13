export function toFahrenheit(celsius) {
  if (celsius === null || celsius === undefined) return null;
  return (celsius * 9) / 5 + 32;
}

export function formatTemp(celsius, unit = 'C', showDegree = true) {
  if (celsius === null || celsius === undefined) return '--';
  const val = unit === 'F' ? toFahrenheit(celsius) : celsius;
  const rounded = Math.round(val);
  return showDegree ? `${rounded}°` : `${rounded}`;
}

export function formatWind(kmh, unit = 'C') {
  if (kmh === null || kmh === undefined) return { value: '--', unit: 'km/h' };
  if (unit === 'F') {
    const mph = kmh * 0.621371;
    return { value: Math.round(mph), unit: 'mph' };
  }
  return { value: Math.round(kmh), unit: 'km/h' };
}

export function formatDate(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString(undefined, {
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
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}

export function formatTime(isoDateTime) {
  if (!isoDateTime) return '--:--';
  const d = new Date(isoDateTime);
  if (isNaN(d.getTime())) return isoDateTime.split('T')[1] || isoDateTime;
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function getUvInfo(uv) {
  const num = typeof uv === 'number' ? uv : 0;
  if (num < 3) {
    return { label: 'Low', color: 'var(--green)', percent: Math.min((num / 11) * 100, 100) };
  }
  if (num < 6) {
    return { label: 'Moderate', color: 'var(--yellow)', percent: Math.min((num / 11) * 100, 100) };
  }
  if (num < 8) {
    return { label: 'High', color: 'var(--orange)', percent: Math.min((num / 11) * 100, 100) };
  }
  if (num < 11) {
    return { label: 'Very High', color: 'var(--red)', percent: Math.min((num / 11) * 100, 100) };
  }
  return { label: 'Extreme', color: 'var(--indigo)', percent: 100 };
}

export function getSunProgress(sunriseIso, sunsetIso) {
  if (!sunriseIso || !sunsetIso) return 50;
  const now = new Date();
  const rise = new Date(sunriseIso);
  const set = new Date(sunsetIso);

  if (now < rise) return 0;
  if (now > set) return 100;
  const total = set.getTime() - rise.getTime();
  const elapsed = now.getTime() - rise.getTime();
  return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
}

export function getHeroGradientClass(weatherCode, isDay = 1) {
  if (isDay === 0) {
    return 'hero-gradient-night';
  }
  // Rain / Showers / Drizzle
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    return 'hero-gradient-rain';
  }
  // Thunderstorm
  if ([95, 96, 99].includes(weatherCode)) {
    return 'hero-gradient-storm';
  }
  // Fog / Overcast
  if ([3, 45, 48].includes(weatherCode)) {
    return 'hero-gradient-cloudy';
  }
  // Check sunset/golden hour
  const nowHour = new Date().getHours();
  if (nowHour >= 17 && nowHour <= 19) {
    return 'hero-gradient-sunset';
  }
  // Clear / Mainly clear day
  return 'hero-gradient-clear-day';
}
