/**
 * Registre photographique.
 *
 * Chaque emplacement décrit le message que la photo doit porter. Tant qu'aucun
 * fichier n'est fourni, le site affiche une composition graphique (jamais une
 * fausse photo). Pour activer une photo :
 *   1. déposez le fichier dans `src/assets/photos/<id>.jpg` (ou .webp/.png/.avif) ;
 *   2. complétez `credit` ci-dessous (auteur, source, licence) ;
 *   3. reportez les informations dans docs/IMAGE-LICENCES-AND-CREDITS.md.
 * Les photos de l'éducatrice ou de ses clients ne doivent provenir que d'elle.
 */
import type { ImageMetadata } from 'astro';
import verifiedCredits from './photo-credits.json';

export type PlateMotif = 'chemin' | 'rencontre' | 'herbes' | 'horizon' | 'portrait';

export interface PhotoCredit {
  author: string;
  sourceUrl: string;
  licence: string;
  /** Vrai si la licence impose une attribution visible. */
  attributionRequired: boolean;
  /** Photo authentique fournie par l'activité (et non illustrative). */
  authentic: boolean;
  licenceUrl?: string;
}

export interface PhotoSlot {
  id: string;
  page: string;
  message: string;
  /** Situation qui doit être visible sur l'image. */
  situation: string;
  framing: string;
  /** Ratio d'affichage (largeur / hauteur). */
  ratio: number;
  alt: string;
  /** Composition graphique affichée en attendant la photo. */
  motif: PlateMotif;
  /** Limites d'interprétation à respecter. */
  caution?: string;
  credit?: PhotoCredit;
  /** Photo d'illustration libre (banque ouverte), jamais présentée comme un chien accompagné. */
  illustrative?: boolean;
}

export const PHOTO_SLOTS = {
  'accueil-balade': {
    id: 'accueil-balade',
    page: 'Accueil — introduction',
    message: 'Une relation détendue au quotidien.',
    situation: 'Une personne et son chien en promenade, laisse détendue, regards ou attention partagés.',
    framing: 'Plan large horizontal, sujets dans le tiers droit, espace libre à gauche pour le texte. Lumière naturelle douce.',
    ratio: 4 / 5,
    alt: 'Une personne marche avec son chien en laisse détendue sur un chemin.',
    motif: 'chemin',
    caution: 'La laisse doit être détendue ; éviter toute image de traction ou de contrainte.',
  },
  'accueil-rencontre': {
    id: 'accueil-rencontre',
    page: 'Accueil — le premier pas',
    message: 'La première rencontre : prendre le temps de faire connaissance.',
    situation: 'Une personne accroupie à hauteur d’un chien qui s’approche librement, dans un jardin ou un salon.',
    framing: 'Plan moyen, à hauteur du chien, profondeur de champ courte.',
    ratio: 4 / 5,
    alt: 'Une personne accroupie laisse un chien venir à elle tranquillement.',
    motif: 'rencontre',
    caution: 'Le chien doit approcher de lui-même, sans être retenu ni forcé.',
  },
  'educatrice-portrait': {
    id: 'educatrice-portrait',
    page: 'Accueil + À propos — portrait',
    message: 'La personne qui vous accompagne.',
    situation: 'Portrait naturel de l’éducatrice, idéalement avec un chien, en extérieur.',
    framing: 'Portrait vertical, regard franc ou tourné vers le chien, arrière-plan naturel flou.',
    ratio: 4 / 5,
    alt: 'Portrait de l’éducatrice de ToutouBien.',
    motif: 'portrait',
    caution: 'Uniquement une photo authentique fournie par l’éducatrice. Jamais d’image de banque.',
  },
  'educatrice-avec-chien': {
    id: 'educatrice-avec-chien',
    page: 'Qui suis-je — avec son chien',
    message: 'La relation qu’elle vit au quotidien avec son propre chien.',
    situation: 'L’éducatrice avec son chien, complices, en extérieur ou chez elle.',
    framing: 'Plan moyen, à hauteur du chien, lumière naturelle.',
    ratio: 1,
    alt: 'L’éducatrice de ToutouBien avec son chien.',
    motif: 'rencontre',
    caution: 'Photo authentique uniquement, fournie par l’éducatrice.',
  },
  'accompagnement-domicile': {
    id: 'accompagnement-domicile',
    page: 'L’accompagnement — chez vous',
    message: 'Travailler dans le cadre de vie du chien.',
    situation: 'Une scène calme à la maison : un chien couché près de sa famille, ou une discussion autour d’une table avec le chien présent.',
    framing: 'Plan moyen intérieur, lumière de fenêtre.',
    ratio: 4 / 3,
    alt: 'Un chien se repose près de sa famille dans le salon.',
    motif: 'herbes',
  },
  'accompagnement-exterieur': {
    id: 'accompagnement-exterieur',
    page: 'L’accompagnement — en extérieur',
    message: 'Observer et apprendre là où les situations se présentent.',
    situation: 'Une balade dans un parc ou en bordure de chemin, chien en laisse longue ou détendue.',
    framing: 'Plan large, horizon bas, beaucoup d’air.',
    ratio: 4 / 3,
    alt: 'Une personne et son chien se promènent dans un parc.',
    motif: 'horizon',
  },
  'apropos-atelier': {
    id: 'apropos-atelier',
    page: 'À propos — en situation',
    message: 'L’éducatrice au travail, en échange avec une famille.',
    situation: 'L’éducatrice en discussion avec un propriétaire, chien présent et détendu.',
    framing: 'Plan moyen, sujets décentrés.',
    ratio: 3 / 2,
    alt: 'L’éducatrice échange avec un propriétaire et son chien.',
    motif: 'chemin',
    caution: 'Photo authentique uniquement, avec l’accord écrit des personnes visibles.',
  },
  // ——— Photos d'illustration libres (scripts/photos/fetch-photos.mjs, licence vérifiée via l'API Commons) ———
  'illus-balade': {
    id: 'illus-balade',
    page: 'Accompagnements — mieux comprendre son chien',
    message: 'La balade comme moment partagé.',
    situation: 'Une personne et son chien marchent ensemble, laisse détendue.',
    framing: 'Plan large, sujets décentrés.',
    ratio: 4 / 3,
    alt: 'Une personne promène son chien en laisse sur un chemin.',
    motif: 'chemin',
    illustrative: true,
  },
  'illus-flair': {
    id: 'illus-flair',
    page: 'Explorer — le monde par le nez',
    message: 'Flairer est un besoin.',
    situation: 'Un chien renifle l’herbe au bord d’un chemin.',
    framing: 'Plan moyen, à hauteur du chien.',
    ratio: 4 / 3,
    alt: 'Un chien blanc renifle l’herbe au bord d’un chemin.',
    motif: 'herbes',
    illustrative: true,
  },
  'illus-rencontre-chiens': {
    id: 'illus-rencontre-chiens',
    page: 'Accompagnements — le chien adulte',
    message: 'Les rencontres entre chiens se lisent dans les détails.',
    situation: 'Deux chiens se saluent calmement dans un parc.',
    framing: 'Plan moyen, les deux chiens lisibles.',
    ratio: 4 / 3,
    alt: 'Deux chiens se saluent en se reniflant dans un parc.',
    motif: 'rencontre',
    illustrative: true,
  },
  'illus-maison': {
    id: 'illus-maison',
    page: 'Accompagnements — les difficultés du quotidien',
    message: 'Le calme à la maison.',
    situation: 'Un chien se repose allongé au sol, à l’intérieur.',
    framing: 'Plan moyen, lumière intérieure.',
    ratio: 4 / 3,
    alt: 'Un chien noir se repose, allongé sur le sol d’une cuisine.',
    motif: 'horizon',
    illustrative: true,
  },
  'illus-chiot': {
    id: 'illus-chiot',
    page: 'Accompagnements — l’arrivée d’un chiot',
    message: 'Le repos fait partie des apprentissages du chiot.',
    situation: 'Un chiot endormi.',
    framing: 'Plan serré, doux.',
    ratio: 4 / 3,
    alt: 'Un chiot beagle endormi.',
    motif: 'horizon',
    illustrative: true,
  },
} satisfies Record<string, PhotoSlot>;

export type PhotoSlotId = keyof typeof PHOTO_SLOTS;

const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/photos/*.{jpg,jpeg,png,webp,avif}', { eager: true });

/** Crédit d'un emplacement : saisi à la main dans le registre, ou vérifié par le script de téléchargement. */
export function creditFor(id: string): PhotoCredit | undefined {
  const manual = (PHOTO_SLOTS as Record<string, PhotoSlot>)[id]?.credit;
  return manual ?? (verifiedCredits as Record<string, PhotoCredit>)[id];
}

/** Renvoie le fichier photo déposé pour un emplacement, s'il existe. */
export function photoFor(id: string): ImageMetadata | undefined {
  const match = Object.entries(files).find(([path]) => path.split('/').pop()?.replace(/\.[^.]+$/, '') === id);
  return match?.[1].default;
}
