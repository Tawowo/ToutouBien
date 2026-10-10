# ToutouBien

Site de **ToutouBien**, activité d'éducation canine et d'accompagnement des propriétaires de chiens.
*« Une famille heureuse au quotidien »*

Site statique construit avec [Astro](https://astro.build) 7 et TypeScript, en CSS natif et sans framework JavaScript côté client.

> ⚠️ **Le site n'est pas encore publiable.** Les informations légales, les coordonnées et le service de formulaire restent à fournir. Lancez `npm run check:launch` pour voir ce qui manque, et consultez `docs/CONTENT-VALIDATION.md`.

## Démarrage

```bash
npm install
cp .env.example .env      # puis compléter si besoin
npm run dev               # http://localhost:4321 (contenus non validés visibles et marqués en orange)
```

Prérequis : Node.js ≥ 22.12.

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement (brouillons visibles) |
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Sert le build de production en local |
| `npm run lint` | ESLint (TypeScript + Astro) |
| `npm run check` | Vérification des types (`astro check`) |
| `npm test` | Tests unitaires (Vitest) |
| `npm run test:e2e` | Tests navigateur (Playwright + axe) sur un build de production |
| `npm run verify` | Lint + types + tests unitaires + build |
| `npm run check:launch` | **Contrôle de mise en ligne** : échoue tant qu'un élément bloquant manque |
| `node scripts/screenshots.mjs <url> <dossier> [largeur] [hauteur]` | Captures pleine page et détection des débordements |
| `node scripts/photos/fetch-photos.mjs [--dry-run]` | Télécharge les photos libres après vérification de leur licence (réseau requis) |
| URL `?quality=high\|medium\|low\|fallback` | Force le niveau de la scène d'accueil (tests, démonstration) |

Pour Playwright sur une autre machine : `npx playwright install chromium`.

## Configuration

### Informations de l'activité : `src/config/site.ts`

C'est **le seul fichier à modifier** pour les informations métier (nom public, coordonnées, zone, premier rendez-vous, prestations, mentions légales…). Chaque valeur porte un statut :

```ts
phone: missing('Numéro de téléphone professionnel à afficher.'),   // inconnu → masqué
free: pending(true, 'Gratuité à confirmer'),                         // à valider → masqué en production
places: fromBrief(['chez vous', 'en extérieur'], '…'),                // rapporté → affiché prudemment
phone: confirmed('06 12 34 56 78'),                                  // validé → affiché
```

Rien de ce qui n'est pas `confirmed` (ou `brief`) n'apparaît en production. Détails : `docs/CONTENT-VALIDATION.md`.

### Variables d'environnement

| Variable | Rôle |
| --- | --- |
| `PUBLIC_SITE_URL` | URL publique (canoniques, sitemap) |
| `PUBLIC_ALLOW_INDEXING` | `true` pour autoriser l'indexation (production uniquement) |
| `PUBLIC_SHOW_DRAFTS` | `true` pour afficher les contenus non validés (préproduction uniquement) |
| `PUBLIC_FORM_PROVIDER` | `formspree`, `web3forms` ou `custom` |
| `PUBLIC_FORM_ENDPOINT` | URL de réception (Formspree / custom) |
| `PUBLIC_WEB3FORMS_ACCESS_KEY` | Clé publique Web3Forms |

Aucun secret n'est nécessaire ni stocké dans le dépôt. Voir `.env.example` et `docs/DEPLOYMENT.md`.

### Formulaires

Les deux formulaires (« Parlons de votre chien » et Contact) envoient les demandes au fournisseur configuré (`src/lib/submit.ts`). Une confirmation n'est affichée **qu'après réception confirmée** par le fournisseur. Sans configuration, le site indique honnêtement que l'envoi en ligne n'est pas activé. Mise en place : `docs/DEPLOYMENT.md` §3.

## Modifier les contenus

### Ajouter un article
1. Créer `src/content/blog/mon-sujet.md` :
   ```md
   ---
   title: "Titre de l'article"
   description: "Résumé de 50 à 170 caractères, utilisé pour Google et les cartes."
   status: draft            # draft → review → published
   category: en-promenade   # au-quotidien | en-promenade | chiot | comprendre
   format: article          # article | fiche | guide
   ctaTopic: rappel         # sujet présélectionné dans le formulaire (facultatif)
   ---
   Texte en Markdown, avec des intertitres ## …
   ```
2. Relire en développement (`npm run dev`, adresse `/blog/mon-sujet/`).
3. Pour publier : `status: published` et `publishDate: 2026-11-15`.

Le blog, les catégories, le menu « Ressources », le sitemap et les articles liés se mettent à jour automatiquement. S'il n'y a aucun article publié, ces pages ne sont pas générées.

### Ajouter une photo

Photos libres : autoriser `commons.wikimedia.org` et `upload.wikimedia.org`, puis `node scripts/photos/fetch-photos.mjs` (licences vérifiées automatiquement ; `--dry-run` pour vérifier sans télécharger). Photos de Mme Petitgand : `src/assets/photos/galerie/` (voir le LISEZMOI du dossier).
Déposer `src/assets/photos/<identifiant>.jpg` pour l'un des emplacements de `src/content/photos.ts`, puis renseigner son crédit. Voir `docs/IMAGE-LICENCES-AND-CREDITS.md`.

### Modifier la FAQ
`src/content/faq.ts`. Les questions qui dépendent d'informations métier n'apparaissent que si ces informations sont validées.

## Structure

```
src/
  config/        site.ts (informations métier), forms.ts, navigation.ts
  content/       blog/*.md, photos.ts (registre photographique), faq.ts
  lib/           fields.ts (statuts), wizard.ts (parcours), submit.ts (envoi), seo.ts (JSON-LD)…
  components/    SiteHeader, SiteFooter, Plate/PlateArt (photos et illustrations), Fil (signature), …
  layouts/       Base.astro (métadonnées, SEO, CSP)
  pages/         accueil, accompagnements (+4), approche, déroulement, premier-rendez-vous, tarifs, faq, questions,
                 orientation, decodeur, explorer (+flair, distance, signaux), qui-suis-je, contact,
                 dossiers (+6 situations), galerie, blog (+articles, catégories), ressources,
                 parlons-de-votre-chien, légal, accessibilité, 404, robots.txt
  scripts/       flair/ (scène WebGL : timeline, scene, quality, shapes, hero), motion.ts (révélations,
                 ciels étoilés), lightbox.ts (visionneuse), explorer/, decodeur.ts,
                 orientation.ts, prep.ts, wizard.ts, contact.ts (amélioration progressive)
scripts/photos/  manifest.json + fetch-photos.mjs (photos libres à licence vérifiée via l'API Commons)
  styles/        global.css (système de design)
  assets/brand/  logo fourni + déclinaisons vectorisées
tests/           unit/ (Vitest), e2e/ (Playwright), launch/ (contrôle de mise en ligne)
docs/            documentation du projet (voir ci-dessous)
```

## Déploiement

Site statique : tout hébergeur de fichiers statiques convient. Build : `npm run build`, dossier publié : `dist`. Procédure complète, préproduction et mise en ligne : `docs/DEPLOYMENT.md`.

## Documentation

| Document | Contenu |
| --- | --- |
| [PROJECT-AUDIT](docs/PROJECT-AUDIT.md) | État initial, ressources, contraintes de l'environnement |
| [CREATIVE-AND-TECHNICAL-RESEARCH](docs/CREATIVE-AND-TECHNICAL-RESEARCH.md) | Références, techniques évaluées, sources |
| [ART-DIRECTION](docs/ART-DIRECTION.md) | Charte V3 issue du logo : couleurs, typographie, mouvement, règles |
| [STARS-GRAMMAR](docs/STARS-GRAMMAR.md) | Grammaire des étoiles : quand, pourquoi et comment elles apparaissent |
| [SITE-MAP-AND-EXPERIENCES](docs/SITE-MAP-AND-EXPERIENCES.md) | Cartographie des pages, expérience visuelle propre à chacune, état testé |
| [VISUAL-QUALITY-REVIEW](docs/VISUAL-QUALITY-REVIEW.md) | Grille de 12 critères, défauts trouvés et corrigés, captures avant/après |
| [RESEARCH-ROUND-2](docs/RESEARCH-ROUND-2.md) · [RESEARCH-CREATIVE-BENCHMARK](docs/RESEARCH-CREATIVE-BENCHMARK.md) | Dépôts étudiés, licences, patterns retenus |
| [BRAND-POSITIONING](docs/BRAND-POSITIONING.md) | Audit, positionnements comparés, proposition de valeur, système de mémorisation |
| [MARKETING-COMPETITOR-ANALYSIS](docs/MARKETING-COMPETITOR-ANALYSIS.md) | 123 références, observations, opportunités |
| [MARKETING-STRATEGY](docs/MARKETING-STRATEGY.md) | Publics, parcours, conversion, SEO, local, canaux, partenariats, budget |
| [EDITORIAL-GUIDELINES](docs/EDITORIAL-GUIDELINES.md) | Ton, vocabulaire, format « cinq temps », règles |
| [CONTENT-CALENDAR-90-DAYS](docs/CONTENT-CALENDAR-90-DAYS.md) · [LAUNCH-CAMPAIGN](docs/LAUNCH-CAMPAIGN.md) | Calendrier et contenus prêts à relire |
| [MARKETING-ROADMAP-90-DAYS](docs/MARKETING-ROADMAP-90-DAYS.md) · [MARKETING-METRICS](docs/MARKETING-METRICS.md) | Plan d'action et indicateurs |
| [IMAGE-LICENCES-AND-CREDITS](docs/IMAGE-LICENCES-AND-CREDITS.md) | Registre photo, licences, photos à demander |
| [CONTENT-VALIDATION](docs/CONTENT-VALIDATION.md) | Registre des informations à fournir et des textes à relire |
| [SEO-STRATEGY](docs/SEO-STRATEGY.md) | SEO technique, local, éditorial |
| [EDITORIAL-STRATEGY](docs/EDITORIAL-STRATEGY.md) | Calendrier sur 6 mois |
| [LAUNCH-AND-COMMUNICATION-PLAN](docs/LAUNCH-AND-COMMUNICATION-PLAN.md) | Lancement, priorités, indicateurs |
| [PRIVACY-AND-SECURITY](docs/PRIVACY-AND-SECURITY.md) | Données, CSP, anti-abus, cookies |
| [TEST-REPORT](docs/TEST-REPORT.md) | Tests exécutés, résultats, corrections |
| [PERFORMANCE-AND-ACCESSIBILITY](docs/PERFORMANCE-AND-ACCESSIBILITY.md) | Mesures Lighthouse, WCAG |
| [FUTURE-ROADMAP](docs/FUTURE-ROADMAP.md) | Évolutions et critères |
| [DEPLOYMENT](docs/DEPLOYMENT.md) | Hébergement, variables, formulaire, mise en ligne |
