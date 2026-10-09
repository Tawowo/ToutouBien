// Captures pleine page pour la revue visuelle.
// Usage : node scripts/screenshots.mjs http://localhost:4321 ./captures [largeur] [hauteur] [chemins…]
// Signale aussi les débordements horizontaux et les erreurs de console.
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const [, , base = 'http://localhost:4321', outDir = 'captures', w = '1440', h = '900', ...rest] = process.argv;
const paths = rest.length ? rest : ['/', '/accompagnement/', '/a-propos/', '/parlons-de-votre-chien/', '/contact/', '/mentions-legales/', '/confidentialite/'];
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(w), height: Number(h) }, reducedMotion: 'reduce' });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));
for (const path of paths) {
  const res = await page.goto(base + path, { waitUntil: 'networkidle' });
  const name = path.replace(/\//g, '_').replace(/^_|_$/g, '') || 'accueil';
  await page.screenshot({ path: `${outDir}/${w}-${name}.png`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(`${path} → ${res?.status()} · débordement horizontal : ${overflow}px`);
}
console.log(errors.length ? `Erreurs console :\n${errors.join('\n')}` : 'Aucune erreur console.');
await browser.close();
