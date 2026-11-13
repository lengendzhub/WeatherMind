import React, { useEffect, useState } from 'react';
import { Map, ExternalLink, Maximize2, X, ZoomIn, ZoomOut, MapPin } from 'lucide-react';
import { getMapInfo } from '../services/api';

export default function LocationMap({ latitude, longitude, locationName }) {
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(12);

  useEffect(() => {
    if (latitude === undefined || longitude === undefined) return;
    let isMounted = true;
    setLoading(true);

    getMapInfo(latitude, longitude, zoomLevel)
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
  }, [latitude, longitude, zoomLevel]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };
    if (isExpanded) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  if (latitude === undefined || longitude === undefined) return null;

  const latLabel = `${Math.abs(latitude).toFixed(4)}° ${latitude >= 0 ? 'N' : 'S'}`;
  const lonLabel = `${Math.abs(longitude).toFixed(4)}° ${longitude >= 0 ? 'E' : 'W'}`;

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.min(prev + 1, 18));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.max(prev - 1, 3));
  };

  return (
    <>
      <div className="widget map-widget widget-hoverable" role="region" aria-label="Destination Map">
        <div className="widget-header map-top-bar">
          <div className="header-label-group">
            <Map size={14} strokeWidth={1.5} color="var(--pink)" />
            <span className="widget-label">Destination Map</span>
          </div>

          <div className="map-actions-group">
            <button
              type="button"
              className="glass-capsule map-action-btn"
              onClick={() => setIsExpanded(true)}
              title="Expand map to full size"
            >
              <Maximize2 size={12} strokeWidth={1.5} />
              <span>Expand Map</span>
            </button>

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
        </div>

        <div className="map-viewport" onClick={() => setIsExpanded(true)} title="Click to open full map">
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

          {/* Quick expand hover badge */}
          <div className="map-expand-overlay-hint">
            <Maximize2 size={13} strokeWidth={1.5} />
            <span>Click to expand</span>
          </div>

          {/* Floating Glass GPS Coordinates Chip */}
          <div className="map-coordinates-chip" onClick={(e) => e.stopPropagation()}>
            <span className="coord-dot" />
            <span className="tabular-nums coord-text">{latLabel}, {lonLabel}</span>
          </div>

          {/* Tidy Clean OSM Attribution */}
          <div className="map-attribution-badge" onClick={(e) => e.stopPropagation()}>
            © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>
          </div>
        </div>
      </div>

      {/* Full-Screen Glass Map Modal */}
      {isExpanded && (
        <div className="map-modal-backdrop" onClick={() => setIsExpanded(false)} role="dialog" aria-modal="true">
          <div className="map-modal-dialog" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="map-modal-header">
              <div className="modal-title-group">
                <MapPin size={18} strokeWidth={1.5} color="var(--pink)" />
                <h3 className="modal-location-heading">{locationName || 'Destination'}</h3>
                <span className="modal-coords-pill tabular-nums">{latLabel}, {lonLabel}</span>
              </div>

              <div className="modal-controls-group">
                {/* Zoom Controls */}
                <div className="modal-zoom-pill">
                  <button
                    type="button"
                    className="zoom-btn"
                    onClick={handleZoomIn}
                    title="Zoom in"
                    disabled={zoomLevel >= 18}
                  >
                    <ZoomIn size={14} strokeWidth={1.5} />
                  </button>
                  <span className="zoom-level-text tabular-nums">{zoomLevel}x</span>
                  <button
                    type="button"
                    className="zoom-btn"
                    onClick={handleZoomOut}
                    title="Zoom out"
                    disabled={zoomLevel <= 3}
                  >
                    <ZoomOut size={14} strokeWidth={1.5} />
                  </button>
                </div>

                {mapData?.osm_url && (
                  <a
                    href={mapData.osm_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-capsule modal-external-btn"
                  >
                    <span>Open in OSM</span>
                    <ExternalLink size={12} strokeWidth={1.5} />
                  </a>
                )}

                <button
                  type="button"
                  className="modal-close-icon-btn"
                  onClick={() => setIsExpanded(false)}
                  aria-label="Close full map"
                >
                  <X size={18} strokeWidth={1.75} />
                </button>
              </div>
            </div>

            {/* Modal Map Viewport */}
            <div className="map-modal-body">
              {mapData?.embed_url ? (
                <iframe
                  title={`Full Map of ${locationName || 'Destination'}`}
                  src={mapData.embed_url}
                  className="map-modal-iframe"
                />
              ) : (
                <div className="map-shimmer-placeholder skeleton">
                  <span className="widget-label">Loading Map...</span>
                </div>
              )}

              <div className="map-coordinates-chip">
                <span className="coord-dot" />
                <span className="tabular-nums coord-text">{latLabel}, {lonLabel}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
