/**
 * Contrôle de mise en ligne. Échoue tant qu'un élément bloquant manque.
 * Lancer avec les variables d'environnement de production : `npm run check:launch`.
 */
import { describe, expect, it } from 'vitest';
import { site } from '~/config/site';
import { readFormConfig } from '~/config/forms';
import { confirmedValue, type Field } from '~/lib/fields';
import { PHOTO_SLOTS, photoFor, type PhotoCredit } from '~/content/photos';

const env = import.meta.env as Record<string, string | undefined>;
const missingLabel = (label: string, f: Field<unknown>) => (confirmedValue(f) === undefined ? [`${label} — ${f.note ?? ''}`] : []);

describe('Éléments bloquants avant publication', () => {
  it('URL publique définie', () => {
    expect(env.PUBLIC_SITE_URL ?? '', 'Définir PUBLIC_SITE_URL').toMatch(/^https:\/\/(?!toutoubien\.example)/);
  });

  it('formulaire réellement relié à un service d’envoi', () => {
    expect(readFormConfig(env), 'Configurer PUBLIC_FORM_PROVIDER (voir docs/DEPLOYMENT.md)').not.toBeNull();
  });

  it('mentions légales complètes', () => {
    const l = site.legal;
    const gaps = [
      ...missingLabel('Éditeur', l.publisherName),
      ...missingLabel('Statut juridique', l.legalForm),
      ...missingLabel('SIRET', l.siret),
      ...missingLabel('Adresse', l.address),
      ...missingLabel('Directeur·rice de publication', l.publicationDirector),
      ...missingLabel('Hébergeur', l.host),
      ...missingLabel('Médiateur de la consommation', l.mediator),
      ...missingLabel('Durée de conservation', l.retention),
      ...(confirmedValue(site.contact.phone) || confirmedValue(site.contact.email) ? [] : ['Téléphone ou e-mail de contact']),
    ];
    expect(gaps).toEqual([]);
  });

  it('chaque photo déposée a un crédit et une licence', () => {
    const uncredited = Object.values(PHOTO_SLOTS)
      .filter((slot) => photoFor(slot.id) && !(slot as { credit?: PhotoCredit }).credit)
      .map((slot) => slot.id);
    expect(uncredited).toEqual([]);
  });

  it('indexation autorisée et brouillons masqués', () => {
    expect(env.PUBLIC_ALLOW_INDEXING).toBe('true');
    expect(env.PUBLIC_SHOW_DRAFTS).not.toBe('true');
  });
});

describe('Recommandé (non bloquant, mais à traiter rapidement)', () => {
  it.each([
    ['Nom public de l’éducatrice', site.educator.displayName],
    ['Présentation de l’éducatrice', site.educator.intro],
    ['Zone d’intervention', site.serviceArea.label],
    ['Conditions du premier rendez-vous (gratuité)', site.firstMeeting.free],
    ['Prestations', site.services],
  ] as [string, Field<unknown>][])('%s', (label, field) => {
    if (confirmedValue(field) === undefined) console.warn(`⚠ À compléter : ${label} — ${field.note}`);
    expect(true).toBe(true);
  });
});
