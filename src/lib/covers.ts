/**
 * Couverture photographique des articles : une photo de la photothèque choisie pour son sujet.
 * Un article peut définir sa propre image (`cover` dans le frontmatter), prioritaire.
 * Sans correspondance, la catégorie donne une photo par défaut.
 */
const BY_ARTICLE: Record<string, string> = {
  'apprendre-la-solitude': 'attente-rebord',
  'arrivee-chiot-premieres-semaines': 'chiot-portee',
  'chien-qui-tire-en-laisse': 'balade-duo-laisses',
  'chiot-qui-mordille': 'chiot-jouet',
  'fiche-observer-son-chien': 'observe-rocher',
  'le-rappel': 'rappel-balle',
  'les-besoins-du-chien': 'nature-soleil',
  'lire-les-signaux': 'observe-profil',
  'preparer-un-accompagnement': 'lien-laisse-golden',
};

const BY_CATEGORY: Record<string, string> = {
  'au-quotidien': 'maison-golden',
  'en-promenade': 'balade-golden-soleil',
  chiot: 'chiot-exploration',
  comprendre: 'observe-duo',
};

export const coverPhoto = (articleId: string, category: string): string => BY_ARTICLE[articleId] ?? BY_CATEGORY[category] ?? 'balade-golden-soleil';
