# Images : licences, crédits et direction photographique

## État actuel (vérifié)

**Aucune photographie n'est utilisée sur le site.** Tentatives de téléchargement depuis Unsplash, Pexels, Wikimedia Commons, Flickr, Openverse, Pixabay, StockSnap, Burst et rawpixel : toutes **refusées par la politique réseau de la session** (HTTP 403 au proxy). Les pages de licence de ces sources étaient elles aussi inaccessibles. Plutôt que de référencer des images impossibles à voir ou de licence non vérifiable, le choix a été de livrer un site complet sans photo, prêt à les recevoir.

| Visuel utilisé | Nature | Auteur | Licence / droits |
| --- | --- | --- | --- |
| Logo (et ses déclinaisons) | Fichier fourni par l'activité | ToutouBien | Propriété de l'activité. **À confirmer** : cession des droits par le ou la graphiste d'origine |
| Compositions graphiques (chemin, horizon, herbes) | SVG créés pour ce site | Créées pour le projet | Propriété de l'activité |
| Compositions « rencontre » et « portrait » | Recadrages de l'emblème du logo | Dérivées du logo | Comme le logo |
| Icônes au trait | SVG créés pour ce site | Créées pour le projet | Propriété de l'activité |
| Polices Fraunces, Instrument Sans | Fontsource (npm) | The Fraunces Project Authors, The Instrument Sans Project Authors | SIL OFL 1.1 (vérifiée dans les fichiers `LICENSE` installés) |

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
| `educatrice-portrait` | Accueil + À propos | La personne qui accompagne | Portrait naturel de l'éducatrice, idéalement avec un chien | 4/5 vertical | « Portrait de l'éducatrice de ToutouBien. » (à personnaliser avec son nom) | **Photo authentique uniquement.** Jamais d'image de banque |
| `accompagnement-domicile` | L'accompagnement, « Chez vous » | Travailler dans le cadre de vie | Chien au repos près de sa famille, ou discussion avec le chien présent | 4/3, lumière de fenêtre | « Un chien se repose près de sa famille dans le salon. » | Une image de banque ne doit pas être présentée comme un client |
| `accompagnement-exterieur` | L'accompagnement, « Dehors » | Apprendre là où les situations se présentent | Balade en parc, laisse longue ou détendue | 4/3, horizon bas | « Une personne et son chien se promènent dans un parc. » | — |
| `apropos-atelier` | À propos (affiché **seulement** si une photo existe) | L'éducatrice au travail | Échange avec un propriétaire, chien détendu | 3/2 | « L'éducatrice échange avec un propriétaire et son chien. » | Photo authentique **avec accord écrit** des personnes visibles |

## Photos utilisées

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
