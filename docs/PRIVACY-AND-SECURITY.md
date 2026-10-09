# Confidentialité et sécurité

## Données collectées : minimisation

| Formulaire | Champs obligatoires | Champs facultatifs | Non collectés |
| --- | --- | --- | --- |
| Parlons de votre chien | Au moins un sujet, prénom, moyen de recontact (téléphone **ou** e-mail selon le choix), consentement | Prénom et âge du chien, circonstances, ancienneté, blessure survenue, commune, préférence de lieu, précision libre (1 200 caractères max.), meilleur moment | Nom de famille, adresse postale, race, photos, vidéos, données de santé détaillées |
| Contact | Nom ou prénom, un moyen de réponse, message (1 500 caractères max.), consentement | Second moyen de réponse | Idem |

- **Aucun fichier n'est accepté** (ni photo ni vidéo) : cela supprime le risque lié aux téléversements. Si ce besoin apparaît, voir `FUTURE-ROADMAP.md` (contrôle du type réel, de la taille, de la durée de conservation).
- La question « Quelqu'un a-t-il déjà été blessé ? » est facultative et propose « Je préfère en parler de vive voix ».
- Les limites de longueur sont vérifiées par le navigateur (`maxlength`) **et** par la validation JavaScript.

## Transmission

- Le site est **statique** : il n'existe aucun serveur applicatif ni base de données à protéger.
- Les demandes sont transmises en **HTTPS** à un fournisseur de formulaires configuré par variables d'environnement (`src/lib/submit.ts`). Une confirmation n'est affichée **qu'après une réponse positive** du fournisseur ; les échecs (réseau, refus, HTTP ≠ 2xx, `success: false`) affichent un message d'erreur, avec un bouton de nouvel essai qui conserve les réponses. Tout cela est vérifié par des tests unitaires et e2e.
- Si aucun fournisseur n'est configuré, le site **le dit** (« L'envoi en ligne n'est pas encore activé ») et propose de copier le résumé. Aucune fausse confirmation n'est possible.
- Les réponses ne sont **pas stockées dans le navigateur** (ni `localStorage` ni `sessionStorage`) : elles restent en mémoire le temps de la page et sont effacées après un envoi réussi.

## Protection contre les abus

| Mesure | Détail |
| --- | --- |
| Champ piège (`botcheck`) | Invisible pour les humains, ignoré par les lecteurs d'écran (`aria-hidden`, `tabindex=-1`). Rempli, il bloque l'envoi. Web3Forms l'exploite aussi côté serveur |
| Délai minimal | Envoi refusé moins de 4 s (parcours) ou 3 s (contact) après le chargement |
| Validation | Côté navigateur, et côté **fournisseur** (filtrage anti-spam inclus chez Formspree et Web3Forms ; voir les réglages de leur tableau de bord) |
| Limitation de débit | Assurée par le fournisseur. Avec un backend `custom`, **il faut l'implémenter** (par IP, avec quota) |
| Captcha | Non installé, par choix (accessibilité, traceurs tiers). À n'ajouter qu'en cas de spam avéré, de préférence une solution sans cookie |

## En-têtes et politique de sécurité

- **Content-Security-Policy** générée par Astro dans chaque page : `default-src 'self'`, scripts et styles autorisés **uniquement par empreinte SHA-256** (pas de `unsafe-inline`), `connect-src` et `form-action` limités au site **et au seul service de formulaire configuré**, `object-src 'none'`, `base-uri 'self'`. Les styles inline ont été retirés du code pour rendre cela possible.
- `public/_headers` (Netlify, Cloudflare Pages) : `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors 'none'`, HSTS, cache des fichiers versionnés. **Sur un autre hébergeur, reproduire ces en-têtes dans sa configuration.**
- Aucune ressource tierce : polices hébergées sur le site, aucun CDN, aucun script externe.
- Liens externes ouverts dans un nouvel onglet avec `rel="noopener"`.

## Secrets

- **Aucun secret dans le dépôt.** Les seules valeurs de configuration sont publiques par nature : URL du point de réception Formspree, ou clé d'accès Web3Forms, **conçue pour être exposée** dans le navigateur.
- `.env` est ignoré par Git ; `.env.example` documente les variables.
- Un backend `custom` qui utiliserait une clé privée (service d'e-mail, par exemple) doit la garder **côté serveur** et ne jamais l'exposer dans une variable `PUBLIC_`.

## Journaux

Le site ne journalise rien. Ne pas activer, chez l'hébergeur ou le fournisseur, de journaux qui conserveraient le **contenu** des formulaires au-delà du nécessaire. Un éventuel backend `custom` ne doit jamais écrire les champs des formulaires dans ses logs.

## Cookies et mesure d'audience

- **Aucun cookie, aucun traceur, aucun outil d'analyse.** Il n'y a donc **pas de bandeau cookies** (en ajouter un sans traceur serait trompeur).
- Si une mesure d'audience devient utile : choisir un outil configurable dans le cadre de l'**exemption de consentement de la CNIL** (finalité limitée à la mesure, IP tronquée, durée de vie ≤ 13 mois, pas de recoupement, données non transmises à des tiers : voir [cnil.fr](https://www.cnil.fr/fr/solutions-pour-la-mesure-daudience)), mettre à jour la politique de confidentialité et proposer un moyen de s'y opposer. Sinon, mettre en place un **vrai** mécanisme de consentement (refus aussi simple que l'acceptation, choix modifiable, traceurs bloqués avant consentement).

## Conservation et droits

- Durée proposée : **3 ans à compter du dernier contact** pour les demandes qui n'ont pas abouti (logique de la CNIL pour les prospects). Statut `pending` : **à valider**, puis à appliquer réellement, en supprimant les messages chez le fournisseur et dans la boîte e-mail.
- **Procédure de suppression** à mettre en place par l'éducatrice : à réception d'une demande (e-mail indiqué dans la politique de confidentialité), supprimer le message chez le fournisseur de formulaire, dans la boîte de réception et dans tout fichier de suivi, puis confirmer à la personne sous un mois.
- **Fournisseur de formulaire** : vérifier sa localisation et ses garanties (sous-traitance au sens du RGPD, transferts hors UE), puis le nommer dans la politique de confidentialité (le texte le fait automatiquement selon `PUBLIC_FORM_PROVIDER`).

## Limites

- Les pages légales sont des **structures** : elles ne sont pas juridiquement validées. **Une relecture par une personne compétente est nécessaire avant publication.** Aucune conformité n'est affirmée.
- La sécurité finale dépend aussi de l'hébergeur (HTTPS, en-têtes) et du fournisseur de formulaire.
