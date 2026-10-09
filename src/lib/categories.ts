export const CATEGORIES = [
  { id: 'au-quotidien', motif: 'herbes', label: 'Au quotidien', description: 'Les petits moments qui font la vie avec un chien : la maison, les visites, les habitudes.' },
  { id: 'en-promenade', motif: 'chemin', label: 'En promenade', description: 'Marcher ensemble, revenir quand on l’appelle, croiser d’autres chiens.' },
  { id: 'chiot', motif: 'horizon', label: 'L’arrivée d’un chiot', description: 'Préparer et accompagner les premières semaines.' },
  { id: 'comprendre', motif: 'rencontre', label: 'Comprendre son chien', description: 'Observer, interpréter avec prudence, mieux communiquer.' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];
export const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as [CategoryId, ...CategoryId[]];
export const categoryLabel = (id: string): string => CATEGORIES.find((c) => c.id === id)?.label ?? id;
export const categoryMotif = (id: string) => CATEGORIES.find((c) => c.id === id)?.motif ?? 'chemin';
