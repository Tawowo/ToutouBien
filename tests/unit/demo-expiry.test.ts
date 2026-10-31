import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_DEMO_EXPIRES_AT,
  handleDemoRequest,
  isDemoExpired,
  isTechnicalAsset,
  parseExpiryDate,
  resolveDemoExpiry,
} from '../../middleware';

const DEADLINE = '2026-10-31T00:00:00+01:00';
const BEFORE = new Date('2026-10-30T22:59:59Z'); // 30 oct., 23:59:59 à Paris
const AFTER = new Date('2026-10-30T23:00:00Z'); // 31 oct., 00:00:00 à Paris

describe('date limite inscrite dans le code', () => {
  it('vaut le 31 octobre 2026 à 00:00, heure de Paris', () => {
    expect(parseExpiryDate(DEFAULT_DEMO_EXPIRES_AT)?.toISOString()).toBe('2026-10-30T23:00:00.000Z');
  });

  it('coupe la démo sans variable d’environnement', () => {
    expect(isDemoExpired(AFTER, undefined)).toBe(true);
    expect(isDemoExpired(AFTER, '')).toBe(true);
    expect(isDemoExpired(AFTER, '   ')).toBe(true);
  });
});

describe('logique d’expiration', () => {
  it('aucune date : jamais expirée', () => {
    expect(resolveDemoExpiry(undefined, '')).toBeNull();
    expect(isDemoExpired(new Date('2100-01-01'), undefined, '')).toBe(false);
  });

  it('date invalide : jamais expirée (pas de coupure par erreur)', () => {
    for (const bad of ['demain', '31/10/2026', '2026-02-30', '2026-13-01', '2026-10-31T25:00', 'NaN']) {
      expect(resolveDemoExpiry(bad), bad).toBeNull();
      expect(isDemoExpired(new Date('2100-01-01'), bad), bad).toBe(false);
    }
    expect(isDemoExpired(new Date('2100-01-01'), undefined, 'pas une date')).toBe(false);
  });

  it('avant la date : active ; à la date et après : expirée', () => {
    expect(isDemoExpired(BEFORE, DEADLINE)).toBe(false);
    expect(isDemoExpired(AFTER, DEADLINE)).toBe(true);
    expect(isDemoExpired(new Date('2027-01-01'), DEADLINE)).toBe(true);
  });

  it('« off » supprime l’expiration', () => {
    for (const off of ['off', 'OFF', ' Off ', 'false', '0']) {
      expect(resolveDemoExpiry(off), off).toBeNull();
      expect(isDemoExpired(new Date('2100-01-01'), off), off).toBe(false);
    }
  });

  it('une date future dans la variable rouvre la démo', () => {
    expect(isDemoExpired(AFTER, '2026-12-15')).toBe(false);
    expect(isDemoExpired(new Date('2026-12-15T00:00:00+01:00'), '2026-12-15')).toBe(true);
  });

  it('interprète les dates sans fuseau en heure de Paris (été comme hiver)', () => {
    expect(parseExpiryDate('2026-12-15')?.toISOString()).toBe('2026-12-14T23:00:00.000Z');
    expect(parseExpiryDate('2026-07-14T18:30')?.toISOString()).toBe('2026-07-14T16:30:00.000Z');
    expect(parseExpiryDate('2026-07-14T18:30:00Z')?.toISOString()).toBe('2026-07-14T18:30:00.000Z');
  });
});

describe('fichiers techniques', () => {
  it('laisse passer scripts, styles, polices et images', () => {
    for (const p of ['/_astro/index.abc.css', '/_astro/x.js', '/favicon.svg', '/icon-192.png', '/og-default.jpg', '/fonts/a.woff2', '/robots.txt']) {
      expect(isTechnicalAsset(p), p).toBe(true);
    }
  });

  it('ne laisse pas passer les pages', () => {
    for (const p of ['/', '/contact/', '/approche', '/index.html', '/blog/article/index.html', '/lien-expire/']) {
      expect(isTechnicalAsset(p), p).toBe(false);
    }
  });
});

describe('middleware', () => {
  afterEach(() => vi.unstubAllGlobals());

  const pages: Record<string, string> = {
    '/lien-expire/': '<html>Ce lien n’est plus disponible</html>',
    '/404.html': '<html>Page introuvable</html>',
  };

  function stubFetch() {
    const calls: Request[] = [];
    vi.stubGlobal('fetch', async (input: URL, init?: RequestInit) => {
      const req = new Request(input, init);
      calls.push(req);
      const body = pages[new URL(req.url).pathname];
      return body ? new Response(body, { status: 200 }) : new Response('', { status: 404 });
    });
    return calls;
  }

  const req = (path: string, headers?: HeadersInit) => new Request(`https://demo.example${path}`, headers ? { headers } : undefined);

  it('démo expirée : toute page répond 410 avec l’écran d’expiration', async () => {
    const calls = stubFetch();
    for (const path of ['/', '/contact/', '/approche/', '/page-inconnue/', '/index.html']) {
      const res = await handleDemoRequest(req(path), AFTER, undefined);
      expect(res.status, path).toBe(410);
      expect(await res.text()).toContain('n’est plus disponible');
      expect(res.headers.get('cache-control')).toContain('no-store');
      expect(res.headers.get('x-robots-tag')).toContain('noindex');
    }
    expect(calls.every((c) => c.headers.get('x-demo-expired-internal') === '1')).toBe(true);
  });

  it('démo expirée : les fichiers techniques passent', async () => {
    stubFetch();
    const res = await handleDemoRequest(req('/_astro/app.css'), AFTER, undefined);
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });

  it('démo expirée : la requête interne vers l’écran d’expiration passe', async () => {
    const res = await handleDemoRequest(req('/lien-expire/', { 'x-demo-expired-internal': '1' }), AFTER, undefined);
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });

  it('démo expirée : écran de secours si la page ne peut pas être lue', async () => {
    vi.stubGlobal('fetch', async () => {
      throw new Error('réseau');
    });
    const res = await handleDemoRequest(req('/'), AFTER, undefined);
    expect(res.status).toBe(410);
    expect(await res.text()).toContain('Le délai de consultation de cette démonstration a été atteint.');
  });

  it('démo active : les pages passent et /lien-expire/ répond 404', async () => {
    stubFetch();
    expect((await handleDemoRequest(req('/'), BEFORE, undefined)).headers.get('x-middleware-next')).toBe('1');
    expect((await handleDemoRequest(req('/'), AFTER, 'off')).headers.get('x-middleware-next')).toBe('1');
    for (const path of ['/lien-expire/', '/lien-expire']) {
      const res = await handleDemoRequest(req(path), BEFORE, undefined);
      expect(res.status).toBe(404);
      expect(await res.text()).toContain('Page introuvable');
    }
  });
});
