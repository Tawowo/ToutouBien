/**
 * Système de validation des contenus.
 *
 * Chaque information métier porte un statut. Le site n'affiche publiquement que
 * ce qui a été confirmé par l'activité ; le reste est masqué ou remplacé par une
 * formulation prudente. En développement (ou avec PUBLIC_SHOW_DRAFTS=true sur une
 * préproduction), les informations en attente apparaissent avec un marquage visible.
 *
 * - `confirmed` : confirmé par Mme Petitgand (ou visible sur un document fourni, ex. le logo).
 * - `brief`     : rapporté lors de l'échange initial ; affiché uniquement avec une
 *                 formulation prudente, à faire confirmer (non bloquant).
 * - `pending`   : proposition ou information à valider ; jamais affichée en production.
 * - `missing`   : information inconnue ; aucune valeur.
 */
export type FieldStatus = 'confirmed' | 'brief' | 'pending' | 'missing';

export interface Field<T> {
  readonly status: FieldStatus;
  readonly value?: T;
  /** Ce qu'il faut demander / vérifier. Repris dans docs/CONTENT-VALIDATION.md. */
  readonly note?: string;
}

export const confirmed = <T>(value: T, note?: string): Field<T> => ({ status: 'confirmed', value, ...(note ? { note } : {}) });
export const fromBrief = <T>(value: T, note: string): Field<T> => ({ status: 'brief', value, note });
export const pending = <T>(value: T, note: string): Field<T> => ({ status: 'pending', value, note });
export const missing = <T = never>(note: string): Field<T> => ({ status: 'missing', note });

/** Vrai lorsque les contenus non validés peuvent être montrés (dev ou préproduction explicite). */
export function draftsVisible(env: { DEV?: boolean; PUBLIC_SHOW_DRAFTS?: string | undefined } = import.meta.env): boolean {
  return Boolean(env.DEV) || env.PUBLIC_SHOW_DRAFTS === 'true';
}

/** Valeur publiable : confirmée ou rapportée par le brief. */
export function publicValue<T>(field: Field<T>): T | undefined {
  return field.status === 'confirmed' || field.status === 'brief' ? field.value : undefined;
}

/** Valeur strictement confirmée (pour les données structurées, les mentions légales, etc.). */
export function confirmedValue<T>(field: Field<T>): T | undefined {
  return field.status === 'confirmed' ? field.value : undefined;
}

export interface Resolved<T> {
  value: T;
  /** Vrai si la valeur n'est visible que parce que les brouillons sont affichés. */
  draft: boolean;
  status: FieldStatus;
}

/**
 * Résout un champ pour l'affichage : renvoie la valeur publique, ou la valeur en attente
 * marquée comme brouillon si les brouillons sont visibles, sinon `undefined`.
 */
export function resolve<T>(field: Field<T>, showDrafts: boolean = draftsVisible()): Resolved<T> | undefined {
  const pub = publicValue(field);
  if (pub !== undefined) return { value: pub, draft: false, status: field.status };
  if (showDrafts && field.value !== undefined) return { value: field.value, draft: true, status: field.status };
  return undefined;
}
