# Direction artistique (V3 — charte issue du logo)

> Cette version remplace les directions précédentes (« Le fil » en ivoire et argile, puis « Le flair » avec
> accents or). À la demande du commanditaire, toute couleur hors de l'univers du logo a été retirée.
> Les jetons sont définis dans `src/styles/global.css` (`:root`).

## 1. Point de départ : le logo

Une femme et un chien **face à face, à la même hauteur**, dans un cœur au trait épais ; « ToutouBien » et
la signature « Une famille heureuse au quotidien ». Couleurs d'origine : **turquoise #9AD3CD** et
**sarcelle #119693** sur fond noir. C'est la seule référence chromatique du site.

## 2. Couleurs

| Jeton | Valeur | Usage |
| --- | --- | --- |
| `--nuit` / `--nuit-2` / `--sous-bois` | #0B1514 / #132220 / #173130 | Fonds sombres (accueil, explorateurs, pied de page) |
| `--papier` / `--blanc` / `--lin` / `--sable` | #F1F5F3 / #FBFDFC / #E2EBE8 / #C7D7D3 | Fonds clairs « brume », cartes, illustrations |
| `--encre` / `--encre-douce` | #142120 / #45524F | Texte sur fond clair |
| `--craie` / `--craie-douce` | #EEF4F2 / #B2C3BF | Texte sur fond sombre |
| `--lagon` | #9AD3CD | Turquoise du logo : accents, boutons et italiques **sur fond sombre** |
| `--lagon-clair` / `--lueur` | #CFEAE6 / #DFF3EF | Lumière froide : particules, surlignages |
| `--turquoise` | #119693 | Sarcelle du logo : grands éléments, filets, décor |
| `--sarcelle` / `--accent` | #0E5F5B / #0B5450 | Texte, liens et boutons **sur fond clair** |
| `--brume` | #6F9A95 | Traits et décor secondaires |
| `--erreur`, `--succes` (+ fonds) | #A3261B, #2C6A3B | États de formulaire uniquement |

Règles : **aucun orange, or, terracotta ni beige** ; le rouge est réservé aux erreurs. Les couleurs codées
en dur dans les composants SVG/canvas reprennent strictement ces valeurs. Contrastes vérifiés
automatiquement (axe-core) sur toutes les pages : 0 violation.

## 3. Typographie

- **Instrument Serif** (titres) ; l'**italique porte l'idée-clé** de chaque titre, en turquoise.
- **Instrument Sans Variable** (texte courant, interface).
- **DM Mono** (étiquettes, numérotation 01-05, compteurs) : la grammaire du « carnet ».
- Échelle fluide `--step--2` à `--step-6` resserrée : le plus grand niveau culmine à 5,6 rem (au lieu de
  11,5 rem), le titre de l'accueil à 5,8 rem. Les titres impressionnent par la composition, pas par la taille.

## 4. Signature visuelle

| Élément | Rôle |
| --- | --- |
| Particules (le flair) | Elles se rassemblent en logo, s'étirent en sentier, se lient en deux anneaux |
| Fil continu | Relie les sections ; masqué quand il gênerait la lecture (articles sur mobile) |
| Cadre « carnet » | Numérotation 01-05, filet turquoise, étiquette mono : décodeur, posts, PDF |
| Étude au trait du chien | Silhouette sombre en dégradé, contour unique turquoise (filtre de dilatation), aucun aplat ni détail cartoon |
| Arche | Forme des photos et illustrations principales (rappel du cœur) |

## 5. Mouvement

- **Une seule progression lissée** (ressort amorti critique) pilote les particules et les textes de
  l'accueil : synchronisation exacte dans les deux sens (`src/scripts/flair/timeline.ts`).
- Paliers stables entre des transitions courtes ; trajectoires en arc, jamais de dispersion aléatoire.
- **Aucun élément ne suit le pointeur** (suppression du cercle de l'accueil, des boutons magnétiques et de
  l'aperçu flottant).
- Transitions de 300 à 700 ms, courbe `--ease-out` ; `prefers-reduced-motion` respecté partout (version
  statique, transitions supprimées), y compris si la préférence change pendant la visite.

## 6. Photographie

Photos authentiques en priorité (galerie réservée à Mme Petitgand) ; photos libres seulement après
vérification automatique de la licence, crédit affiché, jamais présentées comme des chiens accompagnés.
Cadrage « à hauteur de chien ». Voir `IMAGE-LICENCES-AND-CREDITS.md`.

## 7. Déclinaisons hors site

Le système reste reconnaissable sans logo : fond nuit, idée-clé en italique turquoise, numérotation mono,
filet turquoise. Gabarits décrits dans `LAUNCH-CAMPAIGN.md` (carrousels, vidéos verticales, carte
« carnet », affiche A4).
