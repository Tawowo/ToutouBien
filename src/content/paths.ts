/**
 * Parcours de lecture de la bibliothèque : des suites d'articles dans un ordre conseillé.
 * Un parcours n'est affiché que si au moins deux de ses articles sont publiés.
 */
export interface ReadingPath {
  id: string;
  title: string;
  text: string;
  articles: string[];
}

export const READING_PATHS: ReadingPath[] = [
  {
    id: 'chiot',
    title: 'Premiers pas avec un chiot',
    text: 'De la préparation de la maison aux premières découvertes.',
    articles: ['arrivee-chiot-premieres-semaines', 'chiot-qui-mordille', 'les-besoins-du-chien', 'lire-les-signaux'],
  },
  {
    id: 'balades',
    title: 'Des balades plus sereines',
    text: 'Comprendre ce qui se joue dehors, puis construire pas à pas.',
    articles: ['les-besoins-du-chien', 'chien-qui-tire-en-laisse', 'le-rappel', 'lire-les-signaux'],
  },
  {
    id: 'maison',
    title: 'La maison au calme',
    text: 'Les absences, le repos et le rythme de la journée.',
    articles: ['les-besoins-du-chien', 'apprendre-la-solitude', 'lire-les-signaux'],
  },
  {
    id: 'observer',
    title: 'Observer avant d’agir',
    text: 'Apprendre à regarder, noter, puis en parler.',
    articles: ['lire-les-signaux', 'fiche-observer-son-chien', 'preparer-un-accompagnement'],
  },
];
