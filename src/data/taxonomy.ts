/**
 * Guía y Clasificación Oficial de Períodos, Estilos y Programas Arquitectónicos
 * Re-exporta de forma modular desde periodosYEstilos.js y programas.js
 */

export interface PeriodoConEstilos {
  periodo: string;
  estilos: string[];
}

export interface ProgramaConEspecificos {
  programaPrincipal: string;
  programasEspecificos: string[];
}

export {
  TAXONOMIA_PERIODOS_ESTILOS,
  LISTA_PERIODOS,
  LISTA_ESTILOS,
  obtenerEstilosParaPeriodos,
  obtenerPeriodoDeEstilo,
} from './periodosYEstilos.js';

export {
  TAXONOMIA_PROGRAMAS,
  LISTA_PROGRAMAS_PRINCIPALES,
  LISTA_PROGRAMAS_ESPECIFICOS,
  obtenerEspecificosParaPrincipales,
  obtenerPrincipalDeEspecifico,
} from './programas.js';
