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
