/**
 * Filter engine for Architectural Atlas
 * Implements multi-select faceted filters, cascading logic, and derived options
 */

import { ProyectoArquitectura, FiltrosState, OpcionesFiltrosDisponibles } from '../types';
import {
  TODOS_LOS_PERIODOS,
  TODOS_LOS_ESTILOS,
  TODOS_LOS_PROGRAMAS_PRINCIPALES,
  TODOS_LOS_PROGRAMAS_ESPECIFICOS,
  TODOS_LOS_ARQUITECTOS,
  TODOS_LOS_PAISES,
  DECADAS_DISPONIBLES,
  obtenerEstilosParaPeriodos,
  obtenerEspecificosParaPrincipales,
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
    p.region,
    p.pais,
    p.ano_diseno,
    p.anos_construccion,
    p.ano_inauguracion,
    p.ano_pritzker ? `pritzker ${p.ano_pritzker}` : '',
    p.premio_nacional_arquitectura
      ? `premio nacional ${p.premio_nacional_arquitectura}`
      : '',
    ...(p.estilos || p.estilo || []),
    ...(p.periodos || p.periodo || []),
    ...(p.programa_principal || []),
    ...(p.programa_especifico || p['programa_específico'] || []),
    ...(p.programas || p.programa || []),
    ...(p.materiales_principales || []),
    p.fuente_url,
    p.fotografia_credito,
  ];

  return searchableElements.some((val) =>
    val ? String(val).toLowerCase().includes(query) : false
  );
}

export function coincidePaises(
  p: ProyectoArquitectura,
  paisesSeleccionados: string[]
): boolean {
  if (!paisesSeleccionados || paisesSeleccionados.length === 0) return true;
  return paisesSeleccionados.includes(p.pais);
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

export function coincideProgramasPrincipales(
  p: ProyectoArquitectura,
  programasPrincipalesSeleccionados: string[]
): boolean {
  if (
    !programasPrincipalesSeleccionados ||
    programasPrincipalesSeleccionados.length === 0
  ) {
    return true;
  }

  const principalesProyecto = p.programa_principal || [];
  const programasLegacy = p.programas || p.programa || [];

  return programasPrincipalesSeleccionados.some((prog) => {
    if (principalesProyecto.includes(prog)) return true;
    if (programasLegacy.includes(prog)) return true;
    return false;
  });
}

export function coincideProgramasEspecificos(
  p: ProyectoArquitectura,
  programasEspecificosSeleccionados: string[]
): boolean {
  if (
    !programasEspecificosSeleccionados ||
    programasEspecificosSeleccionados.length === 0
  ) {
    return true;
  }

  const especificosProyecto =
    p.programa_especifico || p['programa_específico'] || [];
  const programasLegacy = p.programas || p.programa || [];

  return programasEspecificosSeleccionados.some((prog) => {
    if (especificosProyecto.includes(prog)) return true;
    if (programasLegacy.includes(prog)) return true;
    return false;
  });
}

export function coincideDecadas(
  p: ProyectoArquitectura,
  decadasSeleccionadas: string[]
): boolean {
  if (
    !decadasSeleccionadas ||
    decadasSeleccionadas.length === 0 ||
    decadasSeleccionadas.includes('all')
  ) {
    return true;
  }

  return decadasSeleccionadas.some((dec) => coincideDecada(p, dec));
}

export function coincidePeriodos(
  p: ProyectoArquitectura,
  periodosSeleccionados: string[]
): boolean {
  if (!periodosSeleccionados || periodosSeleccionados.length === 0) {
    return true;
  }

  const periodos = p.periodo || p.periodos || [];
  return periodosSeleccionados.some((periodo) => periodos.includes(periodo));
}

export function coincideEstilos(
  p: ProyectoArquitectura,
  estilosSeleccionados: string[]
): boolean {
  if (!estilosSeleccionados || estilosSeleccionados.length === 0) {
    return true;
  }

  const estilos = p.estilos || p.estilo || [];
  return estilosSeleccionados.some((estilo) => estilos.includes(estilo));
}

export function coincideSoloPritzker(
  p: ProyectoArquitectura,
  soloPritzker: boolean
): boolean {
  if (!soloPritzker) return true;
  return (
    p.ano_pritzker !== null &&
    p.ano_pritzker !== undefined &&
    p.ano_pritzker !== ''
  );
}

/**
 * Checks if a project matches all active filters, optionally excluding one dimension.
 */
export function cumpleFiltros(
  p: ProyectoArquitectura,
  filtros: FiltrosState,
  excluirDimension?:
    | 'pais'
    | 'arquitecto'
    | 'programa_principal'
    | 'programa_especifico'
    | 'decada'
    | 'periodo'
    | 'estilo'
): boolean {
  if (!coincideTextoLibre(p, filtros.busqueda)) return false;
  if (!coincideSoloPritzker(p, filtros.soloPritzker)) return false;

  const paises = filtros.paisesSeleccionados || (filtros.paisSeleccionado ? [filtros.paisSeleccionado] : []);
  if (excluirDimension !== 'pais' && !coincidePaises(p, paises)) {
    return false;
  }

  if (
    excluirDimension !== 'arquitecto' &&
    !coincideArquitecto(p, filtros.arquitectoSeleccionado)
  ) {
    return false;
  }

  if (
    excluirDimension !== 'programa_principal' &&
    !coincideProgramasPrincipales(p, filtros.programasPrincipalesSeleccionados)
  ) {
    return false;
  }

  if (
    excluirDimension !== 'programa_especifico' &&
    !coincideProgramasEspecificos(p, filtros.programasEspecificosSeleccionados)
  ) {
    return false;
  }

  const decadas = filtros.decadasSeleccionadas || (filtros.decadaSeleccionada && filtros.decadaSeleccionada !== 'all' ? [filtros.decadaSeleccionada] : []);
  if (
    excluirDimension !== 'decada' &&
    !coincideDecadas(p, decadas)
  ) {
    return false;
  }

  if (
    excluirDimension !== 'periodo' &&
    !coincidePeriodos(p, filtros.periodosSeleccionados)
  ) {
    return false;
  }

  if (
    excluirDimension !== 'estilo' &&
    !coincideEstilos(p, filtros.estilosSeleccionados)
  ) {
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
  // 1. Países
  const candidatosPais = proyectos.filter((p) =>
    cumpleFiltros(p, filtros, 'pais')
  );
  const paisesEnCandidatos = new Set(
    candidatosPais.map((p) => p.pais).filter(Boolean)
  );
  const paisesDisponibles = TODOS_LOS_PAISES.length > 0
    ? TODOS_LOS_PAISES.filter((pais) => paisesEnCandidatos.has(pais))
    : Array.from(paisesEnCandidatos).sort((a, b) => a.localeCompare(b, 'es'));

  // 2. Arquitectos
  const candidatosArquitectos = proyectos.filter((p) =>
    cumpleFiltros(p, filtros, 'arquitecto')
  );
  const arqsEnCandidatos = new Set<string>();
  for (const p of candidatosArquitectos) {
    const arqVal = p.arquitecto_filtro || p.arquitecto_responsable;
    if (arqVal) arqsEnCandidatos.add(arqVal);
  }
  const arquitectosDisponibles = TODOS_LOS_ARQUITECTOS.filter((arq) => {
    if (arqsEnCandidatos.has(arq)) return true;
    return candidatosArquitectos.some((p) => coincideArquitecto(p, arq));
  });

  // 3. Programas Principales
  const candidatosProgPrincipal = proyectos.filter((p) =>
    cumpleFiltros(p, filtros, 'programa_principal')
  );
  const progsPrincipalesEnCandidatos = new Set(
    candidatosProgPrincipal.flatMap((p) => p.programa_principal || [])
  );
  const programasPrincipalesDisponibles = TODOS_LOS_PROGRAMAS_PRINCIPALES.filter(
    (prog) => progsPrincipalesEnCandidatos.size === 0 || progsPrincipalesEnCandidatos.has(prog)
  );

  // 4. Programas Específicos: si hay programas principales seleccionados, restringir a ellos
  const candidatosProgEspecifico = proyectos.filter((p) =>
    cumpleFiltros(p, filtros, 'programa_especifico')
  );
  const progsEspecificosEnCandidatos = new Set(
    candidatosProgEspecifico.flatMap(
      (p) => p.programa_especifico || p['programa_específico'] || []
    )
  );
  const baseEspecificos = obtenerEspecificosParaPrincipales(
    filtros.programasPrincipalesSeleccionados
  );
  const programasEspecificosDisponibles = baseEspecificos.filter(
    (esp) => progsEspecificosEnCandidatos.size === 0 || progsEspecificosEnCandidatos.has(esp)
  );

  // 5. Décadas
  const candidatosDecada = proyectos.filter((p) =>
    cumpleFiltros(p, filtros, 'decada')
  );
  const decadasDisponibles = extractAvailableDecades(
    candidatosDecada.length > 0 ? candidatosDecada : proyectos,
    true
  );

  // 6. Períodos
  const candidatosPeriodo = proyectos.filter((p) =>
    cumpleFiltros(p, filtros, 'periodo')
  );
  const periodosEnCandidatos = new Set(
    candidatosPeriodo.flatMap((p) => p.periodo || p.periodos || [])
  );
  const periodosDisponibles = TODOS_LOS_PERIODOS.filter(
    (per) => periodosEnCandidatos.size === 0 || periodosEnCandidatos.has(per)
  );

  // 7. Estilos: si hay períodos seleccionados, restringir a los estilos de esos períodos
  const candidatosEstilo = proyectos.filter((p) =>
    cumpleFiltros(p, filtros, 'estilo')
  );
  const estilosEnCandidatos = new Set(
    candidatosEstilo.flatMap((p) => p.estilos || p.estilo || [])
  );
  const baseEstilos = obtenerEstilosParaPeriodos(filtros.periodosSeleccionados);
  const estilosDisponibles = baseEstilos.filter(
    (est) => estilosEnCandidatos.size === 0 || estilosEnCandidatos.has(est)
  );

  return {
    paises: paisesDisponibles,
    arquitectos: arquitectosDisponibles,
    programasPrincipales: programasPrincipalesDisponibles,
    programasEspecificos: programasEspecificosDisponibles,
    decadas: decadasDisponibles,
    periodos: periodosDisponibles,
    estilos: estilosDisponibles,
    programas: programasPrincipalesDisponibles,
  };
}
