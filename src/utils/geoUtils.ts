/**
 * Utilities for geographic coordinates display and formatting
 */

export function formatearCoordenadas(lat: number, lng: number): string {
  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    return '—';
  }
  const latStr = lat >= 0 ? `${lat.toFixed(5)}°N` : `${Math.abs(lat).toFixed(5)}°S`;
  const lngStr = lng >= 0 ? `${lng.toFixed(5)}°E` : `${Math.abs(lng).toFixed(5)}°W`;
  return `${latStr}, ${lngStr}`;
}
