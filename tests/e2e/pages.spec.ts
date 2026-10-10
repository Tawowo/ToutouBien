import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = [
  '/',
  '/accompagnements/',
  '/accompagnements/chiot/',
  '/accompagnements/chien-adulte/',
  '/accompagnements/quotidien/',
  '/accompagnements/comprendre/',
  '/approche/',
  '/deroulement/',
  '/premier-rendez-vous/',
  '/tarifs/',
  '/faq/',
  '/questions/',
  '/orientation/',
  '/decodeur/',
  '/explorer/',
  '/explorer/flair/',
  '/explorer/distance/',
  '/explorer/signaux/',
  '/a-propos/',
  '/parlons-de-votre-chien/',
  '/contact/',
  '/mentions-legales/',
  '/confidentialite/',
  '/accessibilite/',
];

for (const path of PAGES) {
  test.describe(`page ${path}`, () => {
    test('se charge sans erreur, avec un h1 unique et des métadonnées', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page).toHaveTitle(/ToutouBien/);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description?.length ?? 0).toBeGreaterThan(50);
      expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(`https://toutoubien.example${path}`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });

    test('ne présente aucun défaut d’accessibilité détectable automatiquement', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
    });

    test('n’affiche aucun contenu non validé en production', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('[data-draft], .draft-badge')).toHaveCount(0);
      const text = await page.locator('body').innerText();
      expect(text).not.toMatch(/à confirmer|à valider|lorem|TODO/i);
    });
  });
}

test('tous les liens internes répondent', async ({ page, request }) => {
  const seen = new Set<string>();
  for (const path of PAGES) {
    await page.goto(path);
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute('href')!.split('#')[0]!));
    hrefs.forEach((h) => h && seen.add(h));
  }
  for (const href of seen) {
    const res = await request.get(href);
    expect(res.status(), href).toBe(200);
  }
});

test('l’ancienne adresse /accompagnement/ redirige vers /deroulement/', async ({ page }) => {
  await page.goto('/accompagnement/');
  await expect(page).toHaveURL(/\/deroulement\/$/);
});

test('page 404 dédiée', async ({ page }) => {
  const res = await page.goto('/cette-page-n-existe-pas/');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Le chemin');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('sans article publié, la section ressources n’est ni générée ni proposée', async ({ page, request }) => {
  expect((await request.get('/ressources/')).status()).toBe(404);
  expect((await request.get('/blog/')).status()).toBe(404);
  await page.goto('/');
  await expect(page.locator('a[href="/ressources/"]')).toHaveCount(0);
});

test('robots.txt et sitemap', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Disallow: /'); // indexation désactivée par défaut
  const index = await request.get('/sitemap-index.xml');
  expect(index.status()).toBe(200);
  const sitemap = await (await request.get('/sitemap-0.xml')).text();
  for (const p of PAGES) expect(sitemap).toContain(`https://toutoubien.example${p}`);
  expect(sitemap).not.toContain('404');
});

test('les données structurées ne contiennent que des informations confirmées', async ({ page }) => {
  await page.goto('/');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const data = blocks.map((b) => JSON.parse(b));
  const org = data.find((d) => d['@type'] === 'Organization' || d['@type'] === 'LocalBusiness');
  expect(org.name).toBe('ToutouBien');
  expect(org).not.toHaveProperty('telephone');
  expect(org).not.toHaveProperty('address');
  expect(org).not.toHaveProperty('aggregateRating');
});
