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
} from 'lucide-react';
import { ProyectoArquitectura, Idioma } from '../types';
import { I18N_TEXTS, traducirEstilo, traducirPrograma } from '../i18n';

interface ProjectDetailModalProps {
  proyecto: ProyectoArquitectura | null;
  idioma: Idioma;
  onCerrar: () => void;
  onAnterior?: () => void;
  onSiguiente?: () => void;
  tieneAnterior?: boolean;
  tieneSiguiente?: boolean;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  proyecto,
  idioma,
  onCerrar,
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
  const arquitectoPrincipal = proyecto.arquitecto_principal || proyecto.arquitecto;
  const tieneColaboradores = Boolean(
    proyecto.colaboradores ||
    (proyecto.arquitecto && proyecto.arquitecto !== arquitectoPrincipal)
  );
  const textoColaboradores = proyecto.colaboradores || proyecto.arquitecto;

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

            {/* Most relevant architect at the top */}
            <div className="space-y-1">
              <p className="text-base md:text-lg font-bold text-neutral-900 flex items-center gap-2">
                <span>{arquitectoPrincipal}</span>
              </p>

              {/* Collaborators and team shown in full detail */}
              {tieneColaboradores && (
                <div className="flex items-start gap-1.5 text-xs text-neutral-600 pt-0.5">
                  <Users className="w-3.5 h-3.5 text-neutral-400 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong className="font-semibold text-neutral-700">{t.collaborators}:</strong>{' '}
                    {textoColaboradores}
                  </span>
                </div>
              )}
            </div>
          </div>

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

          {/* Architectural Styles, Program & Materiality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Styles */}
            <div>
              <h3 className="text-xs font-mono-code uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>{t.stylesLabel}</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {proyecto.estilos && proyecto.estilos.length > 0 ? (
                  proyecto.estilos.map((estilo) => (
                    <span
                      key={estilo}
                      className="px-2.5 py-1 text-xs bg-white border border-black font-medium text-black"
                    >
                      {traducirEstilo(estilo, idioma)}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-neutral-400 italic">—</span>
                )}
              </div>
            </div>

            {/* Program */}
            <div>
              <h3 className="text-xs font-mono-code uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>{t.programLabel}</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {proyecto.programa && proyecto.programa.length > 0 ? (
                  proyecto.programa.map((prog) => (
                    <span
                      key={prog}
                      className="px-2.5 py-1 text-xs bg-neutral-900 text-white font-medium"
                    >
                      {traducirPrograma(prog, idioma)}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-neutral-400 italic">—</span>
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
          <div className="flex flex-wrap items-center justify-between text-xs font-mono-code text-neutral-500 pt-4 border-t border-[#E5E5E5] gap-2">
            <div className="flex items-center gap-4">
              <span>
                {t.coordinatesLabel}: {proyecto.coordenadas.lat.toFixed(5)}°N, {proyecto.coordenadas.lng.toFixed(5)}°E
              </span>
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
