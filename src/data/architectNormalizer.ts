import { ProyectoArquitectura } from '../types';

export const KNOWN_ARCHITECTS_MAP: Record<string, string> = {
  // Ejemplos explícitos del requerimiento
  'Alejandro Aravena': 'Alejandro Aravena (ELEMENTAL)',

  // Referentes nacionales e internacionales clave
    'Philip Johnson': 'Philip Johnson (Johnson/Burgee Architects)',
    'Luis Barragán': 'Luis Barragán (Luis Barragán)',
    'James Stirling': 'James Stirling (James Stirling Michael Wilford and Associates)',
    'Kevin Roche': 'Kevin Roche (Kevin Roche John Dinkeloo and Associates)',
    'I. M. Pei': 'I. M. Pei (I. M. Pei & Partners)',
    'Richard Meier': 'Richard Meier (Richard Meier & Partners Architects)',
    'Hans Hollein': 'Hans Hollein (Atelier Hans Hollein)',
    'Gottfried Böhm': 'Gottfried Böhm (Gottfried Böhm)',
    'Kenzō Tange': 'Kenzō Tange (Kenzo Tange Associates)',
    'Gordon Bunshaft & Oscar Niemeyer': 'Gordon Bunshaft & Oscar Niemeyer (Skidmore, Owings & Merrill / Oscar Niemeyer)',
    'Frank Gehry': 'Frank Gehry (Gehry Partners)',
    'Aldo Rossi': 'Aldo Rossi (Studio di Architettura)',
    'Robert Venturi': 'Robert Venturi (Venturi, Scott Brown and Associates)',
    'Álvaro Siza Vieira': 'Álvaro Siza Vieira (Álvaro Siza 2 - Arquitecto)',
    'Fumihiko Maki': 'Fumihiko Maki (Maki and Associates)',
    'Christian de Portzamparc': 'Christian de Portzamparc (Atelier Christian de Portzamparc)',
    'Tadao Ando': 'Tadao Ando (Tadao Ando Architect & Associates)',
    'Rafael Moneo': 'Rafael Moneo (Rafael Moneo Arquitecto)',
    'Sverre Fehn': 'Sverre Fehn (Sverre Fehn)',
    'Renzo Piano': 'Renzo Piano (Renzo Piano Building Workshop)',
    'Norman Foster': 'Norman Foster (Foster + Partners)',
    'Rem Koolhaas': 'Rem Koolhaas (OMA)',
    'Jacques Herzog & Pierre de Meuron': 'Jacques Herzog & Pierre de Meuron (Herzog & de Meuron)',
    'Glenn Murcutt': 'Glenn Murcutt (Glenn Murcutt)',
    'Jørn Utzon': 'Jørn Utzon (Jørn Utzon)',
    'Zaha Hadid': 'Zaha Hadid (Zaha Hadid Architects)',
    'Thom Mayne': 'Thom Mayne (Morphosis)',
    'Paulo Mendes da Rocha': 'Paulo Mendes da Rocha (Paulo Mendes da Rocha)',
    'Richard Rogers': 'Richard Rogers (Rogers Stirk Harbour + Partners)',
    'Jean Nouvel': 'Jean Nouvel (Ateliers Jean Nouvel)',
    'Peter Zumthor': 'Peter Zumthor (Atelier Peter Zumthor)',
    'Kazuyo Sejima & Ryue Nishizawa': 'Kazuyo Sejima & Ryue Nishizawa (SANAA)',
    'Eduardo Souto de Moura': 'Eduardo Souto de Moura (Eduardo Souto de Moura)',
    'Wang Shu': 'Wang Shu (Amateur Architecture Studio)',
    'Toyo Ito': 'Toyo Ito (Toyo Ito & Associates)',
    'Shigeru Ban': 'Shigeru Ban (Shigeru Ban Architects)',
    'Frei Otto': 'Frei Otto (Atelier Frei Otto Warmbronn)',
    'Rafael Aranda, Carme Pigem, & Ramón Vilalta': 'Rafael Aranda, Carme Pigem, & Ramón Vilalta (RCR Arquitectes)',
    'Balkrishna Doshi': 'Balkrishna Doshi (Vastu Shilpa Consultants)',
    'Arata Isozaki': 'Arata Isozaki (Arata Isozaki & Associates)',
    'Yvonne Farrell & Shelley McNamara': 'Yvonne Farrell & Shelley McNamara (Grafton Architects)',
    'Anne Lacaton & Jean-Philippe Vassal': 'Anne Lacaton & Jean-Philippe Vassal (Lacaton & Vassal)',
    'Diébédo Francis Kéré': 'Diébédo Francis Kéré (Kéré Architecture)',
    'David Chipperfield': 'David Chipperfield (David Chipperfield Architects)',
    'Riken Yamamoto': 'Riken Yamamoto (Riken Yamamoto & Field Shop)',
    'Liu Jiakun': 'Liu Jiakun (Jiakun Architects)',
    'Smiljan Radić Clarke': 'Smiljan Radić Clarke (Smiljan Radić)'
};

// Prefijos o términos colectivos, institucionales o genéricos que NO son un arquitecto responsable individual
const EXCLUSIONES_COLECTIVAS_E_INSTITUCIONALES = [
  'arquitectos ',
  'arquitectura ',
  'constructores ',
  'canteros ',
  'carpinteros ',
  'artesanos ',
  'comunidad ',
  'misioneros ',
  'oficina técnica',
  'dirección de',
  'ministerio ',
  'caja de ',
  'ferrocarril',
  'instituto ',
  'fuerzas armadas',
  'armada de ',
  'ejército de ',
  'cuerpo militar',
  'conaf',
  'corvi',
  'mop',
  'bechtel',
  'amercanda',
  'anónimo',
  'anonimo',
  'varios autores',
  'autores varios',
  'chillán',
  'concepción',
  'equipo ',
  'docentes',
  'alumnos',
  'estudiantes',
];

/**
 * Resuelve el arquitecto responsable formateado estrictamente como:
 * `Nombre Arquitecto (Nombre Oficina)`
 * Excluyendo instituciones, colaboradores, colectivos y entradas anónimas.
 */
export function resolverArquitectoResponsable(p: {
  arquitecto?: string;
  arquitecto_principal?: string;
}): string | null {
  const raw = (p.arquitecto_principal || p.arquitecto || '').trim();
  if (!raw) return null;

  // 1. Verificar si coincide con el catálogo de mapeo curado
  for (const [key, val] of Object.entries(KNOWN_ARCHITECTS_MAP)) {
    if (
      raw === key ||
      raw.includes(key) ||
      (p.arquitecto && p.arquitecto.includes(key))
    ) {
      return val;
    }
  }

  const s = raw.toLowerCase();

  // 2. Descartar si es genérico, anónimo o empieza con año/paréntesis descriptivo
  if (
    s.startsWith('(') ||
    s === 'anónimo' ||
    s === 'anonimo' ||
    s === 'varios autores' ||
    s === 'oficina técnica'
  ) {
    return null;
  }

  // 3. Descartar instituciones o colectivos
  if (
    EXCLUSIONES_COLECTIVAS_E_INSTITUCIONALES.some(
      (pref) => s.startsWith(pref) || s.includes(pref)
    )
  ) {
    return null;
  }

  // 4. Si ya viene en formato "Nombre (Oficina)"
  const parenMatch = raw.match(/^([^(]+)\s*\(([^)]+)\)$/);
  if (parenMatch) {
    return parenMatch[1].trim() + ' (' + parenMatch[2].trim() + ')';
  }

  // 5. Si viene con barra divisoria "Oficina / Autor" o "Autor / Oficina"
  if (raw.includes('/')) {
    const parts = raw.split('/').map((x) => x.trim());
    if (parts.length === 2) {
      return parts[0] + ' (' + parts[1] + ')';
    }
  }

  // 6. Si termina con Arquitectos/Architects
  if (raw.endsWith('Arquitectos') || raw.endsWith('Architects')) {
    const base = raw.replace(/\s*(Arquitectos|Architects)\b/i, '').trim();
    return base + ' (' + raw + ')';
  }

  // 7. Nombre individual por defecto -> Nombre (Nombre Arquitectos)
  return raw + ' (' + raw + ' Arquitectos)';
}

/**
 * Extrae y normaliza las instituciones públicas, académicas, internacionales
 * y comunitarias asociadas al proyecto.
 */
export function resolverInstituciones(p: {
  nombre_proyecto?: string;
  arquitecto?: string;
  arquitecto_principal?: string;
  colaboradores?: string;
  descripcion?: string;
}): string[] {
  const insts = new Set<string>();
  const allText = [
    p.nombre_proyecto,
    p.arquitecto,
    p.arquitecto_principal,
    p.colaboradores,
    p.descripcion,
  ]
    .filter(Boolean)
    .join(' ');

  const rules: { regex: RegExp; label: string }[] = [
    {
      regex: /\b(MOP|Ministerio de Obras Públicas|Dirección de Arquitectura MOP|Dirección de Vialidad MOP|MOP Obras Portuarias)\b/i,
      label: 'Ministerio de Obras Públicas (MOP)',
    },
    {
      regex: /\b(CORVI|Corporación de la Vivienda)\b/i,
      label: 'Corporación de la Vivienda (CORVI)',
    },
    {
      regex: /\b(CONAF|Corporación Nacional Forestal)\b/i,
      label: 'Corporación Nacional Forestal (CONAF)',
    },
    {
      regex: /\b(INACH|Instituto Antártico Chileno)\b/i,
      label: 'Instituto Antártico Chileno (INACH)',
    },
    {
      regex: /\b(CEPAL|Comisión Económica para América Latina|Naciones Unidas|\bONU\b)\b/i,
      label: 'Naciones Unidas (CEPAL / ONU)',
    },
    {
      regex: /\b(UNESCO)\b/i,
      label: 'UNESCO (Patrimonio Mundial)',
    },
    {
      regex: /\b(Caja de Previsión de Empleados Particulares)\b/i,
      label: 'Caja de Previsión de Empleados Particulares',
    },
    {
      regex: /\b(FADEU UC|Pontificia Universidad Católica de Chile|\bUC\b|Universidad Católica)\b/i,
      label: 'Pontificia Universidad Católica de Chile (UC)',
    },
    {
      regex: /\b(Universidad de Chile)\b/i,
      label: 'Universidad de Chile',
    },
    {
      regex: /\b(Universidad de Concepción)\b/i,
      label: 'Universidad de Concepción',
    },
    {
      regex: /\b(PUCV|Pontificia Universidad Católica de Valparaíso|Escuela de Valparaíso)\b/i,
      label: 'Pontificia Universidad Católica de Valparaíso (PUCV)',
    },
    {
      regex: /\b(Municipalidad de Juan Fernández)\b/i,
      label: 'Municipalidad de Juan Fernández',
    },
    {
      regex: /\b(Municipalidad de Santiago)\b/i,
      label: 'Municipalidad de Santiago',
    },
    {
      regex: /\b(Municipalidad de Valparaíso)\b/i,
      label: 'Municipalidad de Valparaíso',
    },
    {
      regex: /\b(Municipalidad de Quillota)\b/i,
      label: 'Municipalidad de Quillota',
    },
    {
      regex: /\b(Municipalidad de Providencia)\b/i,
      label: 'Municipalidad de Providencia',
    },
    {
      regex: /\b(Ilustre Municipalidad|Municipalidad)\b/i,
      label: 'Municipalidad Local',
    },
    {
      regex: /\b(EFE|Empresa de los Ferrocarriles del Estado|Ferrocarriles del Estado)\b/i,
      label: 'Empresa de los Ferrocarriles del Estado (EFE)',
    },
    {
      regex: /\b(Banco del Estado|Banco de Chile)\b/i,
      label: 'Banco del Estado de Chile',
    },
    {
      regex: /\b(Cuerpo Militar del Trabajo|CMT|Ejército de Chile)\b/i,
      label: 'Cuerpo Militar del Trabajo (CMT) / Ejército',
    },
    {
      regex: /\b(Armada de Chile|SHOA|Servicio Hidrográfico)\b/i,
      label: 'Armada de Chile',
    },
    {
      regex: /\b(Corona Española|Real Audiencia|Ingenieros de la Corona)\b/i,
      label: 'Ingenieros Militares de la Corona Española',
    },
    {
      regex: /\b(Comunidad Rapa Nui|Consejo de Ancianos)\b/i,
      label: 'Comunidad Ancestral Rapa Nui',
    },
    {
      regex: /\b(Orden de San Benito|Benedictino|Monasterio Benedictino)\b/i,
      label: 'Orden de San Benito (O.S.B.)',
    },
    {
      regex: /\b(Compañía de Jesús|Jesuitas|Misioneros Jesuitas)\b/i,
      label: 'Compañía de Jesús (Misión Jesuita)',
    },
    {
      regex: /\b(Orden Franciscana|Franciscanos)\b/i,
      label: 'Orden Franciscana',
    },
    {
      regex: /\b(Orden de Predicadores|Dominicos)\b/i,
      label: 'Orden de Predicadores (Dominicos)',
    },
    {
      regex: /\b(Simpson Gumpertz & Heger)\b/i,
      label: 'Simpson Gumpertz & Heger (Ingeniería Estructural)',
    },
    {
      regex: /\b(Arup|Ove Arup)\b/i,
      label: 'Arup (Ove Arup & Partners)',
    },
    {
      regex: /\b(Serpentine Gallery|Serpentine Galleries)\b/i,
      label: 'Serpentine Galleries',
    },
    {
      regex: /\b(MoMA|Museum of Modern Art)\b/i,
      label: 'Museum of Modern Art (MoMA)',
    },
    {
      regex: /\b(Guggenheim)\b/i,
      label: 'Solomon R. Guggenheim Foundation',
    },
    {
      regex: /\b(Fundação Oscar Niemeyer)\b/i,
      label: 'Fundação Oscar Niemeyer',
    },
  ];

  for (const rule of rules) {
    if (rule.regex.test(allText)) {
      insts.add(rule.label);
    }
  }

  return Array.from(insts);
}

/**
 * Extrae y preserva los colaboradores técnicos, calculistas, artistas y co-autores.
 */
export function resolverColaboradores(p: {
  arquitecto?: string;
  colaboradores?: string;
}): string | undefined {
  if (p.colaboradores && p.colaboradores.trim()) {
    return p.colaboradores.trim();
  }

  const a = p.arquitecto || '';
  if (
    a.includes('con ') ||
    a.includes(' y ') ||
    a.includes('&') ||
    a.includes('+') ||
    a.includes('/')
  ) {
    return a;
  }

  return undefined;
}

/**
 * Normaliza un proyecto crudo asignándole campos de arquitecto responsable,
 * colaboradores limpios e instituciones detectadas.
 */
export function normalizarProyecto(raw: any): ProyectoArquitectura {
  const arquitecto_filtro =
    raw.arquitecto_filtro || resolverArquitectoResponsable(raw) || 'No aplica / Anónimo';
  const autor_especifico_ficha =
    raw.autor_especifico_ficha || raw.colaboradores || raw.arquitecto;
  const arquitecto_responsable = arquitecto_filtro;
  const instituciones = resolverInstituciones(raw);
  const colaboradores = resolverColaboradores(raw);

  // Extraer nombre de oficina si existe
  let oficina: string | undefined = undefined;
  if (arquitecto_filtro && arquitecto_filtro !== 'No aplica / Anónimo') {
    const match = arquitecto_filtro.match(/^([^(]+)\s*\(([^)]+)\)$/);
    if (match) {
      oficina = match[2].trim();
    }
  }

  // Normalizar estilos y períodos
  const rawEstilos = raw.estilos || raw.estilo || [];
  const estilos: string[] = Array.isArray(rawEstilos) ? rawEstilos : [rawEstilos];

  const rawPeriodos = raw.periodo || raw.periodos || [];
  const periodos: string[] = Array.isArray(rawPeriodos) ? rawPeriodos : [rawPeriodos];

  // Normalizar programas
  const rawPrincipal = raw.programa_principal || [];
  const programa_principal: string[] = Array.isArray(rawPrincipal) ? rawPrincipal : [rawPrincipal];

  const rawEspecifico = raw.programa_específico || raw.programa_especifico || [];
  const programa_especifico: string[] = Array.isArray(rawEspecifico) ? rawEspecifico : [rawEspecifico];

  const rawPrograma = raw.programas || raw.programa || [];
  const programaLegacy: string[] = Array.isArray(rawPrograma) ? rawPrograma : [rawPrograma];
  const programa: string[] = programaLegacy.length > 0 
    ? programaLegacy 
    : Array.from(new Set([...programa_principal, ...programa_especifico]));

  // Normalizar año pritzker
  let ano_pritzker: number | null = null;
  if (raw.ano_pritzker !== undefined && raw.ano_pritzker !== null && raw.ano_pritzker !== '') {
    const num = parseInt(String(raw.ano_pritzker), 10);
    if (!isNaN(num)) ano_pritzker = num;
  }

  return {
    ...raw,
    arquitecto_filtro,
    autor_especifico_ficha,
    arquitecto_responsable,
    oficina,
    colaboradores: colaboradores || raw.colaboradores,
    instituciones: instituciones.length > 0 ? instituciones : undefined,
    institucion: instituciones[0],
    estilos,
    estilo: estilos,
    periodos,
    periodo: periodos,
    programa_principal,
    programa_especifico,
    'programa_específico': programa_especifico,
    programa,
    programas: programa,
    ano_pritzker,
  };
}
