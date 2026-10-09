/**
 * Modèle du parcours « Parlons de votre chien ».
 *
 * Objectif : faciliter un premier contact, jamais diagnostiquer.
 * Les reformulations reprennent uniquement ce que la personne a déclaré,
 * avec des tournures prudentes (« vous indiquez que… »).
 */

export interface Choice {
  value: string;
  label: string;
  /** Fragment utilisé dans la reformulation. */
  phrase?: string;
}

export const AGE_CHOICES: Choice[] = [
  { value: 'chiot', label: 'Chiot (moins de 6 mois)', phrase: 'un chiot de moins de 6 mois' },
  { value: 'jeune', label: 'Jeune (6 mois à 2 ans)', phrase: 'un jeune chien (6 mois à 2 ans)' },
  { value: 'adulte', label: 'Adulte', phrase: 'un chien adulte' },
  { value: 'senior', label: 'Senior', phrase: 'un chien senior' },
  { value: 'inconnu', label: 'Je ne sais pas', phrase: '' },
];

/**
 * Sujets proposés. Ce sont des situations décrites par les propriétaires,
 * pas des prestations : la liste est à relire avec l'éducatrice (docs/CONTENT-VALIDATION.md).
 * `dog: true` → la phrase a « votre chien » pour sujet.
 */
export interface Topic extends Choice {
  phrase: string;
  dog: boolean;
  /** Accroche courte utilisée sur l'accueil. */
  teaser: string;
}

export const TOPICS: Topic[] = [
  { value: 'marche-en-laisse', label: 'Il tire en laisse', teaser: 'Les balades ressemblent à un bras de fer.', phrase: 'tire en laisse', dog: true },
  { value: 'rappel', label: 'Il ne revient pas toujours quand je l’appelle', teaser: 'Le lâcher devient une source d’inquiétude.', phrase: 'ne revient pas toujours quand vous l’appelez', dog: true },
  { value: 'chiot', label: 'Un chiot arrive (ou vient d’arriver)', teaser: 'On aimerait bien faire, dès le début.', phrase: 'Un chiot arrive ou vient d’arriver chez vous.', dog: false },
  { value: 'congeneres', label: 'Il réagit fortement en croisant d’autres chiens', teaser: 'Chaque rencontre se prépare à l’avance.', phrase: 'réagit fortement lorsqu’il croise d’autres chiens', dog: true },
  { value: 'solitude', label: 'Il vit mal les moments seul', teaser: 'Partir de la maison devient compliqué.', phrase: 'vit difficilement les moments où il reste seul', dog: true },
  { value: 'excitation', label: 'Il saute sur les gens ou s’excite vite', teaser: 'Les visites tournent vite à l’agitation.', phrase: 'saute sur les gens ou s’excite rapidement', dog: true },
  { value: 'inquietude', label: 'Il semble inquiet dans certaines situations', teaser: 'Certains bruits ou lieux le mettent mal à l’aise.', phrase: 'semble inquiet dans certaines situations', dog: true },
  { value: 'famille', label: 'La vie de famille avec lui est parfois compliquée', teaser: 'Trouver un rythme qui convient à tout le monde.', phrase: 'La vie de famille avec votre chien vous semble parfois compliquée.', dog: false },
  { value: 'comprendre', label: 'J’aimerais simplement mieux le comprendre', teaser: 'Sans problème particulier, juste l’envie de bien faire.', phrase: 'Vous aimeriez avant tout mieux comprendre votre chien.', dog: false },
  { value: 'autre', label: 'Autre chose', teaser: '', phrase: 'Vous souhaitez aborder un autre sujet.', dog: false },
];

export const CONTEXT_CHOICES: Choice[] = [
  { value: 'promenade', label: 'En promenade', phrase: 'en promenade' },
  { value: 'maison', label: 'À la maison', phrase: 'à la maison' },
  { value: 'visites', label: 'Quand quelqu’un arrive', phrase: 'lorsque quelqu’un arrive' },
  { value: 'absence', label: 'Quand je m’absente', phrase: 'lorsque vous vous absentez' },
  { value: 'chiens', label: 'Avec d’autres chiens', phrase: 'en présence d’autres chiens' },
  { value: 'enfants', label: 'Avec les enfants', phrase: 'avec les enfants' },
  { value: 'voiture', label: 'En voiture', phrase: 'en voiture' },
  { value: 'autre', label: 'Ailleurs', phrase: 'dans d’autres circonstances' },
];

export const SINCE_CHOICES: Choice[] = [
  { value: 'recent', label: 'Depuis quelques semaines', phrase: 'depuis quelques semaines' },
  { value: 'mois', label: 'Depuis quelques mois', phrase: 'depuis quelques mois' },
  { value: 'longtemps', label: 'Depuis longtemps', phrase: 'depuis longtemps' },
  { value: 'arrivee', label: 'Depuis son arrivée', phrase: 'depuis son arrivée' },
  { value: 'inconnu', label: 'Je ne sais pas', phrase: '' },
];

export const SAFETY_CHOICES: Choice[] = [
  { value: 'non', label: 'Non' },
  { value: 'oui', label: 'Oui' },
  { value: 'oral', label: 'Je préfère en parler de vive voix' },
];

export const MEETING_CHOICES: Choice[] = [
  { value: 'domicile', label: 'Chez moi', phrase: 'chez vous' },
  { value: 'exterieur', label: 'En extérieur', phrase: 'en extérieur' },
  { value: 'indifferent', label: 'Pas de préférence', phrase: '' },
];

export const CONTACT_METHOD_CHOICES: Choice[] = [
  { value: 'telephone', label: 'Par téléphone' },
  { value: 'email', label: 'Par e-mail' },
];

export const BEST_TIME_CHOICES: Choice[] = [
  { value: 'matin', label: 'Le matin' },
  { value: 'midi', label: 'En début d’après-midi' },
  { value: 'soir', label: 'En fin de journée' },
  { value: 'indifferent', label: 'Peu importe' },
];

export const LIMITS = {
  dogName: 40,
  area: 80,
  message: 1200,
  firstName: 60,
  email: 120,
  phone: 25,
} as const;

export interface WizardAnswers {
  dogName?: string;
  age?: string;
  topics: string[];
  contexts: string[];
  since?: string;
  safety?: string;
  area?: string;
  meeting?: string;
  message?: string;
  firstName?: string;
  contactMethod?: string;
  email?: string;
  phone?: string;
  bestTime?: string;
  consent?: boolean;
}

export const STEPS = ['chien', 'situation', 'contexte', 'lieu', 'contact', 'resume'] as const;
export type StepId = (typeof STEPS)[number];

export const STEP_TITLES: Record<StepId, string> = {
  chien: 'Votre chien',
  situation: 'La situation',
  contexte: 'Le contexte',
  lieu: 'Où et comment',
  contact: 'Pour vous répondre',
  resume: 'Vérification',
};

const label = (choices: Choice[], value: string | undefined): string | undefined => choices.find((c) => c.value === value)?.label;
const phrase = (choices: Choice[], value: string | undefined): string | undefined => choices.find((c) => c.value === value)?.phrase;

/** Joint une liste en français : « a, b et c ». */
export function joinFr(items: string[]): string {
  const list = items.filter(Boolean);
  if (list.length <= 1) return list.join('');
  return `${list.slice(0, -1).join(', ')} et ${list[list.length - 1]}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d.\s-]{8,25}$/;

export const isEmail = (v: string | undefined): boolean => Boolean(v && EMAIL_RE.test(v.trim()));
export const isPhone = (v: string | undefined): boolean => Boolean(v && PHONE_RE.test(v.trim()) && (v.match(/\d/g)?.length ?? 0) >= 8);

export type Errors = Partial<Record<keyof WizardAnswers, string>>;

/** Valide une étape. Seules les informations indispensables pour répondre sont obligatoires. */
export function validateStep(step: StepId, a: WizardAnswers): Errors {
  const e: Errors = {};
  if (step === 'chien') {
    if (a.dogName && a.dogName.length > LIMITS.dogName) e.dogName = `Le prénom ne doit pas dépasser ${LIMITS.dogName} caractères.`;
  }
  if (step === 'situation') {
    if (a.topics.length === 0) e.topics = 'Choisissez au moins un sujet, même « Autre chose ».';
  }
  if (step === 'lieu') {
    if (a.area && a.area.length > LIMITS.area) e.area = `Merci d’indiquer le secteur en ${LIMITS.area} caractères maximum.`;
    if (a.message && a.message.length > LIMITS.message) e.message = `Votre précision ne doit pas dépasser ${LIMITS.message} caractères.`;
  }
  if (step === 'contact') {
    if (!a.firstName?.trim()) e.firstName = 'Indiquez comment nous pouvons vous appeler.';
    else if (a.firstName.length > LIMITS.firstName) e.firstName = `${LIMITS.firstName} caractères maximum.`;
    if (!a.contactMethod) e.contactMethod = 'Choisissez comment vous préférez être recontacté·e.';
    if (a.contactMethod === 'email' && !isEmail(a.email)) e.email = 'Indiquez une adresse e-mail valide, par exemple nom@exemple.fr.';
    if (a.contactMethod === 'telephone' && !isPhone(a.phone)) e.phone = 'Indiquez un numéro de téléphone valide, par exemple 06 12 34 56 78.';
    if (a.email && a.contactMethod !== 'email' && !isEmail(a.email)) e.email = 'Cette adresse e-mail semble incomplète.';
    if (a.phone && a.contactMethod !== 'telephone' && !isPhone(a.phone)) e.phone = 'Ce numéro semble incomplet.';
    if (!a.consent) e.consent = 'Votre accord est nécessaire pour que nous puissions traiter votre demande.';
  }
  return e;
}

/** Valide l'ensemble du parcours avant envoi. */
export function validateAll(a: WizardAnswers): Errors {
  return STEPS.reduce<Errors>((acc, step) => ({ ...acc, ...validateStep(step, a) }), {});
}

/**
 * Reformulation prudente de la situation déclarée.
 * Ne contient jamais de qualification comportementale ni de diagnostic.
 */
export function rephrase(a: WizardAnswers): string[] {
  const out: string[] = [];
  const subject = a.dogName?.trim() ? `votre chien, ${a.dogName.trim()},` : 'votre chien';
  const ageText = phrase(AGE_CHOICES, a.age);
  const topics = TOPICS.filter((t) => a.topics.includes(t.value));
  const dogTopics = topics.filter((t) => t.dog).map((t) => t.phrase);
  const otherTopics = topics.filter((t) => !t.dog).map((t) => t.phrase);

  if (ageText) out.push(`Vous nous parlez d’${ageText}.`);
  if (dogTopics.length) out.push(`Vous indiquez que ${subject} ${joinFr(dogTopics)}.`);
  out.push(...otherTopics);

  const contexts = CONTEXT_CHOICES.filter((c) => a.contexts.includes(c.value)).map((c) => c.phrase ?? '');
  const since = phrase(SINCE_CHOICES, a.since);
  if (contexts.length && since) out.push(`Vous l’observez notamment ${joinFr(contexts)}, ${since}.`);
  else if (contexts.length) out.push(`Vous l’observez notamment ${joinFr(contexts)}.`);
  else if (since) out.push(`Vous l’avez remarqué ${since}.`);

  if (a.safety === 'oui') out.push('Vous signalez qu’une personne ou un animal a déjà été blessé : nous en parlerons en priorité.');

  if (out.length) out.push('Vous pourrez préciser tout cela de vive voix : chaque situation est différente.');
  return out;
}

/** Résumé structuré (libellé → valeur) affiché avant envoi et transmis à l'activité. */
export function summaryFields(a: WizardAnswers): { step: StepId; label: string; value: string }[] {
  const rows: { step: StepId; label: string; value: string }[] = [];
  const push = (step: StepId, l: string, v: string | undefined) => {
    if (v && v.trim()) rows.push({ step, label: l, value: v.trim() });
  };
  push('chien', 'Prénom du chien', a.dogName);
  push('chien', 'Âge', label(AGE_CHOICES, a.age));
  push('situation', 'Sujets', TOPICS.filter((t) => a.topics.includes(t.value)).map((t) => t.label).join(' · '));
  push('contexte', 'Circonstances', CONTEXT_CHOICES.filter((c) => a.contexts.includes(c.value)).map((c) => c.label).join(' · '));
  push('contexte', 'Depuis quand', label(SINCE_CHOICES, a.since));
  push('contexte', 'Blessure déjà survenue', label(SAFETY_CHOICES, a.safety));
  push('lieu', 'Secteur', a.area);
  push('lieu', 'Lieu de rencontre souhaité', label(MEETING_CHOICES, a.meeting));
  push('lieu', 'Précision', a.message);
  push('contact', 'Prénom', a.firstName);
  push('contact', 'Être recontacté·e', label(CONTACT_METHOD_CHOICES, a.contactMethod));
  push('contact', 'E-mail', a.email);
  push('contact', 'Téléphone', a.phone);
  push('contact', 'Meilleur moment', label(BEST_TIME_CHOICES, a.bestTime));
  return rows;
}

/** Liste des sujets valides pour le préremplissage via `?sujet=`. */
export function topicFromQuery(value: string | null): string | undefined {
  return TOPICS.some((t) => t.value === value) ? (value as string) : undefined;
}
