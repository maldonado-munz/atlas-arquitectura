export type Idioma = 'es' | 'en';

export interface Coordenadas {
  lat: number;
  lng: number;
}

export interface ProyectoArquitectura {
  id: string;
  nombre_proyecto: string;
  arquitecto: string;
  arquitecto_principal?: string;
  arquitecto_responsable?: string;
  arquitecto_filtro?: string;
  autor_especifico_ficha?: string;
  ano_construccion?: number | string;
  oficina?: string;
  colaboradores?: string;
  instituciones?: string[];
  institucion?: string;
  ano_pritzker?: number | string | null;
  fotografia_url?: string;
  direccion: string;
  coordenadas: Coordenadas;
  ano_diseno: string;
  anos_construccion: string;
  ano_inauguracion: string;
  // Períodos y Estilos (compatibilidad singular/plural)
  periodo?: string[];
  periodos?: string[];
  estilo?: string[];
  estilos: string[];
  // Programas arquitectónicos
  programa_principal?: string[];
  programa_especifico?: string[];
  'programa_específico'?: string[];
  programa?: string[];
  programas?: string[];
  // Campos complementarios de curaduría
  ciudad: string;
  region?: string;
  pais: string;
  descripcion: string;
  fuente_url?: string;
  materiales_principales?: string[];
  fotografia_credito?: string;
  fotografia_autor_url?: string;
  fotografia_licencia?: string;
  fotografia_licencia_url?: string;
  fotografia_fuente?: string;
  premio_nacional_arquitectura?: number | null;
}

export interface FiltrosState {
  busqueda: string;
  paisesSeleccionados: string[];
  arquitectoSeleccionado: string;
  programasPrincipalesSeleccionados: string[];
  programasEspecificosSeleccionados: string[];
  decadasSeleccionadas: string[];
  periodosSeleccionados: string[];
  estilosSeleccionados: string[];
  soloPritzker: boolean;
  // Campos legacy para retrocompatibilidad
  paisSeleccionado?: string;
  decadaSeleccionada?: string;
  programasSeleccionados?: string[];
}

export interface OpcionDecada {
  label: { es: string; en: string };
  value: string;
}

export interface OpcionesFiltrosDisponibles {
  paises: string[];
  arquitectos: string[];
  programasPrincipales: string[];
  programasEspecificos: string[];
  decadas: OpcionDecada[];
  periodos: string[];
  estilos: string[];
  // Legacy
  programas?: string[];
}
