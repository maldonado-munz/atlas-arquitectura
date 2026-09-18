/**
 * Guía y Clasificación Oficial de Períodos, Estilos y Programas Arquitectónicos
 */

export interface PeriodoConEstilos {
  periodo: string;
  estilos: string[];
}

export interface ProgramaConEspecificos {
  programaPrincipal: string;
  programasEspecificos: string[];
}

// ===============================================================================
// 1. PERÍODOS Y ESTILOS ARQUITECTÓNICOS
// ===============================================================================

export const TAXONOMIA_PERIODOS_ESTILOS: Record<string, string[]> = {
  'Antigüedad y Era Clásica': [
    'Egipcio',
    'Griego',
    'Clásico',
    'Romano',
  ],
  'Periodo Medieval y Renacimiento': [
    'Bizantino',
    'Románico',
    'Gótico',
    'Renacimiento',
  ],
  'Barroco y Reacciones Clásicas': [
    'Barroco',
    'Rococó',
    'Neoclásico',
    'Historicismo',
  ],
  'Revolución Industrial y Modernismo Temprano': [
    'Arquitectura del Hierro',
    'Art Nouveau',
    'Art Déco',
    'Expresionismo',
  ],
  'Movimiento Moderno y Brutalismo': [
    'Racionalismo',
    'Funcionalismo',
    'Estilo Internacional',
    'Brutalismo',
    'Arquitectura Orgánica',
  ],
  'Contemporáneo y Alta Tecnología': [
    'Posmodernismo',
    'Deconstructivismo',
    'High-Tech',
    'Minimalismo',
    'Arquitectura Sustentable / Bioclimática',
    'Paramétrico',
  ],
  'Tradicional y Local': [
    'Vernáculo',
  ],
};

export const LISTA_PERIODOS: string[] = Object.keys(TAXONOMIA_PERIODOS_ESTILOS);

export const LISTA_ESTILOS: string[] = Array.from(
  new Set(Object.values(TAXONOMIA_PERIODOS_ESTILOS).flat())
);

/**
 * Obtiene los estilos asociados a un conjunto de períodos seleccionados.
 * Si no se selecciona ningún período, retorna todos los estilos canónicos.
 */
export function obtenerEstilosParaPeriodos(periodosSeleccionados: string[]): string[] {
  if (!periodosSeleccionados || periodosSeleccionados.length === 0) {
    return LISTA_ESTILOS;
  }
  const estilos = new Set<string>();
  for (const periodo of periodosSeleccionados) {
    const estilosDelPeriodo = TAXONOMIA_PERIODOS_ESTILOS[periodo] || [];
    for (const estilo of estilosDelPeriodo) {
      estilos.add(estilo);
    }
  }
  return Array.from(estilos);
}

/**
 * Encuentra el período al que pertenece un estilo específico.
 */
export function obtenerPeriodoDeEstilo(estiloBuscado: string): string | undefined {
  for (const [periodo, estilos] of Object.entries(TAXONOMIA_PERIODOS_ESTILOS)) {
    if (estilos.includes(estiloBuscado)) {
      return periodo;
    }
  }
  return undefined;
}

// ===============================================================================
// 2. PROGRAMAS ARQUITECTÓNICOS (PRINCIPAL Y ESPECÍFICO)
// ===============================================================================

export const TAXONOMIA_PROGRAMAS: Record<string, string[]> = {
  'Residencial': [
    'Unifamiliar',
    'Multifamiliar',
    'Colectivo / Residencia',
    'Temporal / Vacacional',
    'Vivienda Social',
    'Vivienda de emergencia',
    'Incremental',
  ],
  'Salud': [
    'Hospitalario',
    'Centro médico / Ambulatorio',
    'Especialidades / Rehabilitación',
    'Asistencial / Adulto mayor',
  ],
  'Educación e Investigación': [
    'Preescolar / Escolar',
    'Universitario / Superior',
    'Centro de investigación / Laboratorio',
  ],
  'Comercial y Servicios': [
    'Retail / Tienda',
    'Centro comercial',
    'Gastronómico',
    'Financiero / Administrativo',
  ],
  'Oficinas y Trabajo': [
    'Corporativo',
    'Coworking / Flexible',
    'Gubernamental / Institucional',
  ],
  'Cultura y Patrimonio': [
    'Museo / Galería',
    'Centro cultural',
    'Teatro / Auditorio',
    'Biblioteca',
    'Pabellones',
  ],
  'Recreación, Deporte y Paisaje': [
    'Parque urbano',
    'Parque nacional / Reserva',
    'Deportivo / Complejo deportivo',
    'Plaza / Espacio público',
  ],
  'Hospitalidad y Turismo': [
    'Hotel / Resort',
    'Hostal / Albergue',
    'Efímero',
  ],
  'Industrial y Logística': [
    'Manufactura / Planta',
    'Centro logístico / Almacén',
    'Infraestructura energética / Técnica',
  ],
  'Transporte e Infraestructura': [
    'Terminal de pasajeros (terrestre, aéreo, marítimo)',
    'Estación de transbordo',
    'Aparcamiento / Parking',
  ],
  'Religioso y Funerario': [
    'Culto / Templo',
    'Cementerio / Crematorio',
  ],
  'Uso Mixto': [],
};

export const LISTA_PROGRAMAS_PRINCIPALES: string[] = Object.keys(TAXONOMIA_PROGRAMAS);

export const LISTA_PROGRAMAS_ESPECIFICOS: string[] = Array.from(
  new Set(Object.values(TAXONOMIA_PROGRAMAS).flat())
);

/**
 * Obtiene los programas específicos asociados a los programas principales seleccionados.
 * Si no hay ningún programa principal seleccionado, retorna todos los programas específicos.
 */
export function obtenerEspecificosParaPrincipales(
  principalesSeleccionados: string[]
): string[] {
  if (!principalesSeleccionados || principalesSeleccionados.length === 0) {
    return LISTA_PROGRAMAS_ESPECIFICOS;
  }
  const especificos = new Set<string>();
  for (const principal of principalesSeleccionados) {
    const lista = TAXONOMIA_PROGRAMAS[principal] || [];
    for (const esp of lista) {
      especificos.add(esp);
    }
  }
  return Array.from(especificos);
}

/**
 * Encuentra el programa principal al que pertenece un programa específico.
 */
export function obtenerPrincipalDeEspecifico(
  especificoBuscado: string
): string | undefined {
  for (const [principal, especificos] of Object.entries(TAXONOMIA_PROGRAMAS)) {
    if (especificos.includes(especificoBuscado)) {
      return principal;
    }
  }
  return undefined;
}
