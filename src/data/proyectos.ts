import rawData from '../../proyectos_arquitectura.json';
import { ProyectoArquitectura } from '../types';
import { normalizarProyecto } from './architectNormalizer';
import { extractAvailableDecades } from '../utils/decadeUtils';
import {
  LISTA_PERIODOS,
  LISTA_ESTILOS,
  LISTA_PROGRAMAS_PRINCIPALES,
  LISTA_PROGRAMAS_ESPECIFICOS,
  TAXONOMIA_PERIODOS_ESTILOS,
  TAXONOMIA_PROGRAMAS,
  obtenerEstilosParaPeriodos,
  obtenerEspecificosParaPrincipales,
} from './taxonomy';

export {
  TAXONOMIA_PERIODOS_ESTILOS,
  TAXONOMIA_PROGRAMAS,
  obtenerEstilosParaPeriodos,
  obtenerEspecificosParaPrincipales,
};

export const PROYECTOS_ARQUITECTURA: ProyectoArquitectura[] = (
  rawData as ProyectoArquitectura[]
).map(normalizarProyecto);

export const TODOS_LOS_PERIODOS = LISTA_PERIODOS;
export const TODOS_LOS_ESTILOS = LISTA_ESTILOS;
export const TODOS_LOS_PROGRAMAS_PRINCIPALES = LISTA_PROGRAMAS_PRINCIPALES;
export const TODOS_LOS_PROGRAMAS_ESPECIFICOS = LISTA_PROGRAMAS_ESPECIFICOS;

// Legacy export for backwards compatibility
export const TODOS_LOS_PROGRAMAS = LISTA_PROGRAMAS_PRINCIPALES;

// Menú desplegable: arquitectos en formato "Nombre Arquitecto (Nombre Oficina)" o "No aplica / Anónimo"
export const TODOS_LOS_ARQUITECTOS = Array.from(
  new Set(
    PROYECTOS_ARQUITECTURA.map((p) => p.arquitecto_filtro || p.arquitecto_responsable).filter(
      (arq): arq is string => Boolean(arq && ((arq.includes('(') && arq.includes(')')) || arq === 'No aplica / Anónimo'))
    )
  )
).sort((a, b) => {
  if (a === 'No aplica / Anónimo') return 1;
  if (b === 'No aplica / Anónimo') return -1;
  return a.localeCompare(b, 'es');
});

export const TODOS_LOS_PAISES = Array.from(
  new Set(PROYECTOS_ARQUITECTURA.map((p) => p.pais).filter(Boolean))
).sort((a, b) => a.localeCompare(b, 'es'));

export const DECADAS_DISPONIBLES = extractAvailableDecades(PROYECTOS_ARQUITECTURA);



