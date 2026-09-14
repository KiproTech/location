import { LOCATION_ERROR } from "../services/locationService.js";
import { getFriendlyLocationMessage } from "../utils/locationMessages.js";
import { formatCoordinate, formatAccuracy, formatTimestamp } from "../utils/formatLocation.js";

function Spinner() {
  return (
    <span className="spinner" aria-hidden="true">
      <style>{`
        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid var(--color-border);
          border-top-color: var(--color-accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .spinner { animation-duration: 2.2s; }
        }
      `}</style>
    </span>
  );
}

export default function LocationStatus({ status, data, errorCode, onRetry }) {
  if (status === "idle") {
    return (
      <p className="location-status location-status--muted">
        Location permission has not been requested.
      </p>
    );
  }

  if (status === "requesting") {
    return (
      <p className="location-status location-status--pending" role="status">
        <Spinner /> Requesting your location...
        <style>{`
          .location-status--pending {
            display: flex;
            align-items: center;
            gap: 8px;
          }
        `}</style>
      </p>
    );
  }

  if (status === "granted" && data) {
    return (
      <div className="location-status location-status--granted" role="status">
        <p className="location-status__headline">✓ Location access granted</p>
        <dl className="location-status__grid">
          <dt>Latitude</dt>
          <dd>{formatCoordinate(data.latitude)}</dd>

          <dt>Longitude</dt>
          <dd>{formatCoordinate(data.longitude)}</dd>

          <dt>Accuracy</dt>
          <dd>{formatAccuracy(data.accuracy)}</dd>

          <dt>Time received</dt>
          <dd>{formatTimestamp(data.timestamp)}</dd>
        </dl>

        <style>{`
          .location-status--granted {
            background: #eef6ee;
            border: 1px solid #cfe6cf;
            border-radius: var(--radius-md);
            padding: 14px 16px;
          }
          .location-status__headline {
            margin: 0 0 10px;
            font-weight: 600;
            color: #1f6b2c;
            font-size: 0.92rem;
          }
          .location-status__grid {
            margin: 0;
            display: grid;
            grid-template-columns: auto 1fr;
            column-gap: 12px;
            row-gap: 4px;
            font-size: 0.88rem;
          }
          .location-status__grid dt {
            color: var(--color-ink-soft);
          }
          .location-status__grid dd {
            margin: 0;
            color: var(--color-ink);
            font-variant-numeric: tabular-nums;
          }
        `}</style>
      </div>
    );
  }

  if (status === "error") {
    const isDenied = errorCode === LOCATION_ERROR.PERMISSION_DENIED;
    return (
      <div className="location-status location-status--error" role="alert">
        <p className="location-status__headline">
          {isDenied ? "Location Permission Denied" : "Location Unavailable"}
        </p>
        <p className="location-status__text">{getFriendlyLocationMessage(errorCode)}</p>
        {onRetry && (
          <button type="button" className="btn btn--secondary" onClick={onRetry}>
            Try Again
          </button>
        )}

        <style>{`
          .location-status--error {
            background: #fdecea;
            border: 1px solid #f3c7c1;
            border-radius: var(--radius-md);
            padding: 14px 16px;
          }
          .location-status__headline {
            margin: 0 0 6px;
            font-weight: 600;
            color: var(--color-danger);
            font-size: 0.92rem;
          }
          .location-status__text {
            margin: 0 0 12px;
            font-size: 0.88rem;
            color: var(--color-ink-soft);
          }
        `}</style>
      </div>
    );
  }

  return null;
}
