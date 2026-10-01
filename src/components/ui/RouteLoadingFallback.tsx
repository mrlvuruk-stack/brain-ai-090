import React from 'react';
import './RouteLoadingFallback.css';

export interface RouteLoadingFallbackProps {
  label?: string;
  hindiLabel?: string;
}

export const RouteLoadingFallback: React.FC<RouteLoadingFallbackProps> = ({
  label = 'Loading health intelligence workspace...',
  hindiLabel = 'कार्यक्षेत्र लोड हो रहा है...',
}) => {
  return (
    <div
      className="sw-route-fallback"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="sw-route-fallback__spinner-wrap" aria-hidden="true">
        <div className="sw-route-fallback__ring" />
        <div className="sw-route-fallback__dot" />
      </div>
      <p className="sw-route-fallback__message">
        <span>{label}</span>
        <span className="sw-route-fallback__devanagari">{hindiLabel}</span>
      </p>
    </div>
  );
};
