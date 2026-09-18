export declare const TAXONOMIA_PERIODOS_ESTILOS: Record<string, string[]>;
export declare const LISTA_PERIODOS: string[];
export declare const LISTA_ESTILOS: string[];
export declare function obtenerEstilosParaPeriodos(periodosSeleccionados: string[]): string[];
export declare function obtenerPeriodoDeEstilo(estiloBuscado: string): string | undefined;

declare const _default: {
  TAXONOMIA_PERIODOS_ESTILOS: Record<string, string[]>;
  LISTA_PERIODOS: string[];
  LISTA_ESTILOS: string[];
  obtenerEstilosParaPeriodos: typeof obtenerEstilosParaPeriodos;
  obtenerPeriodoDeEstilo: typeof obtenerPeriodoDeEstilo;
};

export default _default;
