/**
 * Filter engine for Architectural Atlas
 * Implements bidirectional cascading/faceted filters and derived options
 */

import { ProyectoArquitectura, FiltrosState, OpcionesFiltrosDisponibles } from '../types';
import {
  TODOS_LOS_ESTILOS,
  TODOS_LOS_PROGRAMAS,
  TODOS_LOS_ARQUITECTOS,
  TODOS_LOS_PAISES,
  DECADAS_DISPONIBLES,
} from '../data/proyectos';
import {
  extractAvailableDecades,
  coincideDecada,
  getProjectDecades,
  getProjectYears,
  getDatabaseYearExtremes,
} from './decadeUtils';

export {
  extractAvailableDecades,
  coincideDecada,
  getProjectDecades,
  getProjectYears,
  getDatabaseYearExtremes,
};

export function coincideTextoLibre(
  p: ProyectoArquitectura,
  busqueda: string
): boolean {
  if (!busqueda || busqueda.trim() === '') return true;
  const query = busqueda.trim().toLowerCase();

  const searchableElements: (string | undefined | null)[] = [
    p.nombre_proyecto,
    p.arquitecto,
    p.arquitecto_principal,
    p.arquitecto_responsable,
    p.oficina,
    p.colaboradores,
    ...(p.instituciones || []),
    p.institucion,
    p.descripcion,
    p.direccion,
    p.ciudad,
    p.pais,
    p.ano_diseno,
    p.anos_construccion,
    p.ano_inauguracion,
    p.ano_pritzker ? `pritzker ${p.ano_pritzker}` : '',
    p.premio_nacional_arquitectura
      ? `premio nacional ${p.premio_nacional_arquitectura}`
      : '',
    ...(p.estilos || []),
    ...(p.programas || p.programa || []),
    ...(p.materiales_principales || []),
    p.fuente_url,
    p.fotografia_credito,
  ];

  return searchableElements.some((val) =>
    val ? String(val).toLowerCase().includes(query) : false
  );
}

export function coincideEstilos(
  p: ProyectoArquitectura,
  estilosSeleccionados: string[]
): boolean {
  if (!estilosSeleccionados || estilosSeleccionados.length === 0) return true;
  return estilosSeleccionados.some((estilo) => p.estilos.includes(estilo));
}

export function coincideProgramas(
  p: ProyectoArquitectura,
  programasSeleccionados: string[]
): boolean {
  if (!programasSeleccionados || programasSeleccionados.length === 0) return true;
  const progs = p.programas || p.programa || [];
  return programasSeleccionados.some((prog) => progs.includes(prog));
}

export function coincideArquitecto(
  p: ProyectoArquitectura,
  arqSel: string
): boolean {
  if (!arqSel || arqSel.trim() === '') return true;

  if (p.arquitecto_filtro && p.arquitecto_filtro === arqSel) {
    return true;
  }

  if (arqSel === 'No aplica / Anónimo') {
    return p.arquitecto_filtro === 'No aplica / Anónimo';
  }

  if (
    p.arquitecto_responsable === arqSel ||
    p.arquitecto_principal === arqSel ||
    p.arquitecto === arqSel
  ) {
    return true;
  }

  const match = arqSel.match(/^([^(]+)\s*\(([^)]+)\)$/);
  if (match) {
    const nom = match[1].trim().toLowerCase();
    const ofi = match[2].trim().toLowerCase();
    const arqRaw = (p.arquitecto || '').toLowerCase();
    const arqPrin = (p.arquitecto_principal || '').toLowerCase();
    const nomMatches = arqPrin.includes(nom) || arqRaw.includes(nom);
    const ofiMatches = ofi.length > 3 && arqRaw.includes(ofi);
    return nomMatches || ofiMatches;
  }

  return p.arquitecto.includes(arqSel);
}

export function coincidePais(
  p: ProyectoArquitectura,
  paisSeleccionado: string
): boolean {
  if (!paisSeleccionado || paisSeleccionado.trim() === '') return true;
  return p.pais === paisSeleccionado;
}

export function coincideSoloPritzker(
  p: ProyectoArquitectura,
  soloPritzker: boolean
): boolean {
  if (!soloPritzker) return true;
  return p.ano_pritzker !== null;
}

// coincideDecada is imported and re-exported from ./decadeUtils

/**
 * Checks if a project matches all active filters, optionally excluding one dimension.
 * Used to compute candidate subsets for cascading dropdown options.
 */
export function cumpleFiltros(
  p: ProyectoArquitectura,
  filtros: FiltrosState,
  excluirDimension?: 'programa' | 'estilo' | 'arquitecto' | 'pais' | 'decada'
): boolean {
  if (!coincideTextoLibre(p, filtros.busqueda)) return false;
  if (!coincideSoloPritzker(p, filtros.soloPritzker)) return false;

  if (excluirDimension !== 'programa' && !coincideProgramas(p, filtros.programasSeleccionados)) {
    return false;
  }

  if (excluirDimension !== 'estilo' && !coincideEstilos(p, filtros.estilosSeleccionados)) {
    return false;
  }

  if (excluirDimension !== 'arquitecto' && !coincideArquitecto(p, filtros.arquitectoSeleccionado)) {
    return false;
  }

  if (excluirDimension !== 'pais' && !coincidePais(p, filtros.paisSeleccionado)) {
    return false;
  }

  if (excluirDimension !== 'decada' && !coincideDecada(p, filtros.decadaSeleccionada)) {
    return false;
  }

  return true;
}

/**
 * Filters the projects list according to all active criteria.
 */
export function filtrarProyectos(
  proyectos: ProyectoArquitectura[],
  filtros: FiltrosState
): ProyectoArquitectura[] {
  return proyectos.filter((p) => cumpleFiltros(p, filtros));
}

/**
 * Calculates dynamically available options for each dropdown
 * based on the subset of projects matching all OTHER active filters.
 */
export function calcularOpcionesDisponibles(
  proyectos: ProyectoArquitectura[],
  filtros: FiltrosState
): OpcionesFiltrosDisponibles {
  // 1. Programas: candidatos que cumplen todos los filtros excepto programa
  const candidatosProgramas = proyectos.filter((p) =>
    cumpleFiltros(p, filtros, 'programa')
  );
  const progsEnCandidatos = new Set(
    candidatosProgramas.flatMap((p) => p.programas || p.programa || [])
  );
  const programasDisponibles = TODOS_LOS_PROGRAMAS.filter((prog) =>
    progsEnCandidatos.has(prog)
  );

  // 2. Estilos: candidatos que cumplen todos los filtros excepto estilo
  const candidatosEstilos = proyectos.filter((p) =>
    cumpleFiltros(p, filtros, 'estilo')
  );
  const estilosEnCandidatos = new Set(
    candidatosEstilos.flatMap((p) => p.estilos || [])
  );
  const estilosDisponibles = TODOS_LOS_ESTILOS.filter((estilo) =>
    estilosEnCandidatos.has(estilo)
  );

  // 3. Arquitectos: candidatos que cumplen todos los filtros excepto arquitecto
  const candidatosArquitectos = proyectos.filter((p) =>
    cumpleFiltros(p, filtros, 'arquitecto')
  );
  const arqsEnCandidatos = new Set<string>();
  for (const p of candidatosArquitectos) {
    const arqVal = p.arquitecto_filtro || p.arquitecto_responsable;
    if (arqVal) {
      arqsEnCandidatos.add(arqVal);
    }
  }
  const arquitectosDisponibles = TODOS_LOS_ARQUITECTOS.filter((arq) => {
    if (arqsEnCandidatos.has(arq)) return true;
    return candidatosArquitectos.some((p) => coincideArquitecto(p, arq));
  });

  // 4. Países: candidatos que cumplen todos los filtros excepto país
  const candidatosPais = proyectos.filter((p) =>
    cumpleFiltros(p, filtros, 'pais')
  );
  const paisesEnCandidatos = new Set(
    candidatosPais.map((p) => p.pais).filter(Boolean)
  );
  const paisesDisponibles = TODOS_LOS_PAISES.filter((pais) =>
    paisesEnCandidatos.has(pais)
  );

  // 5. Décadas: candidatos que cumplen todos los filtros excepto década
  const candidatosDecada = proyectos.filter((p) =>
    cumpleFiltros(p, filtros, 'decada')
  );
  const decadasDisponibles = extractAvailableDecades(candidatosDecada, true);

  return {
    programas: programasDisponibles,
    estilos: estilosDisponibles,
    arquitectos: arquitectosDisponibles,
    paises: paisesDisponibles,
    decadas: decadasDisponibles,
  };
}

/**
 * Updates filter state and automatically resets any other active dropdown
 * whose selected value is no longer valid in the new context.
 */
export function actualizarFiltrosConCascada(
  proyectos: ProyectoArquitectura[],
  filtrosActuales: FiltrosState,
  cambios: Partial<FiltrosState>
): FiltrosState {
  const proximo: FiltrosState = { ...filtrosActuales, ...cambios };

  // Identificar qué dimensión fue modificada por el usuario
  const clavesModificadas = Object.keys(cambios) as (keyof FiltrosState)[];

  // Si no hay filtros activos conflictivos, retornar temprano
  const totalConProximo = filtrarProyectos(proyectos, proximo).length;
  if (totalConProximo > 0) {
    return proximo;
  }

  // Si se produjo un estado inválido (0 resultados), evaluar y resetear
  // las opciones en otros menús desplegables que dejaron de ser compatibles.
  // El filtro que el usuario acaba de tocar tiene prioridad (intención primaria).

  // 1. Validar Arquitecto si no fue el modificado
  if (
    !clavesModificadas.includes('arquitectoSeleccionado') &&
    proximo.arquitectoSeleccionado !== ''
  ) {
    const hayCoincidencias = proyectos.some((p) =>
      cumpleFiltros(p, proximo)
    );
    if (!hayCoincidencias) {
      // Verificar si el arquitecto es incompatible con el nuevo cambio
      const compatibleConCambios = proyectos.some(
        (p) =>
          coincideArquitecto(p, proximo.arquitectoSeleccionado) &&
          clavesModificadas.every((k) => {
            if (k === 'paisSeleccionado') return coincidePais(p, proximo.paisSeleccionado);
            if (k === 'decadaSeleccionada') return coincideDecada(p, proximo.decadaSeleccionada);
            if (k === 'estilosSeleccionados') return coincideEstilos(p, proximo.estilosSeleccionados);
            if (k === 'programasSeleccionados') return coincideProgramas(p, proximo.programasSeleccionados);
            if (k === 'soloPritzker') return coincideSoloPritzker(p, proximo.soloPritzker);
            if (k === 'busqueda') return coincideTextoLibre(p, proximo.busqueda);
            return true;
          })
      );
      if (!compatibleConCambios) {
        proximo.arquitectoSeleccionado = '';
      }
    }
  }

  // 2. Validar País si no fue el modificado
  if (
    !clavesModificadas.includes('paisSeleccionado') &&
    proximo.paisSeleccionado !== ''
  ) {
    const hayCoincidencias = proyectos.some((p) =>
      cumpleFiltros(p, proximo)
    );
    if (!hayCoincidencias) {
      const compatibleConCambios = proyectos.some(
        (p) =>
          coincidePais(p, proximo.paisSeleccionado) &&
          clavesModificadas.every((k) => {
            if (k === 'arquitectoSeleccionado') return coincideArquitecto(p, proximo.arquitectoSeleccionado);
            if (k === 'decadaSeleccionada') return coincideDecada(p, proximo.decadaSeleccionada);
            if (k === 'estilosSeleccionados') return coincideEstilos(p, proximo.estilosSeleccionados);
            if (k === 'programasSeleccionados') return coincideProgramas(p, proximo.programasSeleccionados);
            if (k === 'soloPritzker') return coincideSoloPritzker(p, proximo.soloPritzker);
            if (k === 'busqueda') return coincideTextoLibre(p, proximo.busqueda);
            return true;
          })
      );
      if (!compatibleConCambios) {
        proximo.paisSeleccionado = '';
      }
    }
  }

  // 3. Validar Década si no fue la modificada
  if (
    !clavesModificadas.includes('decadaSeleccionada') &&
    proximo.decadaSeleccionada !== 'all'
  ) {
    const hayCoincidencias = proyectos.some((p) =>
      cumpleFiltros(p, proximo)
    );
    if (!hayCoincidencias) {
      const compatibleConCambios = proyectos.some(
        (p) =>
          coincideDecada(p, proximo.decadaSeleccionada) &&
          clavesModificadas.every((k) => {
            if (k === 'arquitectoSeleccionado') return coincideArquitecto(p, proximo.arquitectoSeleccionado);
            if (k === 'paisSeleccionado') return coincidePais(p, proximo.paisSeleccionado);
            if (k === 'estilosSeleccionados') return coincideEstilos(p, proximo.estilosSeleccionados);
            if (k === 'programasSeleccionados') return coincideProgramas(p, proximo.programasSeleccionados);
            if (k === 'soloPritzker') return coincideSoloPritzker(p, proximo.soloPritzker);
            if (k === 'busqueda') return coincideTextoLibre(p, proximo.busqueda);
            return true;
          })
      );
      if (!compatibleConCambios) {
        proximo.decadaSeleccionada = 'all';
      }
    }
  }

  // 4. Validar Estilos si no fueron los modificados
  if (
    !clavesModificadas.includes('estilosSeleccionados') &&
    proximo.estilosSeleccionados.length > 0
  ) {
    const estilosValidos = proximo.estilosSeleccionados.filter((estilo) =>
      proyectos.some(
        (p) =>
          p.estilos.includes(estilo) &&
          clavesModificadas.every((k) => {
            if (k === 'arquitectoSeleccionado') return coincideArquitecto(p, proximo.arquitectoSeleccionado);
            if (k === 'paisSeleccionado') return coincidePais(p, proximo.paisSeleccionado);
            if (k === 'decadaSeleccionada') return coincideDecada(p, proximo.decadaSeleccionada);
            if (k === 'programasSeleccionados') return coincideProgramas(p, proximo.programasSeleccionados);
            if (k === 'soloPritzker') return coincideSoloPritzker(p, proximo.soloPritzker);
            if (k === 'busqueda') return coincideTextoLibre(p, proximo.busqueda);
            return true;
          })
      )
    );
    proximo.estilosSeleccionados = estilosValidos;
  }

  // 5. Validar Programas si no fueron los modificados
  if (
    !clavesModificadas.includes('programasSeleccionados') &&
    proximo.programasSeleccionados.length > 0
  ) {
    const programasValidos = proximo.programasSeleccionados.filter((prog) =>
      proyectos.some(
        (p) =>
          (p.programas || p.programa || []).includes(prog) &&
          clavesModificadas.every((k) => {
            if (k === 'arquitectoSeleccionado') return coincideArquitecto(p, proximo.arquitectoSeleccionado);
            if (k === 'paisSeleccionado') return coincidePais(p, proximo.paisSeleccionado);
            if (k === 'decadaSeleccionada') return coincideDecada(p, proximo.decadaSeleccionada);
            if (k === 'estilosSeleccionados') return coincideEstilos(p, proximo.estilosSeleccionados);
            if (k === 'soloPritzker') return coincideSoloPritzker(p, proximo.soloPritzker);
            if (k === 'busqueda') return coincideTextoLibre(p, proximo.busqueda);
            return true;
          })
      )
    );
    proximo.programasSeleccionados = programasValidos;
  }

  // 6. Si tras la validación directa persistiera una incompatibilidad entre filtros secundarios
  // que arroje 0 resultados, relajar progresivamente los secundarios respetando la dimensión modificada
  if (filtrarProyectos(proyectos, proximo).length === 0) {
    if (!clavesModificadas.includes('programasSeleccionados')) {
      proximo.programasSeleccionados = [];
    }
    if (
      filtrarProyectos(proyectos, proximo).length === 0 &&
      !clavesModificadas.includes('estilosSeleccionados')
    ) {
      proximo.estilosSeleccionados = [];
    }
    if (
      filtrarProyectos(proyectos, proximo).length === 0 &&
      !clavesModificadas.includes('arquitectoSeleccionado')
    ) {
      proximo.arquitectoSeleccionado = '';
    }
    if (
      filtrarProyectos(proyectos, proximo).length === 0 &&
      !clavesModificadas.includes('decadaSeleccionada')
    ) {
      proximo.decadaSeleccionada = 'all';
    }
    if (
      filtrarProyectos(proyectos, proximo).length === 0 &&
      !clavesModificadas.includes('paisSeleccionado')
    ) {
      proximo.paisSeleccionado = '';
    }
  }

  return proximo;
}
