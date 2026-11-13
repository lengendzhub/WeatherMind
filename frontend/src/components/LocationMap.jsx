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

  const latLabel = `${Math.abs(latitude).toFixed(4)}° ${latitude >= 0 ? 'N' : 'S'}`;
  const lonLabel = `${Math.abs(longitude).toFixed(4)}° ${longitude >= 0 ? 'E' : 'W'}`;

  return (
    <div className="widget map-widget widget-hoverable" role="region" aria-label="Destination Map">
      <div className="widget-header map-top-bar">
        <div className="header-label-group">
          <Map size={14} strokeWidth={1.5} color="var(--pink)" />
          <span className="widget-label">Destination Map</span>
        </div>

        {mapData?.osm_url && (
          <a
            href={mapData.osm_url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-capsule map-external-link"
            title="Open in OpenStreetMap"
          >
            <span>View Full Map</span>
            <ExternalLink size={12} strokeWidth={1.5} />
          </a>
        )}
      </div>

      <div className="map-viewport">
        {mapData?.embed_url ? (
          <iframe
            title={`Map of ${locationName || 'Destination'}`}
            src={mapData.embed_url}
            className="map-iframe-element"
            loading="lazy"
          />
        ) : (
          <div className="map-shimmer-placeholder skeleton">
            <span className="widget-label">Loading Map...</span>
          </div>
        )}

        {/* Floating Glass GPS Coordinates Chip */}
        <div className="map-coordinates-chip">
          <span className="coord-dot" />
          <span className="tabular-nums coord-text">{latLabel}, {lonLabel}</span>
        </div>

        {/* Tidy Clean OSM Attribution */}
        <div className="map-attribution-badge">
          © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>
        </div>
      </div>
    </div>
  );
}
