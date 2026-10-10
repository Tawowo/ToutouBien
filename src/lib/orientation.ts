/**
 * Parcours « Où en êtes-vous avec votre chien ? ».
 *
 * Une aide pour s'orienter dans le site, jamais un diagnostic : le résultat
 * reformule les réponses avec prudence et propose des lectures et une suite.
 * Rien n'est enregistré ni envoyé ; les réponses vivent en mémoire dans la page.
 */

export type StageId = 'chiot-a-venir' | 'chiot-arrive' | 'adopte' | 'installe' | 'senior';
export type ConcernId = 'promenade' | 'rappel' | 'solitude' | 'visites' | 'congeneres' | 'inquietude' | 'mordille' | 'comprendre';
export type FeelingId = 'curieux' | 'perplexe' | 'fatigue' | 'inquiet';
export type WishId = 'lire' | 'preparer' | 'parler';

export interface Option<T extends string> {
  id: T;
  label: string;
  hint?: string;
}

export interface Question<T extends string> {
  key: keyof OrientationAnswers;
  title: string;
  help: string;
  multiple: boolean;
  options: Option<T>[];
}

export interface OrientationAnswers {
  stage?: StageId | undefined;
  concerns: ConcernId[];
  feeling?: FeelingId | undefined;
  wish?: WishId | undefined;
}

export const STAGES: Option<StageId>[] = [
  { id: 'chiot-a-venir', label: 'Un chiot va arriver', hint: 'Vous préparez sa venue.' },
  { id: 'chiot-arrive', label: 'Un chiot vient d’arriver', hint: 'Les premières semaines.' },
  { id: 'adopte', label: 'Un chien adulte vient d’arriver', hint: 'Adoption, nouveau foyer.' },
  { id: 'installe', label: 'Nous vivons ensemble depuis un moment', hint: 'Des habitudes sont installées.' },
  { id: 'senior', label: 'Mon chien prend de l’âge', hint: 'Son rythme change.' },
];

export const CONCERNS: Option<ConcernId>[] = [
  { id: 'promenade', label: 'Les balades en laisse' },
  { id: 'rappel', label: 'Le rappel, le lâcher' },
  { id: 'solitude', label: 'Les moments seul' },
  { id: 'visites', label: 'Les visites, l’excitation' },
  { id: 'congeneres', label: 'Les rencontres avec d’autres chiens' },
  { id: 'inquietude', label: 'Des peurs, de l’inquiétude' },
  { id: 'mordille', label: 'Il mordille, il attrape' },
  { id: 'comprendre', label: 'Rien de précis : mieux le comprendre' },
];

export const FEELINGS: Option<FeelingId>[] = [
  { id: 'curieux', label: 'Curieux·se', hint: 'J’ai envie d’en apprendre plus.' },
  { id: 'perplexe', label: 'Un peu perdu·e', hint: 'Je ne sais pas trop par où commencer.' },
  { id: 'fatigue', label: 'Fatigué·e', hint: 'Le quotidien me pèse un peu.' },
  { id: 'inquiet', label: 'Inquiet·e', hint: 'J’ai peur que quelqu’un soit blessé, ou mon chien semble mal.' },
];

export const WISHES: Option<WishId>[] = [
  { id: 'lire', label: 'Lire et comprendre à mon rythme' },
  { id: 'preparer', label: 'Préparer un éventuel rendez-vous' },
  { id: 'parler', label: 'En parler avec l’éducatrice' },
];

export const QUESTIONS = [
  { key: 'stage', title: 'Quelle est votre situation aujourd’hui ?', help: 'Une seule réponse.', multiple: false, options: STAGES },
  { key: 'concerns', title: 'Qu’est-ce qui occupe vos pensées en ce moment ?', help: 'Plusieurs réponses possibles.', multiple: true, options: CONCERNS },
  { key: 'feeling', title: 'Comment vous sentez-vous face à cela ?', help: 'Il n’y a pas de mauvaise réponse.', multiple: false, options: FEELINGS },
  { key: 'wish', title: 'De quoi auriez-vous envie maintenant ?', help: 'Une seule réponse.', multiple: false, options: WISHES },
] as const satisfies readonly Question<string>[];

export type AccompagnementSlug = 'chiot' | 'chien-adulte' | 'quotidien' | 'comprendre';
export type ExplorerId = 'flair' | 'distance' | 'signaux';

export interface OrientationResult {
  /** Reformulation prudente des réponses. */
  summary: string[];
  accompagnement: AccompagnementSlug;
  /** Slugs d'articles, par ordre de pertinence (à filtrer selon ce qui est publié). */
  articles: string[];
  explorer: ExplorerId;
  /** Sujet préselectionné dans le formulaire « Parlons de votre chien ». */
  topic: string;
  /** Message de prudence à afficher en premier (santé, sécurité). */
  care: boolean;
  next: WishId;
  /** Dossiers « Comprendre les situations » liés aux préoccupations choisies. */
  dossiers: string[];
}

const label = <T extends string>(list: Option<T>[], id: T | undefined) => list.find((o) => o.id === id)?.label;

const CONCERN_ARTICLES: Record<ConcernId, string[]> = {
  promenade: ['chien-qui-tire-en-laisse', 'les-besoins-du-chien'],
  rappel: ['le-rappel', 'les-besoins-du-chien'],
  solitude: ['apprendre-la-solitude'],
  visites: ['lire-les-signaux', 'les-besoins-du-chien'],
  congeneres: ['lire-les-signaux', 'fiche-observer-son-chien'],
  inquietude: ['lire-les-signaux', 'fiche-observer-son-chien'],
  mordille: ['chiot-qui-mordille'],
  comprendre: ['les-besoins-du-chien', 'lire-les-signaux'],
};

const CONCERN_TOPIC: Record<ConcernId, string> = {
  promenade: 'marche-en-laisse',
  rappel: 'rappel',
  solitude: 'solitude',
  visites: 'excitation',
  congeneres: 'congeneres',
  inquietude: 'inquietude',
  mordille: 'chiot',
  comprendre: 'comprendre',
};

const CONCERN_DOSSIER: Partial<Record<ConcernId, string>> = {
  promenade: 'laisse',
  rappel: 'rappel',
  solitude: 'solitude',
  visites: 'visites',
  congeneres: 'chiens',
  mordille: 'chiot',
};

/**
 * Repère pédagogique affiché après chaque réponse : une idée générale et prudente,
 * jamais une interprétation de la situation de la personne. Textes à relire par l'éducatrice.
 */
export const INSIGHTS: Record<StageId | ConcernId | FeelingId | WishId, string> = {
  'chiot-a-venir': 'Préparer avant l’arrivée apporte beaucoup de sérénité : un coin de repos, des règles communes à toute la famille, les premiers trajets.',
  'chiot-arrive': 'Les premières semaines sont faites de découvertes. Un chiot dort beaucoup : le repos compte autant que les apprentissages.',
  adopte: 'Un chien qui change de foyer a besoin de temps pour prendre ses repères. Rien ne presse.',
  installe: 'Des habitudes installées peuvent évoluer à tout âge, en douceur, quand on comprend ce qui les entretient.',
  senior: 'En vieillissant, un chien peut changer de rythme et de besoins. Un avis vétérinaire aide à faire la part des choses.',
  promenade: 'Notre pas est lent pour beaucoup de chiens, et flairer fait partie de leurs besoins : une laisse tendue a souvent plusieurs raisons.',
  rappel: 'Revenir, pour un chien, c’est choisir entre ce qu’il fait et ce qu’on lui propose. Le contexte compte beaucoup.',
  solitude: 'Rester seul s’apprend progressivement. Filmer quelques minutes d’absence aide à voir ce qui se passe vraiment.',
  visites: 'Sauter est souvent une façon de saluer. Nos réactions, même pour repousser, peuvent l’entretenir sans le vouloir.',
  congeneres: 'La distance à laquelle un chien commence à réagir est un repère précieux pour avancer.',
  inquietude: 'Une peur se respecte : on avance à une distance où le chien reste capable d’observer.',
  mordille: 'Un chiot explore le monde avec sa gueule. C’est normal, et cela s’accompagne.',
  comprendre: 'Observer sans juger est déjà une belle façon de mieux se comprendre.',
  curieux: 'La curiosité est un excellent point de départ.',
  perplexe: 'Ne pas savoir par où commencer est très fréquent : c’est justement l’objet de ce parcours.',
  fatigue: 'Votre fatigue compte aussi : les pistes doivent pouvoir tenir dans votre quotidien.',
  inquiet: 'Si votre chien semble souffrir, ou si la sécurité de quelqu’un est en jeu, parlez-en d’abord à votre vétérinaire.',
  lire: 'Les dossiers et le blog sont faits pour cela : à votre rythme, sans engagement.',
  preparer: 'Noter quelques observations à l’avance rend le premier échange plus riche.',
  parler: 'Un court récapitulatif de vos réponses vous sera proposé dans le formulaire, modifiable.',
};

/** Étape reprise depuis l'accueil (`?stage=`), si elle est valide. */
export const stageFromQuery = (value: string | null): StageId | undefined => STAGES.find((s) => s.id === value)?.id;

const CONCERN_EXPLORER: Record<ConcernId, ExplorerId> = {
  promenade: 'flair',
  rappel: 'flair',
  solitude: 'signaux',
  visites: 'signaux',
  congeneres: 'distance',
  inquietude: 'distance',
  mordille: 'signaux',
  comprendre: 'signaux',
};

export function isComplete(a: OrientationAnswers): boolean {
  return Boolean(a.stage && a.concerns.length && a.feeling && a.wish);
}

export function orient(a: OrientationAnswers): OrientationResult {
  const concerns = a.concerns.length ? a.concerns : (['comprendre'] as ConcernId[]);
  const main = concerns[0]!;
  const puppy = a.stage === 'chiot-a-venir' || a.stage === 'chiot-arrive';
  const specific = concerns.filter((c) => c !== 'comprendre');

  let accompagnement: AccompagnementSlug;
  if (puppy) accompagnement = 'chiot';
  else if (specific.some((c) => c === 'solitude' || c === 'visites' || c === 'inquietude')) accompagnement = 'quotidien';
  else if (a.stage === 'adopte' || specific.length) accompagnement = 'chien-adulte';
  else accompagnement = 'comprendre';

  const articles: string[] = [];
  const push = (slug: string) => {
    if (!articles.includes(slug)) articles.push(slug);
  };
  if (puppy) push('arrivee-chiot-premieres-semaines');
  concerns.forEach((c) => CONCERN_ARTICLES[c].forEach(push));
  if (a.wish === 'preparer' || a.wish === 'parler') push('preparer-un-accompagnement');
  push('fiche-observer-son-chien');

  const summary: string[] = [];
  const stage = label(STAGES, a.stage);
  if (stage) summary.push(`Vous indiquez : « ${stage} ».`);
  const picked = concerns.map((c) => label(CONCERNS, c)?.toLowerCase()).filter(Boolean);
  if (picked.length) summary.push(`Ce qui vous occupe : ${picked.join(', ')}.`);
  const feeling = label(FEELINGS, a.feeling);
  if (feeling) summary.push(`Vous vous sentez plutôt ${feeling.toLowerCase()}.`);

  return {
    summary,
    accompagnement,
    articles: articles.slice(0, 4),
    explorer: CONCERN_EXPLORER[main],
    topic: puppy && main === 'comprendre' ? 'chiot' : CONCERN_TOPIC[main],
    care: a.feeling === 'inquiet' || a.stage === 'senior',
    next: a.wish ?? 'lire',
    dossiers: [...new Set(concerns.map((c) => CONCERN_DOSSIER[c]).filter((d): d is string => Boolean(d)))].slice(0, 3),
  };
}

/** Texte court transmis au formulaire de contact (limité, sans donnée identifiante). */
export function noteFor(a: OrientationAnswers): string {
  const r = orient(a);
  return ['D’après le parcours d’orientation :', ...r.summary].join(' ').slice(0, 600);
}
