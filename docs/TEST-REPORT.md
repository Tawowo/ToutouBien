# Rapport de tests

> **État V3 (10/10/2026)** — résultats réels de la dernière exécution, sur build de production.

| Vérification | Commande | Résultat |
| --- | --- | --- |
| Lint | `npm run lint` | 0 erreur |
| Types (Astro + TypeScript strict) | `npm run check` | 0 erreur, 0 avertissement |
| Tests unitaires (Vitest) | `npm test` | **50 réussis** (modèles : orientation, signaux, flair, distance, qualité 3D, séquence d'accueil, décodeur, parcours de lecture ; champs ; envoi ; formulaire) |
| Tests de bout en bout (Playwright, bureau 1366 × 860 + Pixel 7) | `npm run test:e2e` | **191 réussis, 0 échec**, 1 ignoré (test souris sur mobile) |
| Accessibilité automatique (axe-core, WCAG 2.2 AA) | inclus dans e2e | 0 violation sur 24 pages × 2 formats |
| Liens internes | inclus dans e2e + script de parcours du build | 0 lien cassé |

Nouveaux tests V3 : chaque odeur du « monde par le nez » (trouvée, re-sélectionnée, réinitialisée) ;
absence d'effet lié au pointeur ; décodeur (situation, étapes, note transmise, retour arrière) ; perte du
contexte WebGL sans saut de page ; FAQ (recherche, état vide) ; questions ; orientation complète ;
checklist du premier rendez-vous ; minutage de l'accueil (paliers, un seul texte visible, réversibilité).

---

## Historique (V1-V2)


*Exécutés le 9 octobre 2026 dans l'environnement de développement (Linux, Node 22.22, Chromium 141 via Playwright 1.56). Les résultats ci-dessous sont ceux réellement obtenus lors de la dernière exécution.*

## Synthèse

| Contrôle | Commande | Résultat |
| --- | --- | --- |
| Lint (ESLint + TypeScript + Astro) | `npm run lint` | ✅ 0 erreur |
| Types (`astro check`, TS « strictest ») | `npm run check` | ✅ 0 erreur, 0 avertissement (64 fichiers) |
| Tests unitaires (Vitest) | `npm test` | ✅ **26/26** |
| Build de production | `npm run build` | ✅ 9 routes générées (sans article publié) |
| Tests de bout en bout (Playwright, ordinateur 1366 px + Pixel 7) | `npm run test:e2e` | ✅ **71 réussis**, 1 ignoré (menu compact : test réservé au mobile, ignoré sur ordinateur) |
| Contrôle de lancement | `npm run check:launch` | ❌ **4 bloquants, attendus** : URL publique, service de formulaire, mentions légales, indexation. C'est le comportement voulu tant que les informations ne sont pas fournies |

## Tests unitaires (26)

- **Parcours** (`tests/unit/wizard.test.ts`) : liste en français (« a, b et c », « … ou … ») ; un sujet obligatoire ; étapes facultatives ; prénom, moyen de contact cohérent (téléphone ou e-mail selon le choix) et consentement obligatoires ; limites de longueur ; reformulation fidèle aux déclarations ; **absence garantie de termes de diagnostic** (« agressif », « dominant », « diagnostic », « dangereux », « trouble »…) ; message prudent si une blessure est déclarée ; résumé structuré ; préremplissage `?sujet=` limité aux valeurs connues (aucune injection).
- **Envoi** (`tests/unit/submit.test.ts`) : configuration désactivée si incomplète ou non HTTPS ; charge utile adaptée à Formspree et à Web3Forms ; **aucune confirmation sans configuration** ; confirmation uniquement sur une réponse 2xx sans `success: false` ; refus et erreur réseau correctement signalés.
- **Contenus** (`tests/unit/fields.test.ts`) : seuls `confirmed` et `brief` sont publiables ; données structurées réservées au `confirmed` ; brouillons visibles uniquement sur demande ; **aucune coordonnée ni donnée juridique au statut intermédiaire** dans la configuration ; gratuité du premier rendez-vous non publiée tant qu'elle n'est pas confirmée ; validation du formulaire de contact.

## Tests de bout en bout

Exécutés sur un **build de production** dont le formulaire pointe vers un point de réception fictif, intercepté par le test : aucune donnée ne sort de la machine.

**Pour chacune des 7 pages** (accueil, accompagnement, à propos, parcours, contact, mentions légales, confidentialité), sur ordinateur et sur mobile :
- statut 200, **un seul h1**, titre, description de plus de 50 caractères, **canonique exacte** ;
- **aucun débordement horizontal** ;
- **aucune erreur console**, ce qui couvre aussi les violations de la CSP ;
- **audit axe-core WCAG 2.0/2.1/2.2 A et AA : 0 violation** ;
- **aucun contenu non validé visible** (pas de marquage brouillon, pas de « à confirmer », « à valider », « lorem », « TODO »).

**Transversal**
- Tous les liens internes trouvés sur ces pages répondent 200.
- Page inconnue : statut 404, page dédiée, `noindex`.
- Sans article publié : `/ressources/` et `/blog/` ne sont pas générées et ne figurent pas dans le menu.
- `robots.txt` bloque l'indexation par défaut ; le sitemap liste les 7 pages et exclut la 404.
- Données structurées : nom présent ; aucun téléphone, aucune adresse, aucune note agrégée.

**Parcours « Parlons de votre chien »**
- Validation : passer l'étape 2 sans sujet affiche une alerte annoncée (`role="alert"`) et reste sur l'étape.
- Parcours complet avec sujet prérempli par `?sujet=rappel`, résumé prudent, **retour arrière par « Modifier »** puis correction reflétée dans le résumé, envoi : **confirmation affichée uniquement après la réponse du serveur**, charge utile vérifiée (champs, `_replyto`, absence de termes de diagnostic).
- **Échec réseau** : message d'erreur, aucune confirmation, réponses conservées, « Réessayer » aboutit (2 appels).
- **Refus du service (HTTP 500)** : message d'erreur, aucune confirmation fictive.
- Blessure déclarée : message d'orientation affiché.
- **Formulaire de contact** : erreur si aucun moyen de réponse, puis envoi confirmé.

**Interface**
- Menu mobile : `aria-expanded`, liens visibles, fermeture par **Échap** avec retour du focus sur le bouton.
- Accordéons de la FAQ : ouverture au clic, contenu visible.
- **Mouvement réduit** : aucun élément animé, tout le contenu à opacité 1.
- Lien d'évitement : premier élément atteint au clavier.

## Vérifications manuelles et visuelles

| Vérification | Méthode | Résultat |
| --- | --- | --- |
| Rendu de toutes les pages | Captures Chromium pleine page, 1440 px et 390 px, relues une par une | Défauts trouvés puis corrigés (voir ci-dessous) |
| Débordements à 320, 390, 768, 1024, 1440 et 1920 px | `scripts/screenshots.mjs` | 0 px partout |
| Animations | Captures à 250 ms et 3 s, puis après défilement, sans mouvement réduit | Entrée du hero et révélations au défilement fonctionnelles |
| Pages du blog et marquage des brouillons | Serveur de développement (brouillons visibles) | Rendu correct |
| Logo vectorisé | Comparaison visuelle avec l'original | Fidèle (hors liseré de la version couleur) |

## Problèmes trouvés et corrigés pendant la vérification

1. **Menu mobile en débordement** (le document faisait 669 px de large sur un écran de 390 px) : les sélecteurs `.js` et `.no-js` étaient encapsulés par le scoping CSS d'Astro. Corrigé avec `:global()`.
2. **Classes transmises aux composants enfants sans style** (fil SVG géant, page de 15 000 px de haut) : passage à `scopedStyleStrategy: 'class'`.
3. **Titre du hero illisible** (italique turquoise posé sur l'emblème turquoise) : composition refaite en deux colonnes, sans chevauchement.
4. **Logotype rogné** dans l'en-tête (mauvais recadrage avant vectorisation, plus un fragment de la pointe du cœur) : re-vectorisé avec les bonnes bornes.
5. **Parcours entièrement déplié** (toutes les étapes, le succès et l'alerte visibles) : des règles `display: grid` écrasaient l'attribut `hidden`. Ajout de `[hidden] { display: none !important }`.
6. **Fil graphique traversant des textes** (bandeau final, hero mobile, introductions) : repositionné ou masqué selon la taille d'écran.
7. **« chez vous *et* en extérieur »** au lieu de « ou » : conjonction paramétrable.
8. **Espaces insécables** ajoutés automatiquement jusque dans des commentaires et dans un ternaire de code : nettoyés, puis la règle ESLint a été ajustée pour n'autoriser l'insécable que dans les textes.
9. **En-tête translucide** laissant transparaître le texte au défilement : rendu opaque.
10. **CLS de 0,06 à 0,085** sur le parcours et la page contact : l'état « par étapes » est maintenant appliqué en CSS dès le `<head>`, et les polices principales sont préchargées.
11. **Typage** (CSP, configuration Vitest, versions de `playwright-core` divergentes avec axe) : corrigé.

## Ce qui n'a pas pu être vérifié

- **Réception réelle d'un e-mail** : aucun fournisseur de formulaire n'est configuré (compte et choix à faire). Le comportement réseau est vérifié en simulation ; un test réel est requis après configuration (`DEPLOYMENT.md`).
- **Navigateurs autres que Chromium** (Safari, Firefox) : seuls les binaires Chromium sont disponibles dans l'environnement. Les fonctionnalités récentes utilisées (`animation-timeline`, `interpolate-size`) ont un repli sans animation.
- **Lecteurs d'écran réels** (NVDA, VoiceOver) : non testés. La structure est validée par axe et par les tests de rôles ARIA.
- **Données structurées dans l'outil de test des résultats enrichis de Google** : outil inaccessible depuis l'environnement.
- **Mesures terrain** (Core Web Vitals des vrais utilisateurs) : impossibles avant la mise en ligne.
