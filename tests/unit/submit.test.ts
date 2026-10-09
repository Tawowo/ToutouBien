import { describe, expect, it, vi } from 'vitest';
import { readFormConfig } from '~/config/forms';
import { buildPayload, submitForm } from '~/lib/submit';

const submission = { subject: 'Test', fields: { Prénom: 'Léa' }, replyTo: 'lea@exemple.fr' };

describe('readFormConfig', () => {
  it('reste désactivé sans configuration complète', () => {
    expect(readFormConfig({})).toBeNull();
    expect(readFormConfig({ PUBLIC_FORM_PROVIDER: 'formspree' })).toBeNull();
    expect(readFormConfig({ PUBLIC_FORM_PROVIDER: 'formspree', PUBLIC_FORM_ENDPOINT: 'http://insecure.test' })).toBeNull();
    expect(readFormConfig({ PUBLIC_FORM_PROVIDER: 'web3forms' })).toBeNull();
    expect(readFormConfig({ PUBLIC_FORM_PROVIDER: 'inconnu', PUBLIC_FORM_ENDPOINT: 'https://x.test' })).toBeNull();
  });

  it('lit les fournisseurs pris en charge', () => {
    expect(readFormConfig({ PUBLIC_FORM_PROVIDER: 'formspree', PUBLIC_FORM_ENDPOINT: 'https://formspree.io/f/abc' })).toEqual({ provider: 'formspree', endpoint: 'https://formspree.io/f/abc' });
    expect(readFormConfig({ PUBLIC_FORM_PROVIDER: 'web3forms', PUBLIC_WEB3FORMS_ACCESS_KEY: 'k' })?.endpoint).toBe('https://api.web3forms.com/submit');
  });
});

describe('buildPayload', () => {
  it('adapte les champs techniques au fournisseur', () => {
    expect(buildPayload({ provider: 'formspree', endpoint: 'https://f.test' }, submission)).toMatchObject({ _subject: 'Test', _replyto: 'lea@exemple.fr', Prénom: 'Léa' });
    expect(buildPayload({ provider: 'web3forms', endpoint: 'https://w.test', accessKey: 'k' }, submission)).toMatchObject({ access_key: 'k', subject: 'Test', replyto: 'lea@exemple.fr' });
  });
});

describe('submitForm', () => {
  const config = { provider: 'custom' as const, endpoint: 'https://forms.test/submit' };
  const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

  it('ne prétend jamais avoir envoyé sans configuration', async () => {
    expect(await submitForm(null, submission)).toEqual({ ok: false, reason: 'not-configured' });
  });

  it('confirme uniquement sur réponse positive du fournisseur', async () => {
    const fetchOk = vi.fn().mockResolvedValue(json(200, { ok: true }));
    expect(await submitForm(config, submission, fetchOk)).toEqual({ ok: true });
    expect(fetchOk).toHaveBeenCalledWith(config.endpoint, expect.objectContaining({ method: 'POST' }));
  });

  it('traite un refus explicite comme un échec', async () => {
    expect(await submitForm(config, submission, vi.fn().mockResolvedValue(json(200, { success: false, message: 'Clé invalide' })))).toEqual({ ok: false, reason: 'rejected', message: 'Clé invalide' });
    expect((await submitForm(config, submission, vi.fn().mockResolvedValue(json(422, {})))).ok).toBe(false);
  });

  it('signale une erreur réseau', async () => {
    expect(await submitForm(config, submission, vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))).toEqual({ ok: false, reason: 'network' });
  });
});
