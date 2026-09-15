import L from 'leaflet';

/**
 * Creates a custom Google Maps-style drop pin marker using SVG with:
 * - Characteristic downward-pointing vertex
 * - Explicit fill color: #FDE17D
 * - Minimalist dark border (#111111) and monochromatic shadow
 * - Inner geometric bullseye for maximum contrast
 */
export function createUserLocationIcon(): L.DivIcon {
  const svgHtml = `
    <div class="user-location-pin-wrapper" style="position: relative; width: 34px; height: 44px;">
      <div class="user-pulse-ring"></div>
      <svg width="34" height="44" viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.45)); position: relative; z-index: 2;">
        <!-- Classic Google Maps drop pin pointing downwards to vertex (17, 42.5) -->
        <path
          d="M17 1.5C8.44 1.5 1.5 8.44 1.5 17C1.5 27.2 17 42.5 17 42.5C17 42.5 32.5 27.2 32.5 17C32.5 8.44 25.56 1.5 17 1.5Z"
          fill="#FDE17D"
          stroke="#111111"
          stroke-width="2"
          stroke-linejoin="round"
        />
        <!-- Inner contrasting bullseye -->
        <circle cx="17" cy="16.5" r="5" fill="#111111" stroke="#FFFFFF" stroke-width="1.5" />
      </svg>
    </div>
  `;

  return L.divIcon({
    className: 'custom-user-location-div-icon',
    html: svgHtml,
    iconSize: [34, 44],
    iconAnchor: [17, 43], // The sharp point at the bottom center
    popupAnchor: [0, -42],
    tooltipAnchor: [0, -42],
  });
}
