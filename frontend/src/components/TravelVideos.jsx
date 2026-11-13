import React, { useEffect, useState } from 'react';
import { ExternalLink, Video, Film } from 'lucide-react';
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
    <div className="card travel-videos-card">
      <div className="section-title-row">
        <Film size={22} color="#ef4444" />
        <h3 className="section-title">Travel Inspiration & Guides: {locationName}</h3>
      </div>

      {data.available && data.videos.length > 0 ? (
        <div className="videos-grid">
          {data.videos.map((vid) => (
            <a
              key={vid.id}
              href={vid.url}
              target="_blank"
              rel="noopener noreferrer"
              className="video-item"
            >
              <div className="video-thumb-container">
                <img src={vid.thumbnail} alt={vid.title} className="video-thumb" />
                <span className="video-play-badge">
                  <ExternalLink size={14} /> Watch
                </span>
              </div>
              <h4 className="video-title" title={vid.title}>
                {vid.title}
              </h4>
              <p className="video-channel">{vid.channel_title}</p>
            </a>
          ))}
        </div>
      ) : (
        <div className="videos-fallback">
          <Video size={24} color="#94a3b8" />
          <p className="fallback-title">YouTube Travel Integration</p>
          <p className="fallback-text">
            Add <code>YOUTUBE_API_KEY</code> in <code>backend/.env</code> to automatically display curated YouTube travel guide videos for <strong>{locationName}</strong>.
          </p>
        </div>
      )}
    </div>
  );
}
