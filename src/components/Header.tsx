import React from 'react';
import { SlidersHorizontal, List, Globe } from 'lucide-react';
import { Idioma } from '../types';
import { I18N_TEXTS } from '../i18n';

interface HeaderProps {
  totalProyectos: number;
  proyectosFiltrados: number;
  mostrarFiltros: boolean;
  onToggleFiltros: () => void;
  mostrarLista: boolean;
  onToggleLista: () => void;
  idioma: Idioma;
  onCambiarIdioma: (nuevo: Idioma) => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalProyectos,
  proyectosFiltrados,
  mostrarFiltros,
  onToggleFiltros,
  mostrarLista,
  onToggleLista,
  idioma,
  onCambiarIdioma,
}) => {
  const t = I18N_TEXTS[idioma];

  return (
    <header className="bg-white border-b border-[#E5E5E5] px-4 md:px-8 py-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 select-none z-30 relative shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold tracking-tighter text-xs flex-shrink-0">
          AA
        </div>
        <div>
          <h1 className="text-sm md:text-base font-bold tracking-tight text-black uppercase">
            {t.appTitle}
          </h1>
        </div>
      </div>

      {/* Metrics & Legend */}
      <div className="hidden lg:flex items-center gap-6 text-xs text-neutral-600 border-x border-[#E5E5E5] px-6">
        <div className="flex items-center gap-2">
          <span className="font-mono-code font-bold text-black text-sm">
            {proyectosFiltrados}
          </span>
          <span className="text-neutral-400">/</span>
          <span className="font-mono-code text-neutral-500 text-xs">
            {totalProyectos} {t.worksCount}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-neutral-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-black rotate-45 inline-block border border-white shadow-xs"></span>
            <span>{t.pritzkerPrize}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-black rounded-full inline-block border border-white shadow-xs"></span>
            <span>{t.classicReferent}</span>
          </div>
        </div>
      </div>

      {/* Control Buttons & Language Selector */}
      <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
        {/* Language Switcher Button */}
        <div className="flex items-center border border-[#D4D4D4] bg-[#F5F5F5] p-0.5 text-xs font-mono-code mr-1">
          <button
            id="btn-idioma-es"
            type="button"
            onClick={() => onCambiarIdioma('es')}
            className={`px-2 py-1 transition-all cursor-pointer ${
              idioma === 'es'
                ? 'bg-black text-white font-bold'
                : 'text-neutral-600 hover:text-black'
            }`}
            title="Cambiar a Español"
          >
            ES
          </button>
          <button
            id="btn-idioma-en"
            type="button"
            onClick={() => onCambiarIdioma('en')}
            className={`px-2 py-1 transition-all cursor-pointer ${
              idioma === 'en'
                ? 'bg-black text-white font-bold'
                : 'text-neutral-600 hover:text-black'
            }`}
            title="Switch to English"
          >
            EN
          </button>
        </div>

        <button
          id="btn-toggle-filtros"
          onClick={onToggleFiltros}
          className={`px-3 py-1.5 text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
            mostrarFiltros
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-[#D4D4D4] hover:border-black'
          }`}
          title={t.filtersButton}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{t.filtersButton}</span>
          {proyectosFiltrados !== totalProyectos && (
            <span className="ml-1 w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
          )}
        </button>

        <button
          id="btn-toggle-lista"
          onClick={onToggleLista}
          className={`px-3 py-1.5 text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
            mostrarLista
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-[#D4D4D4] hover:border-black'
          }`}
          title={t.catalogueButton}
        >
          <List className="w-3.5 h-3.5" />
          <span>{t.catalogueButton}</span>
        </button>
      </div>
    </header>
  );
};
