// Map & navigation link helpers
//
// These are pure, unused-for-now helpers that prepare the location data
// architecture for Part 4/5 (the admin panel's "View on Map" and
// "Navigate" features). Nothing in this file renders a map, adds a
// button, or is called anywhere yet — it only defines how the existing
// { latitude, longitude, accuracy, timestamp } object maps to the inputs
// those future features will need.
//
// Coordinates passed in here must always be the actual values reported
// by the visitor's browser (from locationService.getCurrentLocation()).
// Never fabricate or substitute coordinates, and never call this with
// anything other than a location the visitor explicitly consented to
// share.

/**
 * Picks a reasonable map zoom level from a location's reported accuracy
 * (metres). Tighter accuracy -> closer zoom. This is only a sensible
 * default for the future map view; it is not itself a map.
 */
export function suggestZoomLevel(accuracy) {
  if (typeof accuracy !== "number" || Number.isNaN(accuracy)) return 14;
  if (accuracy <= 25) return 17;
  if (accuracy <= 100) return 15;
  if (accuracy <= 500) return 13;
  if (accuracy <= 2000) return 11;
  return 9;
}

/**
 * Builds the { center, zoom } parameters a future interactive map
 * component would need to render a marker for this location.
 */
export function toMapViewParams(location) {
  if (!location) return null;
  const { latitude, longitude, accuracy } = location;
  return {
    center: { lat: latitude, lng: longitude },
    zoom: suggestZoomLevel(accuracy),
    accuracy,
  };
}

/**
 * Builds a "latitude,longitude" destination string, the format a maps/
 * navigation service expects for a directions destination.
 */
export function toDestinationString(location) {
  if (!location) return null;
  const { latitude, longitude } = location;
  return `${latitude},${longitude}`;
}

/**
 * Builds a Google Maps directions URL to the given location. Used by a
 * future "Navigate" button in the admin panel — not called anywhere in
 * the visitor-facing app.
 */
export function buildNavigationUrl(location) {
  const destination = toDestinationString(location);
  if (!destination) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
}
