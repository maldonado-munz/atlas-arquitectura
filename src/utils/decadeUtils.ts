import { ProyectoArquitectura, OpcionDecada } from '../types';

/**
 * Mapping of Roman centuries to their starting Gregorian year.
 */
const ROMAN_CENTURIES: Record<string, number> = {
  XXI: 2000,
  XX: 1900,
  XIX: 1800,
  XVIII: 1700,
  XVII: 1600,
  XVI: 1500,
  XV: 1400,
  XIV: 1300,
  XIII: 1200,
  XII: 1100,
  XI: 1000,
};

/**
 * Extracts all relevant Gregorian years associated with an architectural project
 * by analyzing fields `ano_construccion`, `ano_inauguracion`, `anos_construccion`, and `ano_diseno`.
 * Correctly handles year ranges (e.g. "2018-2022", "1958-1960", "1872 / 2015").
 */
export function getProjectYears(p: ProyectoArquitectura): number[] {
  const years = new Set<number>();
  const rawTexts: string[] = [];

  for (const fld of [
    p.ano_construccion,
    p.ano_inauguracion,
    p.anos_construccion,
    p.ano_diseno,
  ]) {
    if (fld !== undefined && fld !== null) {
      let s = String(fld).trim();
      // Remove explicit B.C. references so they don't produce misleading Gregorian years
      s = s.replace(/\b\d+\s*a\.?\s*c\.?/gi, '');
      if (s.trim()) {
        rawTexts.push(s.trim());
      }
    }
  }

  for (const text of rawTexts) {
    // 1. Explicit ranges: "2018-2022", "1958 - 1960", "1872/1875", "1971–1977"
    const rangeRegex = /\b(\d{3,4})\s*[-–/]\s*(\d{3,4})\b/g;
    let rangeMatch: RegExpExecArray | null;
    while ((rangeMatch = rangeRegex.exec(text)) !== null) {
      const y1 = parseInt(rangeMatch[1], 10);
      const y2 = parseInt(rangeMatch[2], 10);
      if (y1 >= 1000 && y1 <= 2035 && y2 >= 1000 && y2 <= 2035 && y1 <= y2) {
        years.add(y1);
        years.add(y2);
        // For construction spans up to 30 years, associate all intermediate years
        if (y2 - y1 <= 30) {
          for (let yr = y1; yr <= y2; yr++) {
            years.add(yr);
          }
        }
      }
    }

    // 2. 4-digit years: 1000 to 2035
    const yearRegex = /\b(1\d{3}|20[0-3]\d)\b/g;
    let yearMatch: RegExpExecArray | null;
    while ((yearMatch = yearRegex.exec(text)) !== null) {
      const yr = parseInt(yearMatch[1], 10);
      if (yr >= 1000 && yr <= 2035) {
        years.add(yr);
      }
    }

    // 3. Centuries in text: e.g. "Siglos XVII-XIX", "Siglo XVIII", "Siglo XII"
    const centuryRegex = /siglos?\s+([IVXLCDM]+)(?:\s*[-–/]\s*([IVXLCDM]+))?/gi;
    let centuryMatch: RegExpExecArray | null;
    while ((centuryMatch = centuryRegex.exec(text)) !== null) {
      const c1 = centuryMatch[1].toUpperCase();
      if (ROMAN_CENTURIES[c1]) {
        years.add(ROMAN_CENTURIES[c1]);
      }
      if (centuryMatch[2]) {
        const c2 = centuryMatch[2].toUpperCase();
        if (ROMAN_CENTURIES[c2]) {
          years.add(ROMAN_CENTURIES[c2]);
        }
      }
    }
  }

  return Array.from(years).sort((a, b) => a - b);
}

/**
 * Returns the unique decade identifiers to which a project belongs.
 * - For works completed/built in 2020 or later, decade identifier is '2020' (label '2020+').
 * - For earlier works, decade identifier is standard 4-digit decade (e.g. '1930', '1920', '1900', '1850').
 * - Multi-year ranges (e.g. '2018-2022') associate the project with both decades ('2010' and '2020').
 */
export function getProjectDecades(p: ProyectoArquitectura): string[] {
  const years = getProjectYears(p);
  const decades = new Set<string>();

  for (const yr of years) {
    if (yr >= 2020) {
      decades.add('2020');
    } else {
      const dec = Math.floor(yr / 10) * 10;
      decades.add(dec.toString());
    }
  }

  if (decades.size === 0) {
    decades.add('1950');
  }

  return Array.from(decades).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
}

/**
 * Scans the database and detects the earliest and latest recorded years.
 */
export function getDatabaseYearExtremes(projects: ProyectoArquitectura[]): {
  minYear: number;
  maxYear: number;
} {
  let minYear = Infinity;
  let maxYear = -Infinity;

  for (const p of projects) {
    const years = getProjectYears(p);
    for (const yr of years) {
      if (yr < minYear) minYear = yr;
      if (yr > maxYear) maxYear = yr;
    }
  }

  return {
    minYear: minYear === Infinity ? 1900 : minYear,
    maxYear: maxYear === -Infinity ? 2026 : maxYear,
  };
}

/**
 * Generates the dynamic list of available decades from a given array of projects.
 * Only includes decades that have at least one project registered.
 * Orders them chronologically from oldest to newest, with 2020+ at the end.
 */
export function extractAvailableDecades(
  projects: ProyectoArquitectura[],
  includeAllOption = true
): OpcionDecada[] {
  const decadesFound = new Set<string>();

  for (const p of projects) {
    const decs = getProjectDecades(p);
    for (const d of decs) {
      decadesFound.add(d);
    }
  }

  const sortedDecades = Array.from(decadesFound).sort(
    (a, b) => parseInt(a, 10) - parseInt(b, 10)
  );

  const opciones: OpcionDecada[] = [];

  if (includeAllOption) {
    opciones.push({
      label: { es: 'Todas las décadas', en: 'All decades' },
      value: 'all',
    });
  }

  for (const d of sortedDecades) {
    const isRecent = d === '2020' || parseInt(d, 10) >= 2020;
    opciones.push({
      label: {
        es: isRecent ? '2020+' : `${d}s`,
        en: isRecent ? '2020+' : `${d}s`,
      },
      value: d,
    });
  }

  return opciones;
}

/**
 * Evaluates whether a project matches a selected decade filter.
 * When decadaSeleccionada is 'all' or empty, always returns true.
 * For range projects (e.g. 2018-2022), matches if decadaSeleccionada matches either start, end, or intermediate decade.
 */
export function coincideDecada(
  p: ProyectoArquitectura,
  decadaSeleccionada: string
): boolean {
  if (!decadaSeleccionada || decadaSeleccionada === 'all') return true;
  const projectDecades = getProjectDecades(p);
  return projectDecades.includes(decadaSeleccionada);
}
