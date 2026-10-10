# Revue de qualité visuelle

> Méthode : inspection réelle dans Chromium (Playwright), **défilement écran par écran** (planches contact),
> au bureau 1440 × 900, tablette 820 × 1180, mobile 390 × 844, avec et sans mouvement réduit ; chaque
> interaction déclenchée ; erreurs console relevées ; puis correction et nouvelle inspection.
> Les rendus WebGL de cet environnement passent par SwiftShader (rendu logiciel) : les captures sont fidèles,
> les cadences d'image ne le sont pas.
> Captures avant/après : `docs/captures/`.

## 1. Grille (12 critères, note de 1 à 5, avant → après)

| # | Critère | Avant | Après | Commentaire |
| --- | --- | --- | --- | --- |
| 1 | Cohérence chromatique avec le logo | 2 | 5 | Orange, or, terracotta et beige retirés ; palette turquoise/sarcelle/nuit ; badges de brouillon recolorés |
| 2 | Hiérarchie typographique | 2 | 4 | Échelle resserrée (titre d'accueil 11,5 → 5,8 rem) ; reste à juger sur contenus réels |
| 3 | Synchronisation des animations de l'accueil | 2 | 5 | Une seule progression lissée ; textes et formes changent ensemble, dans les deux sens |
| 4 | Lisibilité des formes animées | 3 | 5 | Contour du logo net, paliers stables, plus de dispersion aléatoire |
| 5 | Interaction du reniflement | 2 | 5 | 6 odeurs testées une à une, re-sélection, toucher, réinitialisation, mouvement réduit |
| 6 | Lisibilité du texte sur les effets | 2 | 5 | Plus aucun libellé dans la fumée ; carnet opaque hors du pré ; marqueurs sur fond plein |
| 7 | Maturité des illustrations | 2 | 4 | Chien en étude au trait (contour unique, plus de langue rose) ; scènes recadrées |
| 8 | Effets parasites liés au pointeur | 1 | 5 | Cercle de l'accueil, boutons magnétiques et aperçu flottant supprimés |
| 9 | Mobile et tablette | 3 | 4 | Cadrage adaptatif du hero, pied de page en 2 colonnes, en-tête sans retour à la ligne |
| 10 | Stabilité de mise en page | 2 | 5 | CLS de l'accueil 0,386 → 0,001 ; aucun saut lors d'un repli WebGL (testé) |
| 11 | Accessibilité automatique | 3 | 5 | axe-core : 0 violation sur 24 pages (bureau et mobile) |
| 12 | Homogénéité entre pages | 3 | 4 | Même grammaire partout ; photos réelles encore absentes (réseau) |

## 2. Inventaire des défauts trouvés et traitement

| Défaut observé | Page / état | Cause | Correction |
| --- | --- | --- | --- |
| Grand cercle qui suit la souris | Accueil | Répulsion des particules par le pointeur (gaussienne) + halo chaud | Interaction supprimée du shader et des écouteurs |
| Orange/or/terracotta hors charte | Tout le site | Anciens jetons `--or`, `--argile`, couleurs codées en dur (≈ 60 occurrences) | Nouveaux jetons, remplacement systématique |
| Formes désynchronisées des titres | Accueil | Seuils de texte (0,1/0,42/0,72) ≠ seuils de transformation ; amortissement lent | `timeline.ts` partagé + ressort critique |
| Dispersion anarchique pendant les transitions | Accueil | Dérive aléatoire de 0,6 unité | Trajectoires en arc cohérentes |
| Titre d'accueil démesuré, bouton coupé | Accueil | `clamp(…, 9,5rem)` | `clamp(2,6rem, …, 5,8rem)` |
| Logo et anneaux coupés à droite | Accueil (bureau) | Décalage fixe | Cadrage calculé sur la largeur visible |
| Cœur sur le sur-titre | Accueil (mobile) | Recul insuffisant | Recul + sur-titre masqué en mode animé étroit |
| Logo statique sur les chapitres | Accueil (sans WebGL / mouvement réduit) | Positionnement absolu | Grille texte/emblème/chapitres |
| Décalage de mise en page au chargement | Accueil | Bascule statique → animé après le script | Décision avant le premier rendu |
| Saut de page lors d'un repli | Accueil (appareil lent) | Section 320svh → hauteur normale | Repli « léger » qui conserve la mise en scène |
| Odeur déjà trouvée sans effet au clic | Le monde par le nez | Découverte seulement si non trouvée | État de sélection unique |
| Fiche bloquant le pré et les clics | Le monde par le nez | Carte superposée au canvas | Carnet déplacé dans le panneau |
| Libellés illisibles dans la fumée | Le monde par le nez | Texte dessiné dans le canvas | Marqueurs HTML sur fond plein |
| Redécouverte immédiate après « Recommencer » | Le monde par le nez | Test de distance continu | Déclenchement à l'entrée dans le rayon |
| Haie en disques nets | Le monde par le nez | Cercles opaques | Masses floues |
| Chien « cartoon » (aplat, langue rose) | Accueil, Signaux, Distance | Style d'origine | Étude au trait, filtre de contour |
| Coutures internes du chien | Idem | Contour par partie, dégradé par forme | Filtre de dilatation + dégradé en coordonnées du dessin |
| Pictogramme blanc de l'autre chien | Distance | Icône simplifiée | Même étude au trait, retournée |
| Logo coupé et disque gris | Déroulement, scène 02 | Recadrage du viewBox | Logo entier |
| Étapes inactives illisibles (contraste 1,7:1) | Déroulement | Opacité 0,35 | Filet et décalage, contraste conservé |
| Numéro décoratif signalé en contraste | Approche | Texte réel masqué | Généré en CSS |
| Attributs `style` bloqués par la CSP | Signaux, Flair, Ressources | Styles en ligne | Attributs SVG et réglages par script |
| Liens rapides sur deux lignes | En-tête (1100 px) | Largeur insuffisante | Affichés à partir de 1200 px |
| Pied de page très long | Mobile | Une colonne | Deux colonnes |
| Fil décoratif sur le sommaire | Article (mobile) | Position absolue | Masqué sur mobile |
| Aperçu couvrant les descriptions | Accompagnements | Aperçu flottant | Supprimé |
| Bande claire au-dessus de la carte | Décodeur | Fusion des marges | `flow-root` |
| Compteur « 1 / 5 » sur trois lignes | Décodeur (mobile) | Retour à la ligne | `nowrap`, liens réorganisés |

## 3. Pages et états inspectés

Accueil (4 états de la scène, statique, repli léger, mobile, tablette), accompagnements (index + 4),
approche (onglets), déroulement (5 étapes, avec et sans mouvement), premier rendez-vous (checklist,
récapitulatif), tarifs, FAQ (recherche, état vide), questions (navigation), orientation (4 questions,
retour, récapitulatif), décodeur (sélection, 5 étapes, carnet, retour arrière), explorer (index, flair :
6 odeurs, distance : zones, signaux : scénarios), à propos, contact, parlons de votre chien, ressources
(recherche, filtres, état vide), blog (index, article), mentions légales, confidentialité, accessibilité, 404.

## 4. Restes à faire

- **Photos réelles** : aucune (hôtes bloqués) ; chaîne de vérification prête.
- Jugement final de la typographie avec les vrais textes de Mme Petitgand.
- Test sur appareils physiques (GPU réels, iOS Safari) : non disponible dans cet environnement.
