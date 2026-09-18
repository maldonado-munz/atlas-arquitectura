import proyectosJson from './proyectos.json';

/**
 * Módulo de Proyectos Arquitectónicos Registrados
 * Contiene el registro oficial de obras con esquema completo:
 * - id
 * - nombre_proyecto
 * - arquitecto_principal
 * - arquitecto
 * - ano_pritzker
 * - ano_diseno, anos_construccion, ano_inauguracion
 * - pais, region, ciudad, direccion, coordenadas
 * - periodo, estilo
 * - programa_principal, programa_específico
 * - materiales_principales, descripcion
 * - fotografia_url, fotografia_credito, fotografia_licencia
 * - arquitecto_filtro
 */

export const proyectosData = proyectosJson;

export default proyectosData;
