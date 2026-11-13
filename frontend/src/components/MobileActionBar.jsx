import React from 'react';
import { Search, Navigation, Plus, Loader2 } from 'lucide-react';

export default function MobileActionBar({
  onFocusSearch,
  onUseMyLocation,
  onOpenNewTrip,
  geoLoading,
}) {
  return (
    <nav className="mobile-bottom-bar" role="navigation" aria-label="Mobile Quick Actions">
      <div className="mobile-bar-inner">
        <button
          type="button"
          className="mobile-bar-action"
          onClick={onFocusSearch}
          aria-label="Focus Search Bar"
        >
          <Search size={18} strokeWidth={1.5} />
          <span>Search</span>
        </button>

        <button
          type="button"
          className="mobile-bar-action"
          onClick={onUseMyLocation}
          disabled={geoLoading}
          aria-label="Use Current GPS Location"
        >
          {geoLoading ? (
            <Loader2 size={18} strokeWidth={1.5} className="spin" color="var(--blue)" />
          ) : (
            <Navigation size={18} strokeWidth={1.5} color="var(--blue)" />
          )}
          <span>My Location</span>
        </button>

        <button
          type="button"
          className="mobile-bar-action primary-action"
          onClick={onOpenNewTrip}
          aria-label="Plan a New Trip"
        >
          <Plus size={18} strokeWidth={1.75} />
          <span>New Trip</span>
        </button>
      </div>
    </nav>
  );
}

