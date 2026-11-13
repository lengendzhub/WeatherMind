import React from 'react';
import { AlertCircle, WifiOff, X, RefreshCw } from 'lucide-react';

export default function AlertBanner({ error, isOffline, onRetry, onDismiss }) {
  if (!error && !isOffline) return null;

  const isWarning = isOffline;
  const message = isOffline
    ? 'Network disconnected. Displaying cached weather records.'
    : error;

  return (
    <div
      className={`floating-alert-capsule ${isWarning ? 'alert-warning-pill' : 'alert-danger-pill'}`}
      role="alert"
    >
      <div className="alert-content-group">
        {isWarning ? (
          <WifiOff size={15} strokeWidth={1.5} color="var(--orange)" />
        ) : (
          <AlertCircle size={15} strokeWidth={1.5} color="var(--red-alert)" />
        )}
        <span className="alert-text-body">{message}</span>
      </div>

      <div className="alert-buttons-group">
        {onRetry && (
          <button
            type="button"
            className="alert-pill-action retry-btn"
            onClick={onRetry}
            aria-label="Retry request"
          >
            <RefreshCw size={12} strokeWidth={1.5} />
            <span>Retry</span>
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            className="alert-pill-action dismiss-btn"
            onClick={onDismiss}
            aria-label="Dismiss alert"
          >
            <X size={13} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </div>
  );
}
