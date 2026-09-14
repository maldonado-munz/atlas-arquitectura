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
  colaboradores?: string;
  ano_pritzker: number | null;
  fotografia_url: string;
  direccion: string;
  coordenadas: Coordenadas;
  ano_diseno: string;
  anos_construccion: string;
  ano_inauguracion: string;
  estilos: string[];
  programa: string[];
  // Campos complementarios de curaduría
  ciudad: string;
  pais: string;
  descripcion: string;
  fuente_url?: string;
  materiales_principales?: string[];
  fotografia_credito?: string;
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
