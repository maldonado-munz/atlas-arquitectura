import { PROYECTOS_DATA } from './proyectos_data';
import { ProyectoArquitectura } from '../types';
import { normalizarProyecto } from './architectNormalizer';
import { extractAvailableDecades } from '../utils/decadeUtils';

export const PROYECTOS_ARQUITECTURA: ProyectoArquitectura[] = PROYECTOS_DATA.map(
  normalizarProyecto
);

export const ORDEN_CANONICO_ESTILOS = [
  'Modernismo',
  'Brutalismo',
  'Minimalismo',
  'Contemporáneo',
  'Arquitectura Orgánica',
  'Vernácula / Local',
  'High-Tech',
  'Deconstructivismo',
  'Sostenible / Bioclimático',
  'Estructura Expuesta',
  'Posmodernismo',
  'Neoclásico',
  'Barroco',
  'Historicismo',
  'Art Déco',
  'Art Nouveau',
  'Arqueológico / Ancestral',
  'Industrial / Hierro y Cristal',
  'Paramétrico',
];

// Estilos presentes en el dataset ordenados según la taxonomía normalizada
const estilosEnDataset = new Set(PROYECTOS_ARQUITECTURA.flatMap((p) => p.estilos || []));
export const TODOS_LOS_ESTILOS = ORDEN_CANONICO_ESTILOS.filter((estilo) =>
  estilosEnDataset.has(estilo)
);

export const ORDEN_PROGRAMAS = [
  'Residencial',
  'Cultural',
  'Educación',
  'Institucional',
  'Comercial',
  'Infraestructura',
  'Marítimo',
  'Paisajismo',
  'Religioso',
  'Industrial',
  'Deportivo',
  'Salud',
  'Hotelería',
  'Social',
  'Transporte',
  'Científico',
  'Patrimonio',
  'Oficinas',
  'Innovación',
  'Pabellón',
  'Efímero',
  'Restauración',
];

const programasEnDataset = new Set(
  PROYECTOS_ARQUITECTURA.flatMap((p) => p.programas || p.programa || [])
);
export const TODOS_LOS_PROGRAMAS = ORDEN_PROGRAMAS.filter((prog) =>
  programasEnDataset.has(prog)
);

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
  new Set(PROYECTOS_ARQUITECTURA.map((p) => p.pais))
).sort((a, b) => a.localeCompare(b, 'es'));

export const DECADAS_DISPONIBLES = extractAvailableDecades(PROYECTOS_ARQUITECTURA);


