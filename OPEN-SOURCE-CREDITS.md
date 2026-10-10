# Crédits open source

Versions et licences relevées dans `node_modules` (10/10/2026). Aucun code de dépôt tiers n'a été copié dans
`src/` : la recherche (docs/RESEARCH-ROUND-2.md, 33 identifiants caractéristiques recherchés) n'a trouvé
aucune correspondance.

## Dépendances livrées avec le site

| Paquet | Version | Licence | Usage |
| --- | --- | --- | --- |
| astro | 7.3.8 | MIT | Générateur du site statique |
| @astrojs/sitemap | 3.7.4 | MIT | Plan du site |
| @astrojs/markdown-remark | 7.3.2 | MIT | Rendu des articles |
| three | 0.186.1 | MIT | Scène de particules de l'accueil (chargée à la demande) |
| @fontsource/instrument-serif | 5.3.0 | SIL OFL 1.1 | Police des titres |
| @fontsource-variable/instrument-sans | 5.3.0 | SIL OFL 1.1 | Police du texte |
| @fontsource/dm-mono | 5.3.0 | SIL OFL 1.1 | Police des étiquettes |

## Outils de développement (non livrés)

sharp 0.35.5 (Apache-2.0, optimisation d'images et script photo), vitest, @playwright/test 1.56.1 (Apache-2.0),
@axe-core/playwright (MPL-2.0), eslint et ses extensions (MIT), TypeScript (Apache-2.0).

## Inspirations (aucun code repris)

| Source | Licence | Ce qui a inspiré ToutouBien |
| --- | --- | --- |
| HYDR'EAUX SCAN (projet du même commanditaire, ZIP fourni) | Projet du commanditaire | Principe de qualité adaptative des scènes WebGL, réécrit (`src/scripts/flair/quality.ts`) |
| mulberry32 (générateur pseudo-aléatoire) | Domaine public | Implémentation de quelques lignes dans `src/scripts/flair/shapes.ts` |
| Dépôts étudiés au tour 2 (r3f-scroll-rig, the-substance, shaders-on-scroll, project-universe-, award-winning-website, shader-galaxy) | voir docs/RESEARCH-ROUND-2.md | Idées générales (lissage de progression, paliers, libération des ressources) ; deux dépôts sans licence n'ont servi qu'à l'étude |
