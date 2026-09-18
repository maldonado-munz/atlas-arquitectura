import L from 'leaflet';

/**
 * Creates a minimalist custom drop pin marker (#FDE17D) for user location:
 * - Characteristic downward-pointing vertex
 * - Scaled to approximately double the diameter of architectural project markers (28px height)
 * - Minimalist dark border (#111111) and crisp contrast
 * - Centered inner bullseye
 */
export function createUserLocationIcon(): L.DivIcon {
  const svgHtml = `
    <div class="user-location-pin-wrapper" style="position: relative; width: 22px; height: 28px;">
      <div class="user-pulse-ring"></div>
      <svg width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35)); position: relative; z-index: 2;">
        <!-- Minimalist drop pin pointing downwards to vertex (11, 27) -->
        <path
          d="M11 1.5C6.3 1.5 2.5 5.3 2.5 10C2.5 16.5 11 27 11 27C11 27 19.5 16.5 19.5 10C19.5 5.3 15.7 1.5 11 1.5Z"
          fill="#FDE17D"
          stroke="#111111"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
        <!-- Inner contrasting bullseye -->
        <circle cx="11" cy="9.8" r="3.2" fill="#111111" stroke="#FFFFFF" stroke-width="1" />
      </svg>
    </div>
  `;

  return L.divIcon({
    className: 'custom-user-location-div-icon',
    html: svgHtml,
    iconSize: [22, 28],
    iconAnchor: [11, 27.5], // The sharp point at the bottom center
    popupAnchor: [0, -28],
    tooltipAnchor: [0, -28],
  });
}

