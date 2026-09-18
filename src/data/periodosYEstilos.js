/**
 * ===============================================================================
 * MÓDULO DE PERÍODOS Y ESTILOS ARQUITECTÓNICOS
 * ===============================================================================
 * Estructura jerárquica: Período Histórico / Conceptual -> Estilos Arquitectónicos
 */

export const TAXONOMIA_PERIODOS_ESTILOS = {
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

export const LISTA_PERIODOS = Object.keys(TAXONOMIA_PERIODOS_ESTILOS);

export const LISTA_ESTILOS = Array.from(
  new Set(Object.values(TAXONOMIA_PERIODOS_ESTILOS).flat())
);

/**
 * Obtiene los estilos asociados a un conjunto de períodos seleccionados.
 * Si no se selecciona ningún período, retorna todos los estilos canónicos.
 * @param {string[]} periodosSeleccionados
 * @returns {string[]}
 */
export function obtenerEstilosParaPeriodos(periodosSeleccionados) {
  if (!periodosSeleccionados || periodosSeleccionados.length === 0) {
    return LISTA_ESTILOS;
  }
  const estilos = new Set();
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
 * @param {string} estiloBuscado
 * @returns {string | undefined}
 */
export function obtenerPeriodoDeEstilo(estiloBuscado) {
  for (const [periodo, estilos] of Object.entries(TAXONOMIA_PERIODOS_ESTILOS)) {
    if (estilos.includes(estiloBuscado)) {
      return periodo;
    }
  }
  return undefined;
}

export default {
  TAXONOMIA_PERIODOS_ESTILOS,
  LISTA_PERIODOS,
  LISTA_ESTILOS,
  obtenerEstilosParaPeriodos,
  obtenerPeriodoDeEstilo,
};
