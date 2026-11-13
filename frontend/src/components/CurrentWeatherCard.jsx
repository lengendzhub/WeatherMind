import React from 'react';
import { Calendar, Clock, MapPin, ArrowUp, ArrowDown } from 'lucide-react';
import { getWeatherIconComponent } from '../utils/weatherIcons';
import { formatTemp, formatTime, getHeroGradientClass } from '../utils/formatters';

export default function CurrentWeatherCard({
  weather,
  location,
  unit,
  todayForecast,
  onOpenPlanner,
}) {
  if (!weather) return null;

  const gradientClass = getHeroGradientClass(weather.weather_code, weather.is_day);

  // Derive high/low from today's forecast or current
  const highTemp = todayForecast?.temp_max ?? weather.temperature;
  const lowTemp = todayForecast?.temp_min ?? (weather.temperature - 4);

  return (
    <div className={`widget hero-widget ${gradientClass}`} role="region" aria-label="Current Weather">
      {/* Background ambient lighting overlay */}
      <div className="hero-ambient-glow" />

      {/* Hero Content Shell */}
      <div className="hero-content">
        {/* Top Meta Row */}
        <div className="hero-top-row">
          <div className="hero-location-block">
            <div className="location-heading-group">
              <MapPin size={18} strokeWidth={1.5} className="location-pin-glyph" />
              <h2 className="hero-city-name">{location?.name || 'Selected City'}</h2>
            </div>
            <p className="hero-region-sub">
              {[location?.region, location?.country].filter(Boolean).join(', ') || 'Global Destination'}
              {weather.timezone && (
                <span className="hero-timezone-badge"> • {weather.timezone}</span>
              )}
            </p>
          </div>

          {onOpenPlanner && (
            <button
              type="button"
              className="plan-trip-pill-btn"
              onClick={onOpenPlanner}
              title="Add this destination to Trip Planner"
            >
              <Calendar size={15} strokeWidth={1.5} />
              <span>Plan Trip Here</span>
            </button>
          )}
        </div>

        {/* Centerpiece Hero Temp & Weather Icon */}
        <div className="hero-centerpiece">
          <div className="hero-temp-col">
            <div className="hero-huge-temp tabular-nums">
              {formatTemp(weather.temperature, unit, true)}
            </div>
            <div className="hero-condition-text">{weather.condition}</div>
          </div>

          <div className="hero-icon-col">
            {getWeatherIconComponent(weather.icon, 88, 1.5, 'hero-floating-icon')}
          </div>
        </div>

        {/* Bottom Details Row */}
        <div className="hero-bottom-row">
          <div className="hero-stats-capsules">
            <span className="hero-stat-pill">
              Feels like <strong>{formatTemp(weather.apparent_temperature, unit)}</strong>
            </span>
            <span className="hero-stat-pill temp-range-pill">
              <ArrowUp size={12} strokeWidth={2} color="var(--orange)" />
              <span className="tabular-nums">{formatTemp(highTemp, unit)}</span>
              <span className="range-divider">/</span>
              <ArrowDown size={12} strokeWidth={2} color="var(--sky)" />
              <span className="tabular-nums">{formatTemp(lowTemp, unit)}</span>
            </span>
          </div>

          <div className="hero-observation-pill" title="Time of weather station observation">
            <Clock size={12} strokeWidth={1.5} />
            <span className="widget-label">Observed {formatTime(weather.time)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
