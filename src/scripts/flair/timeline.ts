/**
 * Minutage unique de la séquence d'accueil, partagé par les particules et les textes.
 * Chaque forme dispose d'un palier stable ; les transitions sont courtes et les textes
 * changent au milieu de chaque transition, jamais pendant un palier.
 *
 *   0.00 ─ 0.18  la rencontre (logo) · titre principal
 *   0.18 ─ 0.30  transition vers le sentier
 *   0.30 ─ 0.54  la balade · travelling avant le long du sentier
 *   0.54 ─ 0.68  transition vers le lien
 *   0.68 ─ 1.00  le lien (deux anneaux entrelacés)
 */
export const MARKS = { meetEnd: 0.18, trailStart: 0.3, trailEnd: 0.54, ringsStart: 0.68 } as const;

const smooth = (a: number, b: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export interface Timeline {
  /** 1 rencontre → 2 balade → 3 lien. */
  morph: number;
  /** Avancée du travelling sur le sentier (0…1). */
  dolly: number;
  /** Opacités des blocs de texte (0…1). */
  intro: number;
  walk: number;
  link: number;
  /** Chapitre lisible actuel : 0 rencontre, 1 balade, 2 lien. */
  chapter: 0 | 1 | 2;
}

export function timeline(p: number): Timeline {
  const { meetEnd, trailStart, trailEnd, ringsStart } = MARKS;
  const midA = (meetEnd + trailStart) / 2;
  const midB = (trailEnd + ringsStart) / 2;
  return {
    morph: 1 + smooth(meetEnd, trailStart, p) + smooth(trailEnd, ringsStart, p),
    dolly: smooth(trailStart, trailEnd, p),
    intro: 1 - smooth(meetEnd - 0.04, midA, p),
    walk: smooth(midA, trailStart + 0.02, p) * (1 - smooth(trailEnd, midB, p)),
    link: smooth(midB, ringsStart + 0.02, p),
    chapter: p < midA ? 0 : p < midB ? 1 : 2,
  };
}
