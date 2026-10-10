# Indicateurs et mesure — ToutouBien

> Rôle : apprendre et s'améliorer, **sans collecte inutile**. Aucun outil de mesure ni traceur n'est
> installé à ce jour sur le site. Aucun objectif chiffré n'est présenté comme une prévision : on mesure
> d'abord un point de départ, puis on fixe des objectifs de test.

## 1. Indicateurs utiles

| Indicateur | Pourquoi | Source possible | Disponible aujourd'hui ? |
| --- | --- | --- | --- |
| Visibilité sur les recherches pertinentes (impressions, clics, requêtes) | Savoir si l'on est trouvé | Google Search Console (sans cookie sur le site) | Après mise en ligne |
| Vues des pages accompagnements, tarifs, premier rendez-vous | Intérêt pour l'offre | Mesure d'audience sans cookie | Non (à décider) |
| Ouvertures du décodeur par situation | Sujets qui comptent pour le public | Mesure d'audience (événements anonymes) | Non (à décider) |
| Lectures d'articles | Valeur des contenus | Mesure d'audience | Non |
| Clics vers « Parlons de votre chien » / « Écrire un message » | Passage à l'action | Mesure d'audience | Non |
| Demandes effectivement reçues | Résultat réel | Boîte mail / service de formulaire | Après activation |
| Origine déclarée du contact | Canaux efficaces | Question facultative dans le formulaire **[à ajouter si souhaité]** ou au premier échange | À décider |
| Qualité des demandes (la demande correspond-elle à l'offre ?) | Ajuster les messages | Appréciation de Mme Petitgand, sans fichier nominatif inutile | Après activation |
| Recommandations et retours authentiques | Confiance | Avis Google, messages | Après mise en ligne |
| Coût des actions (impression, outils) | Rentabilité | Tableau ci-dessous | — |
| Temps passé à produire les contenus | Soutenabilité | Tableau ci-dessous | — |

## 2. Méthode

1. **Semaines 1-6 après mise en ligne** : relever les valeurs de départ, sans objectif.
2. **Semaine 6** : fixer 2-3 objectifs de test raisonnables (ex. « le décodeur est ouvert plus souvent que
   la page d'orientation »), et une action par objectif.
3. **Semaine 12** : comparer, garder ce qui marche, abandonner le reste.

## 3. Mesure d'audience respectueuse (si Mme Petitgand la souhaite)

- Préférer une solution **sans cookie et sans donnée personnelle**, configurée pour l'exemption de
  consentement prévue par la CNIL pour la mesure d'audience strictement nécessaire (conditions à vérifier
  sur cnil.fr avant installation : finalité limitée, données anonymisées, pas de recoupement, durée de
  conservation limitée).
- Options à comparer : Matomo auto-hébergé (configuration exemptée), solutions européennes sans cookie
  (offres payantes), statistiques du fournisseur d'hébergement.
- **La CSP du site devra être mise à jour** (`connect-src`, `script-src`) pour l'outil retenu, puis la page
  confidentialité complétée.
- Aucun pixel publicitaire, aucun traceur tiers par défaut.

## 4. Tableau de bord (à tenir mensuellement)

Modèle prêt à copier dans un tableur : `docs/marketing-dashboard.csv`.

| Mois | Contenus publiés | Temps passé (h) | Dépenses (€) | Impressions Google | Clics Google | Ouvertures décodeur | Demandes reçues | Origine principale déclarée | Avis reçus | Ce qui a marché | Ce que l'on change |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M1 | | | | | | | | | | | |
| M2 | | | | | | | | | | | |
| M3 | | | | | | | | | | | |
