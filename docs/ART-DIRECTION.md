# Direction artistique

## Point de départ : le logo

Le logo est la seule ressource visuelle authentique : **une femme et un chien face à face, nez à nez, enfermés dans un cœur au trait épais**, avec le nom ToutouBien et la signature « Une famille heureuse au quotidien ». À l'origine, turquoise clair (#9AD3CD) et sarcelle (#119693) sur fond noir.

Ce qu'il raconte : **le regard partagé, à la même hauteur**. La direction artistique part de là.

## Trois pistes comparées

### A. « Le fil » ✅ retenue
- **Idée** : la relation est un fil, comme une laisse détendue, un chemin de promenade ou un lien entre deux regards. Une ligne continue traverse les pages, sort de la pointe du cœur du logo et relie les scènes.
- **Palette** : alternance d'ivoire (jour, lecture) et de « nuit » vert-noir (écho au fond du logo), turquoise du logo **réservé au fond sombre**, argile chaude pour l'action.
- **Typographie** : Fraunces (serif à empattements doux, axe « SOFT ») pour la voix éditoriale, Instrument Sans pour l'interface.
- **Photographie** : lumière naturelle, plans larges qui laissent de l'air, laisse détendue, regards partagés.
- **Animation** : le fil se dessine au défilement, avec des révélations courtes.
- **Avantages** : la piste vient du logo (elle est donc propre à la marque) ; elle fonctionne **avec ou sans photos** ; elle est très légère (SVG + CSS).
- **Risques** : une ligne trop présente devient décorative. Il faut donc une règle d'usage stricte (voir plus bas).
- **Clientèle** : chaleureuse sans être enfantine ; elle inspire la confiance d'un professionnel.
- **Mobile** : excellent, puisque le trait est vectoriel ; les compositions passent en une colonne et le fil est masqué là où il gênerait la lecture.

### B. « Carnet de terrain » ❌
- **Idée** : le carnet d'observation de l'éducatrice, avec papier kraft, annotations manuscrites, croquis et étiquettes en chasse fixe.
- **Avantages** : pédagogique et humain.
- **Risques** : glisse facilement vers l'artisanal ou l'amateur ; dépend d'illustrations de grande qualité que personne ne peut produire aujourd'hui ; l'écriture manuscrite est peu lisible et peu accessible.
- **Mobile** : les annotations deviennent illisibles.

### C. « Lumière dorée » ❌
- **Idée** : de grandes photographies plein cadre à l'heure dorée, avec un texte blanc minimal posé dessus.
- **Avantages** : émotion immédiate.
- **Risques** : **repose entièrement sur des photos qui n'existent pas encore** (et qu'il était impossible de télécharger ici) ; rendu générique « lifestyle » ; contraste du texte sur image fragile ; images lourdes, donc LCP dégradé.

**Pourquoi A** : c'est la seule piste qui naît du logo, qui reste aboutie sans photos tout en les accueillant ensuite, et qui reste légère.

## Système de design

Tous les jetons sont définis dans `src/styles/global.css` (`:root`).

### Couleurs

| Jeton | Valeur | Usage |
| --- | --- | --- |
| `--ivoire` | #F5EFE6 | Fond principal |
| `--lin` | #EBE2D4 | Sections secondaires, encadrés |
| `--sable` | #DCCDB6 | Illustrations |
| `--nuit` / `--nuit-2` | #0F1B1A / #172826 | Sections sombres, en-tête de l'accueil, pied de page |
| `--encre` / `--encre-douce` | #1A2422 / #4A5552 | Texte |
| `--craie` / `--craie-douce` | #F1ECE3 / #B9C3BF | Texte sur fond nuit |
| `--lagon` | #9AD3CD | Turquoise du logo : **uniquement sur fond sombre** |
| `--sarcelle` | #0E5F5B | Liens et turquoise lisible sur fond clair |
| `--argile` / `--argile-claire` | #A3472A / #E9B49C | Appels à l'action, numéros, le fil |
| `--erreur`, `--succes` (+ fonds) | #A3261B, #2C6A3B | États |

**Contrastes vérifiés (WCAG 2.2)** : encre sur ivoire 13,9:1 · encre douce sur ivoire 6,8:1 · sarcelle sur ivoire 6,6:1 · argile sur ivoire 5,3:1 · blanc sur argile 6,0:1 · craie sur nuit 15:1 · lagon sur nuit 10,6:1 · nuit sur lagon (bouton) 10,6:1 · erreur sur son fond 5,9:1 · anneau de focus sur ivoire 4,5:1 (≥ 3:1 requis). Tous respectent le niveau AA.

Le turquoise n'est **pas** la couleur de tous les composants. Sur fond clair, l'action est en argile ; le turquoise clair ne sert que sur fond nuit, là où il est lisible et fidèle au logo.

### Typographie

- **Fraunces Variable** (axes poids + SOFT), en romain et en italique. Titres de 340 à 380, `SOFT` 60 à 100 pour adoucir. **L'italique porte l'émotion** : chaque titre contient un fragment en italique (« se sentir bien », « une rencontre »).
- **Instrument Sans Variable** : texte courant, interface, surtitres en capitales espacées (0,14 em).
- Échelle fluide `--step--1` → `--step-6` (`clamp()`), de 0,84 rem à 9,5 rem.
- Typographie française : espaces insécables avant `? ! : ;` et dans les guillemets « ».

### Grille, espacements et formes

- Largeur max. 84 rem, gouttière fluide de 1 à 2,5 rem, mesure de lecture de 62 caractères.
- Compositions asymétriques **7/5, 5/7 et 4/7**, colonnes de titre « collantes » (sticky) sur ordinateur.
- Espacements fluides `--space-3xs` → `--space-2xl`.
- Rayons : 0,4 / 0,9 / 1,6 rem, pilule pour les boutons, et une **arche** (`--radius-arch`) pour les images, qui rappelle le haut du cœur.

### Composants

| Composant | Fichier | Notes |
| --- | --- | --- |
| Bouton (plein, contour, lagon) | `global.css` `.btn` | Hauteur ≥ 3,1 rem, flèche animée au survol, état de chargement |
| Lien fléché | `.link-arrow` | |
| Accordéon | `.accordion` + `<details>` natif | Fonctionne sans JS ; ouverture animée là où `interpolate-size` est pris en charge |
| Champs, choix en pastilles | `.input`, `.choice` | Zones tactiles ≥ 2,9 rem, focus visible, erreur signalée par une icône **et** un texte |
| Messages d'état | `.notice--error/success/info` | |
| En-tête / menu mobile | `SiteHeader.astro` | Navigation visible sans JS ; menu accessible (Échap, focus, `aria-expanded`) |
| Planche photo | `Plate.astro` + `PlateArt.astro` | Photo optimisée, ou composition graphique |
| Le fil | `Fil.astro` | 5 tracés : descente, traversée, boucle, vague, colonne |
| Carte d'article | `ArticleCard.astro` | Toute la carte est cliquable via le titre (un seul lien, accessible) |
| Bandeau d'appel à l'action | `CtaBand.astro` | Emblème en ton sur ton, fil en boucle |
| Premier rendez-vous | `FirstMeeting.astro` | N'affiche que les informations validées |
| Marquage « à valider » | `Draft.astro` | Visible uniquement en dev ou en préproduction |

## La signature : « Le fil »

- Une **ligne continue**, d'environ 1,6 px, en argile (sur ivoire) ou en argile claire ou lagon (sur nuit).
- Sur l'accueil, elle **sort de la pointe du cœur** du logo et descend vers la suite de la page.
- Dans le parcours, une **colonne sinueuse** relie les étapes numérotées (le chemin parcouru ensemble).
- Elle se **dessine au défilement**, en CSS uniquement.
- **Règles** : jamais plus d'un fil par section ; jamais par-dessus un texte (masqué sur mobile quand il croiserait le titre) ; toujours `aria-hidden`.

## Système photographique

En attendant de vraies photos, chaque emplacement affiche une **composition graphique** (chemin, horizon, herbes, rencontre, portrait), dont deux sont tirées de l'emblème lui-même. Ce n'est jamais une fausse photo. Les règles de prise de vue figurent dans `IMAGE-LICENCES-AND-CREDITS.md`.

- **Lumière** : naturelle, matin ou fin de journée, pas de flash.
- **Cadrage** : à hauteur du chien, sujets décentrés, de l'air pour le texte.
- **Distance** : la laisse est **détendue** et le chien s'approche de lui-même.
- **Couleurs** : verts doux, terres, ciel pâle, pour rester en accord avec l'ivoire et la nuit. Éviter les saturations fortes.
- **Ratios** : 4/5 (portrait, arche), 4/3 et 3/2 (scènes). Le recadrage mobile est géré par `object-fit: cover`.
- **Rythme** : alterner un plan large et un plan rapproché ; jamais deux portraits de chien de suite.

## Mouvement

- Entrée du premier écran : apparition décalée des lignes du titre (110 ms d'écart), en moins de 1,5 s, **sans jamais bloquer** l'accès au contenu.
- Révélations au défilement : glissement vers le haut avec fondu, et masque d'image qui s'ouvre (`clip-path`).
- Survols : flèches qui avancent, soulignement qui se trace.
- Pas d'animation en continu, pas de parallaxe, pas de défilement détourné.
- `prefers-reduced-motion: reduce` : **aucune animation**, tout le contenu est visible (vérifié par un test automatique).

## Déclinaisons du logo

| Fichier | Origine | Usage |
| --- | --- | --- |
| `src/assets/brand/logo-original-fourni.jpg` | Fichier fourni, intact | Référence |
| `src/assets/brand/logo-couleur-transparent.png` | Fond noir rendu transparent (alpha calculé), couleurs d'origine | Fonds sombres, image de partage |
| `src/assets/brand/emblem.svg` | **Vectorisation technique** (potrace) de l'emblème, en monochrome `currentColor` | En-tête, illustrations, favicon |
| `src/assets/brand/wordmark-nom.svg`, `wordmark-signature.svg` | Vectorisation du texte du logo | En-tête, pied de page |
| `public/favicon.svg`, `icon-*.png`, `apple-touch-icon.png`, `og-default.jpg` | Générés à partir des précédents | Navigateur, partage |

La vectorisation suit fidèlement le dessin (comparaison visuelle faite) sans le redessiner. Elle perd toutefois le liseré sarcelle de la version couleur. **Il faut demander le fichier vectoriel original** (AI, SVG ou PDF) et la police du texte, pour remplacer ces déclinaisons techniques. Toute refonte du logo serait un chantier distinct.
