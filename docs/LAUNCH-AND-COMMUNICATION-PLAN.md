# Plan de lancement et de communication

Une activité indépendante n'a ni le temps ni le budget de lancer dix canaux en même temps. Ce plan **priorise** selon l'impact attendu, le coût, le temps et la difficulté. Il ne promet ni nombre de clients ni classement Google.

## Informations nécessaires avant toute publication

Voir `CONTENT-VALIDATION.md`. En résumé : identité légale, coordonnées, zone d'intervention, conditions du premier rendez-vous, nom public et présentation, choix de l'hébergement et du service de formulaire. `npm run check:launch` doit passer.

## Priorisation des canaux

| Action | Impact | Coût | Temps | Difficulté | Priorité |
| --- | --- | --- | --- | --- | --- |
| Fiche Google Business Profile (zone desservie, sans adresse publique) | Élevé (recherches locales) | Gratuit | 1-2 h + suivi | Faible | **1** |
| Site en ligne + Search Console | Élevé | Hébergement + domaine | Déjà fait côté site | Faible | **1** |
| Avis authentiques de premiers clients | Élevé (confiance) | Gratuit | Continu | Faible | **2** |
| Un réseau social déjà pratiqué par l'éducatrice | Moyen | Gratuit | 1-2 h/semaine | Moyenne | **2** |
| Partenariats locaux (vétérinaires, toiletteurs, animaleries indépendantes, refuges) | Élevé (recommandations) | Cartes de visite | Quelques rendez-vous | Moyenne | **3** |
| Ressources régulières (blog) | Moyen à long terme | Temps | 2-3 h / contenu | Moyenne | **3** |
| Ateliers collectifs | À évaluer | Variable | Élevé | Élevée | Plus tard (voir `FUTURE-ROADMAP.md`) |

On ne suppose pas qu'elle utilise déjà un réseau social. **Mieux vaut un seul réseau tenu régulièrement que trois abandonnés.**

## Checklist de lancement

- [ ] Informations bloquantes renseignées dans `src/config/site.ts`
- [ ] Mentions légales et politique de confidentialité relues par une personne compétente
- [ ] Nom de domaine choisi et acheté
- [ ] Hébergement choisi (voir `DEPLOYMENT.md`), variables d'environnement configurées
- [ ] Service de formulaire configuré, **test d'envoi réel** effectué de bout en bout (réception de l'e-mail vérifiée)
- [ ] Au moins un portrait authentique ajouté (fortement recommandé)
- [ ] Textes éditoriaux validés par Mme Petitgand
- [ ] Articles relus ; ceux qui sont validés passés en `published`
- [ ] `npm run verify`, `npm run test:e2e` et `npm run check:launch` au vert
- [ ] `PUBLIC_ALLOW_INDEXING=true` en production
- [ ] Search Console : propriété vérifiée, sitemap soumis
- [ ] Fiche Google Business Profile créée ou mise à jour avec le lien du site

## Première semaine

1. Mettre le site en ligne et vérifier chaque page sur un téléphone.
2. Faire soi-même une demande via le formulaire (réception, réponse).
3. Créer ou compléter la fiche Google Business Profile (zone, description, lien, photos authentiques).
4. Prévenir son entourage et ses contacts professionnels : un message personnel vaut mieux qu'une annonce.
5. Si elle utilise déjà un réseau social : une publication d'annonce (voir les exemples).

## Premier mois

- Publier **deux ressources** validées.
- Demander un avis aux premières personnes accompagnées (après la prestation, sans contrepartie).
- Prendre contact avec **2 ou 3 partenaires locaux** (vétérinaire de quartier, toiletteur…) : se présenter et laisser des cartes portant l'adresse du site.
- Noter les questions reçues : elles alimenteront la FAQ et le blog.

## Feuille de route sur trois mois

| Mois | Objectif | Actions |
| --- | --- | --- |
| 1 | Être trouvable | Site + fiche Google + premières ressources + bouche-à-oreille |
| 2 | Inspirer confiance | Avis authentiques, photos réelles, présentation complète sur « À propos » |
| 3 | Installer une routine | Un contenu toutes les deux semaines, une publication sociale par semaine, premier bilan des indicateurs |

## Exemples de publications (à adapter, sans date ni chiffre inventés)

**Annonce du site**
> ToutouBien a désormais son site ! Vous y trouverez comment se passe l'accompagnement, des repères pour le quotidien et un petit questionnaire pour me parler de votre chien en deux minutes. 🐾 [lien]

**Relais d'un article**
> Votre chien tire en laisse ? Avant de chercher « la » solution, il est utile de comprendre pourquoi. Quatre raisons fréquentes, et quelques repères pour commencer : [lien]

**Coulisses** *(uniquement avec une vraie photo et l'accord des personnes)*
> Une balade d'observation aujourd'hui. Prendre le temps de regarder comment un chien vit son environnement, c'est souvent là que tout commence.

**Rappel du formulaire**
> Une question sur votre chien ? Pas besoin d'écrire un long message : quelques questions à choix, et on en parle. [lien vers /parlons-de-votre-chien/]

## Indicateurs à suivre

Aucun outil d'analyse n'est installé (voir `PRIVACY-AND-SECURITY.md`). Indicateurs accessibles sans traceur :

| Indicateur | Source |
| --- | --- |
| Nombre de demandes reçues (formulaire + appels) | Boîte de réception du service de formulaire |
| Origine déclarée (« comment m'avez-vous connue ? », à demander de vive voix) | Carnet |
| Impressions, clics et requêtes dans Google | Search Console |
| Vues et appels depuis la fiche Google | Google Business Profile |
| Avis reçus | Google Business Profile |
| Core Web Vitals terrain | Search Console |

Si un suivi plus fin devient utile, choisir un outil de mesure configuré dans le cadre de l'exemption de consentement de la CNIL (voir `PRIVACY-AND-SECURITY.md`).
