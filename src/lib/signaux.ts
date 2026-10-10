/**
 * Explorateur « Lire les signaux » : logique pure.
 * On combine des indices corporels et un contexte pour proposer une LECTURE POSSIBLE,
 * jamais un diagnostic. Les poids sont pédagogiques (illustration), pas scientifiques :
 * l'interface le dit explicitement.
 */
export type Axis = 'detente' | 'attention' | 'inconfort' | 'excitation';

export interface PartOption {
  value: string;
  label: string;
  /** Indice décrit dans la lecture. */
  cue?: string;
  weights: Partial<Record<Axis, number>>;
}

export interface Part {
  key: 'ears' | 'tail' | 'wag' | 'body' | 'head' | 'mouth' | 'gaze';
  label: string;
  options: PartOption[];
}

export const PARTS: Part[] = [
  {
    key: 'body',
    label: 'Posture',
    options: [
      { value: 'soft', label: 'Souple', weights: { detente: 2 } },
      { value: 'frozen', label: 'Figée', cue: 'un corps qui se fige', weights: { attention: 2, inconfort: 1 } },
      { value: 'lowered', label: 'Baissée', cue: 'un corps qui se fait plus petit', weights: { inconfort: 3 } },
      { value: 'bow', label: 'Avant baissé', cue: 'l’avant du corps abaissé, arrière levé', weights: { excitation: 3 } },
    ],
  },
  {
    key: 'ears',
    label: 'Oreilles',
    options: [
      { value: 'relaxed', label: 'Détendues', weights: { detente: 1 } },
      { value: 'forward', label: 'Vers l’avant', cue: 'des oreilles portées vers l’avant', weights: { attention: 2, excitation: 1 } },
      { value: 'back', label: 'En arrière', cue: 'des oreilles plaquées en arrière', weights: { inconfort: 2 } },
    ],
  },
  {
    key: 'tail',
    label: 'Queue',
    options: [
      { value: 'neutral', label: 'Naturelle', weights: { detente: 1 } },
      { value: 'high', label: 'Haute', cue: 'une queue portée haut', weights: { attention: 1, excitation: 1 } },
      { value: 'low', label: 'Basse', cue: 'une queue basse', weights: { inconfort: 1 } },
      { value: 'tucked', label: 'Entre les pattes', cue: 'une queue rentrée', weights: { inconfort: 3 } },
    ],
  },
  {
    key: 'wag',
    label: 'Mouvement de queue',
    options: [
      { value: 'none', label: 'Immobile', weights: {} },
      { value: 'loose', label: 'Ample et souple', cue: 'un battement ample et souple', weights: { detente: 1, excitation: 1 } },
      { value: 'stiff', label: 'Rapide et raide', cue: 'un battement court et raide', weights: { attention: 2, inconfort: 1 } },
    ],
  },
  {
    key: 'head',
    label: 'Tête',
    options: [
      { value: 'neutral', label: 'Naturelle', weights: { detente: 1 } },
      { value: 'turned', label: 'Détournée', cue: 'une tête qui se détourne', weights: { inconfort: 2 } },
      { value: 'low', label: 'Basse', cue: 'une tête basse', weights: { inconfort: 1 } },
      { value: 'up', label: 'Relevée', cue: 'une tête relevée', weights: { attention: 1 } },
    ],
  },
  {
    key: 'mouth',
    label: 'Gueule',
    options: [
      { value: 'relaxed', label: 'Entrouverte, détendue', weights: { detente: 2 } },
      { value: 'closed', label: 'Fermée, crispée', cue: 'une gueule fermée et crispée', weights: { attention: 1, inconfort: 1 } },
      { value: 'lick', label: 'Léchage de truffe', cue: 'un léchage de truffe', weights: { inconfort: 2 } },
      { value: 'yawn', label: 'Bâillement', cue: 'un bâillement', weights: { inconfort: 1 } },
    ],
  },
  {
    key: 'gaze',
    label: 'Regard',
    options: [
      { value: 'soft', label: 'Doux', weights: { detente: 1 } },
      { value: 'fixed', label: 'Fixe', cue: 'un regard fixe', weights: { attention: 3 } },
      { value: 'away', label: 'Détourné', cue: 'un regard qui évite', weights: { inconfort: 2 } },
    ],
  },
];

export type PostureState = Record<Part['key'], string>;

export const CONTEXTS = [
  { value: 'calme', label: 'Au calme, à la maison' },
  { value: 'inconnu', label: 'Un inconnu s’approche' },
  { value: 'congenere', label: 'Un autre chien en face' },
  { value: 'jeu', label: 'Pendant un jeu' },
  { value: 'bruit', label: 'Un bruit soudain' },
] as const;
export type ContextValue = (typeof CONTEXTS)[number]['value'];

export const SCENARIOS: { id: string; label: string; context: ContextValue; state: PostureState }[] = [
  { id: 'repos', label: 'Détendu sur son coussin', context: 'calme', state: { body: 'soft', ears: 'relaxed', tail: 'neutral', wag: 'none', head: 'neutral', mouth: 'relaxed', gaze: 'soft' } },
  { id: 'main', label: 'Une main inconnue approche', context: 'inconnu', state: { body: 'lowered', ears: 'back', tail: 'low', wag: 'none', head: 'turned', mouth: 'lick', gaze: 'away' } },
  { id: 'jeu', label: 'Invitation au jeu', context: 'jeu', state: { body: 'bow', ears: 'forward', tail: 'high', wag: 'loose', head: 'neutral', mouth: 'relaxed', gaze: 'soft' } },
  { id: 'face', label: 'Un chien arrive en face', context: 'congenere', state: { body: 'frozen', ears: 'forward', tail: 'high', wag: 'stiff', head: 'up', mouth: 'closed', gaze: 'fixed' } },
  { id: 'orage', label: 'Un orage éclate', context: 'bruit', state: { body: 'lowered', ears: 'back', tail: 'tucked', wag: 'none', head: 'low', mouth: 'closed', gaze: 'away' } },
];

export const DEFAULT_STATE: PostureState = SCENARIOS[0]!.state;

export interface Reading {
  dominant: Axis;
  /** Répartition normalisée (somme = 1) pour la jauge. */
  share: Record<Axis, number>;
  title: string;
  summary: string;
  cues: string[];
  advice: string;
  caution: string;
}

const AXIS_TEXT: Record<Axis, { title: string; summary: string; advice: string }> = {
  detente: {
    title: 'Plutôt détendu',
    summary: 'L’ensemble évoque un chien à l’aise dans la situation.',
    advice: 'Profitez-en : c’est un bon moment pour un contact calme, s’il le recherche.',
  },
  attention: {
    title: 'Très attentif',
    summary: 'Le chien semble concentré sur quelque chose. Cette attention peut évoluer dans un sens ou dans l’autre.',
    advice: 'Observez ce qui capte son attention et, si besoin, prenez un peu de distance avant que la tension ne monte.',
  },
  inconfort: {
    title: 'Possiblement mal à l’aise',
    summary: 'Plusieurs indices peuvent traduire un inconfort ou une inquiétude.',
    advice: 'Laissez-lui de l’espace et la possibilité de s’éloigner. Évitez de le contraindre ou de le gronder pour ces signaux.',
  },
  excitation: {
    title: 'Plutôt excité, joueur',
    summary: 'Les indices évoquent un chien très mobilisé, souvent dans un registre de jeu.',
    advice: 'Le jeu est bénéfique tant qu’il reste équilibré : des pauses régulières aident à garder la mesure.',
  },
};

const CONTEXT_NOTE: Partial<Record<ContextValue, Partial<Record<string, string>>>> = {
  calme: { yawn: 'Au calme, un bâillement peut tout simplement traduire la fatigue.' },
  inconnu: { lick: 'Face à une personne inconnue, un léchage de truffe peut être un signe de gêne.' },
  jeu: { bow: 'Dans le jeu, l’avant du corps abaissé est souvent une invitation.' },
  congenere: { fixed: 'Face à un autre chien, un regard fixe mérite d’être surveillé : la distance aide.' },
  bruit: { tucked: 'Après un bruit soudain, une queue rentrée peut traduire la peur.' },
};

export function readPosture(state: PostureState, context: ContextValue): Reading {
  const score: Record<Axis, number> = { detente: 0, attention: 0, inconfort: 0, excitation: 0 };
  const cues: string[] = [];
  for (const part of PARTS) {
    const opt = part.options.find((o) => o.value === state[part.key]);
    if (!opt) continue;
    let w = { ...opt.weights };
    // Le contexte nuance certains indices.
    if (context === 'calme' && opt.value === 'yawn') w = { detente: 1 };
    if (context === 'jeu' && part.key === 'body' && opt.value === 'frozen') w = { attention: 1, excitation: 1 };
    for (const [axis, v] of Object.entries(w) as [Axis, number][]) score[axis] += v;
    if (opt.cue) cues.push(opt.cue);
  }
  const total = Object.values(score).reduce((a, b) => a + b, 0) || 1;
  const share = Object.fromEntries(Object.entries(score).map(([k, v]) => [k, v / total])) as Record<Axis, number>;
  const order: Axis[] = ['inconfort', 'attention', 'excitation', 'detente']; // en cas d'égalité, prudence d'abord
  const dominant = order.reduce((best, axis) => (score[axis] > score[best] ? axis : best), order[0]!);
  const notes = Object.values(state)
    .map((v) => CONTEXT_NOTE[context]?.[v])
    .filter((n): n is string => Boolean(n));
  const text = AXIS_TEXT[dominant];
  return {
    dominant,
    share,
    title: text.title,
    summary: [text.summary, ...notes].join(' '),
    cues,
    advice: text.advice,
    caution: 'Lecture indicative : un signal se lit toujours avec l’ensemble du corps, la situation et ce que vous connaissez de votre chien.',
  };
}

export function cuesSentence(cues: string[]): string {
  if (!cues.length) return 'Aucun indice particulier : un corps souple et un visage détendu.';
  if (cues.length === 1) return `Indice observé : ${cues[0]}.`;
  return `Indices observés : ${cues.slice(0, -1).join(', ')} et ${cues[cues.length - 1]}.`;
}
