/**
 * Photothèque d'illustration : photographies de chiens sous licence libre (CC BY 2.0),
 * issues de Flickr via le jeu de données public Google Open Images. Chaque entrée garde
 * l'auteur, la page d'origine et la licence ; l'attribution est affichée sous chaque photo
 * et sur la page /credits-photos/. Inventaire détaillé : docs/PHOTO-ASSETS.md.
 *
 * Ces photos illustrent des situations générales : elles ne montrent ni Mme Petitgand,
 * ni ses clients, ni des chiens qu'elle accompagne.
 */
import type { ImageMetadata } from 'astro';
import entries from '~/content/photo-library.json';

export type Theme = 'lien' | 'balade' | 'flair' | 'jeu' | 'rencontre' | 'rappel' | 'chiot' | 'attente' | 'maison' | 'senior' | 'nature' | 'observe' | 'portrait';

export interface LibraryPhoto {
  id: string;
  file: string;
  theme: Theme;
  alt: string;
  caption: string;
  author: string;
  authorUrl: string;
  sourceUrl: string;
  licence: string;
  licenceUrl: string;
  sourceSite: string;
  width: number;
  height: number;
  focus: { x: number; y: number };
  peopleIdentifiable: boolean;
  img: ImageMetadata;
}

const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/photos/library/*.jpg', { eager: true });

export const LIBRARY: LibraryPhoto[] = (entries as Omit<LibraryPhoto, 'img'>[]).flatMap((e) => {
  const mod = files[`/src/assets/photos/library/${e.file}`];
  return mod ? [{ ...e, img: mod.default }] : [];
});

const byId = new Map(LIBRARY.map((p) => [p.id, p]));

/** Photo par identifiant ; lève une erreur au build si l'identifiant n'existe pas (pas d'image cassée). */
export function photo(id: string): LibraryPhoto {
  const p = byId.get(id);
  if (!p) throw new Error(`Photo inconnue dans la photothèque : ${id}`);
  return p;
}

export const hasPhoto = (id: string): boolean => byId.has(id);
export const byTheme = (theme: Theme): LibraryPhoto[] => LIBRARY.filter((p) => p.theme === theme);

/** Classes de point d'intérêt (object-position par pas de 5 %, sans style en ligne : CSP). */
export const focusClass = (p: Pick<LibraryPhoto, 'focus'>): string => {
  const r = (v: number) => Math.min(100, Math.max(0, Math.round(v / 5) * 5));
  return `fx-${r(p.focus.x)} fy-${r(p.focus.y)}`;
};

export const creditLine = (p: LibraryPhoto): string => `${p.author} · ${p.licence}`;
