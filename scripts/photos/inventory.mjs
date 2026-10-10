#!/usr/bin/env node
/**
 * Génère docs/PHOTO-ASSETS.md : inventaire des photos de la photothèque (source, auteur, licence)
 * et des fichiers du site où chaque photo est utilisée (recherche de l'identifiant dans src/).
 * Usage : node scripts/photos/inventory.mjs
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const lib = JSON.parse(await readFile(path.join(root, 'src/content/photo-library.json'), 'utf8'));

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(astro|ts)$/.test(e.name)) out.push(p);
  }
  return out;
}
const files = await walk(path.join(root, 'src'));
const sources = await Promise.all(files.map(async (f) => [path.relative(root, f), await readFile(f, 'utf8')]));
const usage = (id) => sources.filter(([, s]) => s.includes(`'${id}'`) || s.includes(`"${id}"`)).map(([f]) => f.replace(/^src\//, ''));
const always = ['pages/galerie.astro (toutes les photos)', 'pages/credits-photos.astro (toutes les photos)'];

const rows = lib.map((p) => {
  const used = usage(p.id).filter((f) => !f.startsWith('content/photo-library'));
  return `| \`${p.id}\` | ${p.theme} | ${p.caption} | [${p.author.replace(/\|/g, '/')}](${p.authorUrl}) | [page d’origine](${p.sourceUrl}) | [${p.licence}](${p.licenceUrl}) | ${p.width}×${p.height}${p.cropped ? ', recadrée' : ''} | ${p.peopleIdentifiable ? 'oui' : 'non'} | ${used.length ? used.join('<br>') : '—'} |`;
});

const md = `# Photothèque : inventaire des photographies réellement intégrées

> Fichier généré par \`node scripts/photos/inventory.mjs\` le ${new Date().toISOString().slice(0, 10)}. Ne pas modifier à la main.

**${lib.length} photographies de chiens** sont intégrées localement dans \`src/assets/photos/library/\`
(optimisées au build en AVIF et WebP, chargement différé). Métadonnées complètes : \`src/content/photo-library.json\`.

## Source et licence

- **Source** : photos publiées sur Flickr par leurs auteurs, sélectionnées dans le jeu de données public
  **Google Open Images** (sous-ensembles *validation* et *test*), qui recense pour chaque image l’auteur,
  la page Flickr d’origine et la licence. Les fichiers ont été téléchargés depuis le dépôt public du jeu de données
  (\`open-images-dataset\`, 1024 px sur le grand côté).
- **Licence** : toutes sont recensées sous **Creative Commons Attribution 2.0** (CC BY 2.0) : réutilisation autorisée,
  y compris commerciale, **à condition de créditer l’auteur et d’indiquer la licence**. Les licences CC sont irrévocables
  pour les copies obtenues sous leur régime.
- **Attribution** : affichée sur chaque image (auteur + licence, liens vers la page d’origine et la licence), ou dans une
  ligne « Photos d’illustration » à proximité quand l’image est dans un lien ou une carte, et sur la page
  [/credits-photos/](/credits-photos/) accessible depuis le pied de page de toutes les pages.
- **Vérification** : la licence de chaque photo provient des métadonnées officielles d’Open Images (\`License\`) ;
  **la page Flickr d’origine n’a pas pu être consultée depuis l’environnement de travail** (accès réseau refusé),
  la licence n’a donc pas été revérifiée directement chez l’auteur. À faire avant la mise en ligne si possible
  (ouvrir chaque lien « page d’origine »).
- **Usage** : photos d’illustration uniquement. Elles ne montrent **ni Mme Petitgand, ni ses clients, ni des chiens
  qu’elle accompagne**, et ne sont jamais présentées comme telles. Les emplacements de son portrait et de la photo
  avec son chien restent réservés à ses propres photos.
- **Personnes identifiables** : quelques photos montrent une personne reconnaissable (colonne dédiée) ; elles ne sont
  pas utilisées dans les zones qui pourraient laisser croire qu’il s’agit de l’éducatrice ou de ses clients.
- **Sélection** : 979 candidates examinées visuellement ; écartées : chiens de police ou militaires, muselières,
  colliers coercitifs visibles, filigranes gênants, images floues ou trop sombres, situations ambiguës.

## Inventaire

En plus des emplacements listés, toutes les photos apparaissent dans ${always.join(' et ')}.

| Identifiant | Thème | Légende | Auteur | Source | Licence | Format | Personne identifiable | Utilisée dans |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${rows.join('\n')}

## Remplacer ou ajouter une photo

1. Déposer le fichier dans \`src/assets/photos/library/<identifiant>.jpg\`.
2. Ajouter son entrée dans \`src/content/photo-library.json\` (auteur, page d’origine, licence vérifiée, texte alternatif, point d’intérêt).
3. L’utiliser avec \`<Photo id="<identifiant>" />\` ; relancer \`node scripts/photos/inventory.mjs\`.

Les photos authentiques de l’activité (Mme Petitgand, ses séances) vont dans \`src/assets/photos/galerie/\` et, pour les
emplacements réservés (portrait, avec son chien), dans \`src/assets/photos/<identifiant-emplacement>.jpg\` : elles
remplacent automatiquement l’illustration correspondante.
`;
await writeFile(path.join(root, 'docs/PHOTO-ASSETS.md'), md);
console.log(`docs/PHOTO-ASSETS.md : ${lib.length} photos`);
