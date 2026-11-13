import React from 'react';
import { Droplets, Wind, Sun, CloudRain, Sunrise, Sunset } from 'lucide-react';
import { formatWind, formatTime, getUvInfo, getSunProgress } from '../utils/formatters';

export function HumidityWidget({ humidity }) {
  const val = typeof humidity === 'number' ? humidity : 0;
  // Circular ring math (radius 32, circumference ~201)
  const radius = 30;
  const circ = 2 * Math.PI * radius;
  const strokeDashoffset = circ - (val / 100) * circ;

  const desc = val < 30 ? 'Dry conditions' : val < 60 ? 'Comfortable humidity' : 'Humid air';

  return (
    <div className="widget metric-widget widget-hoverable">
      <div className="widget-header">
        <Droplets size={14} strokeWidth={1.5} color="var(--sky)" />
        <span className="widget-label">Humidity</span>
      </div>

      <div className="metric-body humidity-body">
        <div className="circular-ring-container">
          <svg className="circular-svg" width="76" height="76" viewBox="0 0 76 76">
            <circle
              className="ring-bg"
              cx="38"
              cy="38"
              r={radius}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              className="ring-progress"
              cx="38"
              cy="38"
              r={radius}
              stroke="var(--sky)"
              strokeWidth="6"
              strokeDasharray={circ}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              transform="rotate(-90 38 38)"
            />
          </svg>
          <div className="ring-centered-value">
            <span className="tabular-nums ring-number">{val}</span>
            <span className="ring-unit">%</span>
          </div>
        </div>
      </div>

      <div className="widget-footer-text">{desc}</div>
    </div>
  );
}

export function WindWidget({ windSpeed, unit }) {
  const { value, unit: windUnit } = formatWind(windSpeed, unit);
  const numSpeed = typeof windSpeed === 'number' ? windSpeed : 0;
  // Rotate needle slightly based on speed
  const rotation = Math.min(numSpeed * 6, 180);

  return (
    <div className="widget metric-widget widget-hoverable">
      <div className="widget-header">
        <Wind size={14} strokeWidth={1.5} color="var(--blue-2)" />
        <span className="widget-label">Wind</span>
      </div>

      <div className="metric-body wind-body">
        <div className="compass-visual">
          <div className="compass-face">
            <span className="compass-point north">N</span>
            <span className="compass-point east">E</span>
            <span className="compass-point south">S</span>
            <span className="compass-point west">W</span>
            <div
              className="compass-needle"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <div className="needle-head" />
            </div>
            <div className="compass-hub" />
          </div>
        </div>

        <div className="metric-numeric-group">
          <span className="metric-value-huge tabular-nums">{value}</span>
          <span className="metric-unit-tag">{windUnit}</span>
        </div>
      </div>

      <div className="widget-footer-text">
        {numSpeed < 10 ? 'Calm breeze' : numSpeed < 25 ? 'Moderate wind' : 'Strong gusts'}
      </div>
    </div>
  );
}

export function UvWidget({ uvIndex }) {
  const { label, color, percent } = getUvInfo(uvIndex);
  const displayVal = typeof uvIndex === 'number' ? uvIndex.toFixed(1) : '0.0';

  return (
    <div className="widget metric-widget widget-hoverable">
      <div className="widget-header">
        <Sun size={14} strokeWidth={1.5} color="var(--yellow)" />
        <span className="widget-label">UV Index</span>
      </div>

      <div className="metric-body uv-body">
        <div className="uv-primary-row">
          <span className="metric-value-huge tabular-nums">{displayVal}</span>
          <span className="uv-level-pill" style={{ color: color }}>
            {label}
          </span>
        </div>

        {/* Horizontal Apple Weather UV Spectrum Bar */}
        <div className="uv-spectrum-track">
          <div
            className="uv-spectrum-thumb"
            style={{ left: `${Math.max(4, Math.min(percent, 96))}%` }}
          />
        </div>
      </div>

      <div className="widget-footer-text">
        {uvIndex >= 6 ? 'Wear sunscreen & sunglasses' : 'Low sun hazard today'}
      </div>
    </div>
  );
}

export function PrecipitationWidget({ precipitation }) {
  const val = typeof precipitation === 'number' ? precipitation : 0;
  const barHeight = Math.min((val / 15) * 100, 100);

  return (
    <div className="widget metric-widget widget-hoverable">
      <div className="widget-header">
        <CloudRain size={14} strokeWidth={1.5} color="var(--sky)" />
        <span className="widget-label">Precipitation</span>
      </div>

      <div className="metric-body precip-body">
        <div className="precip-stat-block">
          <span className="metric-value-huge tabular-nums">{val}</span>
          <span className="metric-unit-tag">mm</span>
        </div>

        <div className="precip-mini-bars" aria-hidden="true">
          <div className="p-bar"><div className="p-bar-fill" style={{ height: `${Math.max(10, barHeight * 0.4)}%` }} /></div>
          <div className="p-bar"><div className="p-bar-fill" style={{ height: `${Math.max(15, barHeight * 0.7)}%` }} /></div>
          <div className="p-bar active"><div className="p-bar-fill" style={{ height: `${Math.max(20, barHeight)}%` }} /></div>
          <div className="p-bar"><div className="p-bar-fill" style={{ height: `${Math.max(10, barHeight * 0.3)}%` }} /></div>
        </div>
      </div>

      <div className="widget-footer-text">
        {val === 0 ? 'No precipitation recorded' : `${val} mm recorded in interval`}
      </div>
    </div>
  );
}

export function SunArcWidget({ sunrise, sunset }) {
  const progress = getSunProgress(sunrise, sunset);
  // Calculate SVG arc point for Sun glyph (parabolic curve across width 240, height 70)
  const arcWidth = 240;
  const arcHeight = 55;
  const normalizedX = (progress / 100) * arcWidth;
  // Parabola y = 4 * H * x * (W - x) / (W^2)
  const normalizedY =
    arcHeight - 4 * arcHeight * (normalizedX / arcWidth) * (1 - normalizedX / arcWidth);

  return (
    <div className="widget metric-widget sun-arc-widget widget-hoverable">
      <div className="widget-header">
        <Sunrise size={14} strokeWidth={1.5} color="var(--orange)" />
        <span className="widget-label">Sun Schedule</span>
      </div>

      <div className="sun-arc-body">
        {/* SVG Sun Arc Curve */}
        <div className="sun-arc-viewport">
          <svg className="sun-arc-svg" viewBox="0 0 240 70" preserveAspectRatio="none">
            {/* Horizon dashed line */}
            <line
              x1="0"
              y1="60"
              x2="240"
              y2="60"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeDasharray="4 4"
            />
            {/* Solar trajectory path */}
            <path
              d="M 10,60 Q 120,5 230,60"
              fill="none"
              stroke="rgba(255, 204, 0, 0.35)"
              strokeWidth="2.5"
              strokeDasharray="3 3"
            />
            {/* Progress filled arc path */}
            <path
              d={`M 10,60 Q ${10 + (normalizedX - 10) / 2},${60 - (60 - normalizedY) * 0.8} ${normalizedX},${normalizedY}`}
              fill="none"
              stroke="var(--yellow)"
              strokeWidth="2.5"
            />
            {/* Animated Glowing Sun Icon Marker */}
            <circle
              cx={Math.max(12, Math.min(normalizedX, 228))}
              cy={Math.max(10, Math.min(normalizedY, 58))}
              r="6.5"
              fill="var(--yellow)"
              filter="drop-shadow(0 0 8px #FFCC00)"
            />
          </svg>
        </div>

        {/* Times footer */}
        <div className="sun-times-row">
          <div className="sun-time-item">
            <span className="sun-time-label">Sunrise</span>
            <span className="tabular-nums sun-time-value">{formatTime(sunrise)}</span>
          </div>
          <div className="sun-time-item right">
            <span className="sun-time-label">Sunset</span>
            <span className="tabular-nums sun-time-value">{formatTime(sunset)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

