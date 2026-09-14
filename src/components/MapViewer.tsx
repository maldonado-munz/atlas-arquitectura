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
  Focus,
} from 'lucide-react';
import { traducirEstilo, traducirPrograma } from '../i18n';

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

type TileProviderId = 'esri_light' | 'osm' | 'esri_dark';

interface TileProviderConfig {
  id: TileProviderId;
  name: string;
  description: string;
  url: string;
  options: L.TileLayerOptions;
}

const TILE_PROVIDERS: Record<TileProviderId, TileProviderConfig> = {
  esri_light: {
    id: 'esri_light',
    name: 'Esri Light Gray Canvas',
    description: 'Monocromático, neutro y de alta legibilidad arquitectónica',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    options: {
      maxNativeZoom: 16,
      maxZoom: 19,
      attribution: 'Tiles © Esri',
    },
  },
  osm: {
    id: 'osm',
    name: 'OpenStreetMap',
    description: 'Cartografía estándar con calles, manzanas y nombres de barrios',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      subdomains: ['a', 'b', 'c'],
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    },
  },
  esri_dark: {
    id: 'esri_dark',
    name: 'Esri Dark Gray Canvas',
    description: 'Gris oscuro de alto contraste para visualización nocturna',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    options: {
      maxNativeZoom: 16,
      maxZoom: 19,
      attribution: 'Tiles © Esri',
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

  const [activeTileProvider, setActiveTileProvider] = useState<TileProviderId>(
    modoOscuroMapa ? 'esri_dark' : 'esri_light'
  );
  const [menuCapasAbierto, setMenuCapasAbierto] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(6);
  const [centerCoords, setCenterCoords] = useState<{ lat: number; lng: number }>({
    lat: -33.4489,
    lng: -70.6693,
  });

  const activeTileProviderRef = useRef<TileProviderId>(
    modoOscuroMapa ? 'esri_dark' : 'esri_light'
  );

  // Apply tile layer manually with complete stability and clean layer replacement
  const aplicarProveedor = (providerId: TileProviderId) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (activeTileProviderRef.current === providerId && tileLayerRef.current && map.hasLayer(tileLayerRef.current)) {
      return;
    }

    const config = TILE_PROVIDERS[providerId];
    if (!config) return;

    // Cleanly remove any existing TileLayers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        try {
          map.removeLayer(layer);
        } catch {
          // ignore
        }
      }
    });
    tileLayerRef.current = null;

    const newLayer = L.tileLayer(config.url, config.options);
    newLayer.addTo(map);

    tileLayerRef.current = newLayer;
    activeTileProviderRef.current = providerId;
    setActiveTileProvider(providerId);

    map.invalidateSize({ pan: false });
  };

  // Switch canvas if dark mode prop changes externally
  useEffect(() => {
    if (modoOscuroMapa) {
      aplicarProveedor('esri_dark');
    } else if (activeTileProviderRef.current === 'esri_dark') {
      aplicarProveedor('esri_light');
    }
  }, [modoOscuroMapa]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered initially on Chile (Santiago / Central Zone)
    const initialZoom = 6.2;
    const map = L.map(mapContainerRef.current, {
      center: [-33.4489, -70.6693],
      zoom: initialZoom,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false, // Custom modernist controls
      attributionControl: false, // Disables default Leaflet watermarks/attributions
    });

    // Primary tile layer: Esri Light Gray Canvas (or dark)
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

    map.on('zoomend', () => {
      const currentZoom = Math.round(map.getZoom());
      setZoomLevel(currentZoom);
    });

    // Close layer menu on map click
    map.on('click', () => {
      setMenuCapasAbierto(false);
    });

    // ResizeObserver for reliable dimension adjustments
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      tileLayerRef.current = null;
      markersLayerRef.current = null;
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
        // Pure smooth pan without forcing or altering the user's manual zoom level
        map.panTo([proyecto.coordenadas.lat, proyecto.coordenadas.lng], {
          animate: true,
          duration: 0.5,
        });
      });

      marker.addTo(markersGroup);
    });
  }, [proyectos, proyectoSeleccionado, onSeleccionarProyecto]);

  // Center on selected project if changed externally without overriding manual zoom
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

    if (distance > 0.001) {
      map.panTo([targetLat, targetLng], {
        animate: true,
        duration: 0.5,
      });
    }
  }, [proyectoSeleccionado]);

  // Zoom controls (Manual)
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  // Manual fit bounds to active filtered works
  const handleAjustarObras = () => {
    const map = mapInstanceRef.current;
    if (!map || proyectos.length === 0) return;

    const bounds = L.latLngBounds(
      proyectos.map((p) => [p.coordenadas.lat, p.coordenadas.lng])
    );

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 14,
        animate: true,
        duration: 0.8,
      });
    }
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
          activeTileProvider === 'esri_dark'
            ? 'architect-map-dark'
            : activeTileProvider === 'osm'
            ? 'architect-map-osm'
            : 'architect-map-monochrome'
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

        <button
          id="btn-map-fit-bounds"
          onClick={handleAjustarObras}
          className="w-9 h-9 bg-white hover:bg-black text-black hover:text-white border border-[#111111] flex items-center justify-center transition-colors cursor-pointer"
          title={idioma === 'en' ? 'Fit view to filtered projects' : 'Ajustar vista a obras filtradas'}
          aria-label="Ajustar vista a obras filtradas"
        >
          <Focus className="w-4 h-4" />
        </button>

        <div className="h-[1px] bg-[#D4D4D4] my-0.5" />

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

        {/* Tile Provider Layer Switcher (Manual) */}
        <div className="relative">
          <button
            id="btn-map-capas"
            onClick={() => setMenuCapasAbierto(!menuCapasAbierto)}
            className={`w-9 h-9 border border-[#111111] flex items-center justify-center transition-colors cursor-pointer relative ${
              menuCapasAbierto ? 'bg-black text-white' : 'bg-white hover:bg-black text-black hover:text-white'
            }`}
            title="Selector de capas cartográficas"
            aria-label="Selector de capas cartográficas"
          >
            <Layers className="w-4 h-4" />
          </button>

          {menuCapasAbierto && (
            <div
              id="menu-capas-cartograficas"
              onClick={(e) => e.stopPropagation()}
              className="absolute right-full top-0 mr-2 w-64 bg-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] p-3 z-50 text-xs flex flex-col gap-2 animate-in fade-in slide-in-from-right-2 duration-150"
            >
              <div className="font-mono-code font-bold uppercase text-[10px] text-neutral-500 pb-1.5 border-b border-neutral-200 flex items-center justify-between">
                <span>{idioma === 'en' ? 'Cartographic Layer' : 'Capa Cartográfica'}</span>
              </div>
              <div className="space-y-1.5">
                {(Object.keys(TILE_PROVIDERS) as TileProviderId[]).map((id) => {
                  const isCurrent = activeTileProvider === id;
                  const prov = TILE_PROVIDERS[id];
                  return (
                    <button
                      key={id}
                      id={`btn-capa-${id}`}
                      onClick={() => {
                        aplicarProveedor(id);
                        setMenuCapasAbierto(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 text-xs transition-colors flex flex-col gap-0.5 cursor-pointer border ${
                        isCurrent
                          ? 'bg-black text-white border-black font-medium'
                          : 'bg-white hover:bg-neutral-50 text-black border-neutral-200 hover:border-black'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-semibold">{prov.name}</span>
                        {isCurrent && <span className="text-xs font-bold">✓</span>}
                      </div>
                      <span
                        className={`text-[10px] leading-tight ${
                          isCurrent ? 'text-neutral-300' : 'text-neutral-500'
                        }`}
                      >
                        {prov.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

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
              {proyectoSeleccionado.arquitecto_principal || proyectoSeleccionado.arquitecto}
            </p>
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
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-100 mt-1 flex-wrap">
            <div className="flex items-center gap-1.5">
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

              <button
                id="btn-acercar-sitio-obra"
                type="button"
                onClick={() => {
                  mapInstanceRef.current?.flyTo(
                    [proyectoSeleccionado.coordenadas.lat, proyectoSeleccionado.coordenadas.lng],
                    14,
                    { duration: 0.7 }
                  );
                }}
                className="inline-flex items-center gap-1 text-[11px] font-mono-code px-2 py-1.5 border border-neutral-300 hover:border-black text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
                title={idioma === 'en' ? 'Zoom in to site (Z:14)' : 'Acercar a sitio (Z:14)'}
              >
                <Focus className="w-3 h-3" />
                <span>{idioma === 'en' ? 'Zoom in' : 'Acercar'}</span>
              </button>
            </div>

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
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-xs border border-[#111111] px-3 py-1.5 text-[11px] font-mono-code text-black flex items-center gap-2.5 shadow-[0_2px_6px_rgba(0,0,0,0.05)] flex-wrap max-w-[calc(100%-2rem)]">
        <div className="flex items-center gap-1.5">
          <Navigation className="w-3 h-3 rotate-45" />
          <span>
            {centerCoords.lat >= 0 ? `${centerCoords.lat}°N` : `${Math.abs(centerCoords.lat)}°S`},{' '}
            {centerCoords.lng >= 0 ? `${centerCoords.lng}°E` : `${Math.abs(centerCoords.lng)}°W`}
          </span>
        </div>
        <span className="text-neutral-300">|</span>
        <div className="flex items-center gap-1">
          <span>Z:{zoomLevel}</span>
        </div>
        <span className="text-neutral-300">|</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-neutral-500 uppercase font-medium">
            ESRI CANVAS | EPSG:3857
          </span>
        </div>
      </div>
    </div>
  );
};
