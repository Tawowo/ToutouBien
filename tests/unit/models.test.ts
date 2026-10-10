import { describe, expect, it } from 'vitest';
import { getCollection } from 'astro:content';
import { isComplete, noteFor, orient, QUESTIONS } from '~/lib/orientation';
import { DEFAULT_STATE, readPosture, cuesSentence, SCENARIOS } from '~/lib/signaux';
import { SCENTS, scentAt, sniff, distanceTo, levelWord } from '~/lib/flair-field';
import { thresholds, zoneFor } from '~/lib/distance';
import { pickTier, lowerTier, tierFromQuery, type Capabilities } from '~/scripts/flair/quality';
import { TOPICS } from '~/lib/wizard';

describe('orientation', () => {
  it('ne se déclare complet qu’avec les quatre réponses', () => {
    expect(isComplete({ concerns: [] })).toBe(false);
    expect(isComplete({ stage: 'installe', concerns: ['rappel'], feeling: 'curieux', wish: 'lire' })).toBe(true);
  });

  it('oriente un chiot vers l’accompagnement chiot', () => {
    const r = orient({ stage: 'chiot-arrive', concerns: ['mordille'], feeling: 'fatigue', wish: 'parler' });
    expect(r.accompagnement).toBe('chiot');
    expect(r.articles[0]).toBe('arrivee-chiot-premieres-semaines');
    expect(r.articles).toContain('chiot-qui-mordille');
    expect(r.care).toBe(false);
  });

  it('oriente la solitude vers les difficultés du quotidien', () => {
    expect(orient({ stage: 'installe', concerns: ['solitude'], feeling: 'perplexe', wish: 'lire' }).accompagnement).toBe('quotidien');
  });

  it('sans souci précis, propose de mieux comprendre', () => {
    expect(orient({ stage: 'installe', concerns: ['comprendre'], feeling: 'curieux', wish: 'lire' }).accompagnement).toBe('comprendre');
  });

  it('affiche le message de prudence en cas d’inquiétude ou pour un chien âgé', () => {
    expect(orient({ stage: 'installe', concerns: ['inquietude'], feeling: 'inquiet', wish: 'parler' }).care).toBe(true);
    expect(orient({ stage: 'senior', concerns: ['comprendre'], feeling: 'curieux', wish: 'lire' }).care).toBe(true);
  });

  it('ne propose que des sujets et articles qui existent', async () => {
    const slugs = (await getCollection('blog')).map((a) => a.id);
    const topics = TOPICS.map((t) => t.value);
    for (const stage of QUESTIONS[0].options)
      for (const c of QUESTIONS[1].options) {
        const r = orient({ stage: stage.id, concerns: [c.id], feeling: 'curieux', wish: 'preparer' });
        r.articles.forEach((s) => expect(slugs).toContain(s));
        expect(topics).toContain(r.topic);
        expect(r.articles.length).toBeLessThanOrEqual(4);
      }
  });

  it('reformule prudemment et limite la note transmise', () => {
    const note = noteFor({ stage: 'adopte', concerns: ['promenade', 'rappel'], feeling: 'fatigue', wish: 'parler' });
    expect(note).toMatch(/^D’après le parcours/);
    expect(note).toContain('Vous indiquez');
    expect(note.length).toBeLessThanOrEqual(600);
  });
});

describe('signaux', () => {
  it('lit le scénario par défaut et normalise la jauge', () => {
    const r = readPosture(DEFAULT_STATE, SCENARIOS[0]!.context);
    const sum = Object.values(r.share).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 5);
    expect(r.caution).toMatch(/indicative/);
  });

  it('chaque scénario produit une lecture', () => {
    for (const s of SCENARIOS) expect(readPosture(s.state, s.context).title.length).toBeGreaterThan(0);
  });

  it('formule les indices en français', () => {
    expect(cuesSentence([])).toMatch(/Aucun indice/);
    expect(cuesSentence(['a', 'b', 'c'])).toBe('Indices observés : a, b et c.');
  });
});

describe('champ olfactif', () => {
  const calm = { angle: 0, strength: 0 };
  it('est maximal à la source', () => {
    for (const s of SCENTS) {
      expect(scentAt(s, s.x, s.y, calm)).toBeCloseTo(s.strength, 5);
      expect(distanceTo(s, s.x, s.y)).toBe(0);
    }
  });

  it('le vent porte l’odeur dans sa direction, pas à contre-vent', () => {
    const s = SCENTS[0]!;
    const wind = { angle: 0, strength: 0.8 };
    expect(scentAt(s, s.x + 0.15, s.y, wind)).toBeGreaterThan(scentAt(s, s.x - 0.15, s.y, wind));
  });

  it('borne le niveau perçu et le décrit', () => {
    const r = sniff(0.5, 0.5, calm);
    expect(r.level).toBeGreaterThanOrEqual(0);
    expect(r.level).toBeLessThanOrEqual(1);
    expect(levelWord(0.9)).toBe('forte');
    expect(levelWord(0)).toBe('à peine perceptible');
  });
});

describe('distance de confort', () => {
  it('une journée chargée réduit la marge, un passage en arc l’augmente', () => {
    const base = thresholds('chien', 'normale');
    expect(thresholds('chien', 'chargee').comfort).toBeGreaterThan(base.comfort);
    expect(thresholds('chien', 'normale', true).comfort).toBeLessThan(base.comfort);
  });

  it('classe les distances en trois zones ordonnées', () => {
    const t = thresholds('velo', 'normale');
    expect(zoneFor(0.99, t)).toBe('aise');
    expect(zoneFor((t.comfort + t.alert) / 2, t)).toBe('vigilant');
    expect(zoneFor(0, t)).toBe('deborde');
  });
});

describe('qualité 3D adaptative', () => {
  const desk: Capabilities = { webgl2: true, reducedMotion: false, saveData: false, cores: 8, memoryGb: 8, coarsePointer: false, width: 1440 };
  it('choisit le palier selon l’appareil', () => {
    expect(pickTier(desk)).toBe('high');
    expect(pickTier({ ...desk, reducedMotion: true })).toBe('fallback');
    expect(pickTier({ ...desk, webgl2: false })).toBe('fallback');
    expect(pickTier({ ...desk, coarsePointer: true, width: 390 })).toBe('low');
    expect(pickTier({ ...desk, cores: 4 })).toBe('medium');
  });

  it('descend d’un palier et lit la surcharge d’URL', () => {
    expect(lowerTier('high')).toBe('medium');
    expect(lowerTier('low')).toBe('fallback');
    expect(tierFromQuery('?quality=low')).toBe('low');
    expect(tierFromQuery('?quality=ultra')).toBeNull();
  });
});

describe('parcours de lecture', () => {
  it('ne référencent que des articles existants', async () => {
    const { READING_PATHS } = await import('~/content/paths');
    const slugs = (await getCollection('blog')).map((a) => a.id);
    for (const p of READING_PATHS) p.articles.forEach((s) => expect(slugs).toContain(s));
  });
});
