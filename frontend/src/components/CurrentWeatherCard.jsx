import React from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Sunrise,
  Sunset,
  Clock,
  CloudRain,
  MapPin,
  Calendar,
} from 'lucide-react';
import { getWeatherIconComponent } from '../utils/weatherIcons';
import { formatTemp, formatWind, formatTime, getUvCategory } from '../utils/formatters';

export default function CurrentWeatherCard({ weather, location, unit, onOpenPlanner }) {
  if (!weather) return null;

  const uvInfo = getUvCategory(weather.uv_index);

  return (
    <div className="card current-weather-card">
      <div className="current-header">
        <div className="location-info">
          <div className="location-name-row">
            <MapPin size={22} className="text-sky-400" color="#38bdf8" />
            <h2 className="location-title">
              {location?.name || 'Selected Location'}
            </h2>
          </div>
          <p className="location-details">
            {location?.region ? `${location.region}, ` : ''}
            {location?.country ? `${location.country} • ` : ''}
            <span className="coord-text">
              {weather.timezone || 'Local Timezone'}
            </span>
          </p>
        </div>

        {onOpenPlanner && (
          <button
            type="button"
            className="btn btn-accent plan-trip-btn"
            onClick={onOpenPlanner}
            title="Save trip weather to planner records"
          >
            <Calendar size={16} /> Plan Trip Here
          </button>
        )}
      </div>

      <div className="current-body">
        {/* Main Temperature & Condition */}
        <div className="temp-hero-section">
          <div className="hero-icon-container">
            {getWeatherIconComponent(weather.icon, 72)}
          </div>
          <div className="hero-temp-container">
            <div className="hero-temp">
              {formatTemp(weather.temperature, unit)}
            </div>
            <div className="hero-condition">{weather.condition}</div>
            <div className="hero-feels-like">
              Feels like {formatTemp(weather.apparent_temperature, unit)}
            </div>
          </div>
        </div>

        {/* Observation time */}
        <div className="obs-time-tag">
          <Clock size={14} />
          <span>Local Observation: {weather.time ? formatTime(weather.time) : 'Live'}</span>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="weather-metrics-grid">
          {/* Humidity */}
          <div className="metric-box">
            <div className="metric-header">
              <Droplets size={18} color="#38bdf8" />
              <span className="metric-label">Humidity</span>
            </div>
            <div className="metric-value">{weather.relative_humidity}%</div>
          </div>

          {/* Wind Speed */}
          <div className="metric-box">
            <div className="metric-header">
              <Wind size={18} color="#94a3b8" />
              <span className="metric-label">Wind Speed</span>
            </div>
            <div className="metric-value">{formatWind(weather.wind_speed, unit)}</div>
          </div>

          {/* UV Index */}
          <div className="metric-box">
            <div className="metric-header">
              <Sun size={18} color="#f59e0b" />
              <span className="metric-label">UV Index</span>
            </div>
            <div className="metric-value uv-value-container">
              <span>{weather.uv_index.toFixed(1)}</span>
              <span
                className="uv-pill"
                style={{ backgroundColor: `${uvInfo.color}25`, color: uvInfo.color, borderColor: uvInfo.color }}
              >
                {uvInfo.label}
              </span>
            </div>
          </div>

          {/* Precipitation */}
          <div className="metric-box">
            <div className="metric-header">
              <CloudRain size={18} color="#60a5fa" />
              <span className="metric-label">Precipitation</span>
            </div>
            <div className="metric-value">{weather.precipitation} mm</div>
          </div>

          {/* Sunrise */}
          <div className="metric-box">
            <div className="metric-header">
              <Sunrise size={18} color="#f97316" />
              <span className="metric-label">Sunrise</span>
            </div>
            <div className="metric-value">{weather.sunrise ? formatTime(weather.sunrise) : '--:--'}</div>
          </div>

          {/* Sunset */}
          <div className="metric-box">
            <div className="metric-header">
              <Sunset size={18} color="#ec4899" />
              <span className="metric-label">Sunset</span>
            </div>
            <div className="metric-value">{weather.sunset ? formatTime(weather.sunset) : '--:--'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
