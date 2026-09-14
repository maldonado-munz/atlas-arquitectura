import React from 'react';
import { Search, X, RotateCcw, Award } from 'lucide-react';
import { FiltrosState, Idioma } from '../types';
import {
  TODOS_LOS_ESTILOS,
  TODOS_LOS_PROGRAMAS,
  TODOS_LOS_ARQUITECTOS,
  TODOS_LOS_PAISES,
  DECADAS_DISPONIBLES,
} from '../data/proyectos';
import { I18N_TEXTS, traducirEstilo, traducirPrograma } from '../i18n';

interface FiltersBarProps {
  filtros: FiltrosState;
  idioma: Idioma;
  onActualizarFiltros: (nuevosFiltros: Partial<FiltrosState>) => void;
  onResetFiltros: () => void;
  totalFiltrados: number;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filtros,
  idioma,
  onActualizarFiltros,
  onResetFiltros,
  totalFiltrados,
}) => {
  const t = I18N_TEXTS[idioma];

  // Quick remove helper for active tags
  const toggleEstilo = (estilo: string) => {
    const yaExiste = filtros.estilosSeleccionados.includes(estilo);
    const nuevosEstilos = yaExiste
      ? filtros.estilosSeleccionados.filter((e) => e !== estilo)
      : [...filtros.estilosSeleccionados, estilo];
    onActualizarFiltros({ estilosSeleccionados: nuevosEstilos });
  };

  const togglePrograma = (prog: string) => {
    const yaExiste = filtros.programasSeleccionados.includes(prog);
    const nuevosProgramas = yaExiste
      ? filtros.programasSeleccionados.filter((p) => p !== prog)
      : [...filtros.programasSeleccionados, prog];
    onActualizarFiltros({ programasSeleccionados: nuevosProgramas });
  };

  const hayFiltrosActivos =
    filtros.busqueda.trim() !== '' ||
    filtros.estilosSeleccionados.length > 0 ||
    filtros.programasSeleccionados.length > 0 ||
    filtros.arquitectoSeleccionado !== '' ||
    filtros.paisSeleccionado !== '' ||
    filtros.decadaSeleccionada !== 'all' ||
    filtros.soloPritzker;

  return (
    <div className="bg-white border-b border-[#E5E5E5] px-4 md:px-8 py-2.5 transition-all z-40 relative">
      {/* Controls Row: Compact & Space-Efficient */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="filtro-busqueda-texto"
            type="text"
            placeholder={t.searchPlaceholder}
            value={filtros.busqueda}
            onChange={(e) => onActualizarFiltros({ busqueda: e.target.value })}
            className="w-full bg-[#F5F5F5] border border-transparent focus:border-black focus:bg-white pl-8 pr-7 py-1.5 text-xs text-black placeholder-neutral-400 outline-none transition-all font-sans"
          />
          {filtros.busqueda && (
            <button
              onClick={() => onActualizarFiltros({ busqueda: '' })}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Program Dropdown Filter (Atomic & General Programs) */}
        <div className="w-36 sm:w-44">
          <select
            id="filtro-select-programa"
            value={filtros.programasSeleccionados[0] || ''}
            onChange={(e) =>
              onActualizarFiltros({
                programasSeleccionados: e.target.value ? [e.target.value] : [],
              })
            }
            className={`w-full px-2.5 py-1.5 text-xs outline-none cursor-pointer transition-all border ${
              filtros.programasSeleccionados.length > 0
                ? 'bg-black text-white border-black font-medium shadow-xs'
                : 'bg-[#F7F7F7] text-black border-neutral-200 hover:border-black focus:border-black focus:bg-white'
            }`}
          >
            <option value="" className="text-black bg-white">
              {t.allPrograms}
            </option>
            {TODOS_LOS_PROGRAMAS.map((prog) => (
              <option key={prog} value={prog} className="text-black bg-white">
                {traducirPrograma(prog, idioma)}
              </option>
            ))}
          </select>
        </div>

        {/* Styles Dropdown Filter (Normalized General Architectural Styles) */}
        <div className="w-36 sm:w-44">
          <select
            id="filtro-select-estilo"
            value={filtros.estilosSeleccionados[0] || ''}
            onChange={(e) =>
              onActualizarFiltros({
                estilosSeleccionados: e.target.value ? [e.target.value] : [],
              })
            }
            className={`w-full px-2.5 py-1.5 text-xs outline-none cursor-pointer transition-all border ${
              filtros.estilosSeleccionados.length > 0
                ? 'bg-black text-white border-black font-medium shadow-xs'
                : 'bg-[#F7F7F7] text-black border-neutral-200 hover:border-black focus:border-black focus:bg-white'
            }`}
          >
            <option value="" className="text-black bg-white">
              {t.allStyles}
            </option>
            {TODOS_LOS_ESTILOS.map((estilo) => (
              <option key={estilo} value={estilo} className="text-black bg-white">
                {traducirEstilo(estilo, idioma)}
              </option>
            ))}
          </select>
        </div>

        {/* Architect Dropdown (Principal / Most relevant architects) */}
        <div className="w-36 sm:w-44">
          <select
            id="filtro-select-arquitecto"
            value={filtros.arquitectoSeleccionado}
            onChange={(e) =>
              onActualizarFiltros({ arquitectoSeleccionado: e.target.value })
            }
            className={`w-full px-2.5 py-1.5 text-xs outline-none cursor-pointer transition-all border ${
              filtros.arquitectoSeleccionado
                ? 'bg-black text-white border-black font-medium shadow-xs'
                : 'bg-[#F7F7F7] text-black border-neutral-200 hover:border-black focus:border-black focus:bg-white'
            }`}
          >
            <option value="" className="text-black bg-white">
              {t.allArchitects}
            </option>
            {TODOS_LOS_ARQUITECTOS.map((arq) => (
              <option key={arq} value={arq} className="text-black bg-white">
                {arq}
              </option>
            ))}
          </select>
        </div>

        {/* Country Dropdown */}
        <div className="w-28 sm:w-36">
          <select
            id="filtro-select-pais"
            value={filtros.paisSeleccionado}
            onChange={(e) =>
              onActualizarFiltros({ paisSeleccionado: e.target.value })
            }
            className={`w-full px-2.5 py-1.5 text-xs outline-none cursor-pointer transition-all border ${
              filtros.paisSeleccionado
                ? 'bg-black text-white border-black font-medium shadow-xs'
                : 'bg-[#F7F7F7] text-black border-neutral-200 hover:border-black focus:border-black focus:bg-white'
            }`}
          >
            <option value="" className="text-black bg-white">
              {t.allCountries}
            </option>
            {TODOS_LOS_PAISES.map((pais) => (
              <option key={pais} value={pais} className="text-black bg-white">
                {pais}
              </option>
            ))}
          </select>
        </div>

        {/* Decade Dropdown */}
        <div className="w-28 sm:w-32">
          <select
            id="filtro-select-decada"
            value={filtros.decadaSeleccionada}
            onChange={(e) =>
              onActualizarFiltros({ decadaSeleccionada: e.target.value })
            }
            className={`w-full px-2.5 py-1.5 text-xs outline-none cursor-pointer transition-all border ${
              filtros.decadaSeleccionada !== 'all'
                ? 'bg-black text-white border-black font-medium shadow-xs'
                : 'bg-[#F7F7F7] text-black border-neutral-200 hover:border-black focus:border-black focus:bg-white'
            }`}
          >
            {DECADAS_DISPONIBLES.map((dec) => (
              <option key={dec.value} value={dec.value} className="text-black bg-white">
                {dec.label[idioma]}
              </option>
            ))}
          </select>
        </div>

        {/* Pritzker filter pill */}
        <button
          id="filtro-toggle-pritzker"
          onClick={() =>
            onActualizarFiltros({ soloPritzker: !filtros.soloPritzker })
          }
          className={`px-2.5 py-1.5 text-xs border font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            filtros.soloPritzker
              ? 'bg-black text-white border-black'
              : 'bg-[#F5F5F5] text-black border-transparent hover:border-black'
          }`}
          title={t.pritzkerPrize}
        >
          <Award className="w-3.5 h-3.5" />
          <span>{t.pritzkerPill}</span>
        </button>

        {/* Results Counter & Reset */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-neutral-500 font-mono-code whitespace-nowrap">
            {totalFiltrados} {t.worksCount}
          </span>

          {hayFiltrosActivos && (
            <button
              id="btn-limpiar-filtros"
              onClick={onResetFiltros}
              className="text-xs text-neutral-500 hover:text-black flex items-center gap-1 underline underline-offset-4 cursor-pointer ml-1"
              title={t.reset}
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">{t.reset}</span>
            </button>
          )}
        </div>
      </div>

      {/* Selected tags row: Active styles & active programs */}
      {(filtros.estilosSeleccionados.length > 0 || filtros.programasSeleccionados.length > 0) && (
        <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-2 border-t border-[#F0F0F0] text-[11px]">
          {filtros.estilosSeleccionados.length > 0 && (
            <>
              <span className="text-[10px] font-mono-code uppercase text-neutral-400 mr-0.5 flex-shrink-0">
                {t.activeStyles}
              </span>
              {filtros.estilosSeleccionados.map((estilo) => (
                <span
                  key={estilo}
                  className="inline-flex items-center gap-1 bg-black text-white px-2 py-0.5 text-[10px] flex-shrink-0"
                >
                  {traducirEstilo(estilo, idioma)}
                  <button
                    onClick={() => toggleEstilo(estilo)}
                    className="hover:text-neutral-300 cursor-pointer ml-0.5"
                    title={t.clear}
                  >
                    ×
                  </button>
                </span>
              ))}
            </>
          )}

          {filtros.programasSeleccionados.length > 0 && (
            <>
              <span className="text-[10px] font-mono-code uppercase text-neutral-400 ml-2 mr-0.5 flex-shrink-0">
                {t.activePrograms}
              </span>
              {filtros.programasSeleccionados.map((prog) => (
                <span
                  key={prog}
                  className="inline-flex items-center gap-1 bg-neutral-800 text-white px-2 py-0.5 text-[10px] flex-shrink-0"
                >
                  {traducirPrograma(prog, idioma)}
                  <button
                    onClick={() => togglePrograma(prog)}
                    className="hover:text-neutral-300 cursor-pointer ml-0.5"
                    title={t.clear}
                  >
                    ×
                  </button>
                </span>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};
