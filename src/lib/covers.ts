import type { PhotoSlotId } from '~/content/photos';

/**
 * Visuel de couverture par défaut d'un article selon sa catégorie : un emplacement photo
 * d'illustration (photo libre vérifiée si disponible, composition graphique sinon).
 * Un article peut définir sa propre couverture (`cover` dans le frontmatter).
 */
const BY_CATEGORY: Record<string, PhotoSlotId> = {
  'au-quotidien': 'illus-maison',
  'en-promenade': 'illus-balade',
  chiot: 'illus-chiot',
  comprendre: 'illus-flair',
};

export const coverSlot = (category: string): PhotoSlotId => BY_CATEGORY[category] ?? 'illus-balade';
