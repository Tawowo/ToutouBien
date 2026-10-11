# Cartographie du site et expériences visuelles

État au 10/10/2026 (directive n° 6). Pour chaque page : son rôle, l'expérience visuelle qui lui est propre,
et ce qui a été **réellement testé** (navigateur Chromium via Playwright, bureau 1366–1440 px, tablette 1024 px,
mobile Pixel 7 / iPhone 13). « Testé auto » = couvert par un test automatisé qui passe ; « vu » = inspecté sur capture.

## Directive finale : calibrage (11/10/2026)

| Expérience | Ce qui a changé |
| --- | --- |
| Ouverture | Ordre de départ unique et fiable :<br>– photo voilée dès le premier affichage (jamais d'écran vide) ;<br>– top départ quand la 3D est prête, ou au bout de 1,1 s sans elle ;<br>– sans 3D, la photo fait sa mise au point au rythme du titre.<br>Particules qui arrivent en spirale depuis la profondeur, synchronisées avec les lettres. Fondu de 760 ms entre les pixels et la photo nette. Photo légèrement inclinée vers la souris (ordinateur).<br>Sans 3D ou si le contexte est perdu : la photo recule et se voile pendant que le logo se dessine, sans écran vide. Titre réglé aussi sur la hauteur d'écran. |
| Travelling | Calage :<br>– la première photo entre à 64 % de la largeur, la dernière finit à 40 % ;<br>– pauses au début et à la fin ;<br>– longueur en `svh`, insensible à la barre d'adresse mobile.<br>Mouvement : arcs et léger grossissement au centre, photos bornées en hauteur. Une seule légende, celle de la photo centrale.<br>Fil d'étoiles : il suit les photos et se dessine jusqu'au centre, chaque étoile s'allume au passage. |
| Accompagnements | Une composition propre à chaque scène (placement et mouvement des trois plans). L'iris s'ouvre depuis l'étoile de la scène. Le texte de la nouvelle scène entre avec l'iris, sans zone vide. Les scènes masquées sont `inert`. |
| Curseur truffe | Petite truffe sur ordinateur avec souris seulement :<br>– exacte et sans retard ;<br>– ne capte aucun clic ;<br>– turquoise sur les éléments cliquables, écrasée au clic.<br>Le curseur natif est conservé jusqu'au premier mouvement, ainsi que sur les champs, les fenêtres modales et hors de la fenêtre. Désactivé en contraste forcé et sur écran tactile. |

## Directive n° 8 : les expériences visuelles

Direction artistique : **« Du regard au lien »** — une vraie photo de chien, des pixels qui deviennent des étoiles,
des étoiles qui forment le lien (le logo). Le même motif relie l'ouverture, les transitions et le pied de page.

| Expérience | Où | Technique | Comportement |
| --- | --- | --- | --- |
| Ouverture « Du regard au lien » | Accueil | WebGL (three.js), un seul appel de dessin, positions calculées dans le shader | Les pixels d'une vraie photo arrivent de la profondeur et la composent pendant que le titre bascule lettre à lettre ; la photo nette prend le relais ; toucher la photo y fait passer une onde 3D ; au défilement, relief et rotation, dispersion en étoiles, constellation du logo, second message lettre à lettre |
| Travelling photographique | Accueil, Galerie | 3 plans en parallaxe réelle, perspective par photo, image qui glisse dans son cadre, fil d'étoiles | Le défilement vertical fait passer une vingtaine de photos en profondeur |
| Scènes des accompagnements | Accompagnements | Scène épinglée, ouverture en iris, 3 plans par scène | Chaque accompagnement s'ouvre depuis son étoile ; fil d'étoiles cliquable |
| Orientation qui réagit | Orientation | Iris CSS | Chaque réponse fait apparaître une photo correspondante dans la constellation |
| Fondatrice en plans | Qui suis-je | Plans en profondeur, entrée en perspective, fil d'étoiles dessiné | Emplacements réservés à ses vraies photos |
| Magazine | Blog | Rubriques colorées, grille décalée, une en carte superposée, reflet au survol, couverture en profondeur | — |
| Signature finale | Pied de page (toutes les pages) | SVG | Des étoiles dispersées se rassemblent sur le tracé du logo, qui se dessine |
| Transitions entre pages | Tout le site | View Transitions (CSS) | La page sortante recule, la suivante monte ; l'en-tête reste en place |
| Révélation des photos | Tout le site | IntersectionObserver + clip-path | Le cadre s'ouvre depuis son centre pendant que l'image recule |
| Profondeur au défilement | Blog, articles, approche, dossiers, accompagnements, contact | `translate` piloté par une seule boucle | Les images glissent dans leur cadre |

Repli : mouvement réduit, économie de données ou sans JavaScript → versions statiques lisibles ; sans WebGL ou appareil
trop lent → l'ouverture passe en mode allégé (photo, puis logo dessiné en SVG au défilement).

## Directive n° 7 : les chiens au premier plan

Toutes les pages ci-dessous ont été reprises : **80 vraies photographies de chiens** (voir `docs/PHOTO-ASSETS.md`),
palette plus lumineuse, sections sombres réduites. Principales nouveautés :

- **Accueil** : ouverture photographique (photo principale en arche, chiot en médaillon, truffe dans les feuilles,
  constellation qui relie les trois et fait apparaître *Observer · Comprendre · Avancer ensemble*) ; rubans de photos
  qui défilent lentement ; « Où en êtes-vous ? » avec quatre photos-étoiles ; **« Apprendre à regarder »** (six
  repères à découvrir sur une vraie photo) ; une photo au cœur de chaque situation ; section « Qui vous accompagne »
  illustrée ; fil de l'accompagnement passé en clair ; le sentier WebGL sombre a été retiré de l'accueil.
- **Accompagnements** : photo d'ouverture par accompagnement, une photo par situation fréquente, cartes photo.
- **Approche** : une photo par principe. **Dossiers et décodeur** : une photo par situation.
- **Blog** : couverture photographique par article (liste, article, cartes, catégories, bibliothèque), y compris
  l'état « articles en cours de relecture ».
- **Galerie** : 80 photos en mosaïque, filtres par thème, visionneuse limitée au filtre actif.
- **Qui suis-je** : cartes photo des quatre parcours ; portrait et photo avec son chien **toujours réservés** à ses photos.
- **Contact, Tarifs, FAQ, Explorer, Orientation, 404** : photos intégrées. Nouvelle page **Crédits photos**.

## Navigation

- Barre principale (≥ 1200 px) : **Accompagnements · Comprendre · Blog · Galerie · Qui suis-je** + bouton **Contact**.
- En dessous de 1200 px : logo, bouton Contact (≥ 768 px), bouton **Menu** (menu plein écran en trois groupes :
  Accompagner, Comprendre, ToutouBien). Focus piégé, fermeture par Échap — testé auto.
- Ancienne adresse `/a-propos/` → redirigée vers `/qui-suis-je/` — testé auto.

## Pages

| Page | Rôle | Expérience visuelle propre | État |
| --- | --- | --- | --- |
| `/` Accueil | Donner envie, orienter | Ouverture « Du regard au lien » (WebGL), travelling photographique ; constellation « Par où commencer ? » ; histoires en constellations (6 situations) ; fil lumineux des 5 étapes ; ciels étoilés | Testé auto (sélecteur clic + clavier, histoires → dossier, perte du contexte WebGL, aucun élément ne suit le pointeur, mouvement réduit) ; vu en séquence (captures multi-étapes) |
| `/accompagnements/` + 4 pages | Présenter les 4 besoins | Planches en arche, liste numérotée, « Vous reconnaissez-vous ici ? » (sélection de situations) | Testé auto (chargement, axe) ; vu |
| `/approche/` | Expliquer la méthode | Principes en onglets verticaux, emblème animé, engagements sur fond nuit | Testé auto ; vu |
| `/deroulement/` | Les étapes | Téléphone illustré + étapes qui défilent | Testé auto ; vu |
| `/premier-rendez-vous/` | Préparer | Checklist qui alimente un récapitulatif | Testé auto (checklist) |
| `/tarifs/` | Transparence | Planche « Les tarifs ne sont pas encore publiés », questions à poser | Testé auto ; vu |
| `/dossiers/` **(nouveau)** | « Comprendre les situations » | Ciel étoilé relié, méthode en 5 temps (fil d'étoiles), cartes à mini-constellation qui se dessine au survol | Testé auto (6 cartes, navigation) ; vu bureau + mobile + tablette |
| `/dossiers/<situation>/` ×6 **(nouveau)** | Déplier une situation | Carte de lecture collante qui s'allume section par section ; constellation irrégulière des pistes (rayons dessinés un à un, survol = étoile allumée) ; questions en citations ; « quand demander de l'aide » ; liens vers décodeur, expérience, accompagnement, articles ; précédent / suivant | Testé auto (carte de lecture `aria-current`, lien « Préparer un échange » avec sujet, dossier suivant) ; vu bureau + mobile |
| `/decodeur/` | Observer en 5 temps | Expérience signature sur fond nuit | Testé auto |
| `/explorer/` + flair, distance, signaux | Expériences interactives | Pré à explorer à la truffe (canvas), jauge de distance, chien illustré dont la posture change | Testé auto (chaque odeur trouvée / re-sélectionnée / réinitialisée) |
| `/orientation/` **(refait)** | « Où en êtes-vous avec votre chien ? » | Constellation personnelle qui se construit en direct (une étoile par réponse, un satellite par préoccupation, « Vos pistes » au récapitulatif) ; repère pédagogique après chaque choix ; récapitulatif éditorial avec dossiers liés | Testé auto (15 300 combinaisons en unitaire ; parcours souris, tactile et clavier ; retour ; modifier ; recommencer ; reprise `?stage=` ; chaque préoccupation) ; vu bureau + mobile |
| `/faq/`, `/questions/` | Répondre | Recherche insensible aux accents ; une question à la fois | Testé auto |
| `/blog/` **(toujours publié)** | Rubrique éditoriale | Article à la une (couverture asymétrique), recherche, filtres par catégorie, grille avec carte large, « Voir plus » ; en production sans article publié : présentation des rubriques à venir, sans date ni actualité inventée | Testé auto (état vide en production) ; recherche, filtres et « voir plus » vérifiés en préproduction (9 articles de démonstration marqués « Démonstration · à relire ») |
| `/blog/<article>/` | Lire | Barre de progression, sommaire, articles liés, fil d'Ariane « Blog » | Générées uniquement pour les articles publiés (aucun à ce jour) ; vu en préproduction |
| `/galerie/` **(nouveau)** | Images | Trois familles distinctes : photos authentiques (emplacements visibles en préproduction seulement), photos d'illustration créditées (dès qu'elles seront déposées), carnet graphique de la marque ; visionneuse `<dialog>` | Testé auto (ouverture, flèches, boucle, bouton suivant, Échap, retour du focus, bouton Fermer) ; balayage tactile codé mais non testé automatiquement |
| `/qui-suis-je/` **(nouveau, remplace À propos)** | Présenter Mme Petitgand | Portrait en arche + médaillon « avec son chien », parcours en fil d'étoiles, histoire du logo, principes, publics, qualifications, galerie, liste des informations à demander (préproduction) | Testé auto (chargement, axe, aucun contenu non validé en production) ; vu |
| `/contact/` **(enrichi)** | Écrire | En-tête nuit avec trajet lumineux jusqu'à une enveloppe ; parcours guidé recommandé ; formulaire validé ; « La suite, pas à pas » | Testé auto (validation, envoi intercepté, message de succès seulement après réponse du service) ; sans service configuré, le bouton reste désactivé et le dit |
| `/parlons-de-votre-chien/` | Demande guidée | Formulaire en étapes, préremplissage depuis décodeur / orientation / dossiers | Testé auto |
| Légal, accessibilité, 404 | | Sobres | Testé auto |

## Ce qui reste à faire pour aller plus loin

- **Photos** : aucune photo réelle n'a pu être téléchargée (hôtes bloqués dans cet environnement) ; les compositions
  graphiques tiennent la place. La chaîne de téléchargement avec vérification des licences est prête (`scripts/photos/`).
- **Contenus de Mme Petitgand** : récit, portrait, photos d'activité, coordonnées, délai de réponse (voir `CONTENT-VALIDATION.md`).
