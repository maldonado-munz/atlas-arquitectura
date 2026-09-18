/**
 * ===============================================================================
 * MÓDULO DE PROGRAMAS ARQUITECTÓNICOS (PRINCIPAL Y ESPECÍFICO)
 * ===============================================================================
 * Reglas de Clasificación:
 * 1. Sin números en los nombres de categorías o programas.
 * 2. Relación de Dependencia estricta: Cada Programa Específico se organiza bajo su
 *    correspondiente Programa Principal.
 * 3. Categorías bajo 'Recreación, Deporte y Paisaje' son independientes y no computan
 *    hacia 'Uso Mixto'.
 */

export const TAXONOMIA_PROGRAMAS = {
  'Residencial': [
    'Unifamiliar',
    'Multifamiliar',
    'Colectivo / Residencia',
    'Temporal / Vacacional',
    'Vivienda Social',
    'Vivienda de emergencia',
    'Incremental',
  ],
  'Salud': [
    'Hospitalario',
    'Centro médico / Ambulatorio',
    'Especialidades / Rehabilitación',
    'Asistencial / Adulto mayor',
  ],
  'Educación e Investigación': [
    'Preescolar / Escolar',
    'Universitario / Superior',
    'Centro de investigación / Laboratorio',
  ],
  'Comercial y Servicios': [
    'Retail / Tienda',
    'Centro comercial',
    'Gastronómico',
    'Financiero / Administrativo',
  ],
  'Oficinas y Trabajo': [
    'Corporativo',
    'Coworking / Flexible',
    'Gubernamental / Institucional',
  ],
  'Cultura y Patrimonio': [
    'Museo / Galería',
    'Centro cultural',
    'Teatro / Auditorio',
    'Biblioteca',
    'Pabellones',
  ],
  'Recreación, Deporte y Paisaje': [
    'Parque urbano',
    'Parque nacional / Reserva',
    'Deportivo / Complejo deportivo',
    'Plaza / Espacio público',
  ],
  'Hospitalidad y Turismo': [
    'Hotel / Resort',
    'Hostal / Albergue',
    'Efímero',
  ],
  'Industrial y Logística': [
    'Manufactura / Planta',
    'Centro logístico / Almacén',
    'Infraestructura energética / Técnica',
  ],
  'Transporte e Infraestructura': [
    'Terminal de pasajeros (terrestre, aéreo, marítimo)',
    'Estación de transbordo',
    'Aparcamiento / Parking',
  ],
  'Religioso y Funerario': [
    'Culto / Templo',
    'Cementerio / Crematorio',
  ],
  'Uso Mixto': [],
};

export const LISTA_PROGRAMAS_PRINCIPALES = Object.keys(TAXONOMIA_PROGRAMAS);

export const LISTA_PROGRAMAS_ESPECIFICOS = Array.from(
  new Set(Object.values(TAXONOMIA_PROGRAMAS).flat())
);

/**
 * Obtiene los programas específicos asociados a los programas principales seleccionados.
 * Si no hay ningún programa principal seleccionado, retorna todos los programas específicos.
 * @param {string[]} principalesSeleccionados
 * @returns {string[]}
 */
export function obtenerEspecificosParaPrincipales(principalesSeleccionados) {
  if (!principalesSeleccionados || principalesSeleccionados.length === 0) {
    return LISTA_PROGRAMAS_ESPECIFICOS;
  }
  const especificos = new Set();
  for (const principal of principalesSeleccionados) {
    const lista = TAXONOMIA_PROGRAMAS[principal] || [];
    for (const esp of lista) {
      especificos.add(esp);
    }
  }
  return Array.from(especificos);
}

/**
 * Encuentra el programa principal al que pertenece un programa específico.
 * @param {string} especificoBuscado
 * @returns {string | undefined}
 */
export function obtenerPrincipalDeEspecifico(especificoBuscado) {
  for (const [principal, especificos] of Object.entries(TAXONOMIA_PROGRAMAS)) {
    if (especificos.includes(especificoBuscado)) {
      return principal;
    }
  }
  return undefined;
}

export default {
  TAXONOMIA_PROGRAMAS,
  LISTA_PROGRAMAS_PRINCIPALES,
  LISTA_PROGRAMAS_ESPECIFICOS,
  obtenerEspecificosParaPrincipales,
  obtenerPrincipalDeEspecifico,
};
