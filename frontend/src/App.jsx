import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AlertBanner from './components/AlertBanner';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import {
  HumidityWidget,
  WindWidget,
  UvWidget,
  PrecipitationWidget,
  SunArcWidget,
} from './components/MetricWidgets';
import ForecastGrid from './components/ForecastGrid';
import LocationMap from './components/LocationMap';
import TravelVideos from './components/TravelVideos';
import TripPlannerSection from './components/TripPlannerSection';
import PmaInfoSection from './components/PmaInfoSection';
import { getWeatherOverview } from './services/api';
import './App.css';

const DEFAULT_LOCATION = {
  name: 'London',
  country: 'United Kingdom',
  region: 'England',
  latitude: 51.5085,
  longitude: -0.1257,
  timezone: 'Europe/London',
};

export default function App() {
  // Theme state: defaults to dark or system preference, persisted
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('pma_theme');
    if (saved) return saved;
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  // Temperature unit state (°C or °F)
  const [unit, setUnit] = useState(() => localStorage.getItem('pma_temp_unit') || 'C');

  // Active location and weather
  const [activeLocation, setActiveLocation] = useState(DEFAULT_LOCATION);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Sync theme to root attribute and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pma_theme', theme);
  }, [theme]);

  // Sync unit to localStorage
  useEffect(() => {
    localStorage.setItem('pma_temp_unit', unit);
  }, [unit]);

  // Online / Offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch weather when activeLocation coordinates change
  const fetchWeather = async (loc) => {
    if (!loc) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherOverview(loc.latitude, loc.longitude, 5);
      setWeatherData(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve weather data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(activeLocation);
  }, [activeLocation.latitude, activeLocation.longitude]);

  const handleSelectLocation = (loc) => {
    setActiveLocation(loc);
  };

  const handleScrollToPlanner = () => {
    const el = document.querySelector('.planner-widget');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const current = weatherData?.current;
  const forecast = weatherData?.forecast || [];
  const todayForecast = forecast[0];

  return (
    <div className="bento-viewport">
      {/* Floating System Alert */}
      <AlertBanner
        error={error}
        isOffline={!isOnline}
        onRetry={() => fetchWeather(activeLocation)}
        onDismiss={() => setError(null)}
      />

      {/* Top Navigation Shell */}
      <Header
        unit={unit}
        setUnit={setUnit}
        theme={theme}
        setTheme={setTheme}
        isOnline={isOnline}
        activeLocation={activeLocation}
        onSelectLocation={handleSelectLocation}
        onGeoError={(msg) => setError(msg)}
        loading={loading}
      />

      {/* Main Bento Grid */}
      <main className="bento-canvas">
        {loading && !weatherData ? (
          /* Apple-Style Skeleton Shimmer Grid */
          <div className="bento-grid skeleton-bento">
            <div className="widget hero-widget skeleton" style={{ minHeight: '320px' }} />
            <div className="widget metric-widget skeleton" style={{ minHeight: '150px' }} />
            <div className="widget metric-widget skeleton" style={{ minHeight: '150px' }} />
            <div className="widget metric-widget skeleton" style={{ minHeight: '150px' }} />
            <div className="widget metric-widget skeleton" style={{ minHeight: '150px' }} />
            <div className="widget forecast-widget skeleton" style={{ minHeight: '280px' }} />
            <div className="widget map-widget skeleton" style={{ minHeight: '280px' }} />
          </div>
        ) : (
          <div className="bento-grid">
            {/* 1. Hero Widget (2x2) */}
            <div className="bento-cell cell-hero">
              <CurrentWeatherCard
                weather={current}
                location={activeLocation}
                unit={unit}
                todayForecast={todayForecast}
                onOpenPlanner={handleScrollToPlanner}
              />
            </div>

            {/* 2. Small Metrics (1x1 each) */}
            <div className="bento-cell cell-metric">
              <HumidityWidget humidity={current?.relative_humidity} />
            </div>

            <div className="bento-cell cell-metric">
              <WindWidget windSpeed={current?.wind_speed} unit={unit} />
            </div>

            <div className="bento-cell cell-metric">
              <UvWidget uvIndex={current?.uv_index} />
            </div>

            <div className="bento-cell cell-metric">
              <PrecipitationWidget precipitation={current?.precipitation} />
            </div>

            {/* 3. Wide 2x1 Sun Arc Widget */}
            <div className="bento-cell cell-sun-arc">
              <SunArcWidget
                sunrise={current?.sunrise}
                sunset={current?.sunset}
              />
            </div>

            {/* 4. 5-Day Forecast Widget (Wide) */}
            <div className="bento-cell cell-forecast">
              <ForecastGrid
                forecastDays={forecast}
                currentTemp={current?.temperature}
                unit={unit}
              />
            </div>

            {/* 5. Destination Map Widget (Large) */}
            <div className="bento-cell cell-map">
              <LocationMap
                latitude={activeLocation.latitude}
                longitude={activeLocation.longitude}
                locationName={activeLocation.name}
              />
            </div>

            {/* 6. Travel Inspiration Widget (Wide) */}
            <div className="bento-cell cell-videos">
              <TravelVideos locationName={activeLocation.name} />
            </div>

            {/* 7. Trip Planner CRUD Widget (Full Width) */}
            <div className="bento-cell cell-planner">
              <TripPlannerSection
                activeLocation={activeLocation}
                unit={unit}
              />
            </div>

            {/* 8. PM Accelerator Candidate Attribution (Full Width) */}
            <div className="bento-cell cell-attribution">
              <PmaInfoSection />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
