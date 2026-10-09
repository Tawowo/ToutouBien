# Registre de validation des contenus

## Comment fonctionne le système

Chaque information métier est saisie **une seule fois** dans `src/config/site.ts`, avec un statut :

| Statut | Signification | Affichage en production |
| --- | --- | --- |
| `confirmed` | Confirmé par Mme Petitgand (ou visible sur un document fourni) | Affiché |
| `brief` | Rapporté lors de l'échange initial | Affiché **avec une formulation prudente** |
| `pending` | Proposition ou information à valider | **Masqué** |
| `missing` | Inconnu | **Masqué** |

- En **développement** (`npm run dev`) ou en **préproduction** (`PUBLIC_SHOW_DRAFTS=true`), les éléments non validés apparaissent avec un **marquage orange « À valider » / « Manquant »**, ce qui permet de relire le site avec la cliente.
- En **production**, aucun de ces marquages n'apparaît (c'est vérifié par un test automatique) et les informations non validées sont absentes.
- Les **articles** suivent la même logique (`status: draft | review | published`). Seuls les articles `published` sont générés en production ; s'il n'y en a aucun, les pages Ressources et Blog **ne sont pas générées** et disparaissent du menu.
- `npm run check:launch` liste les éléments **bloquants** qui restent avant publication.

Pour valider une information : remplacer `missing(...)` ou `pending(...)` par `confirmed('valeur')`, puis relancer le build.

## Éléments BLOQUANTS avant publication

| Information attendue | Utilité | Pages concernées | Qui confirme | Solution temporaire |
| --- | --- | --- | --- | --- |
| Nom ou dénomination de l'éditeur | Mentions légales (obligation légale) | Mentions légales, Confidentialité | Mme Petitgand | Masqué, contrôle de lancement en échec |
| Statut juridique, SIRET, adresse de l'éditeur | Mentions légales | Mentions légales | Mme Petitgand | Idem |
| Directeur·rice de la publication | Mentions légales | Mentions légales | Mme Petitgand | Idem |
| Hébergeur (nom, adresse, contact) | Mentions légales | Mentions légales | Selon l'hébergement choisi | Idem |
| Médiateur de la consommation | Obligatoire pour des prestations aux particuliers | Mentions légales | Mme Petitgand (adhésion à un médiateur) | Idem |
| Téléphone **ou** e-mail professionnel | Contact, mentions légales | Pied de page, Contact, Mentions | Mme Petitgand | Seul le formulaire est proposé |
| Adresse de contact pour les données personnelles | Politique de confidentialité | Confidentialité | Mme Petitgand | Masqué |
| Durée de conservation des demandes | Politique de confidentialité | Confidentialité | Mme Petitgand (avec un conseil si besoin) | Proposition : « 3 ans à compter du dernier contact » (`pending`) |
| Service d'envoi des formulaires | Transmission réelle des demandes | Parlons de votre chien, Contact | Choix technique + compte à créer | Envoi désactivé, avec un message honnête et un résumé copiable |
| URL définitive du site | Canoniques, sitemap, partage | Toutes | Mme Petitgand / prestataire | Domaine réservé `toutoubien.example` |
| Crédits de chaque photo ajoutée | Droits d'auteur | Pages concernées | Celui qui fournit la photo | Aucune photo pour l'instant |

## Éléments importants (non bloquants)

| Information attendue | Utilité | Pages | Statut | Solution temporaire |
| --- | --- | --- | --- | --- |
| **Nom public** (« Mme Petitgand » ? prénom ?) | Humaniser, confiance, SEO | Accueil, À propos | `pending` | « une éducatrice » / « votre éducatrice ». *Le brief la présente comme la compagne de Thierry Petitgand : vérifier qu'elle porte bien ce nom.* |
| Intitulé du métier (éducatrice canine, comportementaliste…) | Exactitude | À propos | `pending` | « éducatrice » dans les textes génériques |
| Présentation courte (2-3 phrases) | Accueil, À propos | | `missing` | Texte factuel neutre |
| Parcours | À propos | | `missing` | Section masquée |
| Vision de l'éducation canine | À propos | | `missing` | Masqué |
| **Méthodes utilisées** (et celles qu'elle refuse) | À propos, articles | | `missing` | Masqué. Les articles restent `review` tant que la méthode n'est pas validée |
| Valeurs | À propos | | `missing` | Masqué |
| **Qualifications** (ACACED, diplômes, formations) + justificatifs | Confiance, obligation réglementaire | À propos | `missing` | Rien n'est affiché |
| Expérience (sans chiffre invérifiable) | À propos | | `missing` | Masqué |
| **Zone d'intervention** | SEO local, formulaire, FAQ | Contact, FAQ, données structurées | `missing` | Le formulaire demande la commune |
| **Gratuité du premier rendez-vous** et conditions | Argument fort | Accueil, Accompagnement, FAQ | `pending` | Masquée en production |
| Durée du premier rendez-vous | Accompagnement | | `missing` | Masqué |
| Premier échange à distance possible ? | FAQ | | `missing` | Masqué |
| Lieux du premier rendez-vous (domicile / extérieur) | Accompagnement, formulaire | | `brief` | Affiché avec « peut se dérouler » |
| Prestations et tarifs | Page Accompagnement | | `missing` | Section masquée |
| Horaires de joignabilité | Contact | | `missing` | Masqué |
| Profils sociaux officiels | Pied de page, `sameAs` | | `missing` | Masqué |
| Avis clients **authentiques** (avec accord écrit) | Confiance | — | Aucun | Aucun avis affiché, aucun avis inventé |
| Cession des droits sur le logo + fichier vectoriel | Propriété, qualité | Toutes | Inconnu | Vectorisation technique |
| Photos authentiques | Voir `IMAGE-LICENCES-AND-CREDITS.md` | | Aucune | Compositions graphiques |

## Textes éditoriaux à relire (affichés, sans affirmation factuelle)

Rédigés pour le site : ils ne contiennent ni chiffre, ni promesse, ni qualification, mais **la voix et le positionnement doivent être validés** par Mme Petitgand.

| Texte | Emplacement | Point d'attention |
| --- | --- | --- |
| « Comprendre son chien, se sentir bien ensemble. » | Titre de l'accueil | Variante de la piste du brief ; à choisir avec elle |
| « ToutouBien accompagne les propriétaires et leur chien pour que le quotidien redevienne plus simple, à la maison comme en balade. » | Accueil | |
| « Un chien ne vient pas avec un mode d'emploi… » + « L'idée n'est pas de "corriger" votre chien… » | Accueil, « L'esprit » | Positionnement bienveillant : **doit correspondre à sa méthode** |
| Liste des 9 situations (« Il tire en laisse »…) | Accueil + formulaire | Ce sont des **questions de propriétaires**, pas des prestations. Retirer celles qu'elle ne souhaite pas traiter (ex. réactivité forte) |
| « Une éducatrice qui vient à vous » + texte | Accueil | Repose sur le brief (déplacements) |
| Les 5 étapes du parcours | Accompagnement | Indicatives (« elles donnent une idée du déroulement ») |
| « Ce que vous pouvez attendre » (pas de jugement, pas de promesse miracle, pas de diagnostic à distance, vétérinaire si besoin) | Accompagnement | Engagements : à valider |
| « Face à face, à la même hauteur » | À propos | Lecture du logo |
| Questions fréquentes « problème », « préparer », « morsure » | FAQ | La réponse sur la morsure cite une obligation légale (déclaration en mairie, surveillance vétérinaire, évaluation comportementale) : faire relire |
| Textes du formulaire, du message de confirmation et du message d'orientation en cas de blessure | Parlons de votre chien | |
| Voix : « vous », « nous » dans le formulaire, « l'éducatrice » ailleurs | Partout | Préfère-t-elle le « je » ? Le passage au « je » est simple une fois son nom confirmé |

## Articles (statut `review`, non publiés)

| Article | Points à valider |
| --- | --- |
| `chien-qui-tire-en-laisse.md` | Conformité à sa méthode et au matériel qu'elle recommande ; photo ; date |
| `arrivee-chiot-premieres-semaines.md` | Repères sur la socialisation, la propreté et la solitude ; photo d'un chiot ; date |
| `fiche-observer-son-chien.md` | Grille d'observation utile pour elle ; version PDF possible ; date |

Pour publier : passer `status: published`, ajouter `publishDate: 2026-MM-JJ`, puis relire en préproduction.
