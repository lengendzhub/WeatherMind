import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Droplets, SunMedium } from 'lucide-react';
import { getWeatherIconComponent } from '../utils/weatherIcons';
import { formatTemp, formatDayName } from '../utils/formatters';

export default function ForecastGrid({ forecastDays, currentTemp, unit }) {
  const [expandedDate, setExpandedDate] = useState(null);

  if (!forecastDays || forecastDays.length === 0) return null;

  // Compute absolute min & max across the 5 days to normalize the bar widths
  const allMins = forecastDays.map((d) => d.temp_min).filter((v) => typeof v === 'number');
  const allMaxs = forecastDays.map((d) => d.temp_max).filter((v) => typeof v === 'number');
  const overallMin = allMins.length ? Math.min(...allMins) : 0;
  const overallMax = allMaxs.length ? Math.max(...allMaxs) : 35;
  const rangeSpan = Math.max(overallMax - overallMin, 1);

  const toggleExpand = (date) => {
    setExpandedDate((prev) => (prev === date ? null : date));
  };

  return (
    <div className="widget forecast-widget widget-hoverable" role="region" aria-label="5-Day Forecast">
      <div className="widget-header">
        <Calendar size={14} strokeWidth={1.5} color="var(--blue-2)" />
        <span className="widget-label">5-Day Weather Outlook</span>
      </div>

      <div className="forecast-rows-list">
        {forecastDays.map((day, idx) => {
          const isToday = idx === 0;
          const isExpanded = expandedDate === day.date;
          const rainProb = day.precipitation_probability_max ?? 0;

          // Normalize bar start and width as percentage of global weekly span
          const leftPercent = Math.max(0, ((day.temp_min - overallMin) / rangeSpan) * 100);
          const barWidthPercent = Math.max(
            12,
            Math.min(100 - leftPercent, ((day.temp_max - day.temp_min) / rangeSpan) * 100)
          );

          // Position of current temperature dot on today's bar
          let currentDotPercent = null;
          if (isToday && typeof currentTemp === 'number') {
            const tempClamped = Math.max(day.temp_min, Math.min(currentTemp, day.temp_max));
            const innerSpan = Math.max(day.temp_max - day.temp_min, 1);
            currentDotPercent = ((tempClamped - day.temp_min) / innerSpan) * 100;
          }

          return (
            <div key={day.date || idx} className="forecast-item-wrap">
              <button
                type="button"
                className={`forecast-row-btn ${isExpanded ? 'expanded' : ''}`}
                onClick={() => toggleExpand(day.date)}
                aria-expanded={isExpanded}
              >
                {/* Day Name */}
                <span className="forecast-day-label">
                  {isToday ? 'Today' : formatDayName(day.date)}
                </span>

                {/* Weather Glyph */}
                <div className="forecast-icon-cell">
                  {getWeatherIconComponent(day.icon, 24, 1.5)}
                </div>

                {/* Rain probability */}
                <div className="forecast-rain-cell tabular-nums">
                  {rainProb > 0 ? (
                    <span className="rain-prob-pill">{rainProb}%</span>
                  ) : (
                    <span className="rain-prob-empty">—</span>
                  )}
                </div>

                {/* Min Temp */}
                <span className="forecast-temp-min tabular-nums">
                  {formatTemp(day.temp_min, unit)}
                </span>

                {/* Apple-Style Continuous Temperature Range Bar */}
                <div className="forecast-bar-track">
                  <div
                    className="forecast-bar-range"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${barWidthPercent}%`,
                    }}
                  >
                    {currentDotPercent !== null && (
                      <span
                        className="forecast-today-dot"
                        style={{ left: `${currentDotPercent}%` }}
                        title={`Current: ${formatTemp(currentTemp, unit)}`}
                      />
                    )}
                  </div>
                </div>

                {/* Max Temp */}
                <span className="forecast-temp-max tabular-nums">
                  {formatTemp(day.temp_max, unit)}
                </span>

                {/* Expand Indicator */}
                <div className="forecast-expand-arrow">
                  {isExpanded ? (
                    <ChevronUp size={14} strokeWidth={1.5} color="var(--gray-1)" />
                  ) : (
                    <ChevronDown size={14} strokeWidth={1.5} color="var(--gray-1)" />
                  )}
                </div>
              </button>

              {/* Expandable Details Drawer */}
              {isExpanded && (
                <div className="forecast-drawer-details">
                  <div className="drawer-item">
                    <span className="drawer-label">Condition</span>
                    <span className="drawer-value">{day.condition}</span>
                  </div>
                  <div className="drawer-item">
                    <Droplets size={13} strokeWidth={1.5} color="var(--sky)" />
                    <span className="drawer-label">Rain Total</span>
                    <span className="drawer-value tabular-nums">{day.precipitation_sum} mm</span>
                  </div>
                  {day.uv_index_max !== null && day.uv_index_max !== undefined && (
                    <div className="drawer-item">
                      <SunMedium size={13} strokeWidth={1.5} color="var(--yellow)" />
                      <span className="drawer-label">Peak UV</span>
                      <span className="drawer-value tabular-nums">{day.uv_index_max.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
