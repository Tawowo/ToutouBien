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
  /** Temps de frame moyen (ms) au-delà duquel on rétrograde. */
  budgetMs: number;
}

export const PROFILES: Record<RenderTier, Profile> = {
  high: { particles: 16000, dprMax: 1.75, budgetMs: 1000 / 48 },
  medium: { particles: 9000, dprMax: 1.4, budgetMs: 1000 / 40 },
  low: { particles: 5000, dprMax: 1.15, budgetMs: 1000 / 28 },
};

export interface Capabilities {
  webgl2: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  cores: number;
  memoryGb: number | null;
  coarsePointer: boolean;
  width: number;
  /** Rendu WebGL logiciel (SwiftShader, llvmpipe…) : pas de carte graphique disponible. */
  software?: boolean;
}

export function pickTier(c: Capabilities): Tier {
  if (!c.webgl2 || c.reducedMotion || c.saveData) return 'fallback';
  // Petits écrans (téléphones) et rendu logiciel : palier léger ; la mesure des temps d'image
  // rétrogradera vers la version statique si l'appareil ne suit pas.
  if (c.width < 768 || c.software) return 'low';
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
  let software = false;
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    webgl2 = Boolean(gl);
    const info = gl?.getExtension('WEBGL_debug_renderer_info');
    const renderer = info && gl ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    software = /swiftshader|llvmpipe|softpipe|software/i.test(renderer);
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    // Pas de WebGL 2 : la version statique s'affiche.
  }
  return {
    webgl2,
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    saveData: nav.connection?.saveData === true || /(^|-)2g$/.test(nav.connection?.effectiveType ?? ''),
    cores: nav.hardwareConcurrency ?? 4,
    memoryGb: nav.deviceMemory ?? null,
    coarsePointer: matchMedia('(pointer: coarse)').matches,
    width: innerWidth,
    software,
  };
}
