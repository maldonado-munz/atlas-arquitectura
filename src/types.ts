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
  ano_pritzker?: number | null;
  fotografia_url?: string;
  direccion: string;
  coordenadas: Coordenadas;
  ano_diseno: string;
  anos_construccion: string;
  ano_inauguracion: string;
  estilos: string[];
  programa: string[];
  programas?: string[];
  // Campos complementarios de curaduría
  ciudad: string;
  region?: string;
  pais: string;
  descripcion: string;
  fuente_url?: string;
  materiales_principales?: string[];
  fotografia_credito?: string;
  premio_nacional_arquitectura?: number | null;
}

export interface FiltrosState {
  busqueda: string;
  estilosSeleccionados: string[];
  programasSeleccionados: string[];
  arquitectoSeleccionado: string;
  paisSeleccionado: string;
  decadaSeleccionada: string;
  soloPritzker: boolean;
}

export interface OpcionDecada {
  label: { es: string; en: string };
  value: string;
}

export interface OpcionesFiltrosDisponibles {
  programas: string[];
  estilos: string[];
  arquitectos: string[];
  paises: string[];
  decadas: OpcionDecada[];
}
