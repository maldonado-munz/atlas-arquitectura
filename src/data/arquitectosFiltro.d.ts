import { ProyectoArquitectura } from '../types';

export declare const MAPA_ARQUITECTOS_FILTRO: Record<string, string>;
export declare const KNOWN_ARCHITECTS_MAP: Record<string, string>;

export declare function resolverArquitectoResponsable(p: {
  arquitecto?: string;
  arquitecto_principal?: string;
}): string | null;

export declare function resolverInstituciones(p: {
  nombre_proyecto?: string;
  arquitecto?: string;
  arquitecto_principal?: string;
  colaboradores?: string;
  descripcion?: string;
}): string[];

export declare function resolverColaboradores(p: {
  arquitecto?: string;
  colaboradores?: string;
}): string | undefined;

export declare function normalizarProyecto(raw: any): ProyectoArquitectura;

declare const _default: {
  MAPA_ARQUITECTOS_FILTRO: Record<string, string>;
  KNOWN_ARCHITECTS_MAP: Record<string, string>;
  resolverArquitectoResponsable: typeof resolverArquitectoResponsable;
  resolverInstituciones: typeof resolverInstituciones;
  resolverColaboradores: typeof resolverColaboradores;
  normalizarProyecto: typeof normalizarProyecto;
};

export default _default;
