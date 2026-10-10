#!/usr/bin/env node
/**
 * Télécharge les photos illustratives listées dans manifest.json APRÈS vérification de leur
 * licence via l'API Wikimedia Commons (imageinfo + extmetadata).
 *
 * Règles :
 * - licences acceptées : CC0, domaine public, CC BY, CC BY-SA (usage commercial autorisé, attribution affichée) ;
 * - refus : NC, ND, licences inconnues, GFDL seule, fichiers trop petits (< 1400 px), formats non photo ;
 * - pour chaque emplacement, le premier candidat valide est retenu ; les refus sont expliqués ;
 * - les crédits vérifiés sont écrits dans src/content/photo-credits.json (affichés sous chaque photo).
 *
 * Usage : node scripts/photos/fetch-photos.mjs [--dry-run]
 * Réseau requis : commons.wikimedia.org et upload.wikimedia.org.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const dry = process.argv.includes('--dry-run');
const UA = 'ToutouBien-site/1.0 (photo licence check; contact via site)';
const API = 'https://commons.wikimedia.org/w/api.php';
const ACCEPT = [/^cc0/i, /^public domain/i, /^pd\b/i, /^cc by(-sa)? \d(\.\d)?/i];
const REJECT = [/\bnc\b/i, /\bnd\b/i, /non.?commercial/i, /no.?deriv/i];
const strip = (html = '') => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

async function info(title) {
  const url = `${API}?action=query&format=json&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=2400&titles=${encodeURIComponent(title)}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`API Commons ${res.status}`);
  const data = await res.json();
  const page = Object.values(data.query?.pages ?? {})[0];
  const ii = page?.imageinfo?.[0];
  if (!ii) throw new Error('fichier introuvable sur Commons');
  const m = ii.extmetadata ?? {};
  return {
    title,
    pageUrl: ii.descriptionurl,
    thumb: ii.thumburl ?? ii.url,
    width: ii.width,
    height: ii.height,
    mime: ii.mime,
    licence: strip(m.LicenseShortName?.value),
    licenceUrl: m.LicenseUrl?.value ?? '',
    author: strip(m.Artist?.value) || 'Auteur non indiqué',
    attributionRequired: m.AttributionRequired?.value !== 'false',
    restrictions: strip(m.Restrictions?.value),
  };
}

function verdict(i) {
  if (!/image\/(jpeg|png|webp)/.test(i.mime)) return `format ${i.mime} non retenu`;
  if (Math.max(i.width, i.height) < 1400) return `trop petit (${i.width}×${i.height})`;
  if (!i.licence) return 'licence absente';
  if (REJECT.some((r) => r.test(i.licence))) return `licence restrictive (${i.licence})`;
  if (!ACCEPT.some((r) => r.test(i.licence))) return `licence non reconnue (${i.licence})`;
  if (i.restrictions) return `restrictions signalées (${i.restrictions})`;
  return null;
}

const manifest = JSON.parse(await readFile(path.join(root, 'scripts/photos/manifest.json'), 'utf8'));
const creditsPath = path.join(root, 'src/content/photo-credits.json');
const credits = JSON.parse(await readFile(creditsPath, 'utf8').catch(() => '{}'));
await mkdir(path.join(root, 'src/assets/photos'), { recursive: true });
let failures = 0;

for (const [slot, candidates] of Object.entries(manifest.slots)) {
  let done = false;
  for (const title of candidates) {
    try {
      const i = await info(title);
      const why = verdict(i);
      if (why) {
        console.log(`✗ ${slot} · ${title} : ${why}`);
        continue;
      }
      console.log(`✓ ${slot} · ${title} · ${i.licence} · ${i.author}`);
      if (!dry) {
        const res = await fetch(i.thumb, { headers: { 'User-Agent': UA } });
        if (!res.ok) throw new Error(`téléchargement ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        await sharp(buf).rotate().resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(root, `src/assets/photos/${slot}.jpg`));
        credits[slot] = {
          author: i.author,
          sourceUrl: i.pageUrl,
          licence: i.licence,
          licenceUrl: i.licenceUrl,
          attributionRequired: i.attributionRequired,
          authentic: false,
          commonsTitle: title,
          verifiedAt: new Date().toISOString().slice(0, 10),
        };
      }
      done = true;
      break;
    } catch (e) {
      console.log(`✗ ${slot} · ${title} : ${e.message}`);
    }
  }
  if (!done) failures++;
}
if (!dry) await writeFile(creditsPath, JSON.stringify(credits, null, 2) + '\n');
console.log(failures ? `${failures} emplacement(s) sans photo valide : la composition graphique reste affichée.` : 'Toutes les photos sont vérifiées.');
