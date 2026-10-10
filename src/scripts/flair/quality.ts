/**
 * Qualité adaptative des scènes WebGL.
 * Démarche inspirée du projet HYDR'EAUX SCAN (même commanditaire), réécrite pour ToutouBien :
 * un niveau initial déduit des capacités de l'appareil, puis affiné au runtime
 * d'après les temps de frame réels.
 */
export type Tier = 'high' | 'medium' | 'low' | 'fallback';
export type RenderTier = Exclude<Tier, 'fallback'>;

export interface Profile {
  particles: number;
  dprMax: number;
  pointer: boolean;
  /** Temps de frame moyen (ms) au-delà duquel on rétrograde. */
  budgetMs: number;
}

export const PROFILES: Record<RenderTier, Profile> = {
  high: { particles: 16000, dprMax: 1.75, pointer: true, budgetMs: 1000 / 48 },
  medium: { particles: 9000, dprMax: 1.4, pointer: true, budgetMs: 1000 / 40 },
  low: { particles: 5000, dprMax: 1.15, pointer: false, budgetMs: 1000 / 28 },
};

export interface Capabilities {
  webgl2: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  cores: number;
  memoryGb: number | null;
  coarsePointer: boolean;
  width: number;
}

export function pickTier(c: Capabilities): Tier {
  if (!c.webgl2 || c.reducedMotion || c.saveData) return 'fallback';
  if (c.coarsePointer && c.width < 768) return 'low';
  const memory = c.memoryGb ?? 8;
  if (c.cores <= 4 || memory <= 4 || c.width < 1100) return 'medium';
  return 'high';
}

export function lowerTier(t: RenderTier): Tier {
  return t === 'high' ? 'medium' : t === 'medium' ? 'low' : 'fallback';
}

/** Surcharge pour le débogage et les tests : ?quality=low|fallback… */
export function tierFromQuery(search: string): Tier | null {
  const v = new URLSearchParams(search).get('quality');
  return v === 'high' || v === 'medium' || v === 'low' || v === 'fallback' ? v : null;
}

interface NavigatorHints extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
}

export function readCapabilities(): Capabilities {
  const nav = navigator as NavigatorHints;
  let webgl2 = false;
  try {
    webgl2 = Boolean(document.createElement('canvas').getContext('webgl2'));
  } catch {
    webgl2 = false;
  }
  return {
    webgl2,
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    saveData: nav.connection?.saveData === true || /(^|-)2g$/.test(nav.connection?.effectiveType ?? ''),
    cores: nav.hardwareConcurrency ?? 4,
    memoryGb: nav.deviceMemory ?? null,
    coarsePointer: matchMedia('(pointer: coarse)').matches,
    width: innerWidth,
  };
}
