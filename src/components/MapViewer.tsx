import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ProyectoArquitectura, Idioma } from '../types';
import {
  Plus,
  Minus,
  Globe,
  Navigation,
  Layers,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Award,
  Calendar,
  Maximize2,
  ExternalLink,
  LocateFixed,
} from 'lucide-react';
import { traducirEstilo, traducirPrograma } from '../i18n';
import { useGeolocationTracking } from '../hooks/useGeolocationTracking';
import { createUserLocationIcon } from './UserLocationPin';

interface MapViewerProps {
  proyectos: ProyectoArquitectura[];
  proyectoSeleccionado: ProyectoArquitectura | null;
  onSeleccionarProyecto: (proyecto: ProyectoArquitectura | null) => void;
  onAbrirModalCompleto?: (proyecto: ProyectoArquitectura) => void;
  onAnterior?: () => void;
  onSiguiente?: () => void;
  tieneAnterior?: boolean;
  tieneSiguiente?: boolean;
  modoOscuroMapa?: boolean;
  idioma?: Idioma;
}


type TileProviderId = 'esri_light' | 'osm_mono' | 'esri_dark';

interface TileProviderConfig {
  id: TileProviderId;
  name: string;
  url: string;
  options: L.TileLayerOptions;
}

const TILE_PROVIDERS: Record<TileProviderId, TileProviderConfig> = {
  esri_light: {
    id: 'esri_light',
    name: 'Esri Light Gray Canvas',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    options: {
      maxNativeZoom: 16,
      maxZoom: 20,
      crossOrigin: true,
      attribution: '',
    },
  },
  osm_mono: {
    id: 'osm_mono',
    name: 'OpenStreetMap B&W',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      maxNativeZoom: 19,
      maxZoom: 20,
      crossOrigin: true,
      attribution: '',
    },
  },
  esri_dark: {
    id: 'esri_dark',
    name: 'Esri Dark Gray Canvas',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    options: {
      maxNativeZoom: 16,
      maxZoom: 20,
      crossOrigin: true,
      attribution: '',
    },
  },
};

export const MapViewer: React.FC<MapViewerProps> = ({
  proyectos,
  proyectoSeleccionado,
  onSeleccionarProyecto,
  onAbrirModalCompleto,
  onAnterior,
  onSiguiente,
  tieneAnterior = false,
  tieneSiguiente = false,
  modoOscuroMapa = false,
  idioma = 'es',
}) => {
  const lang: Idioma = idioma === 'en' ? 'en' : 'es';

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userAccuracyCircleRef = useRef<L.Circle | null>(null);
  const centerOnNextFixRef = useRef<boolean>(false);
  const activeTileProviderRef = useRef<TileProviderId>('esri_light');
  const cambiarProveedorCapaRef = useRef<(providerId: TileProviderId) => void>(() => {});

  const [activeTileProvider, setActiveTileProvider] = useState<TileProviderId>('esri_light');
  const [menuCapasAbierto, setMenuCapasAbierto] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(6);
  const [centerCoords, setCenterCoords] = useState<{ lat: number; lng: number }>({
    lat: -33.4489,
    lng: -70.6693,
  });

  // Real-time GPS Tracking Hook with high accuracy & watchPosition
  const {
    userLocation,
    isTracking: isTrackingUser,
    isLocating: isLocatingUser,
    error: gpsError,
    startTracking,
    stopTracking,
  } = useGeolocationTracking();

  // Handle Tile Provider Change with seamless transition & invalidateSize()
  const cambiarProveedorCapa = (providerId: TileProviderId) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (activeTileProviderRef.current === providerId && tileLayerRef.current) {
      return;
    }

    const oldLayer = tileLayerRef.current;
    const config = TILE_PROVIDERS[providerId];
    const newLayer = L.tileLayer(config.url, config.options);

    // Add new layer to map
    newLayer.addTo(map);
    tileLayerRef.current = newLayer;
    activeTileProviderRef.current = providerId;
    setActiveTileProvider(providerId);

    // Clean up old layer once new tiles start rendering to prevent gray canvas
    let oldLayerRemoved = false;
    const cleanupOldLayer = () => {
      if (!oldLayerRemoved && oldLayer && map.hasLayer(oldLayer)) {
        oldLayerRemoved = true;
        map.removeLayer(oldLayer);
      }
    };

    newLayer.once('load', cleanupOldLayer);
    setTimeout(cleanupOldLayer, 300);

    // Rule 2: Execute invalidateSize with setTimeout(..., 100)
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 100);
  };

  cambiarProveedorCapaRef.current = cambiarProveedorCapa;

  // Switch to dark canvas if dark mode toggled from header
  useEffect(() => {
    if (modoOscuroMapa) {
      cambiarProveedorCapa('esri_dark');
    } else {
      const currentZoom = mapInstanceRef.current ? mapInstanceRef.current.getZoom() : 6;
      cambiarProveedorCapa(currentZoom >= 17 ? 'osm_mono' : 'esri_light');
    }
  }, [modoOscuroMapa]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered initially on Chile (Santiago / Central Zone)
    const map = L.map(mapContainerRef.current, {
      center: [-33.4489, -70.6693],
      zoom: 6.2,
      minZoom: 2,
      maxZoom: 20,
      zoomControl: false, // Custom modernist controls
      attributionControl: false, // Disables all default Leaflet watermarks/attributions
    });

    // Primary tile layer: Esri Light Gray Canvas (No API key, zero watermarks)
    const initialProviderId: TileProviderId = modoOscuroMapa ? 'esri_dark' : 'esri_light';
    const provider = TILE_PROVIDERS[initialProviderId];
    const initialTileLayer = L.tileLayer(provider.url, provider.options).addTo(map);
    tileLayerRef.current = initialTileLayer;
    activeTileProviderRef.current = initialProviderId;
    setActiveTileProvider(initialProviderId);

    // Markers layer group
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Invalidate size immediately and after layout stabilization
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 400);

    // Track movement
    map.on('move', () => {
      const center = map.getCenter();
      setCenterCoords({
        lat: Number(center.lat.toFixed(4)),
        lng: Number(center.lng.toFixed(4)),
      });
    });

    // Automatic Zoom Threshold Handler:
    // Zoom <= 16: Esri Light Gray Canvas (or Esri Dark)
    // Zoom >= 17: OpenStreetMap B&W
    map.on('zoomend', () => {
      const currentZoom = map.getZoom();
      setZoomLevel(Math.round(currentZoom));

      const targetProvider: TileProviderId =
        currentZoom >= 17
          ? 'osm_mono'
          : modoOscuroMapa
          ? 'esri_dark'
          : 'esri_light';

      if (activeTileProviderRef.current !== targetProvider) {
        cambiarProveedorCapaRef.current(targetProvider);
      } else {
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 100);
      }
    });

    // ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      resizeObserver.disconnect();
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      if (userAccuracyCircleRef.current) {
        userAccuracyCircleRef.current.remove();
        userAccuracyCircleRef.current = null;
      }
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when projects change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    proyectos.forEach((proyecto) => {
      const isSelected = proyectoSeleccionado?.id === proyecto.id;
      const isPritzker = Boolean(proyecto.ano_pritzker);
      const isRadic = proyecto.arquitecto.toLowerCase().includes('radic');

      // Custom minimal geometric pin: distinct diamond for Pritzker
      const iconClass = `arch-marker-pin ${isPritzker ? 'arch-marker-pritzker' : isRadic ? 'arch-marker-pritzker' : 'arch-marker-standard'} ${
        isSelected ? 'selected' : ''
      }`;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-div-icon',
        html: `
          <div class="${iconClass}" style="width: 32px; height: 32px;">
            <div class="arch-marker-inner">
              ${isPritzker || isRadic ? '<div class="arch-marker-pritzker-core"></div>' : ''}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([proyecto.coordenadas.lat, proyecto.coordenadas.lng], {
        icon: customIcon,
        title: proyecto.nombre_proyecto,
      });

      const arqPrincipal = proyecto.arquitecto_principal || proyecto.arquitecto;

      // Modernist High-Contrast Tooltip with distinction
      marker.bindTooltip(
        `
        <div class="px-2.5 py-1.5 font-sans bg-black text-white text-[11px] leading-tight select-none shadow-lg">
          <div class="flex items-center gap-2 mb-0.5">
            <span class="font-bold tracking-tight">${proyecto.nombre_proyecto}</span>
            ${
              isPritzker
                ? `<span class="text-[9px] font-mono-code bg-white text-black px-1 py-0.2 font-bold tracking-wider uppercase flex-shrink-0">✦ PRITZKER ${proyecto.ano_pritzker}</span>`
                : isRadic
                ? '<span class="text-[9px] font-mono-code bg-neutral-800 text-neutral-200 border border-neutral-600 px-1 py-0.2 font-medium tracking-wider uppercase flex-shrink-0">S. RADIC</span>'
                : ''
            }
          </div>
          <div class="text-neutral-300 text-[10px] font-mono-code">${arqPrincipal} • ${proyecto.ciudad}</div>
        </div>
        `,
        {
          direction: 'top',
          offset: [0, -12],
          opacity: 1,
          className: 'arch-tooltip',
        }
      );

      marker.on('click', (e: L.LeafletMouseEvent) => {
        if (e.originalEvent) {
          e.originalEvent.stopPropagation();
        }
        onSeleccionarProyecto(proyecto);
        map.flyTo([proyecto.coordenadas.lat, proyecto.coordenadas.lng], Math.max(map.getZoom(), 12), {
          duration: 1.2,
        });
      });

      marker.addTo(markersGroup);
    });
  }, [proyectos, proyectoSeleccionado, onSeleccionarProyecto]);

  // Center on selected project if changed externally
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !proyectoSeleccionado) return;

    const currentCenter = map.getCenter();
    const targetLat = proyectoSeleccionado.coordenadas.lat;
    const targetLng = proyectoSeleccionado.coordenadas.lng;

    const distance = Math.hypot(
      currentCenter.lat - targetLat,
      currentCenter.lng - targetLng
    );

    if (distance > 0.02) {
      map.flyTo([targetLat, targetLng], Math.max(map.getZoom(), 12), {
        duration: 1.2,
      });
    }
  }, [proyectoSeleccionado]);

  // Real-time GPS User Marker & Accuracy Circle synchronization
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!userLocation) {
      if (userMarkerRef.current) {
        map.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }
      if (userAccuracyCircleRef.current) {
        map.removeLayer(userAccuracyCircleRef.current);
        userAccuracyCircleRef.current = null;
      }
      return;
    }

    const { lat, lng, accuracy } = userLocation;

    // 1. Maintain or update accuracy circle
    if (!userAccuracyCircleRef.current) {
      const circle = L.circle([lat, lng], {
        radius: Math.max(accuracy, 10),
        color: '#111111',
        weight: 1,
        opacity: 0.35,
        fillColor: '#FDE17D',
        fillOpacity: 0.14,
        dashArray: '4, 4',
      }).addTo(map);
      userAccuracyCircleRef.current = circle;
    } else {
      userAccuracyCircleRef.current.setLatLng([lat, lng]);
      userAccuracyCircleRef.current.setRadius(Math.max(accuracy, 10));
    }

    // 2. Maintain or update user drop pin marker (#FDE17D)
    if (!userMarkerRef.current) {
      const icon = createUserLocationIcon();
      const marker = L.marker([lat, lng], {
        icon,
        zIndexOffset: 1500, // Always stays above standard markers
        title: idioma === 'en' ? 'Your Location' : 'Tu Ubicación',
      }).addTo(map);

      const tooltipContent = `
        <div style="padding: 4px 8px; background-color: #111111; color: #FFFFFF; font-family: monospace; font-size: 11px; border: 1px solid #333333; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #FDE17D; border: 1px solid #111111;"></span>
            <strong style="font-weight: 700; text-transform: uppercase;">${idioma === 'en' ? 'Your Location' : 'Tu Ubicación'}</strong>
          </div>
          <div style="color: #D4D4D4; font-size: 9px; margin-top: 2px;">
            ${idioma === 'en' ? 'GPS Accuracy' : 'Precisión GPS'}: ±${Math.round(accuracy)}m
          </div>
        </div>
      `;

      marker.bindTooltip(tooltipContent, {
        direction: 'top',
        offset: [0, -42],
        opacity: 1,
        className: 'user-pin-tooltip',
      });

      marker.on('click', () => {
        map.flyTo([lat, lng], Math.max(map.getZoom(), 16), { duration: 1.2 });
      });

      userMarkerRef.current = marker;
    } else {
      // Seamless position update without flickering or remounting
      userMarkerRef.current.setLatLng([lat, lng]);
      userMarkerRef.current.setTooltipContent(`
        <div style="padding: 4px 8px; background-color: #111111; color: #FFFFFF; font-family: monospace; font-size: 11px; border: 1px solid #333333; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #FDE17D; border: 1px solid #111111;"></span>
            <strong style="font-weight: 700; text-transform: uppercase;">${idioma === 'en' ? 'Your Location' : 'Tu Ubicación'}</strong>
          </div>
          <div style="color: #D4D4D4; font-size: 9px; margin-top: 2px;">
            ${idioma === 'en' ? 'GPS Accuracy' : 'Precisión GPS'}: ±${Math.round(accuracy)}m
          </div>
        </div>
      `);
    }

    // 3. Smooth flyTo on first fix or when center requested
    if (centerOnNextFixRef.current) {
      centerOnNextFixRef.current = false;
      map.flyTo([lat, lng], Math.max(map.getZoom(), 16), {
        duration: 1.2,
      });
    }
  }, [userLocation, idioma]);

  // Center on user location handler
  const handleMiUbicacion = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!isTrackingUser) {
      centerOnNextFixRef.current = true;
      startTracking();
      return;
    }

    if (userLocation) {
      map.flyTo([userLocation.lat, userLocation.lng], Math.max(map.getZoom(), 16), {
        duration: 1.2,
      });
    } else {
      centerOnNextFixRef.current = true;
    }
  };

  // Zoom controls
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleVerChile = () => {
    mapInstanceRef.current?.flyTo([-33.4489, -70.6693], 6.2, { duration: 1.2 });
  };

  const handleResetView = () => {
    mapInstanceRef.current?.flyTo([25, 10], 2.4, { duration: 1.5 });
  };

  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden select-none bg-[#ECECEC]">
      {/* Map DOM Container - 100% free of watermarks */}
      <div
        ref={mapContainerRef}
        className={`w-full h-full ${
          modoOscuroMapa ? 'architect-map-dark' : 'architect-map-monochrome'
        }`}
        style={{ minHeight: '100%', width: '100%' }}
      />

      {/* Modernist Floating Map Controls (Top-Right) */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
        <button
          id="btn-map-zoom-in"
          onClick={handleZoomIn}
          className="w-9 h-9 bg-white hover:bg-black text-black hover:text-white border border-[#111111] flex items-center justify-center transition-colors cursor-pointer"
          title="Zoom in"
          aria-label="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          id="btn-map-zoom-out"
          onClick={handleZoomOut}
          className="w-9 h-9 bg-white hover:bg-black text-black hover:text-white border border-[#111111] flex items-center justify-center transition-colors cursor-pointer"
          title="Zoom out"
          aria-label="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="h-[1px] bg-[#D4D4D4] my-0.5" />

        {/* User GPS Location Button (Mi Ubicación) */}
        <button
          id="btn-map-mi-ubicacion"
          onClick={handleMiUbicacion}
          className={`w-9 h-9 border border-[#111111] flex items-center justify-center transition-colors cursor-pointer relative ${
            isTrackingUser
              ? 'bg-[#FDE17D] text-black font-bold shadow-xs'
              : 'bg-white hover:bg-black text-black hover:text-white'
          }`}
          title={
            isTrackingUser
              ? (idioma === 'en' ? 'Center on my location (GPS active)' : 'Centrar en mi ubicación (GPS activo)')
              : (idioma === 'en' ? 'Track my location (GPS)' : 'Rastrear mi ubicación (GPS)')
          }
          aria-label={idioma === 'en' ? 'My Location' : 'Mi Ubicación'}
        >
          <LocateFixed className={`w-4 h-4 ${isLocatingUser ? 'animate-spin' : ''}`} />
          {isTrackingUser && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-black border border-white rounded-full"></span>
          )}
        </button>

        <button
          id="btn-map-focus-chile"
          onClick={handleVerChile}
          className="w-9 h-9 bg-white hover:bg-black text-black hover:text-white border border-[#111111] flex items-center justify-center transition-colors cursor-pointer"
          title="Enfocar Chile"
          aria-label="Enfocar Chile"
        >
          <MapPin className="w-4 h-4" />
        </button>

        <button
          id="btn-map-reset-view"
          onClick={handleResetView}
          className="w-9 h-9 bg-white hover:bg-black text-black hover:text-white border border-[#111111] flex items-center justify-center transition-colors cursor-pointer"
          title="Vista Global"
          aria-label="Vista Global"
        >
          <Globe className="w-4 h-4" />
        </button>

        {/* Tile Provider Layer Switcher */}
        <div className="relative">
          <button
            id="btn-map-capas"
            onClick={() => setMenuCapasAbierto(!menuCapasAbierto)}
            className={`w-9 h-9 border border-[#111111] flex items-center justify-center transition-colors cursor-pointer ${
              menuCapasAbierto ? 'bg-black text-white' : 'bg-white hover:bg-black text-black hover:text-white'
            }`}
            title="Cambiar capa base cartográfica"
            aria-label="Cambiar capa base cartográfica"
          >
            <Layers className="w-4 h-4" />
          </button>

          {menuCapasAbierto && (
            <div className="absolute right-full top-0 mr-2 w-64 bg-white border border-[#111111] shadow-xl p-2.5 z-50 text-xs">
              <div className="font-mono-code font-bold uppercase text-[10px] text-neutral-400 mb-1.5 pb-1 border-b border-[#E5E5E5] flex items-center justify-between">
                <span>Capa Cartográfica</span>
                <span className="text-[9px] text-neutral-500 font-normal">Auto Z16/17</span>
              </div>
              <div className="space-y-1">
                {(Object.keys(TILE_PROVIDERS) as TileProviderId[]).map((id) => (
                  <button
                    key={id}
                    onClick={() => {
                      cambiarProveedorCapa(id);
                      setMenuCapasAbierto(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      activeTileProvider === id
                        ? 'bg-black text-white font-semibold'
                        : 'hover:bg-[#F5F5F5] text-black'
                    }`}
                  >
                    <span>{TILE_PROVIDERS[id].name}</span>
                    {activeTileProvider === id && <span>✓</span>}
                  </button>
                ))}
              </div>
              <div className="mt-2 pt-1.5 border-t border-neutral-200 text-[10px] font-mono-code text-neutral-500">
                {zoomLevel >= 17 ? '• Z≥17: OpenStreetMap B&W activo' : '• Z≤16: Esri Light Gray activo'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GPS Notification / Error Toast */}
      {gpsError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] bg-black text-white px-3 py-1.5 text-xs font-mono-code border border-neutral-700 shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <span className="w-2 h-2 rounded-full bg-[#FDE17D] inline-block"></span>
          <span>{gpsError}</span>
          <button
            onClick={() => stopTracking()}
            className="ml-1 text-neutral-400 hover:text-white cursor-pointer"
            title="Cerrar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Architectural Ficha directly on top of the Map */}
      {proyectoSeleccionado && (
        <div
          id="ficha-flotante-mapa"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-[1200] max-w-md w-[calc(100%-2rem)] sm:w-[440px] max-h-[calc(100%-4rem)] overflow-y-auto bg-white border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] p-4 md:p-5 flex flex-col gap-3 animate-in fade-in slide-in-from-top-3 duration-200 pointer-events-auto"
        >
          {/* Card Header & Controls */}
          <div className="flex items-center justify-between gap-2 border-b border-neutral-200 pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              {proyectoSeleccionado.ano_pritzker ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black text-white text-[10px] font-mono-code font-bold uppercase">
                  <Award className="w-3 h-3" />
                  PRITZKER {proyectoSeleccionado.ano_pritzker}
                </span>
              ) : (proyectoSeleccionado.ciudad || '').toLowerCase().includes('chiloé') || (proyectoSeleccionado.nombre_proyecto || '').toLowerCase().includes('iglesia de') ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-900 text-white text-[10px] font-mono-code font-bold uppercase tracking-wider">
                  PATRIMONIO UNESCO / HISTÓRICO
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-neutral-300 text-neutral-700 text-[10px] font-mono-code uppercase">
                  FICHA TÉCNICA
                </span>
              )}
              <span className="text-[10px] font-mono-code text-neutral-400">
                {proyectoSeleccionado.id}
              </span>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              {tieneAnterior && onAnterior && (
                <button
                  id="btn-ficha-anterior"
                  onClick={onAnterior}
                  className="p-1 hover:bg-black hover:text-white border border-neutral-300 transition-colors cursor-pointer text-neutral-700"
                  title={idioma === 'en' ? 'Previous project' : 'Obra anterior'}
                  aria-label="Obra anterior"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              )}
              {tieneSiguiente && onSiguiente && (
                <button
                  id="btn-ficha-siguiente"
                  onClick={onSiguiente}
                  className="p-1 hover:bg-black hover:text-white border border-neutral-300 transition-colors cursor-pointer text-neutral-700"
                  title={idioma === 'en' ? 'Next project' : 'Siguiente obra'}
                  aria-label="Siguiente obra"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                id="btn-cerrar-ficha-mapa"
                onClick={() => onSeleccionarProyecto(null)}
                className="p-1 text-black hover:bg-black hover:text-white border border-black transition-colors cursor-pointer ml-1"
                title={idioma === 'en' ? 'Close fiche' : 'Cerrar ficha'}
                aria-label="Cerrar ficha"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Project Details */}
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-black leading-snug">
              {proyectoSeleccionado.nombre_proyecto}
            </h3>
            <p className="text-xs font-semibold text-neutral-800 mt-0.5">
              {proyectoSeleccionado.arquitecto_responsable ||
                proyectoSeleccionado.arquitecto_principal ||
                proyectoSeleccionado.arquitecto}
            </p>
            {proyectoSeleccionado.instituciones && proyectoSeleccionado.instituciones.length > 0 && (
              <p className="text-[11px] text-neutral-500 mt-0.5 truncate" title={proyectoSeleccionado.instituciones.join(', ')}>
                <span className="font-mono-code text-[10px] uppercase font-bold text-neutral-600">
                  {idioma === 'en' ? 'INST:' : 'INST:'}
                </span>{' '}
                {proyectoSeleccionado.instituciones.join(', ')}
              </p>
            )}
            <div className="flex items-center gap-2 text-[11px] font-mono-code text-neutral-500 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-neutral-400" />
                {proyectoSeleccionado.ciudad}, {proyectoSeleccionado.pais}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-neutral-400" />
                {proyectoSeleccionado.ano_inauguracion}
              </span>
            </div>
          </div>

          {/* Styles & Program Badges */}
          <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
            {proyectoSeleccionado.estilos.slice(0, 3).map((estilo) => (
              <span
                key={estilo}
                className="px-2 py-0.5 bg-neutral-100 text-neutral-800 text-[10px] font-mono-code border border-neutral-200"
              >
                {traducirEstilo(estilo, lang)}
              </span>
            ))}
            {(proyectoSeleccionado.programa || []).slice(0, 2).map((prog) => (
              <span
                key={prog}
                className="px-2 py-0.5 bg-neutral-50 text-neutral-600 text-[10px] font-mono-code border border-neutral-200"
              >
                {traducirPrograma(prog, lang)}
              </span>
            ))}
          </div>

          {/* Excerpt */}
          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
            {proyectoSeleccionado.descripcion}
          </p>

          {/* Action Footer */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-100 mt-1">
            {onAbrirModalCompleto && (
              <button
                id="btn-abrir-modal-completo"
                onClick={() => onAbrirModalCompleto(proyectoSeleccionado)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-mono-code font-bold uppercase transition-colors cursor-pointer shadow-xs"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{idioma === 'en' ? 'Full dossier' : 'Ver ficha completa'}</span>
              </button>
            )}

            {proyectoSeleccionado.fuente_url && (
              <a
                href={proyectoSeleccionado.fuente_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-mono-code text-neutral-600 hover:text-black underline transition-colors ml-auto"
              >
                <span>{idioma === 'en' ? 'Source doc' : 'Documentación'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Architectural Telemetry Bar (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-xs border border-[#111111] px-3 py-1.5 text-[11px] font-mono-code text-black flex items-center gap-3 shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-1.5">
          <Navigation className="w-3 h-3 rotate-45" />
          <span>
            {centerCoords.lat >= 0 ? `${centerCoords.lat}°N` : `${Math.abs(centerCoords.lat)}°S`},{' '}
            {centerCoords.lng >= 0 ? `${centerCoords.lng}°E` : `${Math.abs(centerCoords.lng)}°W`}
          </span>
        </div>
        <span className="text-neutral-300">|</span>
        <div>
          <span>Z:{zoomLevel}</span>
        </div>
        <span className="text-neutral-300">|</span>
        <span className="text-[10px] text-neutral-500 uppercase">{TILE_PROVIDERS[activeTileProvider].name}</span>
        {isTrackingUser && userLocation && (
          <>
            <span className="text-neutral-300">|</span>
            <div className="flex items-center gap-1 text-[10px] text-neutral-800 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#FDE17D] border border-[#111111] inline-block animate-pulse"></span>
              <span>GPS: ±{Math.round(userLocation.accuracy)}m</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
