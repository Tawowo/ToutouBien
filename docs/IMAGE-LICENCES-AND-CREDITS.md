# Images : licences, crédits et direction photographique

## État actuel (directive n° 7, 10/10/2026)

**80 photographies de chiens sont intégrées et affichées sur le site** (photothèque d'illustration, licence CC BY 2.0,
issues de Flickr via le jeu de données public Google Open Images). Inventaire détaillé, sources, auteurs et pages
d'utilisation : **[PHOTO-ASSETS.md](PHOTO-ASSETS.md)**. Crédits publics : page `/credits-photos/`.

Wikimedia Commons, Unsplash, Pexels, Openverse et Flickr restent inaccessibles depuis cet environnement (refus du
proxy, revérifié le 10/10/2026, y compris depuis une session neuve) : la chaîne Commons ci-dessous reste disponible
pour compléter ou remplacer des images depuis un poste qui y a accès.

### Chaîne prête à l'emploi (V3)

- `scripts/photos/manifest.json` associe chaque emplacement d'illustration (`illus-balade`, `illus-flair`,
  `illus-rencontre-chiens`, `illus-maison`, `illus-chiot`) à des fichiers Wikimedia Commons **candidats**,
  repérés par recherche web (titres et licences vus dans les résultats de recherche, **non vérifiés**).
- `node scripts/photos/fetch-photos.mjs` interroge l'API Commons pour chaque candidat, **refuse** toute
  licence non compatible (NC, ND, inconnue, GFDL seule), tout fichier trop petit ou non photographique,
  télécharge le premier candidat valide, l'optimise et écrit les crédits vérifiés dans
  `src/content/photo-credits.json`. `--dry-run` vérifie sans télécharger.
- Le composant `Plate` affiche alors la photo et sa légende « Photo d'illustration : auteur, licence »
  avec lien vers la source ; sans photo, la composition graphique reste affichée.
- Chaîne testée de bout en bout avec une image de test générée localement (puis supprimée) : la photo
  remplace l'illustration et le crédit s'affiche.
- La galerie (`src/assets/photos/galerie/` + `src/content/galerie.json`) est réservée aux photos
  authentiques de Mme Petitgand ; elle n'apparaît sur « À propos » que si des photos avec texte
  alternatif existent.

Pour activer : autoriser `commons.wikimedia.org` et `upload.wikimedia.org` dans les réglages réseau de
l'environnement (ou lancer le script sur une machine connectée), puis relire chaque image retenue.

### Historique

Tentatives de téléchargement depuis Unsplash, Pexels, Wikimedia Commons, Flickr, Openverse, Pixabay, StockSnap, Burst et rawpixel : toutes **refusées par la politique réseau de la session** (HTTP 403 au proxy). Les pages de licence de ces sources étaient elles aussi inaccessibles. Plutôt que de référencer des images impossibles à voir ou de licence non vérifiable, le choix a été de livrer un site complet sans photo, prêt à les recevoir.

| Visuel utilisé | Nature | Auteur | Licence / droits |
| --- | --- | --- | --- |
| Logo (et ses déclinaisons) | Fichier fourni par l'activité | ToutouBien | Propriété de l'activité. **À confirmer** : cession des droits par le ou la graphiste d'origine |
| Compositions graphiques (chemin, horizon, herbes) | SVG créés pour ce site | Créées pour le projet | Propriété de l'activité |
| Compositions « rencontre » et « portrait » | Recadrages de l'emblème du logo | Dérivées du logo | Comme le logo |
| Icônes au trait | SVG créés pour ce site | Créées pour le projet | Propriété de l'activité |
| Polices Instrument Serif, Instrument Sans, DM Mono | Fontsource (npm) | The Instrument Serif / Instrument Sans Project Authors, Colophon (DM Mono) | SIL OFL 1.1 (fichiers `LICENSE` des paquets installés) |
| Étude au trait du chien (`DogFigure`) | SVG créé pour ce site | Créée pour le projet | Propriété de l'activité |

## Comment ajouter une photo

1. Choisir l'emplacement dans `src/content/photos.ts` (identifiant, message, cadrage attendu).
2. Déposer le fichier sous `src/assets/photos/<identifiant>.jpg` (ou `.webp`, `.png`, `.avif`). Prévoir au moins 1600 px de large ; Astro génère les variantes AVIF et WebP aux bonnes tailles.
3. Renseigner `credit` dans `photos.ts` : `author`, `sourceUrl`, `licence`, `attributionRequired`, `authentic`.
4. Compléter le tableau des photos utilisées ci-dessous.
5. `npm run check:launch` refuse la mise en ligne si une photo déposée n'a pas de crédit.

## Registre des emplacements

| Identifiant | Page / section | Message porté | Situation visible attendue | Cadrage | Texte alternatif prévu | Limites d'interprétation |
| --- | --- | --- | --- | --- | --- | --- |
| `accueil-balade` | Accueil, « L'esprit » | Une relation détendue au quotidien | Personne et chien en promenade, laisse **détendue** | Format vertical en arche 4/5, sujets dans le tiers droit | « Une personne marche avec son chien en laisse détendue sur un chemin. » | Aucune traction, aucun matériel coercitif visible |
| `accueil-rencontre` | Accueil, « Le premier pas » | Prendre le temps de faire connaissance | Personne accroupie, chien qui **s'approche librement** | 4/5, à hauteur du chien | « Une personne accroupie laisse un chien venir à elle tranquillement. » | Le chien ne doit être ni retenu ni forcé |
| `educatrice-portrait` | Accueil + Qui suis-je | La personne qui accompagne | Portrait naturel de l'éducatrice, idéalement avec un chien | 4/5 vertical | « Portrait de l'éducatrice de ToutouBien. » (à personnaliser avec son nom) | **Photo authentique uniquement.** Jamais d'image de banque |
| `accompagnement-domicile` | L'accompagnement, « Chez vous » | Travailler dans le cadre de vie | Chien au repos près de sa famille, ou discussion avec le chien présent | 4/3, lumière de fenêtre | « Un chien se repose près de sa famille dans le salon. » | Une image de banque ne doit pas être présentée comme un client |
| `accompagnement-exterieur` | L'accompagnement, « Dehors » | Apprendre là où les situations se présentent | Balade en parc, laisse longue ou détendue | 4/3, horizon bas | « Une personne et son chien se promènent dans un parc. » | — |
| `illus-balade` | Accompagnement « Mieux comprendre son chien » | La balade partagée | Personne et chien qui marchent, laisse détendue | 4/5 en arche | « Une personne promène son chien en laisse sur un chemin. » | Photo libre, jamais présentée comme un client |
| `illus-flair` | Explorer « Le monde par le nez » | Flairer est un besoin | Chien qui renifle l'herbe | 4/3 | « Un chien blanc renifle l'herbe au bord d'un chemin. » | Idem |
| `illus-rencontre-chiens` | Accompagnement « Le chien adulte » | Lire une rencontre | Deux chiens qui se saluent calmement | 4/5 en arche | « Deux chiens se saluent en se reniflant dans un parc. » | Rencontre calme uniquement |
| `illus-maison` | Accompagnement « Difficultés du quotidien » | Le calme à la maison | Chien allongé à l'intérieur | 4/5 en arche | « Un chien noir se repose, allongé sur le sol d'une cuisine. » | Idem |
| `illus-chiot` | Accompagnement « L'arrivée d'un chiot » | Le repos du chiot | Chiot endormi | 4/5 en arche | « Un chiot beagle endormi. » | Idem |
| `educatrice-avec-chien` | Qui suis-je (médaillon rond) | Le lien avec son propre chien | Mme Petitgand avec son chien, complicité calme | Carré 1/1 | « Mme Petitgand et son chien. » (à confirmer) | **Photo authentique uniquement** |
| `apropos-atelier` | Qui suis-je (affiché **seulement** si une photo existe) | L'éducatrice au travail | Échange avec un propriétaire, chien détendu | 3/2 | « L'éducatrice échange avec un propriétaire et son chien. » | Photo authentique **avec accord écrit** des personnes visibles |

## Où apparaissent les photos d'illustration

Depuis la directive n° 6, chaque emplacement `illus-*` sert aussi de couverture : articles du blog (par catégorie,
`src/lib/covers.ts`), dossiers (`/dossiers/<situation>/`) et galerie (section « Photographies d'illustration »,
avec auteur et licence sous chaque image). Déposer une photo vérifiée dans `src/assets/photos/<identifiant>.jpg`
suffit : elle remplace la composition graphique partout, sans autre modification.

Les photos authentiques de l'activité vont dans `src/assets/photos/galerie/` (légendes dans `src/content/galerie.json`) :
elles apparaissent sur `/galerie/` et sur `/qui-suis-je/`.

## Photos utilisées

Voir [PHOTO-ASSETS.md](PHOTO-ASSETS.md) (80 photos). Le tableau ci-dessous concerne les emplacements alimentés par la chaîne Commons, toujours vide.

| Fichier | Emplacement | Auteur | Source (URL) | Licence | Attribution | Points à vérifier |
| --- | --- | --- | --- | --- | --- | --- |
| *(aucune pour l'instant)* | | | | | | |

## Recherche de photos : procédure à suivre (hors de cet environnement)

Pour chaque photo envisagée :

1. Ouvrir la **page d'origine** (et non une copie trouvée par un moteur de recherche d'images).
2. Noter l'auteur et l'URL exacte.
3. Lire la licence au moment du téléchargement :
   - **Unsplash** : usage commercial gratuit, attribution non obligatoire mais appréciée ; interdiction de revendre telle quelle ou de constituer un service concurrent. Pour les personnes identifiables, Unsplash ne garantit pas l'existence d'une autorisation de la personne photographiée ([unsplash.com/license](https://unsplash.com/license)). Les images « Unsplash+ » relèvent d'une licence payante distincte.
   - **Pexels** : licence non vérifiée dans cet environnement. À lire sur pexels.com/license.
   - **Wikimedia Commons** : licence propre à **chaque fichier** (CC BY, CC BY-SA…). Une attribution est souvent **obligatoire**, et le partage à l'identique peut l'être aussi.
4. Vérifier que l'image **correspond exactement au message** (voir le registre) : pas de chien manifestement détendu pour illustrer la peur, un chiot de l'âge annoncé, une promenade pour la marche en laisse, etc.
5. Ne jamais présenter une photo de banque comme Mme Petitgand, ses clients ou ses interventions.
6. Télécharger le fichier et le placer dans `src/assets/photos/` (aucun lien distant).

## Photos à demander à Mme Petitgand

Ce sont les plus précieuses, car elles seules peuvent montrer *son* travail.

1. **Portrait professionnel naturel** : en extérieur, lumière douce, si possible avec un chien (le sien ?), format vertical.
2. **Situation d'échange** : en discussion avec un propriétaire, chien présent (avec l'accord écrit des personnes visibles).
3. **Promenade avec un chien** : laisse détendue, plan large.
4. **Scènes d'accompagnement** : observation, récompense, moment calme.
5. **Environnement de travail** : lieux de balade habituels, matériel utilisé.
6. **Fichier vectoriel original du logo** et police utilisée.

Conseils pratiques : photos prises au smartphone acceptées si la lumière est naturelle ; fichiers originaux, non compressés par une messagerie ; plusieurs cadrages (vertical et horizontal).
