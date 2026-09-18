import React, { useEffect, useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Layers,
  Building2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Compass,
  FileText,
  Award,
  Copy,
  Check,
  Users,
  Landmark,
} from 'lucide-react';
import { ProyectoArquitectura, Idioma } from '../types';
import { I18N_TEXTS, traducirEstilo, traducirPrograma } from '../i18n';
import { formatearCoordenadas } from '../utils/geoUtils';

interface ProjectDetailModalProps {
  proyecto: ProyectoArquitectura | null;
  idioma: Idioma;
  onCerrar: () => void;
  onCentrarEnMapa?: (proyecto: ProyectoArquitectura) => void;
  onAnterior?: () => void;
  onSiguiente?: () => void;
  tieneAnterior?: boolean;
  tieneSiguiente?: boolean;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  proyecto,
  idioma,
  onCerrar,
  onCentrarEnMapa,
  onAnterior,
  onSiguiente,
  tieneAnterior,
  tieneSiguiente,
}) => {
  const t = I18N_TEXTS[idioma];
  const [enlaceCopiado, setEnlaceCopiado] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar();
      if (e.key === 'ArrowLeft' && tieneAnterior && onAnterior) onAnterior();
      if (e.key === 'ArrowRight' && tieneSiguiente && onSiguiente) onSiguiente();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCerrar, onAnterior, onSiguiente, tieneAnterior, tieneSiguiente]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (proyecto) {
      document.body.style.overflow = 'hidden';
      setEnlaceCopiado(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [proyecto]);

  if (!proyecto) return null;

  const obtenerNombreFuente = (url?: string): string => {
    if (!url) return t.sourceLabel;
    try {
      const u = new URL(url);
      const host = u.hostname.toLowerCase();
      if (host.includes('wikipedia')) return 'Wikipedia';
      if (host.includes('archdaily')) return 'ArchDaily';
      if (host.includes('pritzkerprize')) return 'Pritzker Prize';
      if (host.includes('moma')) return 'MoMA';
      if (host.includes('elementalchile')) return 'ELEMENTAL';
      if (host.includes('serpentinegalleries')) return 'Serpentine Galleries';
      if (host.includes('unesco')) return 'UNESCO';
      if (host.includes('fundacaooscarniemeyer') || host.includes('niemeyer')) return 'Fundação Oscar Niemeyer';
      return host.replace('www.', '');
    } catch {
      return t.officialSource;
    }
  };

  const copiarEnlaceFuente = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!proyecto.fuente_url) return;
    try {
      await navigator.clipboard.writeText(proyecto.fuente_url);
      setEnlaceCopiado(true);
      setTimeout(() => setEnlaceCopiado(false), 2000);
    } catch {
      // Fallback
      setEnlaceCopiado(true);
      setTimeout(() => setEnlaceCopiado(false), 2000);
    }
  };

  const nombreFuente = obtenerNombreFuente(proyecto.fuente_url);
  const arquitectoDisplay =
    (proyecto.arquitecto_filtro && proyecto.arquitecto_filtro !== 'No aplica / Anónimo')
      ? proyecto.arquitecto_filtro
      : (proyecto.arquitecto_filtro === 'No aplica / Anónimo'
          ? (idioma === 'es' ? 'No aplica / Anónimo' : 'Not applicable / Anonymous')
          : (proyecto.arquitecto_responsable || proyecto.arquitecto_principal || proyecto.arquitecto));

  const autorEspecifico = proyecto.autor_especifico_ficha;
  const mostrarAutorEspecifico = Boolean(
    autorEspecifico &&
    autorEspecifico !== arquitectoDisplay &&
    autorEspecifico !== 'Anónimo'
  );

  const tieneColaboradores = Boolean(
    proyecto.colaboradores &&
    (!autorEspecifico || !autorEspecifico.includes(proyecto.colaboradores))
  );
  const tieneInstituciones = Boolean(
    proyecto.instituciones && proyecto.instituciones.length > 0
  );

  return (
    <div
      id="modal-detalle-backdrop"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs"
      onClick={onCerrar}
      role="dialog"
      aria-modal="true"
    >
      <div
        id="modal-detalle-contenido"
        className="bg-white border-2 border-black w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E5E5] bg-[#FBFBFB]">
          <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-neutral-600">
            <span className="w-2 h-2 bg-black inline-block"></span>
            <span>{t.appTitle}</span>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-500 truncate max-w-[160px] sm:max-w-[280px]">
              {proyecto.nombre_proyecto}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {(tieneAnterior || tieneSiguiente) && (
              <div className="flex items-center border border-[#E5E5E5] bg-white mr-2">
                <button
                  onClick={onAnterior}
                  disabled={!tieneAnterior}
                  className="p-1 hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit transition-colors cursor-pointer"
                  title={`${t.previous} (←)`}
                  aria-label={t.previous}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="w-[1px] h-4 bg-[#E5E5E5]"></span>
                <button
                  onClick={onSiguiente}
                  disabled={!tieneSiguiente}
                  className="p-1 hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit transition-colors cursor-pointer"
                  title={`${t.next} (→)`}
                  aria-label={t.next}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              id="btn-cerrar-modal-detalle"
              onClick={onCerrar}
              className="p-1.5 text-black hover:bg-black hover:text-white border border-black transition-colors cursor-pointer"
              title={`${t.close} (Esc)`}
              aria-label={t.close}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-5 md:p-8 space-y-6">
          {/* Title and Architect Meta */}
          <div className="border-b border-[#E5E5E5] pb-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex flex-wrap items-center gap-2">
                {proyecto.ano_pritzker ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-black text-white text-xs font-mono-code font-bold">
                    <Award className="w-3.5 h-3.5" />
                    <span>{t.pritzkerPrize.toUpperCase()} {proyecto.ano_pritzker}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-neutral-300 text-neutral-600 text-[11px] font-mono-code">
                    <span>{t.classicReferent.toUpperCase()}</span>
                  </div>
                )}

                <span className="text-xs font-mono-code text-neutral-400">
                  REF: {proyecto.id}
                </span>
              </div>

              {proyecto.fuente_url && (
                <div className="flex items-center gap-2">
                  <a
                    href={proyecto.fuente_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black text-white hover:bg-neutral-800 text-[11px] font-mono-code uppercase transition-colors cursor-pointer"
                    title={t.sourceDoc}
                  >
                    <span>{nombreFuente}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    type="button"
                    onClick={copiarEnlaceFuente}
                    className="inline-flex items-center gap-1 px-2 py-1 border border-neutral-300 hover:border-black text-neutral-700 hover:text-black text-[11px] font-mono-code transition-colors cursor-pointer"
                    title="Copiar URL al portapapeles"
                  >
                    {enlaceCopiado ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                    <span>{enlaceCopiado ? t.copiedUrl : t.copyUrl}</span>
                  </button>
                </div>
              )}
            </div>

            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black mb-1.5">
              {proyecto.nombre_proyecto}
            </h2>

            {/* Architect & Office */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base md:text-lg font-bold text-neutral-950">
                  {arquitectoDisplay}
                </span>
                {proyecto.oficina && !arquitectoDisplay.includes(`(${proyecto.oficina})`) && (
                  <span className="text-xs font-mono-code px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-700">
                    {proyecto.oficina}
                  </span>
                )}
              </div>

              {/* Specific Authorship / Technical sheet attribution */}
              {mostrarAutorEspecifico && (
                <div className="flex items-start gap-2.5 text-xs text-neutral-800 bg-[#F7F7F7] p-3 border border-neutral-200">
                  <Users className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="font-mono-code uppercase font-semibold text-[11px] text-neutral-500 block mb-0.5">
                      {idioma === 'es' ? 'Autoría Específica / Ficha Técnica' : 'Specific Authorship / Technical Attribution'}:
                    </span>
                    <span className="leading-relaxed font-sans font-medium text-neutral-900">
                      {autorEspecifico}
                    </span>
                  </div>
                </div>
              )}

              {/* Collaborators and team shown in full detail */}
              {tieneColaboradores && (
                <div className="flex items-start gap-2.5 text-xs text-neutral-800 bg-[#F7F7F7] p-3 border border-neutral-200">
                  <Users className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="font-mono-code uppercase font-semibold text-[11px] text-neutral-500 block mb-0.5">
                      {t.collaboratorsLabel}:
                    </span>
                    <span className="leading-relaxed font-sans">{proyecto.colaboradores}</span>
                  </div>
                </div>
              )}

              {/* Institutions associated with the project */}
              {tieneInstituciones && (
                <div className="flex items-start gap-2.5 text-xs text-neutral-800 bg-[#F7F7F7] p-3 border border-neutral-200">
                  <Landmark className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="font-mono-code uppercase font-semibold text-[11px] text-neutral-500 block mb-1">
                      {t.institutionsLabel}:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {proyecto.instituciones!.map((inst) => (
                        <span
                          key={inst}
                          className="px-2.5 py-0.5 bg-white border border-neutral-300 text-neutral-800 text-[11px] font-sans font-medium shadow-2xs"
                        >
                          {inst}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fotografía Arquitectónica y Atribución Legal CC BY-SA 4.0 */}
          {proyecto.fotografia_url && (
            <div className="space-y-1.5">
              <div className="w-full bg-[#111111] overflow-hidden border border-[#E5E5E5] shadow-xs flex items-center justify-center max-h-[460px]">
                <img
                  src={proyecto.fotografia_url}
                  alt={proyecto.nombre_proyecto}
                  className="w-full h-auto max-h-[460px] object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>

              {/* Atribución sutil conforme a CC BY-SA 4.0 */}
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-1 text-[11px] font-mono-code text-neutral-500">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-neutral-400">Fotografía:</span>
                  {proyecto.fotografia_autor_url ? (
                    <a
                      href={proyecto.fotografia_autor_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-600 hover:text-black underline underline-offset-2 transition-colors"
                      title="Ver archivo original en Wikimedia Commons"
                    >
                      {proyecto.fotografia_credito || 'Vmorande'}
                    </a>
                  ) : (
                    <span className="text-neutral-600">{proyecto.fotografia_credito || 'Vmorande'}</span>
                  )}
                  <span className="text-neutral-300">•</span>
                  {proyecto.fotografia_licencia_url ? (
                    <a
                      href={proyecto.fotografia_licencia_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-600 hover:text-black underline underline-offset-2 transition-colors"
                      title="Licencia Creative Commons Attribution-ShareAlike 4.0 International"
                    >
                      {proyecto.fotografia_licencia || 'CC BY-SA 4.0'}
                    </a>
                  ) : (
                    <span>{proyecto.fotografia_licencia || 'CC BY-SA 4.0'}</span>
                  )}
                </div>

                {proyecto.fotografia_fuente && (
                  <span className="text-neutral-400">
                    Vía {proyecto.fotografia_fuente}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Chronology & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-[#F7F7F7] border border-[#EBEBEB]">
            {/* Location */}
            <div>
              <div className="text-[11px] font-mono-code uppercase text-neutral-500 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{t.location}</span>
              </div>
              <div className="text-xs font-semibold text-black">
                {proyecto.ciudad}, {proyecto.pais}
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1" title={proyecto.direccion}>
                {proyecto.direccion}
              </div>
            </div>

            {/* Design Year */}
            <div>
              <div className="text-[11px] font-mono-code uppercase text-neutral-500 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{t.designYear}</span>
              </div>
              <div className="text-xs font-mono-code font-bold text-black">
                {proyecto.ano_diseno}
              </div>
            </div>

            {/* Construction Years */}
            <div>
              <div className="text-[11px] font-mono-code uppercase text-neutral-500 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{t.construction}</span>
              </div>
              <div className="text-xs font-mono-code font-bold text-black">
                {proyecto.anos_construccion}
              </div>
            </div>

            {/* Inauguration Year */}
            <div>
              <div className="text-[11px] font-mono-code uppercase text-neutral-500 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{t.inauguration}</span>
              </div>
              <div className="text-xs font-mono-code font-bold text-black">
                {proyecto.ano_inauguracion}
              </div>
            </div>
          </div>

          {/* Architectural Periods, Styles & Program */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Periods & Styles */}
            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-mono-code uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{idioma === 'es' ? 'Período y Estilos' : 'Period & Styles'}</span>
                </h3>
                
                {/* Periods if present */}
                {(proyecto.periodos || proyecto.periodo) && (proyecto.periodos || proyecto.periodo)!.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(proyecto.periodos || proyecto.periodo)!.map((per) => (
                      <span
                        key={per}
                        className="px-2.5 py-0.5 text-xs bg-neutral-100 border border-neutral-300 font-mono-code text-neutral-800"
                      >
                        {per}
                      </span>
                    ))}
                  </div>
                )}

                {/* Styles */}
                <div className="flex flex-wrap gap-1.5">
                  {(proyecto.estilos || proyecto.estilo) && (proyecto.estilos || proyecto.estilo)!.length > 0 ? (
                    (proyecto.estilos || proyecto.estilo)!.map((estilo) => (
                      <span
                        key={estilo}
                        className="px-2.5 py-1 text-xs bg-white border border-black font-medium text-black shadow-2xs"
                      >
                        {traducirEstilo(estilo, idioma)}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-neutral-400 italic">—</span>
                  )}
                </div>
              </div>
            </div>

            {/* Programs: Principal & Específico */}
            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-mono-code uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{t.programLabel}</span>
                </h3>
                
                {/* Main Programs */}
                {proyecto.programa_principal && proyecto.programa_principal.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {proyecto.programa_principal.map((prog) => (
                      <span
                        key={prog}
                        className="px-2.5 py-1 text-xs bg-neutral-900 text-white font-medium"
                      >
                        {traducirPrograma(prog, idioma)}
                      </span>
                    ))}
                  </div>
                )}

                {/* Specific Programs */}
                {(proyecto.programa_especifico || proyecto['programa_específico']) &&
                  (proyecto.programa_especifico || proyecto['programa_específico'])!.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {(proyecto.programa_especifico || proyecto['programa_específico'])!.map((esp) => (
                        <span
                          key={esp}
                          className="px-2 py-0.5 text-xs bg-[#EFEFEF] border border-neutral-300 text-neutral-800 font-mono-code"
                        >
                          {esp}
                        </span>
                      ))}
                    </div>
                )}

                {/* Fallback to legacy programs if neither is present */}
                {(!proyecto.programa_principal || proyecto.programa_principal.length === 0) &&
                  (!proyecto.programa_especifico || proyecto.programa_especifico.length === 0) &&
                  (proyecto.programas || proyecto.programa) && (
                    <div className="flex flex-wrap gap-1.5">
                      {(proyecto.programas || proyecto.programa)!.map((prog) => (
                        <span
                          key={prog}
                          className="px-2.5 py-1 text-xs bg-neutral-900 text-white font-medium"
                        >
                          {traducirPrograma(prog, idioma)}
                        </span>
                      ))}
                    </div>
                )}
              </div>
            </div>
          </div>

          {/* Materials */}
          {proyecto.materiales_principales && proyecto.materiales_principales.length > 0 && (
            <div>
              <h3 className="text-xs font-mono-code uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>{t.materialsLabel}</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {proyecto.materiales_principales.map((mat) => (
                  <span
                    key={mat}
                    className="px-2 py-0.5 text-xs bg-[#EFEFEF] text-neutral-800"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Architectural Description */}
          <div>
            <h3 className="text-xs font-mono-code uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>{t.conceptLabel}</span>
            </h3>
            <div className="bg-[#FAFAFA] p-5 border-l-2 border-black text-sm text-neutral-800 leading-relaxed space-y-3 font-sans">
              <p>{proyecto.descripcion}</p>
            </div>
          </div>

          {/* Geographic Coordinates & Reference Footer */}
          <div className="flex flex-wrap items-center justify-between text-xs font-mono-code text-neutral-500 pt-4 border-t border-[#E5E5E5] gap-3">
            <div className="flex items-center gap-3">
              <button
                id="btn-modal-centrar-coordenadas"
                type="button"
                onClick={() => {
                  if (onCentrarEnMapa) {
                    onCentrarEnMapa(proyecto);
                  } else {
                    onCerrar();
                  }
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-black hover:bg-neutral-800 text-white border border-black text-xs font-mono-code transition-all cursor-pointer shadow-xs group"
                title={idioma === 'en' ? 'Center map on coordinates' : 'Centrar mapa en estas coordenadas'}
              >
                <Compass className="w-3.5 h-3.5 text-[#FDE17D] group-hover:rotate-45 transition-transform" />
                <span className="font-bold">
                  {t.coordinatesLabel}: {formatearCoordenadas(proyecto.coordenadas.lat, proyecto.coordenadas.lng)}
                </span>
                <span className="text-[10px] uppercase font-mono-code px-1.5 py-0.5 bg-white/20 text-white ml-1">
                  {idioma === 'en' ? 'View on map →' : 'Ver en mapa →'}
                </span>
              </button>
            </div>

            {proyecto.fuente_url && (
              <a
                href={proyecto.fuente_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-black hover:underline cursor-pointer"
              >
                <span>{proyecto.fuente_url}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
