/**
 * « Le décodeur du quotidien » : expérience signature de ToutouBien.
 *
 * Une situation se lit en cinq temps : ce que l'on vit → ce que l'on observe → ce que cela
 * peut vouloir dire (toujours plusieurs pistes) → les questions à se poser → quand demander
 * de l'aide. Le décodeur n'établit aucun diagnostic et ne promet aucun résultat : il aide à
 * observer, à mettre des mots et à préparer un échange. Contenus éditoriaux à relire par
 * l'éducatrice (docs/CONTENT-VALIDATION.md). Rien n'est enregistré ni envoyé.
 */

export interface Observation {
  id: string;
  /** Ce que l'on regarde. */
  label: string;
  /** Pourquoi c'est utile de le noter. */
  why: string;
}

export interface Situation {
  id: string;
  title: string;
  /** Phrase telle qu'un propriétaire pourrait la dire. */
  voice: string;
  /** Sujet du formulaire « Parlons de votre chien ». */
  topic: string;
  accompagnement: 'chiot' | 'chien-adulte' | 'quotidien' | 'comprendre';
  explorer?: 'flair' | 'distance' | 'signaux';
  articles: string[];
  observe: Observation[];
  /** Pistes générales, jamais une cause unique. */
  meanings: string[];
  questions: string[];
  /** Signaux qui justifient de demander de l'aide rapidement (vétérinaire, professionnel). */
  care: string[];
  /** Une idée simple et sans risque à essayer, formulée prudemment. */
  first: string;
}

export const STEPS = [
  { id: 'vivre', label: 'Ce que vous vivez' },
  { id: 'observer', label: 'Ce que l’on observe' },
  { id: 'comprendre', label: 'Ce que cela peut vouloir dire' },
  { id: 'questions', label: 'Les questions à se poser' },
  { id: 'suite', label: 'Et ensuite ?' },
] as const;

const COMMON_OBSERVE: Observation[] = [
  { id: 'quand', label: 'Quand cela arrive (moment de la journée, avant ou après quoi)', why: 'Le contexte change beaucoup la lecture d’un comportement.' },
  { id: 'intensite', label: 'L’intensité et la durée', why: 'Un comportement bref et rare ne se lit pas comme un comportement fort et répété.' },
];

export const SITUATIONS: Situation[] = [
  {
    id: 'laisse',
    title: 'Il tire en laisse',
    voice: '« Les balades ressemblent à un bras de fer. »',
    topic: 'marche-en-laisse',
    accompagnement: 'chien-adulte',
    explorer: 'flair',
    articles: ['chien-qui-tire-en-laisse', 'les-besoins-du-chien'],
    observe: [
      { id: 'debut', label: 'S’il tire dès la sortie ou seulement après un moment', why: 'L’excitation du départ et la fatigue n’ont pas les mêmes réponses.' },
      { id: 'vers', label: 'Ce vers quoi il tire : odeurs, chiens, personnes, direction de la maison', why: 'Cela indique ce qui l’attire ou ce qu’il cherche à éviter.' },
      { id: 'materiel', label: 'Le matériel utilisé (collier, harnais, longueur de laisse)', why: 'Le matériel influence le confort et la façon de marcher.' },
      ...COMMON_OBSERVE,
    ],
    meanings: [
      'Il peut simplement aller plus vite que nous : notre rythme de marche est lent pour beaucoup de chiens.',
      'Tirer a souvent fonctionné pour lui : il est arrivé là où il voulait aller.',
      'Il peut chercher à flairer : renifler fait partie de ses besoins.',
      'Une excitation ou une inquiétude dans l’environnement peut accélérer sa marche.',
    ],
    questions: [
      'Votre chien a-t-il l’occasion de se dépenser et de flairer librement à d’autres moments ?',
      'Les règles de marche sont-elles les mêmes pour toutes les personnes qui le promènent ?',
      'À quoi ressemblerait, pour vous, une balade réussie ?',
    ],
    care: ['Une douleur, une boiterie ou une toux en marchant : parlez-en à votre vétérinaire.'],
    first: 'Prévoir, pendant la balade, des moments où il a le droit de flairer à son rythme, sur une laisse plus longue si l’endroit le permet.',
  },
  {
    id: 'rappel',
    title: 'Il ne revient pas quand je l’appelle',
    voice: '« Le lâcher devient une source d’inquiétude. »',
    topic: 'rappel',
    accompagnement: 'chien-adulte',
    explorer: 'flair',
    articles: ['le-rappel', 'les-besoins-du-chien'],
    observe: [
      { id: 'occupe', label: 'Ce qu’il fait au moment de l’appel (flairer, jouer, observer)', why: 'Revenir est un choix entre ce qu’il fait et ce qu’on lui propose.' },
      { id: 'suite', label: 'Ce qui se passe quand il revient (laisse, départ, félicitations)', why: 'Si revenir annonce la fin du plaisir, il peut apprendre à retarder le retour.' },
      { id: 'mot', label: 'Le mot utilisé et combien de fois il est répété', why: 'Un mot répété sans suite perd de sa valeur.' },
      ...COMMON_OBSERVE,
    ],
    meanings: [
      'L’environnement peut être bien plus intéressant que nous à ce moment-là.',
      'Le signal de rappel n’a peut-être pas encore été appris dans ce contexte.',
      'Revenir a pu être associé à quelque chose de désagréable.',
      'Il peut être trop loin, trop excité ou trop inquiet pour répondre.',
    ],
    questions: [
      'Votre chien revient-il facilement à la maison ou au jardin ?',
      'Que se passe-t-il, pour lui, juste après être revenu ?',
      'Dans quels lieux le laissez-vous libre, et sont-ils sûrs ?',
    ],
    care: ['Un chien qui s’approche des routes ou poursuit des animaux : sécurisez avec une longe en attendant un accompagnement.'],
    first: 'Appeler parfois sans que cela annonce la fin de la balade : un retour accueilli chaleureusement, puis il repart.',
  },
  {
    id: 'solitude',
    title: 'Il vit mal les moments seul',
    voice: '« Partir de la maison devient compliqué. »',
    topic: 'solitude',
    accompagnement: 'quotidien',
    explorer: 'signaux',
    articles: ['apprendre-la-solitude'],
    observe: [
      { id: 'quoi', label: 'Ce qui se passe en votre absence (aboiements, destructions, malpropreté)', why: 'Une courte vidéo peut aider à voir ce qui se passe réellement.' },
      { id: 'moment', label: 'Quand cela commence : dès votre départ, ou après un moment', why: 'Le moment donne des indices sur ce qu’il vit.' },
      { id: 'routine', label: 'Ce qui a changé récemment (horaires, déménagement, arrivée)', why: 'Les changements de rythme jouent souvent un rôle.' },
      ...COMMON_OBSERVE,
    ],
    meanings: [
      'L’apprentissage de la solitude a pu être trop rapide ou ne jamais avoir été fait.',
      'Il peut manquer d’activité, de flair ou de repos dans la journée.',
      'Un inconfort ou une inquiétude peuvent s’exprimer en votre absence.',
      'Certains bruits extérieurs peuvent déclencher des aboiements.',
    ],
    questions: [
      'Combien de temps reste-t-il seul, et ce temps a-t-il changé récemment ?',
      'Ses besoins (sortie, flair, jeu, repos) sont-ils couverts avant votre départ ?',
      'Le voisinage vous a-t-il fait des remarques ?',
    ],
    care: ['Des blessures, une grande détresse ou des changements brutaux : parlez-en rapidement à votre vétérinaire.'],
    first: 'Filmer quelques minutes de votre absence pour savoir ce qui se passe vraiment, sans tirer de conclusion hâtive.',
  },
  {
    id: 'visites',
    title: 'Il saute sur les gens',
    voice: '« Les visites tournent vite à l’agitation. »',
    topic: 'excitation',
    accompagnement: 'quotidien',
    explorer: 'signaux',
    articles: ['lire-les-signaux', 'les-besoins-du-chien'],
    observe: [
      { id: 'qui', label: 'Avec qui : la famille, les invités, les enfants, les inconnus dehors', why: 'Le comportement peut varier beaucoup selon les personnes.' },
      { id: 'reaction', label: 'La réaction habituelle des personnes (caresses, cris, mains repoussantes)', why: 'Les réactions humaines peuvent entretenir l’agitation sans le vouloir.' },
      { id: 'apres', label: 'Combien de temps il met à se calmer', why: 'Cela renseigne sur sa capacité à redescendre.' },
      ...COMMON_OBSERVE,
    ],
    meanings: [
      'Sauter est souvent une façon de saluer, de s’approcher du visage.',
      'Il a pu être récompensé par de l’attention, même en étant repoussé.',
      'Une forte excitation peut l’empêcher de proposer autre chose.',
      'Chez certains chiens, sauter peut aussi traduire une gêne face à la situation.',
    ],
    questions: [
      'Tous les membres de la famille réagissent-ils de la même façon ?',
      'Que pourrait-il faire à la place, que vous aimeriez voir ?',
      'Y a-t-il des enfants ou des personnes fragiles parmi vos visiteurs ?',
    ],
    care: ['Si un enfant ou une personne fragile risque d’être bousculé, gérez l’espace (barrière, laisse) en attendant un accompagnement.'],
    first: 'Accueillir les invités quand il est déjà un peu plus calme, par exemple après quelques minutes derrière une barrière.',
  },
  {
    id: 'chiens',
    title: 'Il réagit en croisant d’autres chiens',
    voice: '« Chaque rencontre se prépare à l’avance. »',
    topic: 'congeneres',
    accompagnement: 'chien-adulte',
    explorer: 'distance',
    articles: ['lire-les-signaux', 'fiche-observer-son-chien'],
    observe: [
      { id: 'distance', label: 'La distance à laquelle il commence à réagir', why: 'Cette distance est un repère précieux pour avancer.' },
      { id: 'signes', label: 'Les signes avant la réaction (corps figé, regard fixe, oreilles)', why: 'Les repérer permet d’agir avant qu’il soit débordé.' },
      { id: 'laisse', label: 'S’il réagit pareil en laisse et en liberté', why: 'La laisse change la manière dont un chien vit une rencontre.' },
      ...COMMON_OBSERVE,
    ],
    meanings: [
      'Il peut être inquiet face aux autres chiens et chercher à les tenir à distance.',
      'Il peut au contraire être très excité et frustré de ne pas pouvoir aller les voir.',
      'Une mauvaise expérience passée peut jouer un rôle.',
      'La fatigue ou une journée chargée peuvent réduire sa marge.',
    ],
    questions: [
      'À quelle distance votre chien reste-t-il calme ?',
      'Les rencontres se font-elles plutôt de face, dans des passages étroits ?',
      'Y a-t-il déjà eu des blessures, chez lui ou chez un autre chien ?',
    ],
    care: ['Une morsure ou une bagarre avec blessure : faites examiner les chiens et demandez l’aide d’un professionnel.'],
    first: 'Garder plus de distance, et passer en arc de cercle plutôt que de face quand c’est possible.',
  },
  {
    id: 'chiot',
    title: 'Mon chiot mordille tout',
    voice: '« Mains, chaussures, meubles : tout y passe. »',
    topic: 'chiot',
    accompagnement: 'chiot',
    explorer: 'signaux',
    articles: ['chiot-qui-mordille', 'arrivee-chiot-premieres-semaines'],
    observe: [
      { id: 'moments', label: 'Les moments où il mordille le plus (fin de journée, jeux, fatigue)', why: 'Beaucoup de chiots mordillent davantage quand ils sont fatigués.' },
      { id: 'objets', label: 'Ce qu’il mordille : mains, vêtements, objets', why: 'Cela aide à choisir quoi lui proposer à la place.' },
      { id: 'sommeil', label: 'Combien de temps il dort dans la journée', why: 'Un chiot a besoin de beaucoup de sommeil.' },
      ...COMMON_OBSERVE,
    ],
    meanings: [
      'Explorer avec la gueule fait partie du développement normal du chiot.',
      'La poussée des dents peut accentuer le besoin de mâchouiller.',
      'Un manque de sommeil peut le rendre plus excité.',
      'Le jeu avec les mains a pu être encouragé sans le vouloir.',
    ],
    questions: [
      'Votre chiot a-t-il des objets autorisés à mâchouiller, variés et accessibles ?',
      'Dort-il suffisamment, dans un endroit calme ?',
      'Les enfants de la maison savent-ils comment réagir ?',
    ],
    care: ['Des morsures qui blessent, ou des grognements avec raideur : demandez conseil sans attendre.'],
    first: 'Proposer un objet à mâchouiller au moment où il cherche à mordiller, et ménager des siestes au calme.',
  },
];

export const situation = (id: string): Situation | undefined => SITUATIONS.find((s) => s.id === id);

/** Note courte transmise au formulaire de contact : uniquement ce que la personne a coché. */
export function carnetNote(s: Situation, observed: string[]): string {
  const labels = s.observe.filter((o) => observed.includes(o.id)).map((o) => o.label.toLowerCase());
  const head = `Situation : ${s.title.toLowerCase()}.`;
  const body = labels.length ? ` Points que j’ai observés ou que je peux décrire : ${labels.join(' ; ')}.` : '';
  return (head + body).slice(0, 800);
}
