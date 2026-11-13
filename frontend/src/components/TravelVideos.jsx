import React, { useEffect, useState } from 'react';
import { Film, Play, ExternalLink, Sparkles } from 'lucide-react';
import { getTravelVideos } from '../services/api';

export default function TravelVideos({ locationName }) {
  const [data, setData] = useState({ available: false, videos: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!locationName) return;
    let isMounted = true;
    setLoading(true);

    getTravelVideos(locationName)
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch(() => {
        if (isMounted) setData({ available: false, videos: [] });
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [locationName]);

  if (!locationName) return null;

  return (
    <div className="widget travel-videos-widget widget-hoverable" role="region" aria-label="Travel Inspiration">
      <div className="widget-header">
        <Film size={14} strokeWidth={1.5} color="var(--pink)" />
        <span className="widget-label">Travel Inspiration & Guides</span>
      </div>

      {loading ? (
        <div className="video-carousel-scroller">
          {[1, 2, 3].map((i) => (
            <div key={i} className="video-card-shimmer skeleton" />
          ))}
        </div>
      ) : data.available && data.videos && data.videos.length > 0 ? (
        <div className="video-carousel-scroller">
          {data.videos.map((vid) => (
            <a
              key={vid.id}
              href={vid.url}
              target="_blank"
              rel="noopener noreferrer"
              className="video-capsule-card"
            >
              <div className="video-preview-shell">
                <img src={vid.thumbnail} alt={vid.title} className="video-thumb-img" loading="lazy" />
                <div className="video-play-glyph">
                  <Play size={14} fill="#ffffff" color="#ffffff" />
                </div>
              </div>
              <div className="video-meta-block">
                <h4 className="video-card-title" title={vid.title}>
                  {vid.title}
                </h4>
                <p className="video-card-channel">{vid.channel_title}</p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        /* Elegant Apple-Style Empty State */
        <div className="video-empty-state">
          <div className="empty-symbol-disc">
            <Sparkles size={20} strokeWidth={1.5} color="var(--pink)" />
          </div>
          <p className="empty-headline">
            Curated Travel Guides for <strong>{locationName}</strong>
          </p>
          <div className="empty-hint-row">
            <span className="api-key-chip">YOUTUBE_API_KEY</span>
            <span className="empty-subtext">Add to backend/.env to stream videos</span>
          </div>
        </div>
      )}
    </div>
  );
}
