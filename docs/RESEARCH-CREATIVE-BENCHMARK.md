# Benchmark créatif — synthèse

Ce document fait le lien entre les trois recherches menées et les décisions prises. Les détails et les
niveaux d'inspection (métadonnées, README lu, code inspecté, démo exécutée) sont dans les documents sources.

| Recherche | Document | Portée |
| --- | --- | --- |
| Tour 1 : secteur, références éditoriales, techniques d'animation, formulaires, juridique | `CREATIVE-AND-TECHNICAL-RESEARCH.md` | Recherches web, accès limité |
| Tour 2 : 6 dépôts imposés (code inspecté, licences, 5 démos construites dont 4 exécutées) + 21 dépôts lus + 110 en métadonnées | `RESEARCH-ROUND-2.md` | Clones locaux et recherche GitHub |
| Marché : 123 références (dont 54 éducateurs), vocabulaire, offres, prix publics, confiance | `MARKETING-COMPETITOR-ANALYSIS.md` | Extraits de résultats de recherche uniquement |

## Ce qui a été retenu et implémenté

| Enseignement | Mise en œuvre dans le site |
| --- | --- |
| Une progression unique, lissée, partagée par l'image et le texte (au lieu de tweens séparés) | `timeline.ts` + ressort amorti critique à sous-pas (`scene.ts`) |
| Paliers stables entre transitions courtes (lisibilité des formes) | Logo → sentier → anneaux, textes changeant au milieu des transitions |
| Discipline de libération des ressources et repli statique | `dispose()` + `forceContextLoss()`, perte de contexte WebGL → version statique |
| Qualité adaptative et rendu logiciel | Paliers high/medium/low, mesure des temps d'image, palier léger en rendu logiciel |
| Pas d'effets pilotés par le pointeur ou la vitesse de défilement | Cercle de l'accueil, boutons magnétiques et aperçu flottant supprimés |
| Pédagogie interactive sous-exploitée par les indépendants | Décodeur du quotidien, trois explorateurs, orientation, préparation du rendez-vous |
| La famille absente des promesses concurrentes | Positionnement « comprendre en famille » (`BRAND-POSITIONING.md`) |

## Ce qui a été écarté

React / React Three Fiber (architecture sans React), GSAP + Lenis comme socle (défilement natif conservé),
défilement simulé, ressources lourdes ou sous droits réservés, code sans licence, DSFR (réservé aux
services publics), détection GPU dépendant d'un service distant.
