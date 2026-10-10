# Performance et accessibilité

> **Mesures V3 (10/10/2026)** — Lighthouse 13.5, profil mobile (CPU ralenti ×4), build de production servi
> localement. Le WebGL de cet environnement est un rendu **logiciel** (SwiftShader) : le TBT de l'accueil
> est surestimé par rapport à un appareil doté d'une carte graphique.

| Page | Performance | Accessibilité | Bonnes pratiques | SEO* | LCP | TBT | CLS | Poids |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Accueil | 89 | 100 | 100 | 66 | 1,6 s | 450 ms | 0,001 | 268 Ko |
| Décodeur | 99 | 100 | 100 | 66 | 1,8 s | 0 ms | 0,001 | 139 Ko |
| Le monde par le nez | 100 | 100 | 100 | 66 | 1,7 s | 20 ms | 0 | 133 Ko |
| Accompagnements | 100 | 100 | 100 | 66 | 1,7 s | 0 ms | 0,002 | 125 Ko |
| Tarifs | 100 | 100 | 100 | 66 | 1,7 s | 0 ms | 0,012 | 124 Ko |

\* SEO 66 : l'indexation est **volontairement désactivée** avant validation (robots + `noindex`).

Avant corrections, l'accueil mesurait **56** (CLS 0,386, TBT 1 360 ms). Gains obtenus par : décision du mode
de la scène avant le premier rendu, chargement de three.js et test des capacités au repos du navigateur,
palier léger sur téléphone et en rendu logiciel, repli sans saut de page, rendu suspendu hors écran.

---

## Historique (V1-V2)


## Mesures de performance (laboratoire)

Lighthouse 13.5 en local (`astro preview`), Chromium sans interface. **Ce sont des mesures de laboratoire** (réseau et processeur simulés), pas des données réelles d'utilisateurs : celles-ci viendront de la Search Console après la mise en ligne.

### Mobile (profil par défaut : réseau 4G lent simulé, processeur ralenti ×4)

| Page | Performance | Accessibilité | Bonnes pratiques | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- |
| Accueil | 99 | 100 | 100 | 1,8 s | 0 | 0 ms |
| L'accompagnement | 99 | 100 | 100 | 1,8 s | 0,02 | 0 ms |
| Parlons de votre chien | 99 | 100 | 100 | 2,0 s | 0 | 0 ms |
| Contact | 99 | 100 | 100 | 2,0 s | 0,002 | 0 ms |
| Mentions légales | 100 | 100 | 100 | 1,7 s | 0 | 0 ms |

### Ordinateur (préréglage `desktop`)

| Page | Performance | LCP | CLS |
| --- | --- | --- | --- |
| Accueil | 100 | 0,4 s | 0 |
| L'accompagnement | 100 | 0,4 s | 0,026 |
| Parlons de votre chien | 100 | 0,4 s | 0 |
| Contact | 100 | 0,4 s | 0,041 |
| Mentions légales | 100 | 0,4 s | 0 |

Sur trois passages successifs, le LCP mobile de l'accueil est stable à 1,8 s.

**Score SEO** : 66 en préproduction (seul audit en échec : « page bloquée à l'indexation », voulu) ; **100** sur un build avec indexation autorisée.

### Comparaison avec les objectifs

| Indicateur | Objectif (75ᵉ centile terrain) | Mesuré en laboratoire |
| --- | --- | --- |
| LCP | ≤ 2,5 s | 1,7 à 2,0 s en mobile simulé, 0,4 s sur ordinateur ✅ |
| INP | ≤ 200 ms | Non mesurable en laboratoire. Indicateur indirect : TBT = 0 ms et seulement 2 petits scripts (menu, formulaires) ✅ |
| CLS | ≤ 0,1 | 0 à 0,041 ✅ |

### Ce qui a été fait pour y arriver

- **Aucun framework JavaScript côté client.** JS limité au menu mobile (en ligne, quelques lignes) et aux formulaires (module chargé uniquement sur les pages concernées).
- **Animations en CSS** (`animation-timeline`), exécutées hors du fil principal ; aucun gestionnaire d'événement `scroll`.
- **CSS intégré au HTML** (`inlineStylesheets: 'always'`) : supprime la requête bloquante. Effet mesuré sur l'accueil mobile : LCP passé de 2,1 s à 1,1 s avant l'ajout du préchargement des polices.
- **Polices hébergées sur le site**, sous-ensemble latin (environ 62 Ko pour Fraunces romain, 30 Ko pour Instrument Sans), `font-display: swap`, **préchargement des deux fichiers principaux**. Arbitrage : le préchargement fait remonter le LCP mobile de 1,1 à 1,8 s en simulation, mais supprime les décalages de mise en page (CLS de 0,06 à 0,085 auparavant sur deux pages). Les deux restent dans les objectifs.
- **Illustrations en SVG** (quelques Ko) au lieu de photos lourdes. Pour les futures photos, `<Picture>` génère AVIF et WebP en 4 largeurs, avec dimensions réservées et chargement différé hors du premier écran (`priority` sur l'image principale).
- Poids total d'une page : environ 200 Ko (non compressé, polices incluses).

### Points d'attention

- L'ajout de photos est le principal risque pour le LCP : toujours passer par `src/assets/photos/` (optimisation automatique), jamais par `public/`.
- Le HTML de l'accueil pèse environ 150 Ko non compressés (CSS intégré et emblème SVG présent plusieurs fois). La compression gzip ou brotli de l'hébergeur le réduit fortement. Si le site grossit, on pourra repasser `inlineStylesheets` sur `auto`.

## Accessibilité (WCAG 2.2 AA, dans la mesure applicable)

### Vérifié automatiquement

- **axe-core** (règles WCAG 2.0/2.1/2.2 A et AA) : **0 violation** sur les 7 pages, sur ordinateur et mobile.
- **Lighthouse accessibilité** : 100 sur toutes les pages mesurées.
- Contrastes calculés pour chaque couleur de texte et d'interface (voir `ART-DIRECTION.md`) : tous ≥ 4,5:1 pour le texte, ≥ 3:1 pour les indicateurs.

### Mis en œuvre

| Critère | Implémentation |
| --- | --- |
| Structure | Repères `header`, `nav` (étiquetés), `main`, `footer` ; un h1 par page, hiérarchie respectée |
| Lien d'évitement | « Aller au contenu », premier élément focalisable |
| Focus visible | Contour de 3 px (sarcelle sur fond clair, lagon sur fond sombre), jamais supprimé |
| Clavier | Tout est utilisable au clavier ; Entrée dans un champ passe à l'étape suivante ; Échap ferme le menu et rend le focus |
| Menu | Bouton avec `aria-expanded` et `aria-controls`, libellé « Menu » / « Fermer » |
| Formulaires | Étiquettes visibles ; « (obligatoire) » / « (facultatif) » en texte ; groupes de choix en `fieldset` + `legend` ; erreurs reliées par `aria-describedby`, `aria-invalid`, **récapitulatif des erreurs** en `role="alert"` avec liens vers les champs ; focus déplacé sur le titre de chaque étape ; progression textuelle « Étape 2 sur 6 » avec `aria-current="step"` |
| États | Jamais signalés par la seule couleur : icône « ! » + texte pour les erreurs, coche pour les choix sélectionnés |
| Zones tactiles | ≥ 44 px pour les boutons, liens de navigation, choix et boutons « Modifier » |
| Mouvement | `prefers-reduced-motion` respecté (aucune animation, test automatique) ; aucune information transmise uniquement par une animation |
| Sans JavaScript | Navigation visible, accordéons natifs (`details`), formulaire utilisable d'un seul tenant |
| Images | Illustrations décoratives `aria-hidden` ; textes alternatifs prévus pour chaque photo (registre) |
| Langue | `lang="fr"` ; typographie française (espaces insécables) |
| Reflow | Aucun débordement à 320 px de large |

### Limites et problèmes non résolus

- **Lecteurs d'écran réels** : non testés (aucun disponible dans l'environnement). À faire avec VoiceOver (iOS) et NVDA avant la mise en ligne, en particulier sur le parcours par étapes.
- **Safari et Firefox** : non testés (seul Chromium est disponible).
- Les choix en « pastilles » superposent un `input` transparent à l'étiquette : ce motif est accessible (vérifié par axe et par les tests par rôle), mais mérite une vérification avec un lecteur d'écran mobile.
- Les tests automatiques couvrent environ un tiers des critères WCAG : **ils ne remplacent pas un audit manuel**.
