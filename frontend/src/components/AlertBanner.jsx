import React from 'react';
import { AlertCircle, AlertTriangle, X, RefreshCw } from 'lucide-react';

export default function AlertBanner({ error, isOffline, onRetry, onDismiss }) {
  if (!error && !isOffline) return null;

  const isWarning = isOffline;
  const message = isOffline
    ? 'You are currently offline. Check your internet connection. Live weather requests may fail.'
    : error;

  return (
    <div className={`alert-banner ${isWarning ? 'alert-warning' : 'alert-danger'}`} role="alert">
      <div className="alert-content">
        {isWarning ? <AlertTriangle size={20} /> : <AlertCircle size={20} />}
        <span className="alert-message">{message}</span>
      </div>
      <div className="alert-actions">
        {onRetry && (
          <button type="button" className="alert-btn" onClick={onRetry} title="Retry request">
            <RefreshCw size={14} /> Retry
          </button>
        )}
        {onDismiss && (
          <button type="button" className="alert-close" onClick={onDismiss} aria-label="Dismiss alert">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
