import React from 'react';
import { Search, X, RotateCcw, Award } from 'lucide-react';
import { FiltrosState, Idioma, OpcionesFiltrosDisponibles } from '../types';
import { I18N_TEXTS } from '../i18n';
import {
  CheckboxDropdownFilter,
  DropdownOption,
} from './CheckboxDropdownFilter';
import {
  obtenerPeriodoDeEstilo,
  obtenerPrincipalDeEspecifico,
} from '../data/taxonomy';

interface FiltersBarProps {
  filtros: FiltrosState;
  opcionesDisponibles: OpcionesFiltrosDisponibles;
  idioma: Idioma;
  onActualizarFiltros: (nuevosFiltros: Partial<FiltrosState>) => void;
  onResetFiltros: () => void;
  totalFiltrados: number;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filtros,
  opcionesDisponibles,
  idioma,
  onActualizarFiltros,
  onResetFiltros,
}) => {
  const t = I18N_TEXTS[idioma];

  const hayFiltrosActivos =
    filtros.busqueda.trim() !== '' ||
    (filtros.paisesSeleccionados && filtros.paisesSeleccionados.length > 0) ||
    filtros.arquitectoSeleccionado !== '' ||
    (filtros.programasPrincipalesSeleccionados &&
      filtros.programasPrincipalesSeleccionados.length > 0) ||
    (filtros.programasEspecificosSeleccionados &&
      filtros.programasEspecificosSeleccionados.length > 0) ||
    (filtros.decadasSeleccionadas &&
      filtros.decadasSeleccionadas.length > 0) ||
    (filtros.periodosSeleccionados &&
      filtros.periodosSeleccionados.length > 0) ||
    (filtros.estilosSeleccionados &&
      filtros.estilosSeleccionados.length > 0) ||
    filtros.soloPritzker;

  // 1. Opciones de País
  const opcionesPais: DropdownOption[] = opcionesDisponibles.paises.map((p) => ({
    value: p,
    label: p,
  }));
  // Asegurar que selecciones activas estén presentes
  (filtros.paisesSeleccionados || []).forEach((p) => {
    if (!opcionesPais.some((o) => o.value === p)) {
      opcionesPais.unshift({ value: p, label: p });
    }
  });

  // 2. Opciones de Arquitecto (menú estándar)
  const listaArquitectos = [...opcionesDisponibles.arquitectos];
  if (
    filtros.arquitectoSeleccionado &&
    !listaArquitectos.includes(filtros.arquitectoSeleccionado)
  ) {
    listaArquitectos.unshift(filtros.arquitectoSeleccionado);
  }

  // 3. Opciones de Programa Principal
  const opcionesProgPrincipal: DropdownOption[] =
    opcionesDisponibles.programasPrincipales.map((prog) => ({
      value: prog,
      label: prog,
    }));
  (filtros.programasPrincipalesSeleccionados || []).forEach((prog) => {
    if (!opcionesProgPrincipal.some((o) => o.value === prog)) {
      opcionesProgPrincipal.unshift({ value: prog, label: prog });
    }
  });

  // 4. Opciones de Programa Específico (agrupadas por programa principal)
  const opcionesProgEspecifico: DropdownOption[] =
    opcionesDisponibles.programasEspecificos.map((esp) => ({
      value: esp,
      label: esp,
      group: obtenerPrincipalDeEspecifico(esp),
    }));
  (filtros.programasEspecificosSeleccionados || []).forEach((esp) => {
    if (!opcionesProgEspecifico.some((o) => o.value === esp)) {
      opcionesProgEspecifico.unshift({
        value: esp,
        label: esp,
        group: obtenerPrincipalDeEspecifico(esp),
      });
    }
  });

  // 5. Opciones de Décadas
  const opcionesDecadas: DropdownOption[] = opcionesDisponibles.decadas.map(
    (dec) => ({
      value: dec.value,
      label: dec.label[idioma],
    })
  );
  (filtros.decadasSeleccionadas || []).forEach((dec) => {
    if (!opcionesDecadas.some((o) => o.value === dec)) {
      opcionesDecadas.push({
        value: dec,
        label: dec === '2020' ? '2020+' : `${dec}s`,
      });
    }
  });

  // 6. Opciones de Períodos
  const opcionesPeriodos: DropdownOption[] = opcionesDisponibles.periodos.map(
    (per) => ({
      value: per,
      label: per,
    })
  );
  (filtros.periodosSeleccionados || []).forEach((per) => {
    if (!opcionesPeriodos.some((o) => o.value === per)) {
      opcionesPeriodos.unshift({ value: per, label: per });
    }
  });

  // 7. Opciones de Estilos (agrupadas por período)
  const opcionesEstilos: DropdownOption[] = opcionesDisponibles.estilos.map(
    (est) => ({
      value: est,
      label: est,
      group: obtenerPeriodoDeEstilo(est),
    })
  );
  (filtros.estilosSeleccionados || []).forEach((est) => {
    if (!opcionesEstilos.some((o) => o.value === est)) {
      opcionesEstilos.unshift({
        value: est,
        label: est,
        group: obtenerPeriodoDeEstilo(est),
      });
    }
  });

  return (
    <div className="bg-white border-b border-[#E5E5E5] px-3 sm:px-4 md:px-8 py-2.5 transition-all relative z-[1100]">
      {/* Controles en el orden estricto solicitado:
          1. Buscador
          2. País (checkbox)
          3. Arquitecto (desplegable)
          4. Programa Principal (checkbox)
          5. Programa Específico (checkbox)
          6. Década (checkbox)
          7. Período (checkbox)
          8. Estilo (checkbox)
      */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 1. BUSCADOR */}
        <div className="relative flex-1 min-w-[150px] max-w-xs">
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

        {/* 2. PAÍS (Modalidad Checkbox Desplegable) */}
        <CheckboxDropdownFilter
          id="filtro-checkbox-pais"
          label={t.country}
          selectedValues={filtros.paisesSeleccionados || []}
          options={opcionesPais}
          onChange={(paises) => onActualizarFiltros({ paisesSeleccionados: paises })}
          placeholderSearch="Buscar país..."
          menuWidthClass="w-56"
        />

        {/* 3. ARQUITECTO (Desplegable) */}
        <div className="w-36 sm:w-48 lg:w-56">
          <select
            id="filtro-select-arquitecto"
            value={filtros.arquitectoSeleccionado}
            onChange={(e) =>
              onActualizarFiltros({ arquitectoSeleccionado: e.target.value })
            }
            className={`w-full px-2.5 py-1.5 text-xs outline-none cursor-pointer transition-all border truncate ${
              filtros.arquitectoSeleccionado
                ? 'bg-black text-white border-black font-medium shadow-xs'
                : 'bg-[#F7F7F7] text-black border-neutral-200 hover:border-black focus:border-black focus:bg-white'
            }`}
          >
            <option value="" className="text-black bg-white">
              {t.allArchitects}
            </option>
            {listaArquitectos.map((arq) => (
              <option key={arq} value={arq} className="text-black bg-white">
                {arq}
              </option>
            ))}
          </select>
        </div>

        {/* 4. PROGRAMA PRINCIPAL (Modalidad Checkbox Desplegable) */}
        <CheckboxDropdownFilter
          id="filtro-checkbox-programa-principal"
          label={t.mainProgram}
          selectedValues={filtros.programasPrincipalesSeleccionados || []}
          options={opcionesProgPrincipal}
          onChange={(progs) =>
            onActualizarFiltros({ programasPrincipalesSeleccionados: progs })
          }
          placeholderSearch="Buscar programa principal..."
          menuWidthClass="w-64"
        />

        {/* 5. PROGRAMA ESPECÍFICO (Modalidad Checkbox Desplegable) */}
        <CheckboxDropdownFilter
          id="filtro-checkbox-programa-especifico"
          label={t.specificProgram}
          selectedValues={filtros.programasEspecificosSeleccionados || []}
          options={opcionesProgEspecifico}
          onChange={(esps) =>
            onActualizarFiltros({ programasEspecificosSeleccionados: esps })
          }
          placeholderSearch="Buscar programa específico..."
          menuWidthClass="w-72"
        />

        {/* 6. DÉCADA (Modalidad Checkbox Desplegable) */}
        <CheckboxDropdownFilter
          id="filtro-checkbox-decada"
          label={t.decade}
          selectedValues={filtros.decadasSeleccionadas || []}
          options={opcionesDecadas}
          onChange={(decs) =>
            onActualizarFiltros({ decadasSeleccionadas: decs })
          }
          placeholderSearch="Buscar década..."
          menuWidthClass="w-48"
        />

        {/* 7. PERÍODO (Modalidad Checkbox Desplegable) */}
        <CheckboxDropdownFilter
          id="filtro-checkbox-periodo"
          label={t.period}
          selectedValues={filtros.periodosSeleccionados || []}
          options={opcionesPeriodos}
          onChange={(pers) =>
            onActualizarFiltros({ periodosSeleccionados: pers })
          }
          placeholderSearch="Buscar período..."
          menuWidthClass="w-72"
          alignRight={true}
        />

        {/* 8. ESTILO (Modalidad Checkbox Desplegable) */}
        <CheckboxDropdownFilter
          id="filtro-checkbox-estilo"
          label={t.styles}
          selectedValues={filtros.estilosSeleccionados || []}
          options={opcionesEstilos}
          onChange={(ests) =>
            onActualizarFiltros({ estilosSeleccionados: ests })
          }
          placeholderSearch="Buscar estilo..."
          menuWidthClass="w-72"
          alignRight={true}
        />

        {/* Filtro Pritzker */}
        <button
          id="filtro-toggle-pritzker"
          onClick={() =>
            onActualizarFiltros({ soloPritzker: !filtros.soloPritzker })
          }
          className={`px-2.5 py-1.5 text-xs border font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            filtros.soloPritzker
              ? 'bg-black text-white border-black shadow-xs'
              : 'bg-[#F5F5F5] text-black border-transparent hover:border-black'
          }`}
          title={t.pritzkerPrize}
        >
          <Award className="w-3.5 h-3.5" />
          <span>{t.pritzkerPill}</span>
        </button>

        {/* Botón Restablecer / Limpiar Filtros */}
        <div className="ml-auto flex items-center gap-2">
          {hayFiltrosActivos && (
            <button
              id="btn-limpiar-filtros"
              onClick={onResetFiltros}
              className="text-xs text-neutral-600 hover:text-black flex items-center gap-1 underline underline-offset-4 cursor-pointer ml-1"
              title={t.reset}
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">{t.reset}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
