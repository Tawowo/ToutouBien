/** Photo d'illustration associée à chaque situation du décodeur / des dossiers (src/lib/library.ts). */
export const SITUATION_PHOTO: Record<string, string> = {
  laisse: 'balade-sentier-herbes',
  rappel: 'rappel-course',
  solitude: 'attente-porte',
  visites: 'jeu-deux-chiens-blancs',
  chiens: 'rencontre-huskies',
  chiot: 'chiot-mordille',
};

export const situationPhoto = (id: string): string => SITUATION_PHOTO[id] ?? 'observe-prairie';

/** Photos des pages d'accompagnement : ouverture, puis une photo par situation fréquente (dans l'ordre). */
export const ACC_PHOTOS: Record<string, { hero: string; card: string; situations: string[] }> = {
  chiot: { hero: 'chiot-portee', card: 'chiot-labrador', situations: ['chiot-beagle-balle', 'chiot-corde', 'chiot-mordille', 'chiot-husky'] },
  'chien-adulte': { hero: 'balade-golden-soleil', card: 'balade-sentier-duo', situations: ['portrait-berger-australien', 'balade-duo-laisses', 'maison-parquet', 'nature-bord-de-mer'] },
  quotidien: { hero: 'maison-sur-les-genoux', card: 'maison-golden', situations: ['attente-porte', 'jeu-deux-chiens-blancs', 'observe-levrier', 'maison-bouvier-caresse'] },
  comprendre: { hero: 'attention-regard', card: 'observe-duo', situations: ['lien-laisse-golden', 'observe-profil', 'chiot-exploration', 'flair-buissons'] },
};
