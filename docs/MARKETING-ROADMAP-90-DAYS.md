# Feuille de route marketing — 90 jours

> Rôle : qui fait quoi, quand, avec quels prérequis. Responsables : **MP** = Mme Petitgand · **Dev** =
> développeur · **Claude** = préparation par l'assistant (rédaction, intégration). Coûts : estimations à
> vérifier ; aucun devis n'a été demandé ; rien n'est acheté ni activé sans accord.
> Niveaux : **N1** essentiel · **N2** différenciation · **N3** expérimentation.

## Phase 1 — Fondations (jours 1-30)

| # | Action | Niv. | Priorité | Objectif | Resp. | Prérequis | Temps | Coût | Résultat attendu | Vérification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Valider les informations métier (`docs/CONTENT-VALIDATION.md`) : nom, titre, qualifications, zone, contacts, tarifs, conditions | N1 | Haute | Publier des informations exactes | MP | — | 2-3 h | 0 | `site.ts` en `confirmed` | Aucun bloc « à fournir » en préproduction |
| 2 | Valider le positionnement et la proposition de valeur | N1 | Haute | Une direction partagée | MP | `BRAND-POSITIONING.md` | 1 h | 0 | Accord ou corrections | Retour écrit |
| 3 | Relire les 9 articles, le décodeur, la FAQ, l'approche | N1 | Haute | Contenus justes | MP | — | 4-6 h | 0 | Articles passés en `published` | Build de production avec articles |
| 4 | Fournir photos authentiques (portrait, séances avec accords) | N1 | Haute | Confiance | MP | Accords écrits | 1-2 h | 0 | Fichiers dans `src/assets/photos/` | Planches affichées |
| 5 | Autoriser les hôtes de photos libres puis lancer `fetch-photos.mjs` | N2 | Moyenne | Illustrer en attendant | Dev | Réseau | 30 min | 0 | Photos vérifiées + crédits | Script « Toutes les photos sont vérifiées » |
| 6 | Choisir et activer le service d'envoi des formulaires | N1 | Haute | Recevoir les demandes | Dev + MP | Accord sur le service | 1 h | 0 à quelques €/mois | Envois réels | Test d'envoi réel + e2e |
| 7 | Nom de domaine et hébergement | N1 | Haute | Mise en ligne | Dev + MP | Accord | 1-2 h | ≈ 10-20 €/an (domaine, à vérifier) | Site accessible | `npm run check:launch` |
| 8 | Préparer les 8 premiers contenus du calendrier | N1 | Haute | Démarrer sans retard | Claude + MP | Validation des sujets | 3 h (MP : relecture) | 0 | Contenus prêts | Statuts ✅ |

## Phase 2 — Déploiement (jours 31-60)

| # | Action | Niv. | Priorité | Objectif | Resp. | Prérequis | Temps | Coût | Résultat attendu | Vérification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 9 | Mise en ligne (indexation activée) | N1 | Haute | Être trouvable | Dev | 1, 3, 6, 7 | 1 h | 0 | Site indexable | Search Console |
| 10 | Fiche Google Business Profile (zone de service) | N1 | Haute | Visibilité locale | MP (+ Claude pour les textes) | Zone, photos | 1-2 h | 0 | Fiche publiée | Fiche visible |
| 11 | Campagne « plusieurs histoires possibles » (4 semaines) | N2 | Haute | Faire connaître le décodeur | MP | Contenus validés | 2 h/sem. | 0 | 8 publications | Ouvertures du décodeur |
| 12 | Premiers contacts partenaires (2 cliniques, 1 refuge) | N2 | Moyenne | Recommandations | MP | Messages (`LAUNCH-CAMPAIGN.md` § 5) | 2 h | 0 | 1-2 échanges | Réponses reçues |
| 13 | Impression des cartes « carnet » | N2 | Basse | Supports locaux | MP | Coordonnées, devis | 1 h | quelques dizaines d'€ (devis) | 100-250 cartes | Cartes distribuées |
| 14 | Suivi des premières demandes (origine déclarée) | N1 | Haute | Comprendre ce qui fonctionne | MP | Formulaire actif | 15 min/sem. | 0 | Tableau tenu | `MARKETING-METRICS.md` |

## Phase 3 — Amélioration (jours 61-90)

| # | Action | Niv. | Priorité | Objectif | Resp. | Prérequis | Temps | Coût | Résultat attendu | Vérification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 15 | Bilan des indicateurs | N1 | Haute | Décider sur faits | MP + Claude | Données de 6 semaines | 1 h | 0 | 3 décisions | Compte rendu |
| 16 | Enrichir le décodeur (2 situations demandées par le public) | N2 | Moyenne | Plus de valeur | Claude + MP | Questions reçues | 3 h | 0 | 8 situations | Tests unitaires + relecture |
| 17 | Améliorer le parcours de contact selon les demandes reçues | N1 | Moyenne | Moins de friction | Dev | Retours | 2 h | 0 | Ajustements | Taux d'abandon (si mesuré) |
| 18 | Publier les retours de familles (accord écrit) | N2 | Moyenne | Confiance | MP | Procédure § 9 de la stratégie | 1 h | 0 | 1-3 retours | Accords conservés |
| 19 | Tester un format vidéo plus long ou une lettre mensuelle | N3 | Basse | Fidélisation | MP | Résultats des vidéos courtes | variable | 0 à l'outil d'e-mailing | Décision | Bilan |

## Ce que chacun peut faire

- **Claude (préparé ou réalisable)** : textes, contenus du calendrier, nouvelles situations du décodeur,
  intégration des informations confirmées, tests.
- **Développeur** : hébergement, domaine, service de formulaire, réseau pour les photos, mise en ligne,
  mesure d'audience respectueuse (si décidée).
- **Mme Petitgand (indispensable)** : toutes les informations métier, relecture, photos et accords,
  fiche Google, publications, relations partenaires, décisions de budget.
