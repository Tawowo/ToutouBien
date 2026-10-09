# Feuille de route

Principe : **ne rien construire sans besoin confirmé**. Chaque étape a des critères de déclenchement.

## Niveau 1 : socle (livré)

| Élément | État |
| --- | --- |
| Pages éditoriales, parcours de contact, contact libre | ✅ |
| Ressources / blog (Markdown, catégories, articles liés) | ✅ Générés dès qu'un article est publié |
| Système de validation des contenus et contrôle de lancement | ✅ |
| Page « événement » | ⏸ Non créée : aucun événement n'existe. Un événement peut être publié **comme un article** (format `guide`) en attendant |

## Niveau 2 : extensions à fort impact (si le besoin est confirmé)

| Extension | Déclencheur | Implémentation proposée | Dépendances |
| --- | --- | --- | --- |
| **Prestations détaillées et tarifs** | Liste validée par l'éducatrice | Renseigner `site.services` : la section de la page Accompagnement s'affiche automatiquement. Une page par prestation seulement si chacune a un vrai contenu distinct | Informations métier |
| **Formulaire d'intérêt pour un atelier** | Atelier envisagé concrètement (thème, lieu, période) | Variante du formulaire de contact avec un champ « atelier », envoyée au même fournisseur. Pas de date ni de nombre de places affichés tant qu'ils ne sont pas fixés | Fournisseur de formulaire |
| **Liste d'attente** | Plus de demandes que de créneaux | Même mécanisme ; message honnête (« nous vous recontacterons quand… ») | — |
| **Page événement avec inscription** | Événement daté et confirmé | Collection de contenus `events` (date, lieu, capacité, statut ouvert/complet), page détail, formulaire d'inscription avec **confirmation réelle par e-mail** (fonction du fournisseur) | Choix d'un outil capable de gérer les places de façon fiable |
| **Version PDF des fiches** | Fiche validée et demandée | PDF dans `public/ressources/`, lien depuis la fiche, puis format « téléchargeable » affiché | — |
| **Vidéos courtes** | Vidéos tournées par l'éducatrice | Hébergement sans traceur (fichier local léger, ou plateforme en mode « sans cookie » chargée **au clic**) | Consentement si plateforme tierce |
| **Mesure d'audience** | Besoin réel de suivre les conversions | Outil exempté de consentement (voir `PRIVACY-AND-SECURITY.md`) + événement « demande envoyée » | Mise à jour de la politique de confidentialité |
| **Avis clients** | Avis authentiques, avec accord écrit | Composant « paroles de familles » (prénom ou initiale, avec accord) ; **jamais** de note agrégée en données structurées sans source vérifiable | Accords écrits |
| **CMS** | Publication fréquente par l'éducatrice sans aide technique | CMS basé sur Git (édition des fichiers Markdown existants), pour garder le même modèle de contenu | Hébergement compatible |

## Niveau 3 : uniquement après validation commerciale

| Extension | Critère de déclenchement | Remarque |
| --- | --- | --- |
| Paiement en ligne | Ateliers réguliers avec paiement à l'avance avéré | Prestataire de paiement + CGV + facturation. Ne jamais simuler un paiement |
| Gestion avancée des places | Plusieurs sessions par mois, annulations fréquentes | Outil de réservation dédié plutôt que développement maison |
| Espace client, contenus privés | Programme de suivi structuré avec ressources réservées | Authentification, données personnelles, sécurité : un vrai projet |
| Parcours de formation en ligne | Contenu pédagogique produit et validé | Plateforme spécialisée à privilégier |
| Rappels automatiques, suivi de progression | Volume de clients qui le justifie | Implique une base de données et un traitement de données à documenter |

## Dette technique et points de vigilance

- **Firefox** : les animations au défilement (CSS `animation-timeline`) n'y sont pas actives tant que la fonctionnalité reste derrière un drapeau ; le contenu y est simplement affiché sans animation.
- **Logo** : à remplacer par le vectoriel original dès réception.
- **Astro 7** : suivre les mises à jour mineures (`npm outdated`) ; les tests e2e couvrent les régressions visibles.
