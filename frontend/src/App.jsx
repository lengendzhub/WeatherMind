import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AlertBanner from './components/AlertBanner';
import SearchBar from './components/SearchBar';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import ForecastGrid from './components/ForecastGrid';
import LocationMap from './components/LocationMap';
import TripPlannerSection from './components/TripPlannerSection';
import TravelVideos from './components/TravelVideos';
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
  const [unit, setUnit] = useState(() => localStorage.getItem('pma_temp_unit') || 'C');
  const [activeLocation, setActiveLocation] = useState(DEFAULT_LOCATION);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Sync unit preference to localStorage
  useEffect(() => {
    localStorage.setItem('pma_temp_unit', unit);
  }, [unit]);

  // Online / Offline listener
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

  // Fetch weather when activeLocation changes
  const fetchWeather = async (loc) => {
    if (!loc) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherOverview(loc.latitude, loc.longitude, 5);
      setWeatherData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data for this location.');
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
    const el = document.querySelector('.planner-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-layout">
      <Header unit={unit} setUnit={setUnit} isOnline={isOnline} />

      <main className="main-content">
        <AlertBanner
          error={error}
          isOffline={!isOnline}
          onRetry={() => fetchWeather(activeLocation)}
          onDismiss={() => setError(null)}
        />

        <SearchBar
          onSelectLocation={handleSelectLocation}
          onGeoError={(msg) => setError(msg)}
          loading={loading}
        />

        {/* Live Weather Section */}
        {weatherData && (
          <>
            <CurrentWeatherCard
              weather={weatherData.current}
              location={activeLocation}
              unit={unit}
              onOpenPlanner={handleScrollToPlanner}
            />

            <ForecastGrid
              forecastDays={weatherData.forecast}
              unit={unit}
            />

            {/* Side-by-side Map & Travel Inspiration */}
            <div className="location-media-grid">
              <LocationMap
                latitude={activeLocation.latitude}
                longitude={activeLocation.longitude}
                locationName={activeLocation.name}
              />
              <TravelVideos locationName={activeLocation.name} />
            </div>
          </>
        )}

        {/* Trip Planner & Saved Weather Records (CRUD) */}
        <TripPlannerSection
          activeLocation={activeLocation}
          unit={unit}
        />

        {/* PM Accelerator & Student Attribution Section */}
        <PmaInfoSection />
      </main>
    </div>
  );
}
