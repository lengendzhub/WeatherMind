import React, { useState } from 'react';
import { Search, Navigation, Loader2, MapPin, X } from 'lucide-react';
import { searchLocations } from '../services/api';

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
    <div className="spotlight-search-container">
      <form onSubmit={handleSearchSubmit} className="spotlight-form" role="search">
        <div className="spotlight-pill">
          {searching ? (
            <Loader2 size={16} strokeWidth={1.5} className="spin text-secondary" />
          ) : (
            <Search size={16} strokeWidth={1.5} className="search-lead-icon" />
          )}

          <input
            type="text"
            className="spotlight-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, postal code, landmark, or lat,lon..."
            aria-label="Search destination"
            disabled={loading || searching || geoLoading}
          />

          {query && (
            <button
              type="button"
              className="spotlight-icon-btn clear-btn"
              onClick={() => {
                setQuery('');
                setMatches([]);
                setShowDropdown(false);
              }}
              aria-label="Clear query"
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          )}

          <div className="spotlight-divider" />

          <button
            type="button"
            className={`spotlight-icon-btn geo-btn ${geoLoading ? 'loading' : ''}`}
            onClick={handleUseMyLocation}
            disabled={geoLoading || loading}
            aria-label="Use My Location via GPS"
            title="Use My Location"
          >
            {geoLoading ? (
              <Loader2 size={16} strokeWidth={1.5} className="spin" color="var(--blue)" />
            ) : (
              <Navigation size={15} strokeWidth={1.5} color="var(--blue)" />
            )}
          </button>
        </div>
      </form>

      {/* Spotlight Dropdown Matches */}
      {showDropdown && matches.length > 0 && (
        <div className="spotlight-dropdown" role="listbox">
          <div className="dropdown-header">
            <span className="widget-label">Matching Locations ({matches.length})</span>
          </div>
          <div className="dropdown-scroll">
            {matches.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="dropdown-item"
                onClick={() => handleSelectMatch(item)}
              >
                <div className="dropdown-item-leading">
                  <MapPin size={16} strokeWidth={1.5} color="var(--blue)" />
                </div>
                <div className="dropdown-item-content">
                  <div className="dropdown-item-title">{item.name}</div>
                  <div className="dropdown-item-sub">
                    {[item.region, item.country].filter(Boolean).join(', ')}
                  </div>
                </div>
                <div className="dropdown-item-trailing tabular-nums">
                  {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
