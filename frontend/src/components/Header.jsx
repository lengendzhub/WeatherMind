import React, { useEffect, useState } from 'react';
import { CloudSun, Sun, Moon } from 'lucide-react';
import SearchBar from './SearchBar';

const POPULAR_DESTINATIONS = [
  { name: 'London', country: 'United Kingdom', latitude: 51.5085, longitude: -0.1257 },
  { name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.006 },
  { name: 'Tokyo', country: 'Japan', latitude: 35.6895, longitude: 139.6917 },
  { name: 'Paris', country: 'France', latitude: 48.8534, longitude: 2.3488 },
  { name: 'Sydney', country: 'Australia', latitude: -33.8678, longitude: 151.2073 },
];

export default function Header({
  unit,
  setUnit,
  theme,
  setTheme,
  isOnline,
  activeLocation,
  onSelectLocation,
  onGeoError,
  loading,
}) {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isSelected = (dest) =>
    activeLocation?.name?.toLowerCase().includes(dest.name.toLowerCase());

  return (
    <header className="top-navigation-shell">
      {/* Primary Top Bar */}
      <div className="top-bar">
        {/* Brand Left */}
        <div className="brand-group">
          <div className="brand-symbol">
            <CloudSun size={20} strokeWidth={1.5} color="var(--blue-2)" />
          </div>
          <div className="brand-copy">
            <h1 className="brand-heading">WeatherMind</h1>
            <span className="brand-tagline">Travel Weather Planner</span>
          </div>
        </div>

        {/* Spotlight Search Center */}
        <div className="top-search-wrap">
          <SearchBar
            onSelectLocation={onSelectLocation}
            onGeoError={onGeoError}
            loading={loading}
          />
        </div>

        {/* Controls Right */}
        <div className="top-controls-group">
          {/* Live Clock */}
          <div className="glass-capsule clock-capsule" title="Current Local Time">
            <span className="tabular-nums clock-text">{time}</span>
          </div>

          {/* Online/Offline Status Indicator */}
          <div
            className="glass-capsule status-capsule"
            title={isOnline ? 'Network Connected' : 'Offline Mode'}
          >
            <span
              className="status-dot"
              style={{
                backgroundColor: isOnline ? 'var(--green)' : 'var(--gray-1)',
                boxShadow: isOnline ? '0 0 8px var(--green)' : 'none',
              }}
            />
            <span className="status-label">{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* Unit Segmented Toggle */}
          <div className="glass-capsule unit-segmented-control" role="group" aria-label="Temperature unit">
            <button
              type="button"
              className={`segmented-tab ${unit === 'C' ? 'selected' : ''}`}
              onClick={() => setUnit('C')}
              aria-pressed={unit === 'C'}
            >
              °C
            </button>
            <button
              type="button"
              className={`segmented-tab ${unit === 'F' ? 'selected' : ''}`}
              onClick={() => setUnit('F')}
              aria-pressed={unit === 'F'}
            >
              °F
            </button>
          </div>

          {/* Theme Toggle (Light / Dark) */}
          <button
            type="button"
            className="glass-capsule theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <Moon size={15} strokeWidth={1.5} color="var(--indigo)" />
            ) : (
              <Sun size={15} strokeWidth={1.5} color="var(--yellow)" />
            )}
          </button>
        </div>
      </div>

      {/* Popular Destinations Pill Carousel */}
      <div className="destinations-carousel-row" role="region" aria-label="Popular destinations">
        <span className="widget-label carousel-label">Popular:</span>
        <div className="chips-scroller">
          {POPULAR_DESTINATIONS.map((dest) => {
            const active = isSelected(dest);
            return (
              <button
                key={dest.name}
                type="button"
                className={`destination-chip ${active ? 'active' : ''}`}
                onClick={() => onSelectLocation(dest)}
                aria-pressed={active}
              >
                {dest.name}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
