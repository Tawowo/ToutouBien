# Audit initial du projet

*Réalisé le 9 octobre 2026, avant toute modification.*

## État du dépôt

| Élément | Constat |
| --- | --- |
| Dépôt | `Tawowo/ToutouBien`, branche `claude/toutou-bien-website-ylv9jo` |
| Historique | Aucun commit (« No commits yet »). Aucune branche distante (`git ls-remote` vide). |
| Fichiers | Aucun fichier, hormis `.git/`. |
| Documentation existante | Aucune (pas de README, CLAUDE.md ni AGENTS.md). |
| Framework / dépendances | Aucun. |
| Tests, lint, CI, déploiement | Aucun. |
| Modifications non commitées d'un tiers | Aucune, donc rien à protéger. |

**Conclusion :** le dépôt est vierge. L'architecture est créée de zéro et documentée.

## Ressources réellement disponibles

| Ressource | Statut |
| --- | --- |
| **Logo** | Fourni avec la demande sous la forme d'une image JPEG 2000 × 2000 px, fond noir, turquoise (#9AD3CD) pour l'emblème, sarcelle (#119693) pour le texte. **Aucun fichier vectoriel original.** |
| Portrait / photos de Mme Petitgand | Aucune. |
| Photos de clients ou d'interventions | Aucune. |
| Polices du logo | Inconnues (le texte du logo évoque un Garamond). |
| Documents métier (tarifs, prestations, qualifications) | Aucun. |
| Coordonnées, zone, informations juridiques | Aucune. |

Le logo fourni est conservé tel quel dans `src/assets/brand/logo-original-fourni.jpg`. Les déclinaisons dérivées sont décrites dans `ART-DIRECTION.md`.

## Environnement d'exécution

| Outil | Version / constat |
| --- | --- |
| Node.js | 22.22.0 · npm 10.9.4 (pnpm et yarn disponibles mais non utilisés) |
| Navigateur | Chromium (Playwright 1.56, `/opt/pw-browsers`) : utilisé pour l'inspection visuelle, les tests et Lighthouse |
| Image | ImageMagick et Pillow : utilisés pour extraire et décliner le logo |
| Réseau | Proxy avec liste d'autorisations. **Le registre npm est accessible.** En revanche **Unsplash, Pexels, Wikimedia Commons, Flickr, Openverse, Pixabay, jsDelivr, unpkg, nextjs.org et developers.google.com sont refusés** (403 au CONNECT). L'outil de lecture de pages web (WebFetch) est également bloqué ; seul l'outil de recherche web renvoie des résumés de résultats. |

### Conséquences de la restriction réseau

1. **Aucune photographie n'a pu être téléchargée ni vérifiée.** Il était impossible de consulter une page de photo, une licence ou l'image elle-même. Plutôt que de référencer des images invisibles, le site s'appuie sur un registre photographique prêt à recevoir de vraies photos et affiche, en attendant, des compositions graphiques originales (voir `IMAGE-LICENCES-AND-CREDITS.md`).
2. La recherche documentaire repose sur les résumés renvoyés par la recherche web, sans lecture directe des pages. Les sources sont citées, et les points non confirmés sur une source primaire sont signalés comme tels.
3. Les polices sont installées depuis npm (paquets Fontsource) et **hébergées sur le site**, ce qui est de toute façon préférable pour la confidentialité.

## Décisions d'architecture prises à l'issue de l'audit

- **Astro 7 (site statique) + TypeScript strict.** Le besoin est surtout éditorial : du HTML rapide, accessible et indexable, avec très peu de JavaScript. Astro n'envoie aucun JS par défaut, gère les collections de contenus Markdown et l'optimisation d'images. Next.js aurait imposé un runtime React inutile ici.
- **CSS natif avec propriétés personnalisées**, sans Tailwind : le système de design est petit et singulier, des jetons CSS suffisent.
- **Aucune bibliothèque d'animation.** Les animations liées au défilement sont en CSS (`animation-timeline: view()`), avec un repli statique (voir `CREATIVE-AND-TECHNICAL-RESEARCH.md`).
- **Pas de CMS** pour la V1 : un fichier de configuration typé et des fichiers Markdown, versionnés et validés au build.
- **Formulaires** : envoi réel vers un fournisseur configurable par variables d'environnement, sans backend à maintenir.

Voir `README.md` pour la structure du code.
