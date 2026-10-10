# Stratégie SEO

## 1. Ce qui est en place (vérifié)

| Mécanisme | Implémentation | Vérification |
| --- | --- | --- |
| URLs propres, barre oblique finale | `/accompagnement/`, `/qui-suis-je/` (ancienne `/a-propos/` redirigée), `/parlons-de-votre-chien/`, `/blog/<slug>/`, `/blog/categorie/<id>/` | Tests e2e |
| Titre et description uniques par page | Prop `title`/`description` de `Base.astro` ; motif « Titre · ToutouBien » | Test e2e : description > 50 caractères, titre présent |
| Hiérarchie de titres | **Un seul h1 par page**, puis h2/h3 dans l'ordre | Test e2e + axe |
| Canoniques absolues | Construites à partir de `PUBLIC_SITE_URL` | Test e2e (égalité stricte) |
| Open Graph / Twitter | Titre, description, image 1200×630 (`og-default.jpg`), locale `fr_FR` | Inspection du HTML |
| Sitemap XML | `@astrojs/sitemap` → `sitemap-index.xml` (404 exclue ; pages vides jamais générées) | Test e2e |
| robots.txt | Généré au build. **Indexation bloquée par défaut** ; autorisée seulement si `PUBLIC_ALLOW_INDEXING=true` **et** brouillons masqués | Test e2e + Lighthouse |
| Meta robots | `noindex` en préproduction, sur la 404 et sur les articles non publiés | Test e2e |
| Page 404 dédiée | `src/pages/404.astro` (statut 404 servi par l'hébergeur) | Test e2e |
| Données structurées | `Organization` (→ `LocalBusiness` automatiquement dès que la zone **et** un contact sont confirmés), `WebSite`, `Article` et `BreadcrumbList` sur les articles publiés. **Propriétés issues uniquement de champs `confirmed`.** Ni adresse, ni note, ni avis | Test e2e : pas de `telephone`, d'`address` ni d'`aggregateRating` |
| Images | Composant `<Picture>` d'Astro : AVIF/WebP, `srcset`, dimensions fixées (pas de décalage de mise en page), chargement différé hors premier écran | Lighthouse : CLS ≤ 0,021 |
| Liens internes | Accueil → situations → formulaire prérempli ; articles → catégorie, articles liés, appel à l'action contextualisé | Test e2e : tous les liens internes répondent 200 |
| Performance | Voir `PERFORMANCE-AND-ACCESSIBILITY.md` | Lighthouse mobile 100 |

**Score Lighthouse SEO mesuré** : 66 en préproduction (seul échec : « page bloquée à l'indexation », volontaire) ; **100** sur un build avec `PUBLIC_ALLOW_INDEXING=true`.

## 2. Intentions de recherche visées

Aucune donnée de volume n'a pu être consultée (pas d'accès aux outils de mots-clés). Les intentions ci-dessous sont **qualitatives**, construites à partir des questions que se posent les propriétaires. Il faudra les prioriser avec Google Search Console après le lancement.

| Intention | Exemples de requêtes | Page cible | Condition |
| --- | --- | --- | --- |
| Trouver un·e professionnel·le près de chez soi | « éducatrice canine [ville] », « éducateur canin à domicile [secteur] » | Accueil + Accompagnement | **Zone d'intervention confirmée** (à ajouter dans les textes et les données structurées) |
| Comprendre le déroulement | « comment se passe une séance éducateur canin », « premier rendez-vous éducateur canin gratuit » | Accompagnement | Gratuité confirmée avant d'en parler |
| Marche en laisse | « chien tire en laisse que faire » | Article (rédigé, à valider) | Méthode validée |
| Chiot | « arrivée chiot premières semaines », « éduquer chiot conseils » | Article (rédigé, à valider) | Idem |
| Rappel | « chien ne revient pas au rappel » | Article à écrire | Voir le calendrier |
| Difficultés en promenade | « chien réagit autres chiens », « chien aboie en promenade » | Article à écrire | **Seulement si elle traite ces situations** |
| Solitude | « chien supporte pas être seul » | Article à écrire | Idem |

## 3. SEO local

**Ce qu'il ne faut pas faire** : créer des pages « éducatrice canine + ville » quasi identiques (pratique assimilée à des pages satellites), inventer une adresse, afficher de fausses notes.

**Actions qui nécessitent Mme Petitgand** (l'outil n'a accès à aucun de ces comptes) :

1. **Google Business Profile** en tant qu'**établissement de service sans adresse publique** : la zone desservie est renseignée, l'adresse masquée (les consignes Google demandent de ne pas afficher d'adresse si l'on ne reçoit pas de clients sur place). La catégorie la plus proche de l'activité reste à choisir.
2. Garder un **nom, des coordonnées et une zone identiques** partout : site, fiche Google, réseaux sociaux, annuaires.
3. Demander des **avis authentiques** aux clients satisfaits, après la prestation, sans contrepartie.
4. S'inscrire dans quelques annuaires sérieux (ex. pages professionnelles, annuaires de la commune) : peu nombreux, mais cohérents.

**Côté site, dès que la zone est confirmée** :
- renseigner `serviceArea` dans `site.ts`. L'accueil, le contact, la FAQ et les données structurées (`LocalBusiness` + `areaServed`) se mettent à jour automatiquement ;
- ajouter une phrase naturelle sur la zone dans le texte de l'accueil et de l'accompagnement ;
- éventuellement, **une** page « Zone d'intervention » utile (communes, déplacements, frais éventuels), plutôt que N pages par ville.

## 4. SEO éditorial

Chaque article dispose de : un champ `searchIntent` (documentation interne), une description de 50 à 170 caractères (validée au build), une structure en h2, une table des matières automatique (à partir de 3 h2), un avertissement « repères généraux », des sources facultatives, un appel à l'action vers le formulaire **avec le sujet présélectionné** (`ctaTopic`), et des articles liés de la même catégorie.

Voir `EDITORIAL-STRATEGY.md` pour le calendrier.

## 5. Après le lancement

1. Passer `PUBLIC_ALLOW_INDEXING=true` (après `npm run check:launch`).
2. Vérifier la propriété du domaine dans **Google Search Console** et y soumettre `sitemap-index.xml`.
3. Tester les données structurées avec le **test des résultats enrichis** de Google (non fait ici : outil inaccessible depuis l'environnement).
4. Au bout de 4 à 8 semaines, examiner les requêtes réelles dans Search Console et ajuster titres et descriptions.
5. Suivre les Core Web Vitals **terrain** (rapport Search Console) : les mesures de ce dépôt sont des mesures de **laboratoire**.
