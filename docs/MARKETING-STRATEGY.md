# Stratégie marketing — ToutouBien

> Rôle : décrire **comment** ToutouBien attire les bonnes personnes, leur apporte de la valeur, construit la
> confiance et facilite le contact. Le positionnement est décidé dans `BRAND-POSITIONING.md` ; le ton dans
> `EDITORIAL-GUIDELINES.md` ; le calendrier, la campagne, la feuille de route et la mesure ont chacun leur
> document. **Aucune action payante, publication ou campagne n'est lancée sans l'accord de Mme Petitgand.**

---

## 1. Publics prioritaires (profils de besoins, pas de statistiques inventées)

| | A. La famille qui accueille un chiot | B. Le foyer qui vit une difficulté | C. Le propriétaire curieux | D. La famille d'un chien adopté adulte |
| --- | --- | --- | --- | --- |
| Situation | Chiot à venir ou arrivé | Laisse, solitude, visites, rencontres | Pas de problème, envie de mieux faire | Nouveau foyer, histoire inconnue |
| Objectifs | Bien commencer, éviter les erreurs | Retrouver des balades et une maison sereines | Comprendre, enrichir la relation | Créer la confiance, comprendre ses réactions |
| Questions | « Par quoi commencer ? », « Il mordille, c'est normal ? » | « Est-ce de ma faute ? », « Combien de temps ? » | « Que veut dire ce signal ? » | « Est-il trop tard ? », « Pourquoi réagit-il ainsi ? » |
| Inquiétudes avant contact | Mal faire, coût | Jugement, honte, coût total, morsure | Utilité réelle | Passé inconnu, échec de l'adoption |
| Ce qui rassure | Étapes claires, préparation, ton simple | Absence de jugement, limites dites, vétérinaire si besoin | Contenus gratuits de qualité | Patience, explications, rythme |
| Critères de choix | Proximité, disponibilité, clarté | Méthode, confiance, transparence des prix | Qualité pédagogique | Expérience, douceur, explications |
| Canaux de découverte | Recherche Google, éleveur/refuge, vétérinaire | Recherche Google, bouche-à-oreille, vétérinaire | Réseaux sociaux, articles | Refuge/association, Google |
| Contenus utiles | Accompagnement chiot, articles chiot, préparation | Décodeur, articles, FAQ, questions délicates | Explorateurs, bibliothèque | Décodeur (chiens), distance de confort |
| Objections | « Trop tôt » | « Trop cher », « ça ne marchera pas » | « Je n'ai pas de problème » | « Il a trop vécu » |
| Prochaine étape | Préparer le premier rendez-vous | Décodeur → demande avec carnet | S'inscrire à une éventuelle lettre (plus tard) | Parcours d'orientation → demande |

Ces profils organisent déjà le site (quatre accompagnements, décodeur, orientation). Aucun ne repose sur
la culpabilité ou la peur.

---

## 2. Parcours client (12 étapes)

| Étape | Besoin | Obstacles | Manque d'information | Améliorations (✔ = déjà fait sur le site) |
| --- | --- | --- | --- | --- |
| 1. Découverte | Une réponse à une question | Contenus génériques | — | Décodeur et articles indexables ✔ ; posts « cinq temps » |
| 2. Première impression | Se sentir compris | Sites interchangeables | — | Accueil familial, particules, ton non jugeant ✔ |
| 3. Exploration | Voir si c'est pour soi | Navigation confuse | — | Menu par intentions ✔, orientation ✔ |
| 4. Ressources | Apprendre gratuitement | Contenus non relus | Relecture éducatrice | Bibliothèque, parcours de lecture ✔ (articles en relecture) |
| 5. Prestations | Comprendre l'offre | Offre floue | **Prestations réelles** | Pages accompagnements ✔ ; grille de formules prête, masquée tant que non confirmée ✔ |
| 6. Tarifs | Savoir à quoi s'attendre | Prix cachés | **Tarifs, conditions** | Page tarifs honnête ✔ ; publier les prix dès confirmation |
| 7. Prise de contact | Le faire sans pression | Formulaire long, peur d'engagement | **Délai de réponse** | Parcours guidé, prérempli depuis le décodeur ✔ ; service d'envoi à activer |
| 8. Échange initial | Être écouté | — | Durée, gratuité | Page premier rendez-vous + checklist imprimable ✔ |
| 9. Organisation | Un plan clair | — | Modalités réelles | Page déroulement ✔ (à valider) |
| 10. Suivi | Ne pas être lâché | — | Suivi réel | **À définir** (messages entre séances ?) |
| 11. Retour d'expérience | Pouvoir témoigner | — | Procédure | Modèle de demande de retour avec accord écrit (voir § 9) |
| 12. Recommandation | Partager | — | — | Décodeur partageable ; carte « carnet » à remettre ; avis Google sincères |

---

## 3. Architecture de conversion

Principe : **un appel à l'action par intention**, jamais le même bouton répété partout.

| Intention | Libellé | Destination | Ce qui se passe ensuite (affiché) |
| --- | --- | --- | --- |
| Comprendre une situation | « Ouvrir le décodeur » | /decodeur/ | Cinq temps, rien n'est enregistré ✔ |
| S'orienter | « Par où commencer ? » | /orientation/ | Récapitulatif, pistes ✔ |
| Découvrir une offre | « Explorer ce chemin » | /accompagnements/… | ✔ |
| Comprendre les prix | « Voir les tarifs » / « Demander les tarifs » | /tarifs/, /contact/?objet=tarifs | Message prérempli ✔ |
| Préparer | « Préparer mon rendez-vous » | /premier-rendez-vous/ | Checklist imprimable ✔ |
| Poser une question | « Écrire un message » | /contact/ | Formulaire court ✔ |
| Contacter | « Parlons de votre chien » | /parlons-de-votre-chien/ | Six étapes, vérification avant envoi ✔ |

Formulaires : peu de champs obligatoires, aucune confirmation affichée si l'envoi échoue (testé en e2e),
service d'envoi à activer après choix et accord (voir `docs/DEPLOYMENT.md`).

---

## 4. Stratégie SEO

### Cartographie des sujets (une intention = une page)

| Intention de recherche | Page cible | Pages de soutien (maillage) |
| --- | --- | --- |
| éducatrice canine [ville] **[zone à confirmer]** | Accueil + page zone (unique, quand la zone est confirmée) | À propos, tarifs |
| éducation chiot, arrivée chiot | /accompagnements/chiot/ | articles chiot, décodeur #chiot |
| chien tire en laisse | /blog/chien-qui-tire-en-laisse/ | décodeur #laisse, accompagnement adulte |
| rappel chien | /blog/le-rappel/ | décodeur #rappel, explorer flair |
| chien seul aboie / anxiété séparation | /blog/apprendre-la-solitude/ | décodeur #solitude, accompagnement quotidien |
| chien réactif autres chiens | décodeur #chiens + explorer distance | accompagnement adulte |
| langage corporel chien | /blog/lire-les-signaux/ | explorer signaux |
| tarif éducateur canin | /tarifs/ | FAQ, premier rendez-vous |
| premier rendez-vous éducateur | /premier-rendez-vous/ | déroulement |

Règles : pas deux pages sur la même intention ; pages locales uniquement pour des communes réellement
desservies et avec un contenu propre ; données structurées seulement pour les informations confirmées
(déjà appliqué : `confirmedValue`). Aucune position n'est garantie.

Technique (déjà en place) : site statique, sitemap, balises canoniques, CSP, performances mesurées
(Lighthouse mobile 88-100), indexation **désactivée tant que le site n'est pas validé**.

Liens légitimes : vétérinaires et refuges partenaires (s'ils le souhaitent), annuaires pertinents,
contenus pédagogiques citables (explorateurs).

---

## 5. Visibilité locale (après confirmation de la zone)

1. Fiche Google Business Profile en **zone de service** (sans adresse personnelle visible), catégorie
   adaptée, description reprenant la proposition de valeur, photos authentiques uniquement.
2. Publications Google mensuelles reprenant les contenus « cinq temps ».
3. Avis : demande sincère, sans contrepartie, après accompagnement ; réponses professionnelles à tous.
   Les règles françaises (art. L111-7-2 du Code de la consommation) et les règles de Google sont à
   relire avant toute sollicitation ; ne jamais acheter, filtrer ou rédiger d'avis.
4. Partenariats locaux (§ 8) et supports imprimés « carnet » (voir `LAUNCH-CAMPAIGN.md`).

---

## 6. Canaux retenus

| Canal | Pourquoi | Priorité | Rythme soutenable |
| --- | --- | --- | --- |
| Site + bibliothèque | Cœur du système, contenus durables | 1 | 1 article ou fiche / 2 semaines |
| Google (SEO + fiche locale) | Intention forte, local | 1 | 1 publication / mois |
| Instagram | Format visuel « cinq temps », carrousels, vidéos courtes | 1 | 2 publications / semaine |
| Facebook (page + groupes locaux selon leurs règles) | Public familial local | 2 | Repartage des posts Instagram |
| Partenaires et imprimés | Recommandation | 2 | Au fil des rencontres |
| TikTok / YouTube | Coûteux en production | 3 | Seulement si les vidéos courtes fonctionnent |
| Lettre d'information | Fidélisation | 3 | Mensuelle, inscription volontaire, après validation juridique |

---

## 7. Système de confiance

Clarté de la professionnelle (portrait réel, parcours), qualifications expliquées (ACACED : obligation
réglementaire ; diplômes : ce qu'ils attestent), services décrits, méthode expliquée et ce qui n'est
jamais fait, tarifs et conditions, FAQ (déjà riche), témoignages authentiques et autorisés uniquement,
photos réelles, limites (vétérinaire), mentions légales complètes. Pas de badges ni d'affirmations
invérifiables.

---

## 8. Partenariats (à explorer, aucun n'existe)

| Type | Intérêt mutuel | Proposition | Conflits / limites |
| --- | --- | --- | --- |
| Cliniques vétérinaires | Orienter les clients pour des questions éducatives ; ToutouBien oriente vers le vétérinaire en cas de doute santé | Échange de coordonnées, fiches « quand consulter » | Pas de commission ; indépendance des avis |
| Refuges / associations | Aider les adoptants | Fiche « premières semaines d'un chien adopté » offerte | Pas de rémunération déguisée |
| Éleveurs | Bien préparer les familles | Livret « arrivée du chiot » | Vérifier la cohérence des valeurs |
| Toiletteurs, pensions, pet-sitters | Clients communs | Dépôt de cartes « carnet », recommandations croisées transparentes | Mentionner toute contrepartie |
| Écoles, mairies (prévention morsures) | Prévention | Atelier « lire son chien » **[si compétence confirmée]** | Hors budget public non sollicité |

Messages de premier contact : voir `LAUNCH-CAMPAIGN.md`, § 6.

---

## 9. Témoignages : procédure

Demande écrite après l'accompagnement ; texte de la personne, non réécrit (corrections orthographiques
seulement, avec accord) ; prénom ou initiales selon son choix ; accord écrit conservé ; droit de retrait ;
aucune contrepartie. Les histoires « exemples » sont toujours présentées comme fictives.

---

## 10. Budget et niveaux

| Niveau | Contenu | Coût estimé | Temps estimé |
| --- | --- | --- | --- |
| 1 — Essentiel | Validation des informations, mise en ligne, fiche Google, 8 contenus prioritaires, formulaire actif | Hébergement statique (souvent gratuit à faible coût), service de formulaire (offres gratuites limitées ou quelques euros/mois), nom de domaine (≈ 10-20 €/an, **à vérifier**) | 10-15 h de Mme Petitgand sur le premier mois |
| 2 — Différenciation | Décodeur enrichi, vidéos courtes, carnet imprimé, campagne signature | Impression (quelques dizaines d'euros, **devis à faire**) ; tournage au téléphone | 2-3 h / semaine |
| 3 — Expérimentation | Lettre d'information, ateliers, nouvelles situations interactives, YouTube | Outil d'e-mailing (offres gratuites ou payantes, **à comparer**) | Selon résultats |

Montants indicatifs : aucun devis n'a été demandé. Rien n'est acheté ni activé sans accord.
