import rawData from '../../proyectos_arquitectura.json';
import { ProyectoArquitectura } from '../types';

export const PROYECTOS_ARQUITECTURA: ProyectoArquitectura[] = rawData as ProyectoArquitectura[];

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

// Arquitectos más relevantes al principio (arquitecto_principal)
export const TODOS_LOS_ARQUITECTOS = Array.from(
  new Set(
    PROYECTOS_ARQUITECTURA.map(
      (p) => p.arquitecto_principal || p.arquitecto
    ).filter(Boolean)
  )
).sort((a, b) => a.localeCompare(b, 'es'));

export const TODOS_LOS_PAISES = Array.from(
  new Set(PROYECTOS_ARQUITECTURA.map((p) => p.pais))
).sort((a, b) => a.localeCompare(b, 'es'));

export const DECADAS_DISPONIBLES = [
  { label: { es: 'Todas las décadas', en: 'All decades' }, value: 'all' },
  { label: { es: '1930s', en: '1930s' }, value: '1930' },
  { label: { es: '1940s', en: '1940s' }, value: '1940' },
  { label: { es: '1950s', en: '1950s' }, value: '1950' },
  { label: { es: '1960s', en: '1960s' }, value: '1960' },
  { label: { es: '1970s', en: '1970s' }, value: '1970' },
  { label: { es: '1980s', en: '1980s' }, value: '1980' },
  { label: { es: '1990s', en: '1990s' }, value: '1990' },
  { label: { es: '2000s', en: '2000s' }, value: '2000' },
  { label: { es: '2010s+', en: '2010s+' }, value: '2010' },
];


