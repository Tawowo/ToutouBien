# Recherche créative et technique

## Méthode et limites (à lire en premier)

La recherche a été faite avec l'outil de **recherche web** de l'environnement, qui renvoie des listes de résultats accompagnées d'un résumé. **La lecture directe des pages (WebFetch) et l'accès aux banques d'images étaient bloqués par la politique réseau de la session** (voir `PROJECT-AUDIT.md`). Concrètement :

- les URL ci-dessous ont été **renvoyées par les recherches**, et les enseignements viennent des résumés de ces résultats ;
- aucune page n'a été inspectée visuellement : aucun site de référence n'a donc pu être « copié », et l'analyse porte sur des principes, pas sur des maquettes ;
- les affirmations techniques ou juridiques importantes sont croisées avec les sources primaires lorsque la recherche les a fait remonter (web.dev, CNIL, préfectures) ; les autres sont signalées **« à vérifier »**.

Pour la technique, la source de vérité a été **le code source des versions réellement installées** (Astro 7.3.8 dans `node_modules/astro` : schéma de configuration, loaders de contenus, API `astro:assets`), plutôt que la documentation en ligne, inaccessible.

## 1. Secteur : sites d'éducateurs canins

| Source | Ce qui en ressort |
| --- | --- |
| [Zarla — 20 Dog Training Website Examples 2025](https://www.zarla.com/guides/dog-training-website-examples) | Les sites du secteur se ressemblent beaucoup : palettes bleues ou grises, illustrations « mignonnes », pattes, grilles de cartes identiques. |
| [CyberOptik — best dog training websites](https://cyberoptik.net/blog/best-dog-training-websites) | Les exemples les plus réussis (ex. Pupford) mettent des **conseils concrets et des ressources gratuites** en avant : la valeur éditoriale crée la confiance. |
| [Zarla — Good Hound Academy (modèle)](https://www.zarla.com/website-templates/dog-training/good-hound-academy) | Le modèle type : un hero « formatrice + chiot dans un salon » et un bloc biographie. C'est efficace, mais générique : c'est précisément ce qu'il fallait dépasser. |
| [PagesJaunes / chien.com — annuaires](https://www.chien.com/adresse/10-0-0-0-0-educateur-dresseur-canin-60.php) | Les éducatrices françaises se présentent par leurs **méthodes (bienveillance), leur intervention à domicile et leur diplôme**. Le vocabulaire est très uniforme : « relation harmonieuse », « binôme ». |

**Enseignements retenus**
- Se différencier par la **qualité éditoriale** et la **franchise** (pas de promesses, pas de faux témoignages) plutôt que par l'accumulation de badges.
- Les propriétaires cherchent d'abord à **reconnaître leur situation**. D'où la liste « De quoi aimeriez-vous parler ? », qui mène directement au formulaire prérempli.
- Intervenir à domicile est un argument concret : la page « L'accompagnement » le met en scène (« Chez vous ou dehors »).

**Rejeté** : les pattes, os et illustrations enfantines ; les compteurs et statistiques ; les carrousels de témoignages (il n'y en a aucun d'authentique).

## 2. Références éditoriales et design de marque

| Source | Mécanisme intéressant |
| --- | --- |
| [Awwwards — Editorial layout (Adoratorio)](https://www.awwwards.com/inspiration/editorial-layout-mara-2) | Typographie éditoriale à fort contraste et marges généreuses. |
| [Awwwards — Editorial layout Aupale (Locomotive)](https://www.awwwards.com/inspiration/editorial-layout-aupale-vodka) | Photographie intégrée à la composition, ruptures d'échelle. |
| [Awwwards — Kindred Pet Care (Areal)](https://www.awwwards.com/inspiration/service-page-kindred-pet-care) | Une marque animalière qui évite le cliché grâce à un trait dessiné maîtrisé. |
| [Crème de Mint — LuckyTail](https://cremedemint.com/blog/portfolio/luckytail-pet-web-design) | Photographie spontanée, tons humains chaleureux, couleur d'accent ponctuelle. |

**Enseignements retenus** : une **typographie à caractère** (serif expressive) associée à une linéale sobre ; des **ruptures de rythme** (sections sombres et claires, grilles asymétriques 7/5) ; **un seul motif graphique fort**, décliné partout, plutôt que dix effets.

## 3. Animation : techniques évaluées

| Technique | Décision | Raison |
| --- | --- | --- |
| **CSS scroll-driven animations** (`animation-timeline: view()`) | ✅ Retenue | Aucune ligne de JS, tourne sur le compositeur. Prise en charge par Chrome/Edge (depuis 115) et Safari (26) ; Firefox stable encore derrière un drapeau mi-2026 ([ics.media](https://ics.media/en/entry/230718/), [buildmvpfast](https://www.buildmvpfast.com/blog/css-scroll-driven-animations-replace-js-2026)). **Repli** : contenu immédiatement visible (`@supports`), donc aucun risque. |
| Tracé SVG (`stroke-dashoffset` + `pathLength="1"`) | ✅ Retenue | C'est la base de la signature « Le fil ». Légère et indépendante de la résolution. |
| GSAP + ScrollTrigger | ❌ Écartée | Devenu gratuit, y compris pour un usage commercial, depuis le rachat par Webflow ([README GSAP](https://cdn.jsdelivr.net/npm/gsap@3.15.0/README.md), licence à confirmer sur le site officiel). Mais son poids (~70 Ko) n'apporte rien ici face au CSS natif. À reconsidérer seulement pour une scène complexe pilotée en JS. |
| Motion (Framer Motion) | ❌ Écartée | Suppose React, que le projet n'utilise pas. |
| Three.js / React Three Fiber | ❌ Écartée | Aucun rôle utile : une scène 3D n'exprime pas mieux « la relation » que la photographie et le trait. Coût élevé sur mobile, et maintenance. |
| Transitions entre pages (View Transitions) | ⏸ Reportée | Gain faible pour un site de 7 pages ; à évaluer avec les vraies photos. |
| Parallaxe | ❌ Écartée | Le brief demande de la retenue, et la parallaxe gêne les personnes sensibles au mouvement. |
| Curseur personnalisé | ❌ Écarté | Gêne l'interaction et ne sert à rien sur tactile. |

## 4. SEO

| Source | Point retenu |
| --- | --- |
| [web.dev — seuils Core Web Vitals](https://web.dev/articles/defining-core-web-vitals-thresholds) | LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1, au 75ᵉ centile des **données terrain**. |
| [Google Business Profile — zones desservies](https://support.google.com/business/answer/9157481?hl=en-GB) | Une activité qui se déplace chez ses clients ne doit **pas** afficher d'adresse si elle n'accueille personne à cette adresse. |
| [Search Engine Journal — avis de J. Mueller](https://searchenginejournal.com/google-on-use-of-product-structured-data-for-a-services-business/479159) | Pour un service local, utiliser des données structurées de type `LocalBusiness` plutôt que `Product`. |
| Synthèses sur les règles anti-spam (pages satellites / « doorway pages ») ([exemple](https://scorpion.co/expert-tips/marketing/what-your-local-business-needs-to-know-about-goo)) | Ne pas multiplier des pages « éducateur canin + ville » quasi identiques. *Texte primaire de Google non consulté directement : à relire sur Search Central.* |

## 5. Formulaires : solutions comparées

| Option | Évaluation |
| --- | --- |
| **Netlify Forms** | Très simple, mais ne fonctionne que si le site est hébergé chez Netlify ([dev.to](https://dev.to/allenarduino/how-to-add-a-contact-form-to-your-astro-site-without-a-backend-13no)). |
| **Formspree** | Service établi, guide Astro officiel ([formspree.io/guides/astro](https://formspree.io/guides/astro/)). Envoi AJAX avec l'en-tête `Accept: application/json`, champs `_replyto` et `_subject` ([R. Camden](https://raymondcamden.com/2016/05/24/building-an-ajax-based-form-for-formspree)). D'anciennes versions réservaient l'AJAX aux offres payantes : **à vérifier** sur l'offre choisie. |
| **Web3Forms** | Clé d'accès publique (pas d'adresse e-mail exposée), champ anti-robot `botcheck`, envoi JSON ([docs](https://docs.web3forms.com/how-to-guides/html-and-javascript)). Durée de conservation des messages non documentée dans les résultats : **à vérifier**. |
| Backend maison (fonction serverless + envoi d'e-mails) | Plus de contrôle, mais aussi plus de maintenance et des secrets à gérer. Prévu via `PUBLIC_FORM_PROVIDER=custom`. |

**Retenu** : un adaptateur unique (`src/lib/submit.ts`) qui gère les trois cas. Le choix final dépendra de l'hébergeur et sera documenté dans `DEPLOYMENT.md`.

## 6. Juridique et réglementaire (France)

| Source | Point retenu |
| --- | --- |
| [CNIL — mesure d'audience exemptée](https://www.cnil.fr/fr/solutions-pour-la-mesure-daudience) | Une mesure d'audience peut être exemptée de consentement sous conditions (finalité limitée, IP tronquée, durée ≤ 13 mois…). **Aucun outil d'analyse n'est installé**, donc pas de bandeau cookies. |
| [LegalPlace — mentions légales](https://www.legalplace.fr/guides/mentions-legales/), [CMS](https://cms.law/en/fra/legal-updates/sites-internet-marchands-etes-vous-en-regle) | Mentions obligatoires pour tout site public : identité de l'éditeur, contact, hébergeur, directeur·rice de publication. *Article exact de la LCEN à vérifier sur Légifrance.* |
| [Bpifrance Création — éducateur canin](https://bpifrance-creation.fr/activites-reglementees/educateur-canin) | L'éducation canine est une activité réglementée : une certification couvrant l'espèce est exigée (souvent l'ACACED). À demander à l'éducatrice. **Rien n'est affiché sans justificatif.** |
| [Préfecture d'Indre-et-Loire — « Mon chien a mordu »](https://www.indre-et-loire.gouv.fr/index.php/contenu/telechargement/3167/15432/file/Mon-chien-a-mordu.pdf) | Une morsure sur une personne doit être déclarée en mairie, avec une surveillance vétérinaire et une évaluation comportementale. C'est repris avec prudence dans la FAQ et dans le parcours. |
| [CNIL — durées de conservation (secteur assurance)](https://www.cnil.fr/les-durees-de-conservation-des-donnees-du-secteur-de-lassurance) | Logique des 3 ans à compter du dernier contact pour des prospects : c'est la **proposition** retenue, à valider (référentiel « gestion commerciale » non consulté directement). |

## 7. Licences des ressources

| Ressource | Licence vérifiée |
| --- | --- |
| Fraunces (Fontsource) | SIL Open Font License 1.1 (fichier `LICENSE` du paquet installé) |
| Instrument Sans (Fontsource) | SIL Open Font License 1.1 (fichier `LICENSE` du paquet installé) |
| Unsplash | Usage commercial gratuit, attribution appréciée mais non obligatoire, interdiction de constituer un service concurrent ([unsplash.com/license](https://unsplash.com/license), résumé de recherche). Prudence pour les personnes identifiables (autorisation de la personne photographiée). |
| Pexels | Page de licence inaccessible (bloquée) : **non vérifiée**. |
