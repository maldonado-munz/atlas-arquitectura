import { ProyectoArquitectura } from '../types';

export const KNOWN_ARCHITECTS_MAP: Record<string, string> = {
  // Ejemplos explícitos del requerimiento
  'Alejandro Aravena': 'Alejandro Aravena (ELEMENTAL)',
  'Smiljan Radic': 'Smiljan Radic (Smiljan Radic Arquitectos)',

  // Referentes nacionales e internacionales clave
  'Norman Foster': 'Norman Foster (Foster + Partners)',
  'Rem Koolhaas': 'Rem Koolhaas (OMA)',
  'Zaha Hadid': 'Zaha Hadid (Zaha Hadid Architects)',
  'Tadao Ando': 'Tadao Ando (Tadao Ando Architect & Associates)',
  'Oscar Niemeyer': 'Oscar Niemeyer (Oscar Niemeyer Arquitetura)',
  'Frank Gehry': 'Frank Gehry (Gehry Partners)',
  'Renzo Piano': 'Renzo Piano (Renzo Piano Building Workshop)',
  'Richard Rogers': 'Richard Rogers (Rogers Stirk Harbour + Partners)',
  'Jacques Herzog & Pierre de Meuron': 'Jacques Herzog & Pierre de Meuron (Herzog & de Meuron)',
  'Herzog & de Meuron': 'Jacques Herzog & Pierre de Meuron (Herzog & de Meuron)',
  'Kazuyo Sejima & Ryue Nishizawa': 'Kazuyo Sejima & Ryue Nishizawa (SANAA)',
  'SANAA': 'Kazuyo Sejima & Ryue Nishizawa (SANAA)',
  'Jean Nouvel': 'Jean Nouvel (Ateliers Jean Nouvel)',
  'Toyo Ito': 'Toyo Ito (Toyo Ito & Associates)',
  'Shigeru Ban': 'Shigeru Ban (Shigeru Ban Architects)',
  'Álvaro Siza': 'Álvaro Siza (Álvaro Siza Vieira)',
  'Peter Zumthor': 'Peter Zumthor (Atelier Peter Zumthor)',
  'Bjarke Ingels': 'Bjarke Ingels (BIG)',
  'Pezo von Ellrichshausen': 'Mauricio Pezo & Sofía von Ellrichshausen (Pezo von Ellrichshausen)',
  'Mathias Klotz': 'Mathias Klotz (Mathias Klotz Arquitecto)',
  'Edward Rojas': 'Edward Rojas (Edward Rojas Arquitectos)',
  'Sebastián Irarrázaval': 'Sebastián Irarrázaval (Sebastián Irarrázaval Arquitectos)',
  'Emilio Duhart': 'Emilio Duhart (Emilio Duhart Arquitectura)',
  'Cazú Zegers': 'Cazú Zegers (Cazú Zegers Arquitectura)',
  'Teodoro Fernández': 'Teodoro Fernández (Teodoro Fernández Arquitectos)',
  'Felipe Assadi': 'Felipe Assadi (Felipe Assadi Arquitectos)',
  'Cristián Undurraga': 'Cristián Undurraga (Undurraga Devés Arquitectos)',
  'Luis Izquierdo & Antonia Lehmann': 'Luis Izquierdo & Antonia Lehmann (Izquierdo Lehmann)',
  'Izquierdo Lehmann': 'Luis Izquierdo & Antonia Lehmann (Izquierdo Lehmann)',
  'Enrique Browne & Borja Huidobro': 'Enrique Browne & Borja Huidobro (Browne & Huidobro Arquitectos)',
  'Bresciani, Valdés, Castillo, Huidobro': 'Bresciani, Valdés, Castillo, Huidobro (BVCH)',
  'Bresciani, Valdés, Castillo, Huidobro (BVCH)': 'Bresciani, Valdés, Castillo, Huidobro (BVCH)',
  'Gabriel Guarda & Martín Correa': 'Gabriel Guarda & Martín Correa (Monasterio Benedictino)',
  'Gabriel Guarda O.S.B. & Martín Correa O.S.B.': 'Gabriel Guarda & Martín Correa (Monasterio Benedictino)',
  'Max Núñez': 'Max Núñez (Max Núñez Arquitectos)',
  'Guillermo Acuña': 'Guillermo Acuña (Guillermo Acuña Arquitectos)',
  'Cecilia Puga': 'Cecilia Puga (Cecilia Puga Arquitectos)',
  'Albert Tidy': 'Albert Tidy (Albert Tidy Arquitectos)',
  'Guillermo Jullian de la Fuente': 'Guillermo Jullian de la Fuente (Guillermo Jullian de la Fuente)',
  'Luciano Kulczewski': 'Luciano Kulczewski (Estudio Luciano Kulczewski)',
  'Joaquín Toesca': 'Joaquín Toesca (Joaquín Toesca)',
  'Alberto Cruz Montt': 'Alberto Cruz Montt (Cruz Montt & Larraín Bravo)',
  'Alberto Cruz': 'Alberto Cruz (Escuela de Valparaíso)',
  'Gonzalo Mardones': 'Gonzalo Mardones (Gonzalo Mardones Arquitectos)',
  'Juan Grimm': 'Juan Grimm (Estudio Juan Grimm)',
  'Teresa Moller': 'Teresa Moller (Teresa Moller Landscape)',
  'Fermín Vivaceta': 'Fermín Vivaceta (Fermín Vivaceta Arquitecto)',
  'François Brunet de Baines': 'François Brunet de Baines (Estudio Brunet de Baines)',
  'Lucien Hénault': 'Lucien Hénault (Lucien Hénault Arquitecto)',
  'Josué Smith Solar': 'Josué Smith Solar (Smith Solar & Smith Miller)',
  'Ricardo Larraín Bravo': 'Ricardo Larraín Bravo (Larraín Bravo Arquitectos)',
  'Carlos Martner': 'Carlos Martner (Carlos Martner Arquitecto)',
  'Borja Huidobro': 'Borja Huidobro (A&H Arquitectos)',
  'Christian de Groote': 'Christian de Groote (Christian de Groote Arquitectos)',
  'Juan Martínez Gutiérrez': 'Juan Martínez Gutiérrez (Juan Martínez Gutiérrez)',
  'Felipe Elton & Mauricio Léniz': 'Mauricio Léniz & Mirene Elton (Elton Léniz Arquitectos)',
  'Elton Léniz': 'Mauricio Léniz & Mirene Elton (Elton Léniz Arquitectos)',
  'Cristián Boza': 'Cristián Boza (Boza & Asociados)',
  'Alejandro Soffia': 'Alejandro Soffia (Alejandro Soffia Arquitectos)',
  'Guillermo Hevia': 'Guillermo Hevia (Guillermo Hevia Arquitectos)',
  'Martín Hurtado': 'Martín Hurtado (Martín Hurtado Arquitectos)',
  'Polidura Talhouk': 'Antonio Polidura & Marco Talhouk (Polidura Talhouk Arquitectos)',
  'dRN Arquitectos': 'Nicolás del Río & Max Núñez (dRN Arquitectos)',
  'LAND Arquitectos': 'Cristóbal Valenzuela & Ángela Delorenzo (LAND Arquitectos)',
  'A4 Arquitectos': 'Sebastián di Girolamo & Germán Zegers (A4 Arquitectos)',
  '+Arquitectos': 'Alex Brahm & David Bonomi (+Arquitectos)',
  'Hariri Pontarini Architects': 'Siamak Hariri (Hariri Pontarini Architects)',
  'Germán del Sol': 'Germán del Sol (Germán del Sol Arquitecto)',
  'Cristián Fernández Arquitectos': 'Cristián Fernández (Cristián Fernández Arquitectos)',
  'Lateral Arquitectura': 'Lateral (Lateral Arquitectura & Diseño)',
  'WMR Arquitectos': 'Felipe Wedeles, Jorge Manieu & Macarena Rabat (WMR Arquitectos)',
  'DRAA': 'Nicolas Rebolledo & Rodrigo Valenzuela (DRAA)',
  'Al Borde': 'David Barragán & Pascual Gangotena (Al Borde)',
  'Dorte Mandrup': 'Dorte Mandrup (Dorte Mandrup Arkitekter)',
  'Kengo Kuma': 'Kengo Kuma (Kengo Kuma & Associates)',
  'David Chipperfield': 'David Chipperfield (David Chipperfield Architects)',
  'Anne Lacaton & Jean-Philippe Vassal': 'Anne Lacaton & Jean-Philippe Vassal (Lacaton & Vassal)',
  'Lacaton & Vassal': 'Anne Lacaton & Jean-Philippe Vassal (Lacaton & Vassal)',
  'Yvonne Farrell & Shelley McNamara': 'Yvonne Farrell & Shelley McNamara (Grafton Architects)',
  'Grafton Architects': 'Yvonne Farrell & Shelley McNamara (Grafton Architects)',
  'Arata Isozaki': 'Arata Isozaki (Arata Isozaki & Associates)',
  'Balkrishna Doshi': 'Balkrishna Doshi (Vāstu Shilpā Consultants)',
  'RCR Arquitectes': 'Rafael Aranda, Carme Pigem & Ramón Vilalta (RCR Arquitectes)',
  'Frei Otto': 'Frei Otto (Atelier Warmbronn)',
  'Wang Shu & Lu Wenyu': 'Wang Shu & Lu Wenyu (Amateur Architecture Studio)',
  'Eduardo Souto de Moura': 'Eduardo Souto de Moura (Eduardo Souto de Moura Arquitectos)',
  'Paulo Mendes da Rocha': 'Paulo Mendes da Rocha (Paulo Mendes da Rocha)',
  'Glenn Murcutt': 'Glenn Murcutt (Glenn Murcutt Architect)',
  'Jørn Utzon': 'Jørn Utzon (Utzon Associates)',
  'Sverre Fehn': 'Sverre Fehn (Sverre Fehn Arkitekt)',
  'Christian de Portzamparc': 'Christian de Portzamparc (2Portzamparc)',
  'Fumihiko Maki': 'Fumihiko Maki (Maki and Associates)',
  'Robert Venturi & Denise Scott Brown': 'Robert Venturi & Denise Scott Brown (VSBA Architects)',
  'Aldo Rossi': 'Aldo Rossi (Studio di Architettura Aldo Rossi)',
  'Gordon Bunshaft': 'Gordon Bunshaft (Skidmore, Owings & Merrill - SOM)',
  'Kenzo Tange': 'Kenzo Tange (Kenzo Tange Associates)',
  'I. M. Pei': 'I. M. Pei (Pei Cobb Freed & Partners)',
  'Hans Hollein': 'Hans Hollein (Atelier Hans Hollein)',
  'Richard Meier': 'Richard Meier (Richard Meier & Partners)',
  'James Stirling': 'James Stirling (Stirling Wilford & Associates)',
  'Kevin Roche': 'Kevin Roche (Kevin Roche John Dinkeloo and Associates)',
  'Philip Johnson': 'Philip Johnson (Philip Johnson Architects)',
  'Luis Barragán': 'Luis Barragán (Luis Barragán Arquitecto)',
  'Le Corbusier': 'Le Corbusier (Atelier Le Corbusier)',
  'Mies van der Rohe': 'Ludwig Mies van der Rohe (Mies van der Rohe Studio)',
  'Frank Lloyd Wright': 'Frank Lloyd Wright (Taliesin Fellowship)',
  'Alvar Aalto': 'Alvar Aalto (Alvar Aalto & Associates)',
  'Louis Kahn': 'Louis Kahn (Louis I. Kahn Architect)',
  'Lúcio Costa': 'Lúcio Costa (Lúcio Costa Arquitetura)',
  'Affonso Eduardo Reidy': 'Affonso Eduardo Reidy (Atelier Reidy)',
  'Lina Bo Bardi': 'Lina Bo Bardi (Studio Lina Bo Bardi)',
  'Amancio Williams': 'Amancio Williams (Estudio Amancio Williams)',
  'Clorindo Testa': 'Clorindo Testa (Estudio Clorindo Testa)',
  'Eladio Dieste': 'Eladio Dieste (Dieste y Montañez)',
  'Rogelio Salmona': 'Rogelio Salmona (Rogelio Salmona Arquitecto)',
  'Carlos Raúl Villanueva': 'Carlos Raúl Villanueva (Villanueva Arquitectura)',
  'Teodoro González de León': 'Teodoro González de León (González de León Arquitectos)',
  'Abraham Zabludovsky': 'Abraham Zabludovsky (Zabludovsky Arquitectos)',
  'Ricardo Legorreta': 'Ricardo Legorreta (Legorreta + Legorreta)',
  'Enric Miralles & Carme Pinós': 'Enric Miralles & Carme Pinós (EMBT / Miralles Tagliabue)',
  'Carme Pinós': 'Carme Pinós (Estudio Carme Pinós)',
  'Rafael Moneo': 'Rafael Moneo (Estudio Rafael Moneo)',
  'Alberto Campo Baeza': 'Alberto Campo Baeza (Estudio Campo Baeza)',
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

  return {
    ...raw,
    arquitecto_filtro,
    autor_especifico_ficha,
    arquitecto_responsable,
    oficina,
    colaboradores: colaboradores || raw.colaboradores,
    instituciones: instituciones.length > 0 ? instituciones : undefined,
    institucion: instituciones[0],
  };
}
