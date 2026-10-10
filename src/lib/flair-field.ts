/**
 * Explorateur « Le monde par le nez » : modèle pur (testable).
 * Le pré est un repère normalisé [0, 1] × [0, 1]. Chaque source émet une odeur ;
 * le vent l'étire en panache. La concentration est un modèle illustratif
 * (gaussiennes), pas une simulation physique : l'interface le précise.
 */
export interface Scent {
  id: string;
  label: string;
  x: number;
  y: number;
  strength: number;
  color: string;
  text: string;
}

export const SCENTS: Scent[] = [
  {
    id: 'arbre',
    label: 'Le pied d’un arbre',
    x: 0.22,
    y: 0.3,
    strength: 1,
    color: '#dff3ef',
    text: 'Les endroits fréquentés par d’autres chiens sont de véritables panneaux d’affichage. Votre chien y lit qui est passé : ce temps de lecture fait partie de la balade.',
  },
  {
    id: 'chat',
    label: 'Le passage d’un chat',
    x: 0.68,
    y: 0.22,
    strength: 0.85,
    color: '#5fcfc4',
    text: 'Une odeur d’animal peut capter toute son attention. C’est souvent à ce moment que le rappel devient difficile : ce n’est pas de la désobéissance, c’est une information très forte pour lui.',
  },
  {
    id: 'gouter',
    label: 'Une miette de goûter',
    x: 0.45,
    y: 0.62,
    strength: 0.6,
    color: '#c6e6c9',
    text: 'Une toute petite miette suffit à attirer son nez. Cacher quelques friandises dans l’herbe transforme une balade en jeu de recherche apaisant.',
  },
  {
    id: 'joggeur',
    label: 'La trace d’un joggeur',
    x: 0.84,
    y: 0.7,
    strength: 0.7,
    color: '#8fd6e0',
    text: 'Les odeurs humaines restent un moment sur le sol : votre chien peut percevoir qu’une personne est passée là avant vous.',
  },
  {
    id: 'herisson',
    label: 'Un hérisson cette nuit',
    x: 0.12,
    y: 0.78,
    strength: 0.75,
    color: '#b7ddd6',
    text: 'Le pré garde la trace de ce qui s’y est passé pendant la nuit. Pour votre chien, la balade du matin est un journal rempli de nouvelles.',
  },
  {
    id: 'chien',
    label: 'Un autre chien, il y a peu',
    x: 0.58,
    y: 0.86,
    strength: 0.9,
    color: '#7cc8b4',
    text: 'Croiser l’odeur d’un congénère peut enthousiasmer ou rendre vigilant certains chiens, avant même de le voir. Cela explique parfois un changement d’attitude soudain.',
  },
];

export interface Wind {
  /** Direction vers laquelle souffle le vent, en radians (0 = vers la droite). */
  angle: number;
  /** 0 (calme) à 1 (vent marqué). */
  strength: number;
}

/** Concentration illustrative d'une source en un point (0…≈1). */
export function scentAt(s: Scent, x: number, y: number, wind: Wind, aspect = 1): number {
  const dx = (x - s.x) * aspect;
  const dy = y - s.y;
  const near = Math.exp(-(dx * dx + dy * dy) / (2 * 0.035 * 0.035));
  if (wind.strength < 0.02) {
    return s.strength * Math.max(near, Math.exp(-(dx * dx + dy * dy) / (2 * 0.08 * 0.08)) * 0.75);
  }
  const ux = Math.cos(wind.angle);
  const uy = Math.sin(wind.angle);
  const along = dx * ux + dy * uy;
  const across = Math.abs(dx * uy - dy * ux);
  let plume = 0;
  if (along > 0) {
    const sigma = 0.02 + along * (0.35 - wind.strength * 0.2);
    const reach = 0.12 + wind.strength * 0.45;
    plume = Math.exp(-(across * across) / (2 * sigma * sigma)) * Math.exp(-along / reach) * (0.7 + wind.strength * 0.3);
  }
  return s.strength * Math.max(near, plume);
}

/** Odeur dominante perçue en un point. */
export function sniff(x: number, y: number, wind: Wind, aspect = 1): { scent: Scent; level: number } {
  let best = SCENTS[0]!;
  let level = 0;
  for (const s of SCENTS) {
    const c = scentAt(s, x, y, wind, aspect);
    if (c > level) {
      level = c;
      best = s;
    }
  }
  return { scent: best, level: Math.min(1, level) };
}

/** Distance (normalisée) à la source, pour décider qu'elle est « trouvée ». */
export function distanceTo(s: Scent, x: number, y: number, aspect = 1): number {
  return Math.hypot((x - s.x) * aspect, y - s.y);
}

export const FOUND_RADIUS = 0.06;

export function levelWord(level: number): string {
  if (level > 0.7) return 'forte';
  if (level > 0.35) return 'nette';
  if (level > 0.1) return 'légère';
  return 'à peine perceptible';
}
