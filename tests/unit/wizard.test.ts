import { describe, expect, it } from 'vitest';
import { joinFr, rephrase, summaryFields, topicFromQuery, validateAll, validateStep, isEmail, isPhone, type WizardAnswers } from '~/lib/wizard';

const base: WizardAnswers = { topics: [], contexts: [] };

describe('joinFr', () => {
  it('joint une liste à la française', () => {
    expect(joinFr([])).toBe('');
    expect(joinFr(['a'])).toBe('a');
    expect(joinFr(['a', 'b'])).toBe('a et b');
    expect(joinFr(['a', 'b', 'c'])).toBe('a, b et c');
  });
});

describe('validation', () => {
  it('exige au moins un sujet', () => {
    expect(validateStep('situation', base).topics).toBeTruthy();
    expect(validateStep('situation', { ...base, topics: ['rappel'] })).toEqual({});
  });

  it('rend facultatives les étapes chien, contexte et lieu', () => {
    expect(validateStep('chien', base)).toEqual({});
    expect(validateStep('contexte', base)).toEqual({});
    expect(validateStep('lieu', base)).toEqual({});
  });

  it('exige prénom, moyen de contact cohérent et consentement', () => {
    const e = validateStep('contact', base);
    expect(e.firstName).toBeTruthy();
    expect(e.contactMethod).toBeTruthy();
    expect(e.consent).toBeTruthy();
    const phoneMissing = validateStep('contact', { ...base, firstName: 'Léa', contactMethod: 'telephone', consent: true });
    expect(phoneMissing.phone).toBeTruthy();
    const ok = validateStep('contact', { ...base, firstName: 'Léa', contactMethod: 'telephone', phone: '06 12 34 56 78', consent: true });
    expect(ok).toEqual({});
    const emailOk = validateStep('contact', { ...base, firstName: 'Léa', contactMethod: 'email', email: 'lea@exemple.fr', consent: true });
    expect(emailOk).toEqual({});
  });

  it('refuse les textes trop longs', () => {
    expect(validateStep('lieu', { ...base, message: 'x'.repeat(1201) }).message).toBeTruthy();
    expect(validateStep('chien', { ...base, dogName: 'x'.repeat(41) }).dogName).toBeTruthy();
  });

  it('valide l’ensemble du parcours', () => {
    expect(Object.keys(validateAll(base))).toEqual(expect.arrayContaining(['topics', 'firstName', 'consent']));
  });

  it('reconnaît e-mails et téléphones plausibles', () => {
    expect(isEmail('nom@exemple.fr')).toBe(true);
    expect(isEmail('nom@exemple')).toBe(false);
    expect(isPhone('+33 6 12 34 56 78')).toBe(true);
    expect(isPhone('1234')).toBe(false);
  });
});

describe('reformulation prudente', () => {
  const answers: WizardAnswers = {
    ...base,
    dogName: 'Filou',
    age: 'jeune',
    topics: ['marche-en-laisse', 'congeneres', 'chiot'],
    contexts: ['promenade', 'chiens'],
    since: 'mois',
  };

  it('reprend uniquement les déclarations', () => {
    const lines = rephrase(answers);
    expect(lines).toContain('Vous nous parlez d’un jeune chien (6 mois à 2 ans).');
    expect(lines).toContain('Vous indiquez que votre chien, Filou, tire en laisse et réagit fortement lorsqu’il croise d’autres chiens.');
    expect(lines).toContain('Un chiot arrive ou vient d’arriver chez vous.');
    expect(lines).toContain('Vous l’observez notamment en promenade et en présence d’autres chiens, depuis quelques mois.');
  });

  it('ne contient jamais de qualification ou de diagnostic', () => {
    const all = [rephrase(answers), rephrase({ ...base, topics: ['inquietude', 'excitation', 'solitude'], safety: 'oui' })].flat().join(' ').toLowerCase();
    for (const word of ['agressi', 'dominant', 'diagnostic', 'dangereux', 'anxiété de séparation', 'trouble']) {
      expect(all).not.toContain(word);
    }
  });

  it('signale prudemment une blessure déclarée', () => {
    expect(rephrase({ ...base, topics: ['autre'], safety: 'oui' }).join(' ')).toContain('nous en parlerons en priorité');
  });

  it('ne renvoie rien sans réponse', () => {
    expect(rephrase(base)).toEqual([]);
  });
});

describe('résumé et préremplissage', () => {
  it('liste les champs renseignés avec leur étape', () => {
    const rows = summaryFields({ ...base, firstName: 'Léa', topics: ['rappel'], contactMethod: 'email', email: 'lea@exemple.fr' });
    expect(rows.map((r) => r.label)).toEqual(['Sujets', 'Prénom', 'Être recontacté·e', 'E-mail']);
    expect(rows.find((r) => r.label === 'Sujets')?.step).toBe('situation');
  });

  it('n’accepte que des sujets connus via ?sujet=', () => {
    expect(topicFromQuery('rappel')).toBe('rappel');
    expect(topicFromQuery('<script>')).toBeUndefined();
    expect(topicFromQuery(null)).toBeUndefined();
  });
});
