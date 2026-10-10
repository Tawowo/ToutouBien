# Grammaire des étoiles

Les petites étoiles sont la signature visuelle de ToutouBien. Elles ne décorent pas : chacune a un sens.
Ce document fixe quand elles apparaissent, ce qu'elles veulent dire et comment elles bougent, pour que
le site reste cohérent quand on ajoute une page.

## Le principe

**Une étoile = un repère.** Quelque chose que l'on comprend, une étape franchie, une piste à explorer.
Un trait entre deux étoiles = un lien : entre deux étapes, entre une situation et ses explications,
entre une personne et son chien.

Conséquence : on n'ajoute jamais d'étoile « pour faire joli » sur un élément qui ne représente pas un repère.

## Les cinq usages

| Usage | Où | Sens | Comportement |
| --- | --- | --- | --- |
| **Le sentier** (particules WebGL) | Accueil, premier écran | Le flair, puis la progression d'une relation | Les particules forment une piste ; le duo humain + chien avance ; les mots *Observer → Comprendre → Ajuster → Avancer ensemble* s'allument quand le duo les atteint. |
| **La constellation de choix** | Accueil (« Par où commencer ? ») | Vous êtes une étoile ; chaque accompagnement en est une autre | Choisir relie votre étoile à celle de l'accompagnement par un rayon de lumière. |
| **La constellation des pistes** | Accueil (histoires), dossiers | Une situation a toujours **plusieurs** explications | La situation au centre, ses pistes autour, à des distances irrégulières (jamais un schéma géométrique). Les rayons se dessinent un par un. Survoler une piste allume son étoile. |
| **Le fil** | Accueil (« Le fil d'un accompagnement »), Contact, Dossiers (carte de lecture et méthode en cinq temps) | Les étapes d'un parcours | Un trait se dessine au fil du défilement et allume les étapes une à une. |
| **La constellation personnelle** | Orientation | Vos réponses dessinent votre situation | Une étoile par question répondue, une étoile satellite par préoccupation cochée, l'étoile « Vos pistes » au récapitulatif. Réagit en direct, avant même de valider. |

Le **ciel** (`data-sky`, voir ci-dessous) est le fond commun : une présence calme, pas un message.

## Le ciel de fond (`data-sky`)

- Activation : ajouter `data-sky="0.8"` sur une section (la valeur règle la densité, de 0.3 à 1.5).
  `data-sky-links` ajoute de fins traits entre étoiles proches (à réserver aux sections qui parlent de liens).
- Code : `src/scripts/motion.ts` (`initSkies`) ; styles `.sky` dans `src/styles/global.css`.
- Un seul `requestAnimationFrame` partagé, actif seulement pour les ciels visibles à l'écran.
- Mouvement réduit : ciel figé (aucune animation), toujours affiché.
- Densité recommandée : 0.4–0.6 sur fond clair (presque invisible), 0.8–1.4 sur fond nuit.

## Règles de mouvement

1. **Lent et doux.** Respiration des halos : 2,8 à 3,6 s. Rayons : 0,9 à 1 s. Jamais de clignotement rapide.
2. **Une cause, un effet.** Une étoile s'allume parce que l'on a fait quelque chose (défiler, choisir, répondre),
   ou parce que le récit arrive à elle. Pas d'animation sans déclencheur, sauf la respiration discrète d'une étoile active.
3. **Toujours lisible sans mouvement.** Avec `prefers-reduced-motion: reduce`, tout est affiché dans son état final.
   Sans JavaScript, le contenu (listes, liens) reste complet ; seules les étoiles interactives disparaissent.
4. **Décoratives pour les lecteurs d'écran.** Les SVG d'étoiles sont `aria-hidden` : l'information qu'elles portent
   existe toujours en texte (liste d'étapes, liste de pistes, récapitulatif).

## Couleurs

Uniquement la palette du logo : `--lueur` (cœur des étoiles), `--lagon` / `--turquoise` (rayons, halos),
`--sarcelle` (étoiles sur fond clair). Jamais d'or, d'orange ni de blanc pur saturé.

## Ajouter une étoile à une page : la checklist

- [ ] Que représente-t-elle ? (un repère, une étape, une piste) — sinon, ne pas l'ajouter.
- [ ] Qu'est-ce qui l'allume ?
- [ ] L'information existe-t-elle aussi en texte ?
- [ ] L'état final est-il visible en mouvement réduit ?
- [ ] Les couleurs viennent-elles de la palette ?
