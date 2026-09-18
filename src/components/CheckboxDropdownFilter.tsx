import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X, Search } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  group?: string;
}

interface CheckboxDropdownFilterProps {
  id?: string;
  label: string;
  selectedValues: string[];
  options: DropdownOption[];
  onChange: (newValues: string[]) => void;
  placeholderSearch?: string;
  className?: string;
  menuWidthClass?: string;
  maxMenuHeight?: string;
  alignRight?: boolean;
}

export const CheckboxDropdownFilter: React.FC<CheckboxDropdownFilterProps> = ({
  id,
  label,
  selectedValues,
  options,
  onChange,
  placeholderSearch = 'Buscar...',
  className = '',
  menuWidthClass = 'w-64',
  maxMenuHeight = 'max-h-72',
  alignRight = false,
}) => {
  const [abierto, setAbierto] = useState(false);
  const [busquedaInterna, setBusquedaInterna] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputSearchRef = useRef<HTMLInputElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickAfuera = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setAbierto(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAbierto(false);
      }
    };

    if (abierto) {
      document.addEventListener('mousedown', handleClickAfuera);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickAfuera);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [abierto]);

  // Focus en el buscador al abrir si hay muchas opciones
  useEffect(() => {
    if (abierto && options.length > 7 && inputSearchRef.current) {
      setTimeout(() => inputSearchRef.current?.focus(), 50);
    }
  }, [abierto, options.length]);

  const toggleOpcion = (val: string) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((v) => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  const limpiarSeleccion = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const seleccionarTodosVisibles = () => {
    const visibles = opcionesFiltradas.map((o) => o.value);
    const combinados = Array.from(new Set([...selectedValues, ...visibles]));
    onChange(combinados);
  };

  // Filtrado interno para búsqueda
  const opcionesFiltradas = options.filter((opt) =>
    opt.label.toLowerCase().includes(busquedaInterna.trim().toLowerCase())
  );

  // Agrupamiento si las opciones tienen campo `group`
  const opcionesAgrupadas: Record<string, DropdownOption[]> = {};
  const opcionesSinGrupo: DropdownOption[] = [];

  opcionesFiltradas.forEach((opt) => {
    if (opt.group) {
      if (!opcionesAgrupadas[opt.group]) {
        opcionesAgrupadas[opt.group] = [];
      }
      opcionesAgrupadas[opt.group].push(opt);
    } else {
      opcionesSinGrupo.push(opt);
    }
  });

  const tieneGrupos = Object.keys(opcionesAgrupadas).length > 0;
  const estaActivo = selectedValues.length > 0;

  // Texto del botón
  const getButtonText = () => {
    if (selectedValues.length === 0) return label;
    if (selectedValues.length === 1) {
      const match = options.find((o) => o.value === selectedValues[0]);
      const valorLabel = match ? match.label : selectedValues[0];
      return `${label}: ${valorLabel}`;
    }
    return `${label} (${selectedValues.length})`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${abierto ? 'z-[1200]' : 'z-10'} ${className}`}
    >
      {/* Botón gatillador */}
      <button
        id={id}
        type="button"
        onClick={() => setAbierto(!abierto)}
        className={`px-2.5 py-1.5 text-xs outline-none cursor-pointer transition-all border rounded-md flex items-center justify-between gap-1.5 select-none whitespace-nowrap font-medium ${
          estaActivo
            ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
            : 'bg-[#F3F4F6] text-neutral-800 border-[#E5E7EB] hover:bg-[#E5E7EB] hover:border-neutral-400 focus:border-neutral-400 focus:bg-white'
        }`}
        title={selectedValues.join(', ')}
      >
        <span className="truncate max-w-[150px] sm:max-w-[180px]">
          {getButtonText()}
        </span>

        <div className="flex items-center gap-1 flex-shrink-0">
          {estaActivo && (
            <span
              onClick={limpiarSeleccion}
              className="p-0.5 hover:bg-neutral-800 rounded transition-colors cursor-pointer text-neutral-300 hover:text-white"
              title="Limpiar"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-200 ${
              abierto ? 'rotate-180' : ''
            } ${estaActivo ? 'text-white' : 'text-neutral-500'}`}
          />
        </div>
      </button>

      {/* Menú Desplegable Flotante */}
      {abierto && (
        <div
          className={`absolute ${
            alignRight ? 'right-0' : 'left-0'
          } top-full mt-1.5 bg-white border border-[#E5E7EB] shadow-[0_10px_30px_rgba(0,0,0,0.1)] rounded-md z-[1250] flex flex-col ${menuWidthClass} animate-in fade-in duration-100 overflow-hidden`}
        >
          {/* Cabecera con Buscador o Acciones */}
          {options.length > 5 && (
            <div className="p-2 border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <div className="relative">
                <Search className="w-3 h-3 text-neutral-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={inputSearchRef}
                  type="text"
                  placeholder={placeholderSearch}
                  value={busquedaInterna}
                  onChange={(e) => setBusquedaInterna(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded pl-7 pr-6 py-1 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-400 font-sans"
                />
                {busquedaInterna && (
                  <button
                    onClick={() => setBusquedaInterna('')}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Botones de acción rápida */}
              <div className="flex items-center justify-between mt-1.5 px-0.5 text-[10px] text-neutral-500 font-medium">
                <button
                  type="button"
                  onClick={seleccionarTodosVisibles}
                  className="hover:text-black underline cursor-pointer"
                >
                  Marcar visibles
                </button>
                {selectedValues.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onChange([])}
                    className="hover:text-red-600 underline cursor-pointer"
                  >
                    Limpiar ({selectedValues.length})
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Lista de Opciones con Checkboxes */}
          <div className={`overflow-y-auto ${maxMenuHeight} p-1 divide-y divide-neutral-100`}>
            {opcionesFiltradas.length === 0 ? (
              <div className="py-4 text-center text-xs text-neutral-400 font-mono-code">
                Sin coincidencias
              </div>
            ) : tieneGrupos ? (
              <>
                {opcionesSinGrupo.map((opt) => {
                  const seleccionado = selectedValues.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      onClick={() => toggleOpcion(opt.value)}
                      className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-neutral-900 hover:bg-neutral-100 cursor-pointer select-none transition-colors"
                    >
                      <div
                        className={`w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 transition-colors ${
                          seleccionado
                            ? 'bg-black border-black text-white'
                            : 'bg-white border-neutral-400 hover:border-black'
                        }`}
                      >
                        {seleccionado && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span className="truncate">{opt.label}</span>
                    </label>
                  );
                })}

                {Object.entries(opcionesAgrupadas).map(([grupo, grupoOpts]) => (
                  <div key={grupo} className="pt-1.5 pb-1">
                    <div className="px-2 py-0.5 text-[10px] font-mono-code font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100/70 border-y border-neutral-200 mb-0.5">
                      {grupo}
                    </div>
                    {grupoOpts.map((opt) => {
                      const seleccionado = selectedValues.includes(opt.value);
                      return (
                        <label
                          key={opt.value}
                          onClick={() => toggleOpcion(opt.value)}
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-neutral-900 hover:bg-neutral-100 cursor-pointer select-none transition-colors"
                        >
                          <div
                            className={`w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 transition-colors ${
                              seleccionado
                                ? 'bg-black border-black text-white'
                                : 'bg-white border-neutral-400 hover:border-black'
                            }`}
                          >
                            {seleccionado && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span className="truncate">{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                ))}
              </>
            ) : (
              opcionesFiltradas.map((opt) => {
                const seleccionado = selectedValues.includes(opt.value);
                return (
                  <label
                    key={opt.value}
                    onClick={() => toggleOpcion(opt.value)}
                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-neutral-900 hover:bg-neutral-100 cursor-pointer select-none transition-colors"
                  >
                    <div
                      className={`w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 transition-colors ${
                        seleccionado
                          ? 'bg-black border-black text-white'
                          : 'bg-white border-neutral-400 hover:border-black'
                      }`}
                    >
                      {seleccionado && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className="truncate">{opt.label}</span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
