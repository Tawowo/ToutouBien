/**
 * Les quatre grands besoins auxquels répond l'accompagnement.
 * Ce sont des SITUATIONS vécues par les propriétaires, décrites de façon générale :
 * aucune prestation, durée ou tarif n'y est affirmé. Textes éditoriaux à relire
 * avec l'éducatrice (docs/CONTENT-VALIDATION.md).
 */
import type { PlateMotif } from './photos';

export interface Accompagnement {
  slug: 'chiot' | 'chien-adulte' | 'quotidien' | 'comprendre';
  num: string;
  label: string;
  title: string;
  /** Titre de page, syntaxe SplitTitle (*italique*). */
  heading: string;
  short: string;
  lede: string;
  motif: PlateMotif;
  /** Couleur d'ambiance de la page. */
  tone: 'lagon' | 'or' | 'argile' | 'mousse';
  situations: { title: string; text: string }[];
  benefits: string[];
  steps: { title: string; text: string }[];
  repères: { title: string; text: string }[];
  topics: string[];
  articles: string[];
  explorer?: { href: string; label: string; text: string };
  faq: { q: string; a: string }[];
  seoDescription: string;
}

export const ACCOMPAGNEMENTS: Accompagnement[] = [
  {
    slug: 'chiot',
    num: '01',
    label: 'L’arrivée d’un chiot',
    title: 'Accueillir un chiot',
    heading: 'Bien commencer, *dès les premières semaines*.',
    short: 'Préparer son arrivée, poser un rythme, accompagner ses découvertes.',
    lede: 'Un chiot découvre tout en même temps : une nouvelle maison, de nouvelles personnes, de nouveaux bruits. Les premières semaines sont le moment idéal pour poser des bases sereines, sans viser la perfection.',
    motif: 'horizon',
    tone: 'or',
    situations: [
      { title: 'Un chiot arrive bientôt', text: 'Vous voulez préparer la maison, la famille et les premiers jours pour que tout se passe au mieux.' },
      { title: 'Il vient d’arriver', text: 'Les nuits sont courtes, la propreté se cherche et chacun a son avis sur ce qu’il faut faire.' },
      { title: 'Il mordille tout', text: 'Mains, chaussures, meubles : il explore avec sa gueule et vous ne savez pas comment réagir.' },
      { title: 'Il découvre le monde', text: 'Vous aimeriez l’aider à aborder les bruits, les gens, les autres chiens et les trajets sans le brusquer.' },
    ],
    benefits: [
      'Des repères clairs et cohérents pour toute la famille',
      'Un rythme de journée adapté à son âge',
      'Des découvertes progressives, à sa mesure',
      'Des réponses à vos questions au fur et à mesure',
    ],
    steps: [
      { title: 'Faire connaissance', text: 'Votre chiot dans son nouvel environnement, votre organisation, vos questions.' },
      { title: 'Poser le cadre', text: 'Coin de repos, rythme, règles partagées : ce qui aide un chiot à se sentir en sécurité.' },
      { title: 'Accompagner les découvertes', text: 'Comment proposer de nouvelles expériences de façon positive et progressive.' },
      { title: 'Ajuster ensemble', text: 'Un chiot grandit vite : on adapte au fil des semaines.' },
    ],
    repères: [
      { title: 'Le sommeil compte', text: 'Un chiot dort beaucoup. Le respecter l’aide à mieux apprendre et à rester calme.' },
      { title: 'Petit à petit', text: 'Des expériences courtes, variées et agréables valent mieux qu’une longue sortie intimidante.' },
      { title: 'Cohérence', text: 'Les mêmes mots et les mêmes règles pour tout le monde simplifient beaucoup sa compréhension.' },
    ],
    topics: ['chiot'],
    articles: ['arrivee-chiot-premieres-semaines', 'chiot-qui-mordille'],
    explorer: { href: '/explorer/flair/', label: 'Le monde par le nez', text: 'Découvrez comment un chiot explore son environnement.' },
    faq: [
      { q: 'À quel âge peut-on commencer ?', a: 'Dès l’arrivée du chiot, et même avant pour préparer son accueil. Les premières semaines sont un moment privilégié pour poser de bonnes bases.' },
      { q: 'Mon chiot n’a pas fini ses vaccins, peut-il sortir ?', a: 'C’est une question à poser à votre vétérinaire, qui vous indiquera les lieux et les contacts possibles selon sa situation.' },
    ],
    seoDescription: 'Accueillir un chiot sereinement : préparer son arrivée, poser un rythme, accompagner ses découvertes. Un accompagnement pour bien commencer.',
  },
  {
    slug: 'chien-adulte',
    num: '02',
    label: 'Le chien adulte',
    title: 'Éduquer un chien adulte',
    heading: 'Il n’est *jamais trop tard* pour apprendre ensemble.',
    short: 'Un chien adopté, un chien qui a pris des habitudes, une nouvelle étape de vie.',
    lede: 'Un chien adulte peut tout à fait apprendre, à condition de partir de ce qu’il est : son histoire, ses habitudes, sa sensibilité. L’accompagnement s’adapte à son rythme et au vôtre.',
    motif: 'chemin',
    tone: 'lagon',
    situations: [
      { title: 'Vous venez de l’adopter', text: 'Vous connaissez peu son passé et vous aimeriez l’aider à trouver ses repères chez vous.' },
      { title: 'Les balades sont compliquées', text: 'Il tire en laisse ou ne revient pas toujours quand vous l’appelez.' },
      { title: 'Des habitudes installées', text: 'Certaines habitudes se sont installées avec le temps et vous aimeriez les faire évoluer.' },
      { title: 'Un changement de vie', text: 'Déménagement, naissance, nouveau rythme : votre chien doit s’adapter, vous aussi.' },
    ],
    benefits: [
      'Comprendre ce qui motive ses réactions',
      'Des exercices adaptés à son âge et à sa condition',
      'Des balades plus détendues pour tous les deux',
      'Une progression à votre rythme',
    ],
    steps: [
      { title: 'Faire le point', text: 'Son histoire, son quotidien, ce qui fonctionne déjà et ce qui vous pèse.' },
      { title: 'Observer', text: 'À la maison ou en balade, là où les situations se présentent réellement.' },
      { title: 'Des pistes concrètes', text: 'Quelques changements simples à mettre en place, expliqués pas à pas.' },
      { title: 'Suivre l’évolution', text: 'On ajuste selon ce que vous observez entre deux rencontres.' },
    ],
    repères: [
      { title: 'Son histoire compte', text: 'Un chien adopté arrive avec son vécu : lui laisser le temps de découvrir son nouveau cadre est essentiel.' },
      { title: 'La santé d’abord', text: 'Un changement de comportement soudain mérite un avis vétérinaire, notamment pour écarter une douleur.' },
      { title: 'Des petits pas', text: 'Les progrès se construisent sur des réussites, même modestes.' },
    ],
    topics: ['marche-en-laisse', 'rappel'],
    articles: ['chien-qui-tire-en-laisse', 'le-rappel'],
    explorer: { href: '/explorer/distance/', label: 'La distance de confort', text: 'Visualisez pourquoi la distance change tout.' },
    faq: [
      { q: 'Mon chien a 8 ans, est-ce encore possible ?', a: 'Oui. Un chien adulte ou âgé peut apprendre ; l’accompagnement tient compte de son âge, de sa condition physique et de son rythme.' },
      { q: 'Faut-il connaître son passé ?', a: 'Ce n’est pas indispensable. On part de ce que l’on observe aujourd’hui, et de ce que vous savez de lui.' },
    ],
    seoDescription: 'Éducation du chien adulte : adoption, marche en laisse, rappel, nouvelles habitudes. Un accompagnement adapté à son histoire et à votre rythme.',
  },
  {
    slug: 'quotidien',
    num: '03',
    label: 'Les difficultés du quotidien',
    title: 'Les difficultés du quotidien',
    heading: 'Quand le quotidien devient *un peu lourd*.',
    short: 'Solitude, visites, excitation, inquiétude : retrouver un équilibre à la maison.',
    lede: 'Certaines situations finissent par peser sur toute la famille : les départs, les visites, l’agitation, les moments où votre chien semble mal à l’aise. Les comprendre est la première étape pour les faire évoluer.',
    motif: 'herbes',
    tone: 'argile',
    situations: [
      { title: 'Les moments seul', text: 'Il vit mal vos absences : aboiements, destructions, voisins qui s’en plaignent.' },
      { title: 'Les visites', text: 'Chaque arrivée tourne à l’agitation, il saute sur tout le monde.' },
      { title: 'L’inquiétude', text: 'Certains bruits, lieux ou personnes semblent le mettre mal à l’aise.' },
      { title: 'La vie de famille', text: 'Enfants, horaires, autres animaux : trouver un rythme qui convient à chacun.' },
    ],
    benefits: [
      'Mettre des mots sur ce qui se passe',
      'Des ajustements réalistes pour votre organisation',
      'Des moments plus sereins à la maison',
      'Une orientation vers d’autres professionnels si nécessaire',
    ],
    steps: [
      { title: 'Écouter', text: 'Ce que vous vivez, depuis quand, dans quelles circonstances.' },
      { title: 'Comprendre', text: 'Ce que votre chien exprime, et ce qui peut entretenir la situation.' },
      { title: 'Agir progressivement', text: 'Des étapes simples, à la mesure de votre chien et de votre quotidien.' },
      { title: 'Faire le point', text: 'On regarde ensemble ce qui évolue et ce qui reste à travailler.' },
    ],
    repères: [
      { title: 'Ce n’est pas « contre vous »', text: 'Un chien qui aboie ou détruit en votre absence exprime souvent un mal-être, pas une vengeance.' },
      { title: 'La sécurité d’abord', text: 'En cas de morsure ou de risque, protégez chacun et parlez-en rapidement à un professionnel.' },
      { title: 'Un avis vétérinaire', text: 'Douleur, inconfort ou maladie peuvent modifier un comportement : c’est à vérifier en premier.' },
    ],
    topics: ['solitude', 'excitation', 'inquietude', 'famille'],
    articles: ['apprendre-la-solitude', 'lire-les-signaux'],
    explorer: { href: '/explorer/signaux/', label: 'Lire les signaux', text: 'Apprenez à repérer les signes d’inconfort.' },
    faq: [
      { q: 'Mon chien détruit tout quand je pars, est-il en colère ?', a: 'C’est une interprétation fréquente, mais un chien qui détruit en votre absence exprime le plus souvent une difficulté à vivre ce moment. Comprendre la cause aide à trouver des solutions adaptées.' },
      { q: 'Et si la situation est dangereuse ?', a: 'Si une personne ou un animal est en danger, la priorité est la sécurité. Un avis vétérinaire et, si besoin, un professionnel spécialisé du comportement peuvent être nécessaires.' },
    ],
    seoDescription: 'Chien qui supporte mal la solitude, s’agite lors des visites ou semble inquiet : comprendre ce qui se passe et retrouver un quotidien plus serein.',
  },
  {
    slug: 'comprendre',
    num: '04',
    label: 'Mieux comprendre son chien',
    title: 'Mieux comprendre son chien',
    heading: 'Apprendre à *lire* son chien.',
    short: 'Sans problème particulier : juste l’envie de mieux le comprendre.',
    lede: 'Pas besoin d’avoir un « problème » pour vouloir mieux comprendre son chien. Savoir lire ses signaux, connaître ses besoins et adapter ses habitudes rend la vie commune plus simple et plus riche.',
    motif: 'rencontre',
    tone: 'mousse',
    situations: [
      { title: 'Vous voulez bien faire', text: 'Vous aimeriez savoir si vous répondez vraiment à ses besoins.' },
      { title: 'Ses réactions vous intriguent', text: 'Il fait des choses que vous ne comprenez pas toujours.' },
      { title: 'Un premier chien', text: 'Vous découvrez la vie avec un chien et vous cherchez des repères fiables.' },
      { title: 'Enrichir son quotidien', text: 'Vous cherchez des idées d’activités adaptées à son caractère.' },
    ],
    benefits: [
      'Reconnaître ses principaux signaux',
      'Mieux connaître ses besoins (flair, repos, activité, relation)',
      'Des activités adaptées à son caractère',
      'Une relation plus fluide au quotidien',
    ],
    steps: [
      { title: 'Observer ensemble', text: 'Votre chien dans son quotidien : ce qu’il aime, ce qui le fatigue, ce qui l’intrigue.' },
      { title: 'Décoder', text: 'Ses postures, ses mimiques et son contexte, sans interprétation hâtive.' },
      { title: 'Enrichir', text: 'Des idées concrètes pour répondre à ses besoins.' },
    ],
    repères: [
      { title: 'Le contexte avant tout', text: 'Un même signal peut avoir plusieurs sens : on le lit toujours avec le reste du corps et la situation.' },
      { title: 'Le flair est un besoin', text: 'Renifler permet au chien de s’informer sur son environnement et participe souvent à son apaisement.' },
      { title: 'Chaque chien est unique', text: 'Âge, race, histoire et caractère influencent ses besoins.' },
    ],
    topics: ['comprendre'],
    articles: ['lire-les-signaux', 'les-besoins-du-chien', 'fiche-observer-son-chien'],
    explorer: { href: '/explorer/', label: 'Explorer', text: 'Trois expériences pour voir le monde à hauteur de chien.' },
    faq: [
      { q: 'Est-ce utile si tout va bien ?', a: 'Oui : mieux comprendre son chien permet souvent d’anticiper les difficultés et d’enrichir la relation.' },
    ],
    seoDescription: 'Mieux comprendre son chien : lire ses signaux, connaître ses besoins, enrichir son quotidien. Un accompagnement sans « problème » à résoudre.',
  },
];

export const accompagnement = (slug: string) => ACCOMPAGNEMENTS.find((a) => a.slug === slug);
