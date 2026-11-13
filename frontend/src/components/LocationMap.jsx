import React, { useEffect, useState } from 'react';
import { Map, ExternalLink } from 'lucide-react';
import { getMapInfo } from '../services/api';

export default function LocationMap({ latitude, longitude, locationName }) {
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (latitude === undefined || longitude === undefined) return;
    let isMounted = true;
    setLoading(true);

    getMapInfo(latitude, longitude)
      .then((data) => {
        if (isMounted) setMapData(data);
      })
      .catch((err) => {
        console.error('Failed to load map data:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [latitude, longitude]);

  if (latitude === undefined || longitude === undefined) return null;

  return (
    <div className="card map-card">
      <div className="map-header">
        <div className="section-title-row">
          <Map size={20} color="#38bdf8" />
          <h3 className="section-title">Destination Map</h3>
        </div>
        {mapData?.osm_url && (
          <a
            href={mapData.osm_url}
            target="_blank"
            rel="noopener noreferrer"
            className="osm-link"
          >
            <span>View Full Map</span>
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      <div className="map-container">
        {mapData?.embed_url ? (
          <iframe
            title={`Map of ${locationName || 'Location'}`}
            src={mapData.embed_url}
            className="map-iframe"
            loading="lazy"
          />
        ) : (
          <div className="map-placeholder">
            <span>Loading interactive map...</span>
          </div>
        )}
      </div>

      <div className="map-footer">
        <span className="map-coords-badge">
          GPS: {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
        </span>
        <span className="map-attribution">
          © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors
        </span>
      </div>
    </div>
  );
}
