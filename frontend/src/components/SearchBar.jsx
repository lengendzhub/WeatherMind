import React, { useState } from 'react';
import { Search, Navigation, Loader2, MapPin } from 'lucide-react';
import { searchLocations } from '../services/api';

const QUICK_LOCATIONS = [
  { name: 'London', country: 'United Kingdom', lat: 51.5085, lon: -0.1257 },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6895, lon: 139.6917 },
  { name: 'Paris', country: 'France', lat: 48.8534, lon: 2.3488 },
  { name: 'Sydney', country: 'Australia', lat: -33.8678, lon: 151.2073 },
];

export default function SearchBar({ onSelectLocation, onGeoError, loading }) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [matches, setMatches] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const handleSearchSubmit = async (e) => {
    e?.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;

    setSearching(true);
    setMatches([]);
    setShowDropdown(false);

    try {
      const results = await searchLocations(q);
      if (results.length === 1) {
        onSelectLocation(results[0]);
        setQuery(results[0].name);
      } else if (results.length > 1) {
        setMatches(results);
        setShowDropdown(true);
      }
    } catch (err) {
      onGeoError(err.message || `No location found for "${q}".`);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectMatch = (match) => {
    onSelectLocation(match);
    setQuery(match.name + (match.country ? `, ${match.country}` : ''));
    setShowDropdown(false);
    setMatches([]);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      onGeoError('Browser geolocation is not supported on this device.');
      return;
    }

    setGeoLoading(true);
    setShowDropdown(false);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoading(false);
        const { latitude, longitude } = pos.coords;
        const myLocation = {
          name: 'My Current Location',
          country: null,
          region: null,
          latitude,
          longitude,
          timezone: null,
        };
        setQuery(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        onSelectLocation(myLocation);
      },
      (err) => {
        setGeoLoading(false);
        let msg = 'Failed to retrieve your location.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Geolocation access was denied. Please allow location access or search manually.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Location information is unavailable.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Geolocation request timed out. Please try again.';
        }
        onGeoError(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="search-section">
      <form onSubmit={handleSearchSubmit} className="search-form">
        <div className="input-group">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, postal code (10001), coordinates (40.7,-74.0), or landmark..."
            disabled={loading || searching || geoLoading}
          />
          {query && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => {
                setQuery('');
                setMatches([]);
                setShowDropdown(false);
              }}
            >
              ×
            </button>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={query.trim().length < 2 || searching || loading}
        >
          {searching ? <Loader2 size={18} className="spin" /> : 'Search'}
        </button>

        <button
          type="button"
          className="btn btn-secondary geo-btn"
          onClick={handleUseMyLocation}
          disabled={geoLoading || loading}
          title="Use GPS Geolocation"
        >
          {geoLoading ? (
            <Loader2 size={18} className="spin" />
          ) : (
            <>
              <Navigation size={18} />
              <span className="btn-label">Use My Location</span>
            </>
          )}
        </button>
      </form>

      {/* Multiple Matches Dropdown */}
      {showDropdown && matches.length > 0 && (
        <div className="matches-dropdown">
          <p className="matches-title">Select a matching location ({matches.length} found):</p>
          <ul className="matches-list">
            {matches.map((item, idx) => (
              <li key={idx} onClick={() => handleSelectMatch(item)} className="match-item">
                <MapPin size={16} className="match-icon" />
                <span className="match-name">{item.name}</span>
                {item.region && <span className="match-region">({item.region})</span>}
                {item.country && <span className="match-country">{item.country}</span>}
                <span className="match-coords">
                  {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick location chips */}
      <div className="quick-chips">
        <span className="chips-label">Popular Destinations:</span>
        {QUICK_LOCATIONS.map((loc) => (
          <button
            key={loc.name}
            type="button"
            className="chip-btn"
            onClick={() => {
              setQuery(loc.name);
              onSelectLocation(loc);
            }}
          >
            {loc.name}
          </button>
        ))}
      </div>
    </div>
  );
}
