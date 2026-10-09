import { describe, expect, it } from 'vitest';
import { confirmed, confirmedValue, fromBrief, missing, pending, publicValue, resolve } from '~/lib/fields';
import { validateContact } from '~/lib/contact';
import { site } from '~/config/site';

describe('statuts de contenu', () => {
  it('ne publie que le confirmé et le brief', () => {
    expect(publicValue(confirmed('a'))).toBe('a');
    expect(publicValue(fromBrief('b', 'n'))).toBe('b');
    expect(publicValue(pending('c', 'n'))).toBeUndefined();
    expect(publicValue(missing('n'))).toBeUndefined();
  });

  it('réserve les données structurées au strictement confirmé', () => {
    expect(confirmedValue(fromBrief('b', 'n'))).toBeUndefined();
  });

  it('montre les brouillons uniquement si demandé, avec marquage', () => {
    expect(resolve(pending('c', 'n'), false)).toBeUndefined();
    expect(resolve(pending('c', 'n'), true)).toEqual({ value: 'c', draft: true, status: 'pending' });
    expect(resolve(missing('n'), true)).toBeUndefined();
  });
});

describe('configuration de l’activité', () => {
  it('ne contient aucune coordonnée ou donnée juridique non confirmée publiable', () => {
    for (const field of [site.contact.phone, site.contact.email, site.legal.siret, site.legal.address, site.serviceArea.label]) {
      expect(field.status === 'confirmed' || field.status === 'missing').toBe(true);
    }
  });

  it('garde la gratuité du premier rendez-vous hors publication tant qu’elle n’est pas confirmée', () => {
    expect(['pending', 'confirmed']).toContain(site.firstMeeting.free.status);
  });
});

describe('formulaire de contact', () => {
  it('exige un moyen de réponse, un message et le consentement', () => {
    const e = validateContact({});
    expect(Object.keys(e)).toEqual(expect.arrayContaining(['name', 'email', 'message', 'consent']));
    expect(validateContact({ name: 'Léa', phone: '0612345678', message: 'Bonjour', consent: true })).toEqual({});
  });
});
