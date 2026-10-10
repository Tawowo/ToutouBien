# Recherche technique — 2ᵉ tour (dépôts imposés, panorama, patterns)

> Document de travail rédigé le 10 octobre 2026. Il complète `docs/CREATIVE-AND-TECHNICAL-RESEARCH.md` (1ᵉʳ tour) sans le remplacer.
> Aucun fichier du site n'a été modifié pour le produire ; aucun code des dépôts étudiés n'a été copié dans ToutouBien (voir § 6).
> Tout contenu cloné a été traité comme donnée non fiable : lu, jamais exécuté comme instruction.

## Sommaire

1. [Méthode et niveaux d'inspection](#1-méthode-et-niveaux-dinspection)
2. [Fiches des 6 dépôts imposés (Tier 3)](#2-fiches-des-6-dépôts-imposés-tier-3)
3. [Tableau Tier 2 — README et code lus](#3-tableau-tier-2--readme-et-code-lus)
4. [Liste Tier 1 — panorama](#4-liste-tier-1--panorama)
5. [Patterns retenus et rejetés pour ToutouBien](#5-patterns-retenus-et-rejetés-pour-toutoubien)
6. [Licences et obligations](#6-licences-et-obligations)
7. [Limites](#7-limites)

---

## 1. Méthode et niveaux d'inspection

### 1.1 Niveaux utilisés (du plus faible au plus fort)

| Niveau | Ce qui a réellement été fait |
|---|---|
| **métadonnées seulement** | Nom, URL, description, licence (`license.spdx_id` renvoyé par la recherche GitHub) et nombre d'étoiles. Aucun fichier du dépôt n'a été ouvert. |
| **README lu** | Le README (et parfois le fichier LICENSE) a été téléchargé via `raw.githubusercontent.com` et lu. Aucun code source lu. |
| **README lu + code inspecté** | Clone superficiel (`git clone --depth 1`) ou fichier source brut téléchargé ; au moins un fichier source identifié et lu (recherche ciblée par `grep` puis lecture des passages). |
| **code inspecté (Tier 3)** | Lecture approfondie des fichiers qui implémentent la technique, licence vérifiée à la source (LICENSE **et** `package.json`), dépendances relevées. |
| **démo exécutée** | `npm install --ignore-scripts`, script de build lancé, puis page servie localement et chargée dans Chromium headless (Playwright 1.56, rendu WebGL logiciel SwiftShader) avec capture d'écran et relevé des erreurs console. |

### 1.2 Comptes

| Palier | Nombre | Détail |
|---|---:|---|
| Tier 3 — dépôts imposés, code inspecté | **6** | 14islands/r3f-scroll-rig, drcmda/the-substance, Faboolea/shaders-on-scroll, haitham-kh/project-universe-, adrianhajdin/award-winning-website, sugaith/react-three-fiber-shader-galaxy |
| dont démo exécutée | **5** | 4 builds complets + 1 build avec correctif local en copie de travail (shaders-on-scroll) ; project-universe- seulement jusqu'à l'écran d'accueil |
| dont build échoué | **1** | r3f-scroll-rig (bibliothèque ; erreur TypeScript avec les types résolus aujourd'hui) |
| Tier 2 — README + au moins un fichier source | **21** | voir § 3 |
| README lu sans code | **4** | airbnb/lottie-web, rive-app/rive-wasm, idyll-lang/idyll, GouvernementFR/dsfr (README **et** LICENSE) |
| Tier 1 — métadonnées seulement | **110** | voir § 4 |
| **Total des entrées du panorama (§ 4)** | **135** | 110 + 4 + 21, les 6 dépôts imposés étant traités à part au § 2 |

### 1.3 Outils et sources

- **Clones** : les 6 dépôts imposés existaient déjà sous `/home/user/research/<owner>/<repo>` ; chacun a été validé (`git rev-parse HEAD` OK et `remote get-url origin` conforme) puis réutilisé. 18 dépôts Tier 2 ont été clonés un par un (`GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1`), sans erreur ni 429.
- **Recherche GitHub** : l'API REST publique (`api.github.com/search/repositories`) est **bloquée** dans cet environnement (réponse : « sessions are bound to their configured repositories »). La recherche a donc été faite via l'outil de recherche GitHub mis à disposition de la session (même moteur, mêmes champs `stargazers_count` et `license.spdx_id`), par requêtes thématiques (`scrollytelling`, `gpgpu particles three.js`, `view transitions api demo`, `scroll-driven animations css`, `explorable explanations`, `prefers-reduced-motion`, `accessible quiz`, `astro theme`, `topic:view-transitions`, `topic:gpgpu topic:threejs`, `user:codrops scroll`…) puis par lots `repo:a/b repo:c/d …` pour vérifier les métadonnées de dépôts connus. Les étoiles sont celles du 10/10/2026.
- **Recherche web** : 4 requêtes (mode standard) sur le GPGPU three.js, les stratégies de repli WebGL / mouvement réduit, le lissage par ressort critique et la combinaison Astro + `animation-timeline`. Résultats utilisés au § 5 (sources citées).
- **Fichiers bruts** : `raw.githubusercontent.com` est accessible ; utilisé pour `three.js` (`examples/jsm/misc/GPUComputationRenderer.js`, `src/math/MathUtils.js`), `govuk-frontend` (`radios.mjs`), `matter-js` (`src/core/Runner.js`) et les README/LICENSE listés plus haut.
- **Lecture de ToutouBien** (lecture seule) : `src/scripts/flair/{hero,scene,timeline,quality,shapes}.ts`, `src/scripts/magnetic.ts`, `src/scripts/hover-preview.ts`, `package.json`.

---

## 2. Fiches des 6 dépôts imposés (Tier 3)

Résumé :

| Dépôt | Licence vérifiée à la source | Pile | Démo | Réutilisable ? |
|---|---|---|---|---|
| 14islands/r3f-scroll-rig | **MIT** (fichier LICENSE, © 2023 14 Islands AB) ; `package.json` dit **ISC** → incohérence | React + R3F + Lenis + zustand | build échoué | Idées oui ; code lié à React |
| drcmda/the-substance | **MIT** (LICENSE, © 2019 Paul Henschel) ; pas de champ `license` dans `package.json` | React expérimental + react-three-fiber 4 beta + three 0.111 | **exécutée** | Idées oui ; API obsolète |
| Faboolea/shaders-on-scroll | **MIT** (LICENSE, © 2009-2020 Codrops) ; `package.json` dit **ISC** → incohérence | three 0.129 + GSAP 3, vanilla, Parcel | **exécutée** (correctif local) | Oui, le plus proche de notre pile |
| haitham-kh/project-universe- | **MIT pour le code** (LICENSE, © 2026 Haitham Kh) ; **modèles 3D, décors, design et chorégraphie « All Rights Reserved »** (README) | Next 16 + React 19 + R3F 9 + GSAP + Lenis + zustand | **exécutée partiellement** | Idées d'architecture oui ; aucun asset |
| adrianhajdin/award-winning-website | **aucune licence = tous droits réservés, code non réutilisable** ; README : « design credits go to Zentry… not intended for commercial use » | React 18 + GSAP/ScrollTrigger + Tailwind, vidéos | **exécutée** | Non |
| sugaith/react-three-fiber-shader-galaxy | **aucune licence = tous droits réservés, code non réutilisable** | CRA éjecté, React 17, R3F 7, react-spring, leva, postprocessing | **exécutée** | Non |

### 2.1 14islands/r3f-scroll-rig

- **Commit inspecté** : `123663599e4b`.
- **Licence** : `LICENSE` = MIT (« Copyright (c) 2023 14 Islands AB ») ; `package.json` déclare `"license": "ISC"`. Les deux sont permissives ; en cas de reprise, appliquer le texte du fichier LICENSE (MIT) et conserver la mention.
- **README** : « Progressively enhance a React website with WebGL » ; un seul `<GlobalCanvas/>` persistant entre les pages, des éléments DOM « proxy » suivis pour placer les objets WebGL, Lenis pour le défilement.
- **Fichiers clés et rôle**
  - `src/hooks/useTracker.ts` : mesure une seule fois `getBoundingClientRect()` (+ scroll initial), puis recalcule à chaque défilement une position monde et trois progressions normalisées (`progress`, `visibility`, `viewport`) avec `mapLinear`, sans relire le DOM. La visibilité vient d'un `IntersectionObserver` (`react-intersection-observer`).
  - `src/scrollbar/SmoothScrollbar.tsx` : instancie Lenis, le fait avancer soit via la boucle de R3F (`addEffect`), soit via son propre `requestAnimationFrame` ; désactive `pointer-events` sur `<html>` pendant les défilements rapides (seuils de vitesse 1 / 1,5) ; `lenis.destroy()` au démontage ; classes `js-smooth-scrollbar-enabled/disabled`.
  - `src/store.ts` : registre zustand des enfants du canvas avec compteur d'instances ; `removeFromCanvas(key, dispose)` démonte réellement ou marque `inactive` (réutilisation sans recréer).
  - `src/components/GlobalCanvas.tsx` + `CanvasErrorBoundary.tsx` : si WebGL échoue à l'initialisation, `isCanvasAvailable: false` et classe `js-global-canvas-error` ; `src/styles/index.css` rend alors visibles les éléments DOM masqués (`.ScrollRig-visibilityHidden`). C'est une vraie amélioration progressive : le HTML reste la source de vérité.
- **Synchronisation scroll ↔ WebGL** : « lockstep » sur le thread principal — Lenis anime la position de défilement, puis le même rAF met à jour les positions 3D. Le lissage est donc dans le défilement lui-même (Lenis), pas dans la scène.
- **Libération des ressources** : démontage géré par React/R3F (qui appelle `dispose` sur les objets créés en JSX) ; le registre évite de recréer les scènes partagées. Pas de `dispose` manuel de textures dans le code lu.
- **Mouvement réduit / repli** : aucune lecture de `prefers-reduced-motion` dans `src/` (Lenis récent le gère lui-même, voir § 3). Repli « pas de WebGL » : oui, via la classe d'erreur ci-dessus.
- **Dépendances** : `lenis`, `zustand`, `react-intersection-observer`, `@juggle/resize-observer`, `debounce`, `vecn`, `suspend-react`, `supports-webp`, `query-string` + pairs `react`, `@react-three/fiber`, `three`.
- **Démo** : `npm install --ignore-scripts --legacy-peer-deps` OK (18 s) ; `npm run build-default` (microbundle) **échoue** : `src/hooks/useImageAsTexture.ts(95,9): TS2322 Type 'string' is not assignable to type 'PremultiplyAlpha | undefined'` (types récents). Tentative avec `yarn install --frozen-lockfile` : refusée (« lockfile needs to be updated »). Arrêt là (bibliothèque sans démo autonome dans le dépôt). Le `yarn.lock` modifié par npm a été restauré.

### 2.2 drcmda/the-substance

- **Commit inspecté** : `501e0500867b`.
- **Licence** : MIT (« Copyright (c) 2019 Paul Henschel »). Images : README crédite Unsplash et Flickr de l'auteur → **ne pas reprendre les images**.
- **README** : tutoriel Codrops « Scroll, Refraction and Shader Effects in Three.js and React ».
- **Fichiers clés**
  - `src/store.js` : état global mutable (`state.top = createRef()`), sections, paragraphes, positions des diamants.
  - `src/index.js` : un `<div class="scrollArea">` de hauteur artificielle (8 × 100vh) au-dessus d'un `<Canvas>` orthographique plein écran ; `onScroll` écrit `scrollTop` dans `state.top.current`. Le texte est mis dans la scène via `<Dom>` (HTML positionné en 3D).
  - `src/blocks.js` : `Block` déplace chaque groupe vers `(top / zoom) * factor` avec `lerp(cur, cible, 0.1)` à chaque frame → parallaxe par facteur et lissage **dépendant de la cadence** (0,1 par frame, pas par seconde).
  - `src/components/Plane.js` + `CustomMaterial.js` : la **vitesse de défilement** (`top - last`) alimente l'uniform `shift` qui courbe le plan (vertex) et décale les canaux RVB (fragment).
  - `src/diamonds/Diamonds.js` : `instancedMesh` de diamants + réfraction en 4 passes (FBO d'environnement, FBO de faces arrière, rendu final).
- **Synchronisation** : scroll natif d'un conteneur → valeur partagée → `lerp` par objet dans `useFrame`.
- **Libération** : défaut notable — les deux `WebGLRenderTarget` sont recréés dans un `useMemo([size, ratio])` à chaque redimensionnement **sans `dispose()` des précédents** (fuite mémoire GPU à chaque resize).
- **Mouvement réduit / repli** : aucun. Le texte vit dans la scène : sans WebGL, plus de contenu. Défilement dans un `div` interne (le document fait 800 px de haut dans notre test) : ancres et restauration de position du navigateur dégradées.
- **Dépendances** : `react@experimental`, `react-dom@experimental`, `react-scripts 3.2.0`, `react-three-fiber 4.0.0-beta.12`, `three 0.111.0`, `lerp`.
- **Démo** : install OK (40 s, 1 486 paquets, React « experimental » résolu en `0.0.0-experimental-b53ea6ca0`) ; build OK avec `NODE_OPTIONS=--openssl-legacy-provider` (webpack 4 sous Node 22) ; page servie et chargée : canvas présent, **aucune erreur console**, diamants et plans déformés visibles sur la capture.

### 2.3 Faboolea/shaders-on-scroll

- **Commit inspecté** : `02a0b9e9e335`.
- **Licence** : `LICENSE` = MIT (« Copyright (c) 2009 - 2020 Codrops ») ; README : « License: MIT » ; `package.json` : `"license": "ISC"` (incohérence sans conséquence pratique, appliquer MIT).
- **README** : « A handy setup to create a smooth scroll based GLSL animation using Three.js and GSAP » (article Codrops 2021).
- **Fichiers clés**
  - `src/app/index.js` (classe `ScrollStage`) : un `IcosahedronGeometry(1, 64)` en fil de fer + `ShaderMaterial` additif ; un objet `settings` décrit pour chaque uniform un couple `{ start, end }` ; à chaque défilement (throttle rAF) `normalized = (hard / limit).toFixed(1)` puis `GSAP.to(uniform, { value: start + normalized * (end - start) })` avec `duration: 6.6`, `ease: 'power2'`, `overwrite: true`. `setPixelRatio(Math.min(devicePixelRatio, 1.5))`.
  - `src/app/SmoothScroll.js` : faux défilement — `body.style.height` = hauteur du contenu, contenu en `position: fixed` déplacé par `translateY(-soft)` avec `soft = interpolate(soft, hard, 0.05)` par frame.
  - `src/app/shaders/vertex.glsl` : bruit de Perlin périodique (`pnoise`) le long des normales × `uStrength`, puis torsion autour de Y (`rotateY`) selon `sin(uv.y * uFrequency) * uAmplitude`.
  - `src/app/shaders/fragment.glsl` : palette cosinus (`cosPalette`, technique d'Inigo Quilez) pilotée par la distorsion.
  - `src/app/Animations.js` : entrée GSAP (caméra + textes en cascade).
- **Synchronisation** : la progression est **quantifiée au dixième** puis interpolée par des tweens longs : le rendu reste fluide mais **décroché** du scroll (6,6 s de traîne), et la quantification crée des paliers involontaires.
- **Libération** : aucune (`dispose` absent, listeners jamais retirés) — acceptable pour une page démo unique, pas pour un site.
- **Mouvement réduit / repli** : aucun ; une alerte JS pour les navigateurs sans variables CSS ; un handler `mousemove` (désactivé en commentaire) montre l'usage pointeur.
- **Dépendances** : `three ^0.129`, `gsap ^3.7`, `parcel: latest`.
- **Démo** : install OK (12 s). `npm run build` **échoue** dans le clone : `parcel: latest` installe aujourd'hui Parcel 2, qui refuse le champ `"main": "dist/index.html"`. Build refait **dans une copie de travail** (bloc-notes de session) en retirant `main` du `package.json` et en ajoutant `type="module"` à la balise `<script>` : build OK (3,5 s, bundle 600 kB), page chargée, canvas 1280×800, une seule erreur réseau (ressource externe bloquée par le proxy). Capture conforme à la démo Codrops. Le clone a été restauré (`git checkout -- dist`).

### 2.4 haitham-kh/project-universe-

- **Commit inspecté** : `63330130fd16`.
- **Licence** : code MIT (« Copyright (c) 2026 Haitham Kh ») ; le README précise que **modèles de planètes, fonds, design UI et chorégraphie sont « All Rights Reserved »** et que le modèle Parker Solar Probe vient de NASA 3D Resources. Le dossier `public/` pèse **251 Mo**.
- **README** : expérience « cinématique » scroll-driven en chapitres, niveaux de qualité adaptatifs, chargement « shell-first », export statique.
- **Fichiers clés**
  - `src/lib/gsapTimeline.ts` : **une timeline GSAP maîtresse en pause, de durée 5**, qui anime un **objet JS simple** (`TimelineState` : caméra, opacités de scènes, intensités d'effets) et non des objets three.js ; `scrubTimeline(progress)` borne `p` à [0,1] et positionne la timeline. Un « directeur » recopie ensuite cet état vers la scène. Même idée que notre `timeline(p)` pure, en plus lourd.
  - `src/lib/motionMath.ts` : `clamp`, `lerp`, `remap`, `smoothstep`, `smootherstep`, easings, amortissement indépendant de la cadence.
  - `src/lib/performanceTiers.ts` + `src/hooks/usePerformanceTier.ts` : 4 niveaux (`dpr` 1→2, `particleMultiplier` 0,3→1,5, MSAA 0→8, étoiles 3 000→10 000) ; contrôleur à EMA courte/longue, p95 des temps de frame, ratio de pics > 20 ms et > 28 ms, temps de chauffe 4,5 s, durées minimales avant baisse/hausse, cooldown et « plancher » anti-oscillation ; mobile : départ niveau 1, baisse seulement.
  - `src/lib/AssetOrchestrator.ts` (1 136 lignes) : file de chargement à budget par frame, pool LRU avec `evictOldest()` → `dispose()` et `clear()` en cas de pression mémoire ; `src/lib/MaterialCache.ts`.
  - `src/components/LenisBridge.tsx` : Lenis (`lerp: 0.06`) ponté vers `ScrollControls` de drei ; `lenis.destroy()` au nettoyage.
  - `src/lib/scrollPacing.ts` : `capScrollTopByProgressRate()` **plafonne la vitesse de progression du scroll de l'utilisateur** (scroll-jacking).
- **Synchronisation** : scroll (Lenis) → `offset` → `scrubTimeline` → état → directeur → caméra/effets à chaque frame.
- **Libération** : la plus aboutie des six (pool, éviction, `dispose` explicites, 18 occurrences dans l'orchestrateur).
- **Mouvement réduit / repli** : une seule règle CSS `@media (prefers-reduced-motion: reduce)` qui coupe une animation de grain ; la scène 3D et le plafonnement du scroll restent actifs. Pas de détection « pas de WebGL » ni de gestion de perte de contexte trouvée (`grep webglcontextlost` vide).
- **Dépendances** : `next 16.0.8`, `react 19.2.1`, `@react-three/fiber ^9.4`, `drei ^10.7`, `@react-three/postprocessing`, `three ^0.181`, `gsap ^3.14`, `lenis ^1.3`, `zustand ^5`, `framer-motion`, `maath`, `simplex-noise`, Tailwind.
- **Contenu annexe** : `src/REVERSE_ENGINEERING_REPORT.txt` et `docs/frost-protocol-reverse-engineering.txt` (rapports générés décrivant le code) — lus comme données, sans effet sur ce travail.
- **Démo** : `npm ci --ignore-scripts` OK (19 s ; le `postinstall` qui copie les décodeurs Draco/Basis n'a donc pas tourné) ; `npm run build` (export statique Next) OK ; servi sous le chemin de base attendu `/project-universe-/` (un premier essai à la racine donnait 8 erreurs 404 de CSS) : canvas créé, **aucune erreur console**, écran « ENTER COSMOS / Ready to explore ». La scène 3D derrière le bouton n'a **pas** été parcourue (pas de clic simulé) : exécution **partielle**.

### 2.5 adrianhajdin/award-winning-website

- **Commit inspecté** : `bd29330d31fc`.
- **Licence** : **aucune licence = tous droits réservés, code non réutilisable** (ni fichier LICENSE, ni champ `license`). Le README ajoute : « All design credits go to Zentry… created purely for educational purposes and is not intended for commercial use or public deployment ».
- **Fichiers clés**
  - `src/components/Hero.jsx` : cadre vidéo dont le `clip-path` passe d'un rectangle plein à un polygone (`polygon(14% 0, 72% 0, 88% 90%, 0 95%)`) via `gsap.from(..., { scrollTrigger: { scrub: true } })` ; enchaînement de 4 vidéos MP4 au clic.
  - `src/components/AnimatedTitle.jsx` : découpe en mots (`dangerouslySetInnerHTML` par mot), timeline ScrollTrigger `toggleActions: "play none none reverse"` ; nettoyage correct par `gsap.context` + `ctx.revert()`.
  - `src/components/Features.jsx`, `Story.jsx`, `VideoPreview.jsx` : effets d'inclinaison 3D **qui suivent le pointeur** (`onMouseMove` → `perspective(700px) rotateX/rotateY`).
- **Synchronisation** : GSAP ScrollTrigger `scrub: true` (pas de WebGL dans ce projet).
- **Libération** : `ctx.revert()` dans `AnimatedTitle` ; ailleurs `useGSAP` (nettoyage automatique).
- **Mouvement réduit / repli** : aucun (`grep reduce` vide). Lecture automatique de vidéos ; `public/` = **51 Mo** (9 vidéos MP4).
- **Dépendances** : `react 18`, `gsap 3.12`, `@gsap/react`, `react-use`, `react-icons`, `clsx`, Tailwind, Vite 5.
- **Démo** : install OK (5 s) ; `vite build` OK (bundle 281 kB) ; page chargée, aucune erreur hors ressource externe bloquée ; capture : cadre vidéo/visuel du héros.

### 2.6 sugaith/react-three-fiber-shader-galaxy

- **Commit inspecté** : `9e10de610c01`.
- **Licence** : **aucune licence = tous droits réservés, code non réutilisable**.
- **README** : « boilerplate » R3F éjecté avec GLSL, zustand, particules procédurales, contrôles leva, animations GSAP et react-spring.
- **Fichiers clés**
  - `src/view/components/3D/Galaxy/LightGalaxy.js` : génère `count` (36 000 par défaut, jusqu'à 90 000) positions en spirale (bras, `spin`, aléa puissance `randomnessPower`) et couleurs interpolées intérieur→extérieur dans des `Float32Array`, rendus en `points` avec `ShaderMaterial` additif sans écriture de profondeur.
  - `galaxyAlphaCircle2.vert` : rotation différentielle (`angleOffset = 1000 / distance * uniTime`) et taille de point atténuée par la profondeur ; le code contient des multiplicateurs empiriques commentés « TODO » (`gl_PointSize *= 50.0`).
  - `src/Store.js` : déplacements de caméra en `gsap.to` (keyframes) déclenchés par le menu — **pas de lien avec le scroll**.
- **Libération** : défaut — `generateGalaxy()` remplace les `BufferAttribute` à chaque changement de paramètre sans libérer les anciens ; incohérence de taille (`attrScale` dimensionné à `count / 3`).
- **Mouvement réduit / repli** : aucun ; panneau leva et compteur FPS visibles en production.
- **Dépendances** : ~90 entrées dans `dependencies` (toute la chaîne CRA éjectée : webpack 5, babel, jest, eslint…), `three ^0.137`, R3F 7, drei 8, postprocessing, react-spring, leva, styled-components, use-sound.
- **Démo** : install OK (31 s, 1 581 paquets) ; build OK ; servi sous `/react-three-fiber-shader-galaxy/` : galaxie visible, **2 FPS** affichés par le compteur en rendu logiciel SwiftShader (indication de coût, pas une mesure sur GPU réel). Le `yarn.lock` modifié par npm a été restauré.

### 2.7 Ce que les six ont en commun (et ce qui manque à tous)

- **Une seule valeur de progression** alimente tout le reste dans les projets les mieux construits (project-universe-, shaders-on-scroll, the-substance) — c'est déjà le cœur de ToutouBien.
- **Le lissage est presque toujours un `lerp` par frame** (0,05 à 0,1) ou un tween : dépendant de la cadence, avec traîne. Seuls Lenis récent et `MathUtils.damp` de three.js (§ 3) proposent une forme `1 - exp(-λ·dt)` indépendante de la cadence ; ToutouBien va plus loin avec un ressort critique (position + vitesse).
- **Aucun des six ne lit `prefers-reduced-motion` pour couper la 3D**, aucun ne gère `webglcontextlost`, un seul (r3f-scroll-rig) prévoit un repli si WebGL ne démarre pas.
- **Trois sur six reposent sur des effets qui suivent le pointeur ou la vitesse de scroll** (inclinaisons, aberration chromatique liée à la vitesse) : à écarter pour notre public.

---

## 3. Tableau Tier 2 — README et code lus

Tous ces dépôts ont été lus au niveau « README lu + code inspecté » (clone superficiel, sauf three.js, govuk-frontend et matter-js lus par fichiers bruts). Licence vérifiée **dans le fichier LICENSE** quand il existe.

| # | Dépôt | Licence (fichier) | Fichier(s) source lu(s) | Ce qu'on y voit | Idée transférable à ToutouBien |
|---:|---|---|---|---|---|
| 1 | [russellsamora/scrollama](https://github.com/russellsamora/scrollama) | MIT | `src/entry.js` | Un `IntersectionObserver` par étape, marges calculées depuis un `offset` ; option `progress` via des seuils générés (`createProgressThreshold`) ; `ResizeObserver` par étape. | Pour les pages-récits secondaires (StoryScroller), déclencher les changements d'étape sans écouter `scroll` ; garder notre calcul de `p` uniquement pour l'accueil. |
| 2 | [darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) | MIT | `packages/core/src/lenis.ts`, `maths.ts`, `animate.ts` | `damp(x, y, λ, dt) = lerp(x, y, 1 - exp(-λ·dt))` ; option `respectReducedMotion = true` : défilement programmatique en coupe franche, saisie utilisateur 1:1 (`lerp = 1`). | Confirme notre choix : **ne pas** lisser le défilement natif ; lisser seulement la valeur dérivée. Reprendre l'idée « coupe franche » pour les ancres internes sous mouvement réduit. |
| 3 | [flackr/scroll-timeline](https://github.com/flackr/scroll-timeline) | Apache-2.0 | `src/` (`scroll-timeline-base.js`, `scroll-timeline-css.js`) | Polyfill `ScrollTimeline`/`ViewTimeline` et de la syntaxe CSS `animation-timeline`. | Si une animation CSS scroll-driven devient indispensable sur Firefox/Safari anciens, polyfill ciblé possible ; sinon garder l'approche « l'animation est un bonus » (pas de polyfill). |
| 4 | [pmndrs/detect-gpu](https://github.com/pmndrs/detect-gpu) | MIT | `src/index.ts` | Lit `UNMASKED_RENDERER_WEBGL`, liste noire de GPU (`BLOCKLISTED`), puis compare à des benchmarks **téléchargés par défaut depuis unpkg**. | Idée : ajouter une petite liste noire locale (pilotes logiciels type SwiftShader/llvmpipe → `fallback`). **Ne pas** intégrer la bibliothèque telle quelle (requête tierce, cf. politique de confidentialité). |
| 5 | [veltman/flubber](https://github.com/veltman/flubber) | MIT | `src/interpolate.js`, `normalize.js` | Rééchantillonne deux formes 2D (`maxSegmentLength`), aligne les anneaux puis interpole ; court-circuit aux extrémités (t < 1e-4). | Pour le repli SVG (sans WebGL) : un morphing « logo → sentier → anneaux » en SVG pur, piloté par la même `timeline(p)`. |
| 6 | [edankwan/The-Spirit](https://github.com/edankwan/The-Spirit) | MIT | `src/3d/simulator.js`, `src/fallback/mobile.js` | Simulation GPGPU (FBO ping-pong, bruit curl) ; écran de repli mobile qui demande une action avant de lancer. | Le GPGPU n'est pas nécessaire à 16 000 points (notre vertex shader suffit) ; à garder en réserve si l'on dépasse ~100 000 particules. |
| 7 | [KittyGiraudel/a11y-dialog](https://github.com/KittyGiraudel/a11y-dialog) | MIT | `src/a11y-dialog.ts`, `dom-utils.ts` | Mémorise et restaure le focus, piège la tabulation, Échap, `aria-modal`. | Référence pour les modales éventuelles du wizard / de l'orientation ; préférer `<dialog>` natif + ces règles de focus. |
| 8 | [ncase/trust](https://github.com/ncase/trust) | CC0-1.0 (code) ; sons sous licences diverses (README) | `js/` (structure `core`, `sims`, `slides`), README | Explorable en diapositives, simulations dédiées par diapositive, rendu PIXI. | Découper chaque explorateur Canvas en « diapositive = une question » ; attention : les **sons** ne sont pas tous CC0. |
| 9 | [joshwcomeau/waveforms](https://github.com/joshwcomeau/waveforms) | MIT | `src/components/*` (`MountWhenVisible`, `IntersectionObserver`, `RevealableAnswer`, `Slider`) | Explorable React : composants montés seulement quand visibles, réponses révélables, curseurs. | `MountWhenVisible` = notre chargement à l'approche ; « réponse révélable » transposable aux quiz (sans React). |
| 10 | [GoogleChromeLabs/view-transitions-toolkit](https://github.com/GoogleChromeLabs/view-transitions-toolkit) | Apache-2.0 | `src/feature-detection.ts`, `navigation.ts`, README | Détection fine des sous-fonctions VT, types de navigation automatiques, contrôle de lecture. | Tester `document.startViewTransition` et les « types » avant d'ajouter des transitions directionnelles ; garder le repli « navigation normale ». |
| 11 | [martrapp/astro-vtbot](https://github.com/martrapp/astro-vtbot) | ISC | `components/` (`NoScroll`, `PageOffset`, `ProgressBar`, `Linter`…) | Boîte à outils pour les view transitions d'Astro, dont un *linter* de noms de transition. | L'idée de **linter** les `view-transition-name` (unicité) est utile ; à reproduire par un test Playwright plutôt que par dépendance. |
| 12 | [codrops/ScrollBasedLayoutAnimations](https://github.com/codrops/ScrollBasedLayoutAnimations) | MIT | `js/index.js` | Lenis → `ScrollTrigger.update()` ; animations de mise en page GSAP Flip ; GSAP/Flip embarqués minifiés dans le dépôt. | Ce que les View Transitions natives + CSS scroll-driven remplacent chez nous sans dépendance. |
| 13 | [codrops/OnScrollTypographyAnimations](https://github.com/codrops/OnScrollTypographyAnimations) | MIT | `src/js/index.js` | Splitting.js (découpe en lettres) + ScrollTrigger + Lenis. | Découpe typographique : à faire en CSS (`SplitTitle.astro` existe déjà) avec texte intact pour les lecteurs d'écran. |
| 14 | [MisterPrada/morph-particles](https://github.com/MisterPrada/morph-particles) | **aucune licence = tous droits réservés, code non réutilisable** | `src/Experience/World/Page.js`, `Shaders/Particles/horseParticles.vert` | Morph de nuages de points via `morphTargetInfluences` et `mix(originalPos, transformedPos, f(uScroll))` ; faux conteneur de scroll et écoute `wheel`. | Seulement l'idée générale (déjà appliquée) ; écouter `wheel` est à proscrire (casse clavier/tactile). |
| 15 | [basementstudio/scrollytelling](https://github.com/basementstudio/scrollytelling) | MIT (fichier) ; l'API GitHub affiche « NOASSERTION » | `scrollytelling/src/image-sequence-canvas.tsx` | Séquence d'images dessinée sur Canvas 2D (`drawImage`) selon la progression ; React + GSAP. | Alternative légère au WebGL pour une scène « film » : séquence de 30-60 WebP sur Canvas 2D (mais coût réseau à mesurer). |
| 16 | [incluud/accessible-astro-starter](https://github.com/incluud/accessible-astro-starter) | MIT | `src/components/Navigation.astro`, `LauncherConfig.astro` | Animations sous `@media (prefers-reduced-motion: no-preference)` ; bascule utilisateur « réduire les animations ». | Ajouter un **interrupteur visible** « Réduire les animations » qui force le mode statique, en plus de la préférence système. |
| 17 | [amandaghassaei/gpu-io](https://github.com/amandaghassaei/gpu-io) | MIT | `src/GPUComposer.ts` | Chaîne de repli de contexte : `webgl2` → `webgl` → `experimental-webgl2` → `experimental-webgl`. | ToutouBien exige WebGL 2 et sinon passe en statique : plus simple et suffisant ; ne pas multiplier les chemins. |
| 18 | [agargaro/instanced-mesh](https://github.com/agargaro/instanced-mesh) | MIT | README, `src/core` | InstancedMesh2 : frustum culling par instance, BVH, LOD, tri. | Inutile pour des `Points` ; pertinent seulement si l'on passe à des milliers de maillages (empreintes, feuilles). |
| 19 | [mrdoob/three.js](https://github.com/mrdoob/three.js) | MIT | `examples/jsm/misc/GPUComputationRenderer.js`, `src/math/MathUtils.js` | `GPUComputationRenderer` (variables, `compute()`, `dispose()` complet) ; `MathUtils.damp`. | `damp` est l'équivalent « premier ordre » de notre ressort ; `GPUComputationRenderer.dispose()` montre la discipline attendue (quad, cibles, textures initiales). |
| 20 | [alphagov/govuk-frontend](https://github.com/alphagov/govuk-frontend) | MIT (code) ; contenus OGL v3 (README) | `src/govuk/components/radios/radios.mjs` | Révélation conditionnelle synchronisée avec l'état des boutons radio et `aria-expanded`, restaurée au retour arrière. | Modèle direct pour `wizard.ts`/`orientation.ts` : une question par écran, révélations conditionnelles accessibles, état restauré au retour. |
| 21 | [liabru/matter-js](https://github.com/liabru/matter-js) | MIT | `src/core/Runner.js` | Pas de temps fixe/variable, historique des deltas, repli quand le delta est inutilisable (0, NaN, longue pause). | Pour les explorateurs Canvas : borner `dt` (déjà fait dans la scène : `Math.min(…, 0.05)`) et lisser le delta sur quelques frames. |

**README lus sans code** (comptés à part) : `airbnb/lottie-web` (MIT ; animations After Effects exportées en JSON — rejeté, voir § 5), `rive-app/rive-wasm` (MIT ; moteur d'animation à machine d'états — intéressant pour un personnage, mais outil auteur propriétaire), `idyll-lang/idyll` (MIT ; langage d'explorables, peu actif depuis 2023), `GouvernementFR/dsfr` (Etalab 2.0 **avec modalités d'utilisation réservant le DSFR à l'administration** — inutilisable pour ToutouBien, voir § 6).

---

## 4. Liste Tier 1 — panorama

135 entrées classées par thème. Colonne « Licence (API) » = `license.spdx_id` renvoyé par la recherche GitHub ; « non vérifiée » = champ absent ; « NOASSERTION » = GitHub n'a pas reconnu de licence standard (fichier atypique ou multiple — à lire avant toute reprise). Sauf mention contraire dans la dernière colonne, **l'entrée n'a fait l'objet que d'une lecture de métadonnées**. Les 6 dépôts imposés (§ 2) ne sont pas répétés ici.

### Récit au défilement / scrollytelling

| Dépôt | Licence (API) | Étoiles | Objet | Inspection |
|---|---|---:|---|---|
| [russellsamora/scrollama](https://github.com/russellsamora/scrollama) | MIT | 6001 | Scrollytelling avec IntersectionObserver | README lu + code inspecté (Tier 2) |
| [basementstudio/scrollytelling](https://github.com/basementstudio/scrollytelling) | NOASSERTION | 1666 | A library for creating Scrollytelling animations, powered by React & GSAP. | README lu + code inspecté (Tier 2) |
| [codevise/pageflow](https://github.com/codevise/pageflow) | MIT | 713 | Multimedia story telling for the web. | métadonnées seulement |
| [qmd-lab/closeread](https://github.com/qmd-lab/closeread) | MIT | 236 | Easy scrollytelling in Quarto | métadonnées seulement |
| [sjwilliams/scrollstory](https://github.com/sjwilliams/scrollstory) | MIT | 291 | A jQuery plugin for building scroll-based stories | métadonnées seulement |
| [vgshenoy/vue-scrollama](https://github.com/vgshenoy/vue-scrollama) | MIT | 478 | Vue 3 component to setup scroll-driven interactions (aka scrollytelling) | métadonnées seulement |
| [squirrelsquirrel78/react-scrollama](https://github.com/squirrelsquirrel78/react-scrollama) | MIT | 405 | Simple scrollytelling with the IntersectionObserver in React. | métadonnées seulement |
| [btahir/react-kino](https://github.com/btahir/react-kino) | MIT | 221 | Cinematic scroll-driven storytelling for React | métadonnées seulement |
| [code-hike/codehike](https://github.com/code-hike/codehike) | MIT | 5389 | Build rich content websites with Markdown and React | métadonnées seulement |
| [the-pudding/svelte-starter](https://github.com/the-pudding/svelte-starter) | MIT | 469 | Gabarit de récits The Pudding | métadonnées seulement |
| [idyll-lang/idyll](https://github.com/idyll-lang/idyll) | MIT | 2042 | Langage pour explorable explanations | README lu |
| [nateherkai/scroll-craft](https://github.com/nateherkai/scroll-craft) | MIT | 3019 | An agent skill for building premium, immersive, scroll-driven websites. Works with Codex,  | métadonnées seulement |

### Animation au scroll, smooth scroll, alternatives à ScrollTrigger

| Dépôt | Licence (API) | Étoiles | Objet | Inspection |
|---|---|---:|---|---|
| [darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) | MIT | 16327 | Smooth scroll | README lu + code inspecté (Tier 2) |
| [locomotivemtl/locomotive-scroll](https://github.com/locomotivemtl/locomotive-scroll) | MIT | 8869 | Détection viewport + smooth scroll + parallaxe | métadonnées seulement |
| [greensock/GSAP](https://github.com/greensock/GSAP) | non vérifiée | 28993 | Moteur d'animation + ScrollTrigger (licence propre, champ licence absent de l'API) | métadonnées seulement |
| [michalsnik/aos](https://github.com/michalsnik/aos) | MIT | 28056 | Animate on scroll | métadonnées seulement |
| [alexfoxy/lax.js](https://github.com/alexfoxy/lax.js) | MIT | 10470 | Animations au scroll (archivé) | métadonnées seulement |
| [dixonandmoe/rellax](https://github.com/dixonandmoe/rellax) | MIT | 7125 | Parallaxe vanilla | métadonnées seulement |
| [terwanerik/ScrollTrigger](https://github.com/terwanerik/ScrollTrigger) | MIT | 3969 | Classes CSS au scroll (≠ GSAP ScrollTrigger) | métadonnées seulement |
| [mciastek/sal](https://github.com/mciastek/sal) | MIT | 3692 | Animations au scroll légères | métadonnées seulement |
| [nk-o/jarallax](https://github.com/nk-o/jarallax) | MIT | 1458 | Parallaxe image/vidéo | métadonnées seulement |
| [callmecavs/jump.js](https://github.com/callmecavs/jump.js) | MIT | 3422 | Smooth scrolling programmatique | métadonnées seulement |
| [hsnaydd/moveTo](https://github.com/hsnaydd/moveTo) | MIT | 2850 | Défilement animé vers une ancre | métadonnées seulement |
| [theatre-js/theatre](https://github.com/theatre-js/theatre) | Apache-2.0 | 12738 | Éditeur de motion design / séquençage | métadonnées seulement |
| [juliangarnier/anime](https://github.com/juliangarnier/anime) | MIT | 73455 | JavaScript animation engine | métadonnées seulement |
| [motiondivision/motion](https://github.com/motiondivision/motion) | MIT | 33929 | A modern animation library for React and JavaScript | métadonnées seulement |
| [pmndrs/react-spring](https://github.com/pmndrs/react-spring) | MIT | 29166 | ✌️ A spring physics based React animation library | métadonnées seulement |

### CSS scroll-driven animations

| Dépôt | Licence (API) | Étoiles | Objet | Inspection |
|---|---|---:|---|---|
| [flackr/scroll-timeline](https://github.com/flackr/scroll-timeline) | Apache-2.0 | 1167 | Polyfill ScrollTimeline (CSS scroll-driven) | README lu + code inspecté (Tier 2) |
| [barvian/CodropsCarousels](https://github.com/barvian/CodropsCarousels) | non vérifiée | 100 | Three carousel experiments made with CSS scroll-driven animations, based on Francesco Zaga | métadonnées seulement |
| [adamplesnik/tailwindcss-scroll-driven-animations](https://github.com/adamplesnik/tailwindcss-scroll-driven-animations) | MIT | 20 | Unofficial and experimental plugin for Tailwind CSS v3.4+ that provides utilities for scro | métadonnées seulement |
| [AdamBien/unscripted](https://github.com/AdamBien/unscripted) | MIT | 4 | A zero-JavaScript SPA: every page demonstrates one modern HTML or CSS feature that replace | métadonnées seulement |
| [AleBrito124356/scroll-story-lab](https://github.com/AleBrito124356/scroll-story-lab) | MIT | 3 | Scroll-driven animation patterns in vanilla JS and modern CSS - reveals, parallax, pinned  | métadonnées seulement |
| [viliket/pure-web-bottom-sheet](https://github.com/viliket/pure-web-bottom-sheet) | MIT | 192 | A performant, lightweight, and accessible bottom sheet web component powered by CSS scroll | métadonnées seulement |

### View transitions

| Dépôt | Licence (API) | Étoiles | Objet | Inspection |
|---|---|---:|---|---|
| [WICG/view-transitions](https://github.com/WICG/view-transitions) | NOASSERTION | 850 | — | métadonnées seulement |
| [GoogleChromeLabs/view-transitions-toolkit](https://github.com/GoogleChromeLabs/view-transitions-toolkit) | Apache-2.0 | 191 | — | README lu + code inspecté (Tier 2) |
| [GoogleChromeLabs/view-transitions-mock](https://github.com/GoogleChromeLabs/view-transitions-mock) | Apache-2.0 | 70 | A non-visual polyfill for Same-Document View Transitions | métadonnées seulement |
| [martrapp/astro-vtbot](https://github.com/martrapp/astro-vtbot) | ISC | 364 | The 👜 Bag of Tricks ✨ for Astro's View Transitions. ⭐️ Please star to support this work! | README lu + code inspecté (Tier 2) |
| [Charca/view-transitions-live](https://github.com/Charca/view-transitions-live) | non vérifiée | 324 | View Transitions API Demo | métadonnées seulement |
| [Charca/astro-view-transitions](https://github.com/Charca/astro-view-transitions) | non vérifiée | 67 | Demo of Astro MPA using the View Transitions API | métadonnées seulement |
| [jakearchibald/http203-playlist](https://github.com/jakearchibald/http203-playlist) | Apache-2.0 | 44 | Démo View Transitions de Jake Archibald | métadonnées seulement |
| [shuding/next-view-transitions](https://github.com/shuding/next-view-transitions) | MIT | 2384 | Use CSS View Transitions API in Next.js App Router. | métadonnées seulement |
| [meursyphus/ssgoi](https://github.com/meursyphus/ssgoi) | MIT | 994 | animated page transition for major ssr frameworks and browsers, including Safari | métadonnées seulement |
| [argyleink/morphull](https://github.com/argyleink/morphull) | MIT | 249 | Astro starter powered by MPA view transitions | métadonnées seulement |
| [swup/swup](https://github.com/swup/swup) | MIT | 5238 | Versatile and extensible page transition library for server-rendered websites 🎉 | métadonnées seulement |
| [barbajs/barba](https://github.com/barbajs/barba) | MIT | 12990 | Create badass, fluid and smooth transitions between your website’s pages | métadonnées seulement |
| [hotwired/turbo](https://github.com/hotwired/turbo) | MIT | 7399 | The speed of a single-page web application without having to write any JavaScript | métadonnées seulement |
| [paoloricciuti/sveltekit-view-transition](https://github.com/paoloricciuti/sveltekit-view-transition) | MIT | 189 | Start using view transitions without any hassle! | métadonnées seulement |

### WebGL : moteurs, outils, shaders

| Dépôt | Licence (API) | Étoiles | Objet | Inspection |
|---|---|---:|---|---|
| [mrdoob/three.js](https://github.com/mrdoob/three.js) | MIT | 116192 | JavaScript 3D Library. | README lu + code inspecté (Tier 2) |
| [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber) | MIT | 32828 | 🇨🇭 A React renderer for Three.js | métadonnées seulement |
| [pmndrs/drei](https://github.com/pmndrs/drei) | MIT | 9915 | 🥉 useful helpers for react-three-fiber | métadonnées seulement |
| [pmndrs/postprocessing](https://github.com/pmndrs/postprocessing) | Zlib | 2874 | A post processing library for three.js. | métadonnées seulement |
| [oframe/ogl](https://github.com/oframe/ogl) | non vérifiée | 4668 | Minimal WebGL Library | métadonnées seulement |
| [regl-project/regl](https://github.com/regl-project/regl) | MIT | 5587 | 👑 Functional WebGL | métadonnées seulement |
| [greggman/twgl.js](https://github.com/greggman/twgl.js) | MIT | 3005 | A Tiny WebGL helper Library | métadonnées seulement |
| [pixijs/pixijs](https://github.com/pixijs/pixijs) | MIT | 48318 | The HTML5 Creation Engine: Create beautiful digital content with the fastest, most flexibl | métadonnées seulement |
| [patriciogonzalezvivo/thebookofshaders](https://github.com/patriciogonzalezvivo/thebookofshaders) | NOASSERTION | 7043 | Livre/guide des fragment shaders | métadonnées seulement |
| [patriciogonzalezvivo/glslCanvas](https://github.com/patriciogonzalezvivo/glslCanvas) | MIT | 2277 | Shaders GLSL sur canvas | métadonnées seulement |
| [glslify/glslify](https://github.com/glslify/glslify) | NOASSERTION | 2288 | Modules GLSL | métadonnées seulement |
| [spite/THREE.MeshLine](https://github.com/spite/THREE.MeshLine) | MIT | 2339 | Lignes épaisses three.js | métadonnées seulement |
| [pmndrs/gltfjsx](https://github.com/pmndrs/gltfjsx) | MIT | 5877 | GLTF vers composants JSX | métadonnées seulement |
| [mattdesl/svg-mesh-3d](https://github.com/mattdesl/svg-mesh-3d) | MIT | 1223 | Chemin SVG vers maillage 3D | métadonnées seulement |
| [brunosimon/folio-2019](https://github.com/brunosimon/folio-2019) | MIT | 4748 | Portfolio WebGL | métadonnées seulement |
| [brunosimon/my-room-in-3d](https://github.com/brunosimon/my-room-in-3d) | non vérifiée | 4514 | Scène 3D baked (champ licence absent) | métadonnées seulement |

### Particules, GPGPU, morphing, instancing

| Dépôt | Licence (API) | Étoiles | Objet | Inspection |
|---|---|---:|---|---|
| [edankwan/The-Spirit](https://github.com/edankwan/The-Spirit) | MIT | 1283 | Expérience WebGL de particules GPGPU (curl noise) | README lu + code inspecté (Tier 2) |
| [amandaghassaei/gpu-io](https://github.com/amandaghassaei/gpu-io) | MIT | 1487 | A GPU-accelerated computing library for running physics simulations and other GPGPU comput | README lu + code inspecté (Tier 2) |
| [MisterPrada/morph-particles](https://github.com/MisterPrada/morph-particles) | non vérifiée | 284 | Models -> Particles -> Morph + Animation + Smooth Scroll | README lu + code inspecté (Tier 2) |
| [Alfred-Mountfield/WebGLParticles](https://github.com/Alfred-Mountfield/WebGLParticles) | non vérifiée | 2 | Particules GPGPU (GPUComputationRenderer) | métadonnées seulement |
| [cullenwebber/three-ml-sharp](https://github.com/cullenwebber/three-ml-sharp) | non vérifiée | 123 | Image -> Apple's ML SHARP -> Point Cloud -> Three JS GPGPU -> Particle System | métadonnées seulement |
| [tuqire/text-stars](https://github.com/tuqire/text-stars) | non vérifiée | 9 | Writes words dynamically using stars. THREE.js driven WEBGL project leveraging hardware ac | métadonnées seulement |
| [poeti8/one-million-particles](https://github.com/poeti8/one-million-particles) | MIT | 45 | 1,000,000 gpgpu particles in webgl. | métadonnées seulement |
| [colejd/Reaction-Diffusion-ThreeJS](https://github.com/colejd/Reaction-Diffusion-ThreeJS) | MIT | 49 | Reaction-Diffusion simulation in Three.js | métadonnées seulement |
| [danlex/particles](https://github.com/danlex/particles) | MIT | 3 | 61 real-time GPU particle animations — strange attractors, fractals, physics simulations,  | métadonnées seulement |
| [GeeAI/Interactive-3D-Particle-Morphing](https://github.com/GeeAI/Interactive-3D-Particle-Morphing) | MIT | 1 | 🌌 Stunning 3D particle system with scroll-based morphing between geometric shapes. Built w | métadonnées seulement |
| [Scenes3D/particles-morphing](https://github.com/Scenes3D/particles-morphing) | non vérifiée | 0 | 🎭🎆GPU-powered particle morphing system built with Three.js WebGPU. Particles smoothly tran | métadonnées seulement |
| [agargaro/instanced-mesh](https://github.com/agargaro/instanced-mesh) | MIT | 452 | InstancedMesh2 : culling, LOD, tri | README lu + code inspecté (Tier 2) |
| [gkjohnson/three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh) | MIT | 3506 | BVH pour raycast three.js | métadonnées seulement |
| [veltman/flubber](https://github.com/veltman/flubber) | MIT | 6940 | Tools for smoother shape animations. | README lu + code inspecté (Tier 2) |

### Qualité adaptative, perf, accessibilité 3D, mouvement réduit

| Dépôt | Licence (API) | Étoiles | Objet | Inspection |
|---|---|---:|---|---|
| [pmndrs/detect-gpu](https://github.com/pmndrs/detect-gpu) | MIT | 1217 | Classifies GPUs based on their 3D rendering benchmark score allowing the developer to prov | README lu + code inspecté (Tier 2) |
| [mrdoob/stats.js](https://github.com/mrdoob/stats.js) | MIT | 9154 | Moniteur de performance | métadonnées seulement |
| [cocopon/tweakpane](https://github.com/cocopon/tweakpane) | MIT | 4603 | :control_knobs: Compact GUI for fine-tuning parameters and monitoring value changes | métadonnées seulement |
| [pmndrs/leva](https://github.com/pmndrs/leva) | MIT | 6251 | GUI de réglages (React) | métadonnées seulement |
| [pmndrs/react-three-a11y](https://github.com/pmndrs/react-three-a11y) | NOASSERTION | 627 | Accessibilité pour R3F | métadonnées seulement |
| [zakky8/web-optimization](https://github.com/zakky8/web-optimization) | MIT | 5 | The definitive Three.js & WebGL performance reference — 48 folders: WebGPU, GLSL shaders,  | métadonnées seulement |
| [magica11y/prefers-reduced-motion](https://github.com/magica11y/prefers-reduced-motion) | MIT | 11 | 🎢 Detects user’s preferences for reduced motion using the 'prefers-reduce-motion' CSS3 lev | métadonnées seulement |
| [anatoliygatt/use-prefers-reduced-motion](https://github.com/anatoliygatt/use-prefers-reduced-motion) | MIT | 24 | 🪝 React hook for subscribing to user's motion preference. | métadonnées seulement |
| [egstad-construct/detect-motion](https://github.com/egstad-construct/detect-motion) | MIT | 2 | A micro ES6 module (~0.5KB) for detecting a users prefers-reduced-motion and watching for  | métadonnées seulement |
| [SydBal/prefers-reduced-motion.com](https://github.com/SydBal/prefers-reduced-motion.com) | MIT | 1 | Homepage for prefers-reduced-motion.com | métadonnées seulement |
| [kentcdodds/epic-stack-with-framer-motion](https://github.com/kentcdodds/epic-stack-with-framer-motion) | non vérifiée | 25 | Using client hints to avoid content layout shift with prefers-reduced-motion and framer mo | métadonnées seulement |

### Explorables et simulations Canvas

| Dépôt | Licence (API) | Étoiles | Objet | Inspection |
|---|---|---:|---|---|
| [ncase/trust](https://github.com/ncase/trust) | CC0-1.0 | 6306 | An interactive guide to the game theory of cooperation | README lu + code inspecté (Tier 2) |
| [ncase/loopy](https://github.com/ncase/loopy) | CC0-1.0 | 1748 | A tool for thinking in systems | métadonnées seulement |
| [ncase/polygons](https://github.com/ncase/polygons) | CC0-1.0 | 1360 | A playable post on how harmless choices can make a harmful world. | métadonnées seulement |
| [ncase/anxiety](https://github.com/ncase/anxiety) | CC0-1.0 | 495 | — | métadonnées seulement |
| [joshwcomeau/waveforms](https://github.com/joshwcomeau/waveforms) | MIT | 1480 | An interactive, explorable explanation about the peculiar magic of sound waves. | README lu + code inspecté (Tier 2) |
| [blob42/awesome-explorables](https://github.com/blob42/awesome-explorables) | CC0-1.0 | 1053 | A curated list of awesome explorable explanations. | métadonnées seulement |
| [explorableexplanations/explorableexplanations.github.io](https://github.com/explorableexplanations/explorableexplanations.github.io) | CC0-1.0 | 520 | The Explorable Explanations Website | métadonnées seulement |
| [eleweek/inside_python_dict](https://github.com/eleweek/inside_python_dict) | MIT | 152 | An explorable explanation of python dictionaries | métadonnées seulement |
| [curvenote/article](https://github.com/curvenote/article) | MIT | 201 | Components for interactive scientific writing, reactive documents and explorable explanati | métadonnées seulement |
| [landgreen/physics](https://github.com/landgreen/physics) | GPL-3.0 | 143 | Explorable Physics is a website with course notes for algebra based physics with explorabl | métadonnées seulement |
| [liabru/matter-js](https://github.com/liabru/matter-js) | MIT | 18447 | a 2D rigid body physics engine for the web ▲● ■ | README lu + code inspecté (Tier 2) |
| [processing/p5.js](https://github.com/processing/p5.js) | LGPL-2.1 | 24111 | p5.js is a client-side JS platform that empowers artists, designers, students, and anyone  | métadonnées seulement |
| [d3/d3](https://github.com/d3/d3) | ISC | 113725 | Bring data to life with SVG, Canvas and HTML. :bar_chart::chart_with_upwards_trend::tada: | métadonnées seulement |
| [mattdesl/canvas-sketch](https://github.com/mattdesl/canvas-sketch) | MIT | 5304 | [beta] A framework for making generative artwork in JavaScript and the browser. | métadonnées seulement |
| [fabricjs/fabric.js](https://github.com/fabricjs/fabric.js) | MIT | 31465 | Bibliothèque Canvas 2D / SVG | métadonnées seulement |
| [konvajs/konva](https://github.com/konvajs/konva) | NOASSERTION | 14857 | Scène Canvas 2D interactive | métadonnées seulement |
| [jonobr1/two.js](https://github.com/jonobr1/two.js) | MIT | 8669 | A renderer agnostic two-dimensional drawing api for the web | métadonnées seulement |
| [rough-stuff/rough](https://github.com/rough-stuff/rough) | MIT | 21251 | Create graphics with a hand-drawn, sketchy, appearance | métadonnées seulement |
| [Rich-Harris/pancake](https://github.com/Rich-Harris/pancake) | MIT | 1321 | Graphiques Svelte expérimentaux | métadonnées seulement |

### SVG, personnages, animation vectorielle

| Dépôt | Licence (API) | Étoiles | Objet | Inspection |
|---|---|---:|---|---|
| [airbnb/lottie-web](https://github.com/airbnb/lottie-web) | MIT | 32180 | Render After Effects animations natively on Web, Android and iOS, and React Native. http:/ | README lu |
| [rive-app/rive-wasm](https://github.com/rive-app/rive-wasm) | MIT | 973 | Wasm/JS runtime for Rive | README lu |
| [svgdotjs/svg.js](https://github.com/svgdotjs/svg.js) | NOASSERTION | 11828 | The lightweight library for manipulating and animating SVG | métadonnées seulement |
| [maxwellito/vivus](https://github.com/maxwellito/vivus) | MIT | 15483 | JavaScript library to make drawing animation on SVG | métadonnées seulement |

### Accessibilité, formulaires, quiz/assistant

| Dépôt | Licence (API) | Étoiles | Objet | Inspection |
|---|---|---:|---|---|
| [alphagov/govuk-frontend](https://github.com/alphagov/govuk-frontend) | MIT | 1467 | GOV.UK Frontend contains the code you need to start building a user interface for governme | README lu + code inspecté (Tier 2) |
| [alphagov/accessible-autocomplete](https://github.com/alphagov/accessible-autocomplete) | MIT | 954 | An autocomplete component, built to be accessible. | métadonnées seulement |
| [nhsuk/nhsuk-frontend](https://github.com/nhsuk/nhsuk-frontend) | MIT | 684 | NHS.UK frontend contains the code you need to start building user interfaces for NHS websi | métadonnées seulement |
| [w3c/aria-practices](https://github.com/w3c/aria-practices) | NOASSERTION | 1356 | WAI-ARIA Authoring Practices Guide (APG) | métadonnées seulement |
| [dequelabs/axe-core](https://github.com/dequelabs/axe-core) | MPL-2.0 | 7621 | Accessibility engine for automated Web UI testing | métadonnées seulement |
| [pa11y/pa11y](https://github.com/pa11y/pa11y) | LGPL-3.0 | 4572 | Pa11y is your automated accessibility testing pal | métadonnées seulement |
| [KittyGiraudel/a11y-dialog](https://github.com/KittyGiraudel/a11y-dialog) | MIT | 2488 | A very lightweight and flexible accessible modal dialog script. | README lu + code inspecté (Tier 2) |
| [focus-trap/focus-trap](https://github.com/focus-trap/focus-trap) | MIT | 1563 | Trap focus within a DOM node. | métadonnées seulement |

### Systèmes de design éditoriaux, Astro

| Dépôt | Licence (API) | Étoiles | Objet | Inspection |
|---|---|---:|---|---|
| [GouvernementFR/dsfr](https://github.com/GouvernementFR/dsfr) | NOASSERTION | 397 | 🇫🇷 Official french government's design system (Système de Design de l'État) | README lu |
| [uswds/uswds](https://github.com/uswds/uswds) | NOASSERTION | 7217 | The U.S. Web Design System helps the federal government build fast, accessible, mobile-fri | métadonnées seulement |
| [argyleink/open-props](https://github.com/argyleink/open-props) | MIT | 5537 | Jetons CSS (custom properties) | métadonnées seulement |
| [withastro/astro](https://github.com/withastro/astro) | NOASSERTION | 63145 | The web framework for content-driven websites. | métadonnées seulement |
| [withastro/starlight](https://github.com/withastro/starlight) | MIT | 9389 | 🌟 Build beautiful, accessible, high-performance documentation websites with Astro | métadonnées seulement |
| [incluud/accessible-astro-starter](https://github.com/incluud/accessible-astro-starter) | MIT | 1187 | An Accessible, WCAG compliant Starter Theme for Astro 6+ including several accessibility f | README lu + code inspecté (Tier 2) |
| [satnaing/astro-paper](https://github.com/satnaing/astro-paper) | MIT | 5105 | A minimal, accessible and SEO-friendly Astro blog theme. | métadonnées seulement |
| [arthelokyo/astrowind](https://github.com/arthelokyo/astrowind) | MIT | 6029 | ⭕️ AstroWind: A free template using Astro v7 and Tailwind CSS v4. Astro starter theme. | métadonnées seulement |
| [chrismwilliams/astro-theme-cactus](https://github.com/chrismwilliams/astro-theme-cactus) | MIT | 1735 | A simple Astro theme. Use it to create your blog or website. | métadonnées seulement |

### Démos Codrops au scroll

| Dépôt | Licence (API) | Étoiles | Objet | Inspection |
|---|---|---:|---|---|
| [codrops/ScrollBasedLayoutAnimations](https://github.com/codrops/ScrollBasedLayoutAnimations) | MIT | 335 | An exploration of different scroll based layout switch animations using GSAP's ScrollTrigg | README lu + code inspecté (Tier 2) |
| [codrops/OnScrollTypographyAnimations](https://github.com/codrops/OnScrollTypographyAnimations) | MIT | 346 | Inspiration and ideas for on-scroll typography animations that add an extra layer of creat | README lu + code inspecté (Tier 2) |
| [codrops/SmoothScrollingImageEffects](https://github.com/codrops/SmoothScrollingImageEffects) | non vérifiée | 335 | A small set of ideas on animating images and other elements while smooth scrolling a page. | métadonnées seulement |
| [codrops/TileScroll](https://github.com/codrops/TileScroll) | MIT | 232 | Scroll animations for image grids using Locomotive Scroll | métadonnées seulement |
| [codrops/ColumnScroll](https://github.com/codrops/ColumnScroll) | MIT | 213 | A grid layout with columns that scroll in opposite directions. | métadonnées seulement |
| [codrops/Scroll3DGrid](https://github.com/codrops/Scroll3DGrid) | MIT | 183 | On-scroll animations for perspective image grids with different layouts. | métadonnées seulement |
| [codrops/FullscreenScroll](https://github.com/codrops/FullscreenScroll) | MIT | 153 | A fullscreen scroll-based slideshow with a content view powered by GreenSock's Observer pl | métadonnées seulement |

---

## 5. Patterns retenus et rejetés pour ToutouBien

### 5.1 Rappel de l'architecture existante (lue dans `src/scripts/flair/`)

| Élément | Où | Ce que fait le code aujourd'hui |
|---|---|---|
| Progression brute | `hero.ts` → `progress()` | `-rect.top / (hauteur section - innerHeight)`, bornée à [0,1], recalculée sur `scroll` passif et `ResizeObserver`. |
| Lissage | `scene.ts` → `frame()` | Ressort **critiquement amorti** : `ω = 9`, `a = ω²(raw − p) − 2ω·v`, intégration d'Euler semi-implicite, `dt` borné à 50 ms, arrêt net sous 1e-4. |
| Partage particules ↔ textes | `scene.ts` appelle `onProgress(p)` → `hero.ts` `apply(p)` | La **même** valeur lissée pilote les uniforms (`uMorph`, travelling) et les variables CSS `--p` / `--a` des blocs de texte ; `inert` sur les blocs invisibles. Sans scène, `apply` reçoit la valeur brute. |
| Minutage | `timeline.ts` | Fonction pure `timeline(p)` : paliers 0-0,18 / 0,30-0,54 / 0,68-1, transitions courtes, changement de texte au milieu des transitions, jamais pendant un palier. |
| Qualité | `quality.ts` + `scene.ts` `watchBudget()` | Niveau initial depuis WebGL 2, mouvement réduit, Save-Data/2G, cœurs, mémoire, pointeur grossier, largeur ; puis moyenne de 90 frames après 60 frames de chauffe ; rétrogradation `high → medium → low → fallback` avec reconstruction des géométries (et `dispose()` des anciennes). |
| Repli | `hero.ts` `toStatic()` | Illustration statique + textes ; `scene.dispose()` ; déclenché aussi si l'import dynamique échoue. |
| Sobriété | `hero.ts` | Import de three.js à la demande, chargement à 300 px de la section, rendu suspendu hors écran et onglet masqué. |

### 5.2 Patterns retenus (ce que la recherche confirme ou suggère d'ajouter)

| # | Pattern | Sources qui l'illustrent | État dans ToutouBien | Action proposée |
|---:|---|---|---|---|
| R1 | **Une seule progression, lissée une seule fois, partagée par la 3D et le texte** | project-universe- (`scrubTimeline` sur un objet d'état), r3f-scroll-rig (lockstep), shaders-on-scroll (uniforms `start/end`) | **Fait**, et plus propre que les sources (ni GSAP ni état global mutable). | Garder. Documenter dans `timeline.ts` que **tout** nouvel effet doit lire `timeline(p)` et non `scrollY`. |
| R2 | **Ressort critique indépendant de la cadence** plutôt que `lerp` par frame ou tween long | Contre-exemples : the-substance (`lerp 0.1`/frame), shaders-on-scroll (tween 6,6 s + quantification au dixième) ; références : `MathUtils.damp` (three.js), `damp` de Lenis, `FMath::CriticallyDampedSmoothing` d'Unreal et le modèle masse-ressort-amortisseur de Firefox ([bug 1010538](https://bugzil.la/1010538), [doc Unreal](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Core/FMath/CriticallyDampedSmoothing)) | **Fait** (`ω = 9`). | Petit durcissement : sous-échantillonner si `dt > 0,5 / ω` (≈ 55 ms) au lieu de seulement borner `dt`, pour garder la stabilité sur une frame très longue (recommandation de la doc Unreal). Ajouter un test unitaire « pas de dépassement depuis v = 0 ». |
| R3 | **Minutage en paliers + transitions courtes**, texte changé au milieu des transitions | project-universe- (chapitres, opacités de scène dans la timeline), scrollama (étapes discrètes) | **Fait** (`MARKS`). | Garder ; exposer `MARKS` aux tests e2e (déjà possible via `?quality=`), et vérifier qu'aucun texte n'est à `--a` intermédiaire pendant un palier. |
| R4 | **Discipline `dispose`** : chaque géométrie, matériau, cible de rendu et le renderer libérés ; rien recréé sans libérer l'ancien | Bon : project-universe- (`AssetOrchestrator`, pool LRU), `GPUComputationRenderer.dispose()`. Mauvais : the-substance (FBO recréés sans `dispose` au resize), galaxy (attributs remplacés sans libération) | **Fait** pour géométries/matériaux/renderer (`dispose()`, `watchBudget`). | Ajouter `renderer.forceContextLoss()` après `renderer.dispose()` dans `toStatic()` pour rendre le contexte immédiatement au navigateur (utile sur mobile, plafond de contextes WebGL). Si des textures apparaissent un jour (sprite de particule…), les inscrire dans `dispose()`. |
| R5 | **Qualité adaptative à hystérésis** | project-universe- (EMA, p95, cooldown, plancher, mobile « baisse seulement »), detect-gpu (liste noire GPU) | **Fait** en version simple (moyenne sur 90 frames, baisse seulement). | Suffisant pour une seule scène. Deux ajouts bon marché : (a) mesurer aussi le **p95** sur la même fenêtre (une moyenne masque les saccades) ; (b) **liste noire locale** de renderers logiciels (`SwiftShader`, `llvmpipe`, `Software`) via `WEBGL_debug_renderer_info` → `fallback` direct (notre test headless tournait à 2 FPS sur la galaxie en SwiftShader). Pas de dépendance réseau (detect-gpu télécharge ses benchmarks depuis unpkg). |
| R6 | **Mouvement réduit = pas de 3D du tout**, pas « 3D ralentie » | Aucun des six ne le fait ; Lenis (`respectReducedMotion`), accessible-astro-starter (`no-preference`) ; guides web consultés : « poster statique d'abord, WebGL seulement si le mouvement est permis » ([webgl landing steering](https://tessl.io/registry/skills/github/MengTo/Skills/webgl-landing-steering), [Verdigris — Reduced Motion Guide](https://design.verdigris.co/categories/animation/reduced-motion)) | **Fait** (`pickTier` → `fallback`). | Ajouter un **interrupteur visible** « Réduire les animations » (mémorisé en `localStorage`, appliqué avant le chargement de three.js) pour les personnes qui ne savent pas régler la préférence système. Écouter aussi le **changement** de `matchMedia('(prefers-reduced-motion: reduce)')` en cours de visite → `toStatic()`. |
| R7 | **Repli « pas de WebGL » qui garde tout le contenu dans le HTML** | r3f-scroll-rig (`js-global-canvas-error` révèle le DOM) ; contre-exemple : the-substance (texte dans la scène via `<Dom>`) | **Fait** : textes toujours dans le DOM, illustration statique, `toStatic()` en cas d'échec d'import. | Ajouter l'écoute de **`webglcontextlost`** sur le canvas → `toStatic()` (aucune des sources ne le fait ; cité dans les guides consultés). Optionnel : `webglcontextrestored` ignoré (on reste en statique, plus sûr). |
| R8 | **Pas d'effet qui suit le pointeur ni la vitesse de scroll** | Contre-exemples : award-winning-website (inclinaisons au `mousemove`), the-substance (aberration RVB liée à la vitesse), shaders-on-scroll (`mousemove` prévu), morph-particles (`wheel`) | Scène : **fait** — le champ `pointer` de `PROFILES` (`quality.ts`) est déclaré mais **lu nulle part** dans `scene.ts`. Hors scène : `src/scripts/magnetic.ts` (boutons « magnétiques » qui suivent le pointeur, souris + sans mouvement réduit) et `src/scripts/hover-preview.ts` (aperçu qui suit le pointeur) **existent et sont branchés** (`data-magnetic` dans `FlairHero.astro`, `SiteHeader.astro`, `premier-rendez-vous.astro`, `orientation.astro`). | Si la règle « aucun effet qui suit le pointeur » est bien la ligne du projet, il y a un **écart** à arbitrer : retirer `magnetic.ts`/`hover-preview.ts` ou documenter l'exception (ils sont déjà limités à `pointer: fine` et, pour `magnetic.ts`, au mouvement non réduit). Supprimer le champ mort `pointer` de `PROFILES` pour éviter qu'un futur contributeur l'active. |
| R9 | **Chargement paresseux + pause hors écran** | waveforms (`MountWhenVisible`), scrollama (IntersectionObserver), guides consultés (« pause when offscreen ») | **Fait** (`rootMargin: 300px`, `IntersectionObserver`, `visibilitychange`). | Garder. |
| R10 | **Repli animé sans WebGL en SVG**, piloté par la même `timeline(p)` | flubber (interpolation de formes 2D), svg-mesh-3d (même chemin SVG source) | Le chemin SVG du logo sert déjà de source aux particules (`emblemPath`). | Piste (pas une obligation) : en mode `low` ou `fallback` **sans** mouvement réduit, animer seulement l'opacité/le tracé (`stroke-dashoffset`) du SVG avec `--p`. Rester en image fixe sous mouvement réduit. |
| R11 | **Formulaires/quiz : une question par écran, révélations conditionnelles accessibles, état restauré au retour arrière** | govuk-frontend `radios.mjs` (`aria-expanded`, resynchronisation sur `pageshow`), a11y-dialog (focus) | `wizard.ts` est déjà en amélioration progressive (« sans ce script, le formulaire reste utilisable d'un seul tenant »). | Vérifier la resynchronisation sur `pageshow` (retour arrière depuis le cache bfcache) et le déplacement du focus vers le titre de chaque étape. |
| R12 | **View Transitions natives, testées par fonctionnalité** | view-transitions-toolkit (détection fine), astro-vtbot (linter de noms) | View transitions natives déjà utilisées. | Ajouter un test e2e qui vérifie l'unicité des `view-transition-name` sur chaque page (idée du *linter* d'astro-vtbot, réécrite). Sur l'interaction Astro ↔ `animation-timeline`, aucune source fiable trouvée : à tester au cas par cas ([docs Astro](https://docs.astro.build/ja/guides/view-transitions), [MDN `view()`](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline/view)). |

### 5.3 Patterns rejetés

| # | Pattern | Vu dans | Raison du rejet |
|---:|---|---|---|
| X1 | **React / React Three Fiber / drei / zustand** | r3f-scroll-rig, the-substance, project-universe-, galaxy, scrollytelling (basement), waveforms | Le site n'a pas de React ; ajouter React + R3F pour une seule scène alourdirait nettement le JS (à titre indicatif, le bundle principal de la démo galaxy fait 465 kB gzip ; notre scène charge three.js seul, à la demande). Les idées (tracker, registre de scènes, timeline maîtresse) se réécrivent en 20-50 lignes de TypeScript. |
| X2 | **GSAP + ScrollTrigger + Lenis comme socle** | award-winning-website, shaders-on-scroll, codrops ×2, project-universe- | Redondant avec CSS scroll-driven + View Transitions + notre ressort ; licence GSAP propre (non OSI, champ licence absent de l'API — non vérifiée ici) ; Lenis modifie le défilement natif (ancres, clavier, restauration), ce que l'on veut éviter. |
| X3 | **Faux défilement** (`body` à hauteur artificielle + contenu `fixed` translaté, ou conteneur de scroll interne) | shaders-on-scroll (`SmoothScroll.js`), the-substance (`.scrollArea`), morph-particles (`#fake-scroll` + `wheel`) | Casse recherche dans la page, ancres, lecteurs d'écran, restauration du scroll et zoom ; `wheel` ignore clavier et tactile. |
| X4 | **Plafonner la vitesse de défilement de l'utilisateur** | project-universe- (`capScrollTopByProgressRate`) | Scroll-jacking : contraire à l'autonomie de l'utilisateur et aux attentes d'accessibilité (frustration sur mobile, perte de contrôle du geste). Nos paliers rendent la lecture confortable sans contraindre le geste. |
| X5 | **Effets liés à la vitesse du scroll** (aberration chromatique, courbure) | the-substance (`shift` = delta de scroll) | Déclencheur vestibulaire, illisible pendant le geste, sans valeur pédagogique. |
| X6 | **Effets qui suivent le pointeur** (inclinaison 3D, aimantation) | award-winning-website, shaders-on-scroll (code présent mais commenté) | Inégalité entre souris et tactile/clavier ; distraction ; voir l'écart R8 pour l'existant. |
| X7 | **Code sans licence** | award-winning-website, react-three-fiber-shader-galaxy, morph-particles | Aucune licence = tous droits réservés : lecture permise, reprise interdite. award-winning-website reprend en plus le design d'un tiers (Zentry). |
| X8 | **Assets lourds ou sous droits** | project-universe- (251 Mo, modèles « All Rights Reserved »), award-winning-website (51 Mo de vidéos), the-substance (photos Unsplash/Flickr), trust (sons CC BY-NC) | Poids incompatible avec un site de quartier consulté sur mobile ; droits non transférables. Nos formes viennent d'un chemin SVG maison et de fonctions procédurales (`shapes.ts`). |
| X9 | **Post-processing lourd (bloom, MSAA 8×, DOF, motion blur)** | project-universe-, The-Spirit, galaxy | Coût GPU élevé (galaxy à 2 FPS en rendu logiciel) pour un gain esthétique hors de la direction artistique éditoriale. |
| X10 | **Détection GPU par benchmarks téléchargés** | detect-gpu | Requête vers unpkg à chaque visite : dépendance et fuite d'information tierces, incompatible avec l'approche sans tiers du site ; la mesure in situ (`watchBudget`) suffit. |
| X11 | **DSFR** (Système de design de l'État) | GouvernementFR/dsfr | Modalités d'utilisation : réservé aux entités de l'administration et aux domaines `.gouv.fr` ; police Marianne sous conditions. Utiliser pour ToutouBien serait trompeur. |
| X12 | **Lottie / Rive pour un personnage** | lottie-web, rive-wasm | Exigent un outil auteur (After Effects + Bodymovin, éditeur Rive) et un runtime de 60-250 kB ; nos personnages sont déjà des SVG Astro (`DogFigure.astro`) animables en CSS. À reconsidérer seulement si un illustrateur livre des animations dans ces formats. |
| X13 | **GPGPU / InstancedMesh2 / BVH** | The-Spirit, gpu-io, instanced-mesh, three-mesh-bvh | Sur-dimensionné à 5 000-16 000 points ; à garder en réserve (voir Tier 2 n° 6 et 18). |

### 5.4 Les 5 patterns les plus transférables (priorité)

1. **Écouter `webglcontextlost` → `toStatic()`** et appeler `renderer.forceContextLoss()` après `dispose()` (R4, R7) — absent des six dépôts, absent de ToutouBien, coût ≈ 10 lignes.
2. **Interrupteur « Réduire les animations » + réaction au changement de préférence en cours de visite** (R6) — inspiré d'accessible-astro-starter et de Lenis.
3. **Liste noire locale des renderers logiciels + p95 dans `watchBudget`** (R5) — version minimale du contrôleur de project-universe-, sans dépendance réseau.
4. **Garder et durcir le ressort critique** (sous-pas si `dt` long, test « sans dépassement ») plutôt que `lerp`/tween (R2) — c'est l'avantage net de ToutouBien sur toutes les sources.
5. **Arbitrer l'écart « effets qui suivent le pointeur »** : retirer ou documenter `magnetic.ts` / `hover-preview.ts`, supprimer le champ mort `PROFILES.pointer` (R8).

---

## 6. Licences et obligations

### 6.1 Les 6 dépôts imposés

| Dépôt | Licence | Obligations si l'on reprenait du code | Statut pour ToutouBien |
|---|---|---|---|
| 14islands/r3f-scroll-rig | MIT (LICENSE) ; ISC (`package.json`) | Conserver la notice de copyright et le texte MIT dans les copies substantielles. | Rien de repris. |
| drcmda/the-substance | MIT | Idem ; **images exclues** (Unsplash, Flickr de l'auteur). | Rien de repris. |
| Faboolea/shaders-on-scroll | MIT (© Codrops) ; ISC (`package.json`) | Notice MIT. Le bruit `pnoise` et `rotation3dY` du vertex shader proviennent de tiers cités en commentaire (glsl-rotate) : vérifier leurs licences avant toute reprise. | Rien de repris. |
| haitham-kh/project-universe- | MIT (code) + « All Rights Reserved » (modèles, fonds, design, chorégraphie) ; modèle NASA | Notice MIT pour le code ; **aucun asset réutilisable** ; mention NASA si l'on utilisait leur modèle. | Rien de repris. |
| adrianhajdin/award-winning-website | **aucune licence = tous droits réservés, code non réutilisable** ; design attribué à Zentry | Aucune reprise possible sans autorisation écrite. | Rien de repris. |
| sugaith/react-three-fiber-shader-galaxy | **aucune licence = tous droits réservés, code non réutilisable** | Aucune reprise possible sans autorisation écrite. | Rien de repris. |

### 6.2 Licences rencontrées dans les Tier 1-2

- **MIT, ISC, Zlib, Apache-2.0, CC0-1.0** : permissives. Apache-2.0 (scroll-timeline, view-transitions-toolkit, theatre) ajoute une clause de brevets et l'obligation de signaler les modifications ; CC0 (ncase) n'impose rien, mais **les sons de *trust* ont leurs propres licences** (dont CC BY-NC).
- **LGPL** (p5.js 2.1, pa11y 3.0) : usage en bibliothèque possible, modification du code de la bibliothèque à redistribuer sous LGPL. Pas concerné (outils de test ou non utilisés).
- **GPL-3.0 / AGPL** (quelques thèmes Astro, landgreen/physics) : contaminantes — **à ne pas copier** dans le site.
- **NOASSERTION** (thebookofshaders, glslify, konva, svg.js, uswds, aria-practices, DSFR, astro, basement scrollytelling, react-three-a11y…) : GitHub ne reconnaît pas le fichier ; lire le fichier avant toute reprise. Cas vérifiés : DSFR = Etalab 2.0 **+ modalités d'utilisation restrictives** (voir X11) ; basementstudio/scrollytelling = MIT dans le fichier LICENSE racine.
- **« non vérifiée »** (GSAP, ogl, my-room-in-3d, la plupart des démos de recherche) : aucune licence détectée par l'API ; considérer comme **tous droits réservés** tant que le fichier n'a pas été lu.
- **GSAP** : licence propre de GreenSock (non OSI) ; non vérifiée dans ce tour. Sans objet tant que GSAP n'est pas utilisé.

### 6.3 ToutouBien copie-t-il du code de ces dépôts ?

**Non, d'après la vérification effectuée.** Méthode : `grep -r -l -F` sur `/home/user/ToutouBien/src` pour 33 identifiants caractéristiques des dépôts étudiés :

`useTracker`, `ScrollRig`, `GlobalCanvas`, `SmoothScrollbar` (r3f-scroll-rig) · `cosPalette`, `uDeepPurple`, `uFrequency`, `uAmplitude`, `pnoise`, `rotation3dY` (shaders-on-scroll) · `offsetFactor`, `sectionHeight`, `RefractionMaterial`, `backfaceFbo`, `state.top` (the-substance) · `scrubTimeline`, `capScrollTopByProgressRate`, `useTierController`, `ENGINE_TIERS`, `particleMultiplier`, `AssetOrchestrator` (project-universe-) · `animated-word`, `polygon(14%` (award-winning-website) · `generateGalaxy`, `uniTime`, `randomnessPower`, `branchAngle` (galaxy) · `lenis`, `gsap`, `react-three`, `@react-three`, `zustand`, `lerp` (dépendances).

**Résultat : 0 fichier correspondant pour chacun des 33 identifiants.** `package.json` ne déclare que `three ^0.186.1` parmi ces bibliothèques. Les ressemblances de fond (une progression partagée, des paliers, des niveaux de qualité) relèvent d'idées et de techniques générales, non d'une reprise de code ; `quality.ts` indique lui-même s'inspirer d'un autre projet du même commanditaire (« HYDR'EAUX SCAN »), réécrit pour ToutouBien. Limite : un `grep` d'identifiants ne prouve pas l'absence de toute paraphrase ; il exclut la copie directe des fichiers inspectés.

### 6.4 Obligations actuelles de ToutouBien liées à ce tour

- **three.js** (MIT) : la notice MIT est embarquée dans le paquet npm ; la conserver dans le bundle (les commentaires de licence ne doivent pas être supprimés par la minification) ou la citer dans `docs/IMAGE-LICENCES-AND-CREDITS.md` / mentions légales.
- **Aucune autre obligation nouvelle** : rien n'a été intégré.

---

## 7. Limites

- **Réseau** : l'API REST GitHub (`api.github.com`) est bloquée pour les dépôts hors session (recherche et `repos/{owner}/{repo}`) ; **WebFetch n'est pas disponible** ; de nombreux hôtes externes sont filtrés par le proxy (les démos signalent `ERR_TUNNEL_CONNECTION_FAILED` pour leurs ressources tierces : polices, analytics). `git clone` et `raw.githubusercontent.com` fonctionnent. Les métadonnées (étoiles, licences) viennent de l'outil de recherche GitHub de la session ; elles sont exactes au 10/10/2026 mais n'ont pas été recoupées par un second canal.
- **Démos** : exécutées en Chromium headless avec **rendu WebGL logiciel** (SwiftShader) : les FPS observés ne reflètent pas un GPU réel ; aucune interaction n'a été simulée au-delà d'une molette de 1 500 px ; project-universe- n'a pas été parcouru au-delà de l'écran d'accueil ; shaders-on-scroll n'a été construit qu'après un correctif local (copie de travail), signe que son `parcel: latest` n'est plus reproductible tel quel ; r3f-scroll-rig ne construit plus avec les types actuels.
- **Profondeur** : en Tier 2, un ou deux fichiers lus par dépôt, ciblés par `grep` — pas d'audit complet. En Tier 1, **aucun fichier lu** : la colonne « Objet » reprend la description fournie par l'auteur, qui peut être optimiste ou datée.
- **Résultats de recherche bruités** : les requêtes plein texte remontent beaucoup de dépôts d'exercices ou sans rapport (écartés du § 4) ; les dépôts « connus » ont été vérifiés par requêtes `repo:` ; certains noms supposés n'existent pas sous cette forme (`stegu/webgl-noise`, `pmndrs/maath`, `idiotWu/smooth-scrollbar`, `nytimes/ai2html`, `pmndrs/r3f-perf`, `bramus/scroll-driven-animations` : non trouvés par la recherche) et ne figurent donc pas dans la liste.
- **Recherche web** : quatre requêtes seulement ; les guides sur le repli WebGL/mouvement réduit sont des blogs et catalogues de composants, pas des normes. Note : un de ces guides présente WCAG 2.3.3 comme critère AA alors qu'il s'agit d'un critère **AAA** ; respecter `prefers-reduced-motion` reste une bonne pratique forte, pas une obligation AA à elle seule.
- **Fichiers laissés hors du projet** : clones sous `/home/user/research/` (avec `node_modules`, `build/` ou `out/` pour les démos) ; copies de travail et captures dans le bloc-notes de session. Les fichiers suivis par git modifiés par `npm install` (`yarn.lock`, `dist/`) ont été restaurés. Dans `/home/user/ToutouBien`, seul ce document a été créé.

### Sources web citées

- [Codrops — Crafting a Dreamy Particle Effect with Three.js and GPGPU (déc. 2024)](https://tympanus.net/codrops/2024/12/19/crafting-a-dreamy-particle-effect-with-three-js-and-gpgpu/)
- [Alfred-Mountfield/WebGLParticles](https://github.com/Alfred-Mountfield/WebGLParticles)
- [webgl landing steering (checklist)](https://tessl.io/registry/skills/github/MengTo/Skills/webgl-landing-steering)
- [Verdigris — Reduced Motion Guide](https://design.verdigris.co/categories/animation/reduced-motion)
- [Mozilla bug 1010538 — smooth scroll masse-ressort-amortisseur critique](https://bugzil.la/1010538)
- [Mozilla bug 1026023 — AxisPhysicsModel](https://bugzilla.mozilla.org/show_bug.cgi?id=1026023)
- [Unreal Engine — FMath::CriticallyDampedSmoothing](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Core/FMath/CriticallyDampedSmoothing)
- [MDN — `view()` (animation-timeline)](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline/view)
- [Astro — View transitions](https://docs.astro.build/ja/guides/view-transitions)
