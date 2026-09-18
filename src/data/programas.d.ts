export declare const TAXONOMIA_PROGRAMAS: Record<string, string[]>;
export declare const LISTA_PROGRAMAS_PRINCIPALES: string[];
export declare const LISTA_PROGRAMAS_ESPECIFICOS: string[];
export declare function obtenerEspecificosParaPrincipales(principalesSeleccionados: string[]): string[];
export declare function obtenerPrincipalDeEspecifico(especificoBuscado: string): string | undefined;

declare const _default: {
  TAXONOMIA_PROGRAMAS: Record<string, string[]>;
  LISTA_PROGRAMAS_PRINCIPALES: string[];
  LISTA_PROGRAMAS_ESPECIFICOS: string[];
  obtenerEspecificosParaPrincipales: typeof obtenerEspecificosParaPrincipales;
  obtenerPrincipalDeEspecifico: typeof obtenerPrincipalDeEspecifico;
};

export default _default;
