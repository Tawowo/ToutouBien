# Stratégie éditoriale (6 mois)

## Principes

- **Utile avant tout** : chaque contenu répond à une vraie question de propriétaire.
- **Dans le périmètre de l'éducatrice** : on n'écrit que sur des sujets qu'elle traite et selon *sa* méthode. Chaque article passe par le statut `review`, puis elle le valide.
- **Court et concret** : 600 à 1 200 mots pour un article, une page pour une fiche.
- **Prudence** : pas de diagnostic, pas de promesse ; orientation vers le vétérinaire en cas de douleur, de changement brutal ou de morsure.
- **Rythme réaliste** : **un contenu toutes les deux semaines**, à ralentir à un par mois si le temps manque. La régularité compte plus que la quantité.

## Catégories (définies dans `src/lib/categories.ts`)

| Catégorie | Contenu |
| --- | --- |
| **En promenade** | Marche en laisse, rappel, rencontres, balades |
| **L'arrivée d'un chiot** | Préparation, premières semaines, découvertes |
| **Au quotidien** | Maison, visites, solitude, vie de famille, enfants |
| **Comprendre son chien** | Observation, communication, besoins |

## Formats

| Format | Usage | Champ `format` |
| --- | --- | --- |
| Article | Comprendre un sujet | `article` |
| Fiche pratique | Checklist, grille, exercice expliqué | `fiche` |
| Guide | Sujet plus long, découpé en étapes | `guide` |
| *(futur)* Vidéo courte | Démonstration d'un exercice | à ajouter quand une vidéo existe |
| *(futur)* PDF téléchargeable | Version imprimable d'une fiche | à ajouter quand le PDF existe |

Les formats vidéo et PDF **ne sont pas affichés** tant qu'aucun contenu de ce type n'existe.

## Calendrier sur six mois

Les dates sont relatives au lancement (S = semaine). Les trois premiers contenus sont **déjà rédigés** (statut `review`).

| Semaine | Sujet | Intention de recherche | Public | Lien avec l'activité | Format | Réseaux sociaux | Validation nécessaire |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S0 | Mon chien tire en laisse : comprendre avant d'agir *(rédigé)* | « chien tire en laisse que faire » | Propriétaires de jeunes chiens et d'adultes | Situation n° 1 du formulaire | Article | Carrousel « 4 raisons pour lesquelles un chien tire » | Méthode, matériel |
| S0 | L'arrivée d'un chiot *(rédigé)* | « accueillir un chiot premières semaines » | Futurs et nouveaux propriétaires | Situation « chiot » | Guide | Liste « à préparer avant l'arrivée » | Socialisation, propreté |
| S2 | Fiche : observer une situation *(rédigée)* | « comprendre comportement chien » | Tous | Prépare le formulaire | Fiche | Visuel « 5 questions à se poser » | Grille |
| S4 | Le rappel : pourquoi mon chien ne revient pas | « chien ne revient pas rappel » | Propriétaires de chiens lâchés en balade | Situation « rappel » | Article | Courte vidéo d'un exercice (si elle en tourne) | Méthode |
| S6 | Premier rendez-vous : comment ça se passe ? | « éducateur canin premier rendez-vous » | Prospects | Prestation (une fois confirmée) | Article | Story « coulisses » | **Conditions du premier RDV** |
| S8 | Laisser son chien seul : les premiers pas | « chien seul à la maison » | Familles qui travaillent | Situation « solitude » | Article | Conseils en carrousel | Elle traite ce sujet ? |
| S10 | Fiche : préparer une balade sereine | « balade chien conseils » | Tous | Promenade | Fiche | Checklist | — |
| S12 | Chien et enfants : quelques repères | « chien et enfants cohabitation » | Familles | Situation « famille » | Article | Visuel « signes à respecter » | Sécurité, prudence |
| S14 | Les visites à la maison sans agitation | « chien saute sur les invités » | Propriétaires | Situation « excitation » | Article | Courte vidéo | Méthode |
| S16 | Croiser d'autres chiens en balade | « chien réagit autres chiens » | Propriétaires concernés | Situation « congénères » | Article | Prudent, pas de démonstration risquée | **Elle traite ce sujet ?** Prudence maximale |
| S18 | Fiche : choisir son matériel de promenade | « harnais ou collier chien » | Tous | Promenade | Fiche | Comparatif visuel | **Ses recommandations** |
| S20 | Chien inquiet : reconnaître les signes | « chien peureux comment l'aider » | Propriétaires | Situation « inquiétude » | Article | Infographie | Prudence, orientation vétérinaire |
| S22 | Le chiot qui mordille | « chiot mordille que faire » | Nouveaux propriétaires | Chiot | Article | Courte vidéo | Méthode |
| S24 | Bilan : questions les plus posées en 6 mois | Questions réelles reçues | Tous | FAQ vivante | Article/FAQ | Série de stories Q/R | Anonymiser les questions |

## Production : recommandations

1. **Partir des vraies questions** reçues par le formulaire (le champ « Précision » est une mine d'informations) et lors des rendez-vous. Les noter dans un carnet.
2. **Rédaction** : un brouillon dans `src/content/blog/<slug>.md` avec `status: draft`, puis `review`. Mme Petitgand relit, puis l'article passe en `published` avec une `publishDate`.
3. **Photo** : une photo adaptée au sujet (voir les règles dans `IMAGE-LICENCES-AND-CREDITS.md`), idéalement **authentique**. Sans photo, la carte affiche la composition graphique de la catégorie.
4. **Sources** : citer des sources fiables (vétérinaires, organismes officiels) dans `sources:` pour toute affirmation médicale ou légale.
5. **Lien interne** : chaque article mène vers le formulaire avec `ctaTopic`, et vers un ou deux articles liés.

## Réutilisation sur les réseaux sociaux

Un article peut fournir :
- **1 carrousel** (4 à 6 visuels) qui reprend les intertitres ;
- **1 citation** (le passage en exergue de l'article) ;
- **1 courte vidéo** si un exercice s'y prête (tournée par elle, avec son chien ou un chien client avec accord) ;
- **1 story Q/R** à partir de la FAQ.

Toujours renvoyer vers l'article complet, puis vers « Parlons de votre chien ».
