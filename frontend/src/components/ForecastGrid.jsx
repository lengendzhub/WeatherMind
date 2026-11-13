import React from 'react';
import { Calendar, Umbrella, ArrowUp, ArrowDown } from 'lucide-react';
import { getWeatherIconComponent } from '../utils/weatherIcons';
import { formatTemp, formatDate, formatDayName } from '../utils/formatters';

export default function ForecastGrid({ forecastDays, unit }) {
  if (!forecastDays || forecastDays.length === 0) return null;

  return (
    <div className="forecast-section">
      <div className="section-title-row">
        <Calendar size={20} color="#38bdf8" />
        <h3 className="section-title">5-Day Travel Weather Outlook</h3>
      </div>

      <div className="forecast-grid">
        {forecastDays.map((day, idx) => {
          const rainProb = day.precipitation_probability_max ?? 0;
          return (
            <div key={day.date || idx} className="forecast-card">
              <div className="forecast-day-header">
                <span className="forecast-day-name">{formatDayName(day.date)}</span>
                <span className="forecast-date-sub">{formatDate(day.date)}</span>
              </div>

              <div className="forecast-icon-box">
                {getWeatherIconComponent(day.icon, 44)}
              </div>

              <div className="forecast-condition-label">{day.condition}</div>

              {/* High / Low temps */}
              <div className="forecast-temp-range">
                <div className="temp-high" title="Maximum Temperature">
                  <ArrowUp size={14} color="#f87171" />
                  <span>{formatTemp(day.temp_max, unit)}</span>
                </div>
                <div className="temp-low" title="Minimum Temperature">
                  <ArrowDown size={14} color="#60a5fa" />
                  <span>{formatTemp(day.temp_min, unit)}</span>
                </div>
              </div>

              {/* Rain Chance */}
              <div className="forecast-rain-info">
                <div className="rain-label-row">
                  <Umbrella size={14} color="#38bdf8" />
                  <span>{rainProb}% rain</span>
                </div>
                <div className="rain-bar-bg">
                  <div
                    className="rain-bar-fill"
                    style={{
                      width: `${Math.min(rainProb, 100)}%`,
                      backgroundColor: rainProb > 50 ? '#3b82f6' : '#93c5fd',
                    }}
                  />
                </div>
                {day.precipitation_sum > 0 && (
                  <span className="precip-sum-text">{day.precipitation_sum} mm</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
