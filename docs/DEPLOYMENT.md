# Déploiement

Le site est **100 % statique** (dossier `dist/`). Il peut être hébergé chez n'importe quel hébergeur de fichiers statiques capable de servir `404.html` pour les pages inconnues.

## 1. Choisir un hébergeur

| Hébergeur | Avantages | Points d'attention |
| --- | --- | --- |
| **Netlify** | Simple, `_headers` pris en charge, Netlify Forms possible | Hébergeur à mentionner dans les mentions légales |
| **Cloudflare Pages** | Rapide, gratuit, `_headers` pris en charge | Idem |
| **Hébergeur français ou européen** (offre statique / mutualisée) | Données en UE, interlocuteur local | Reproduire les en-têtes de `public/_headers` dans la configuration du serveur |

Une fois l'hébergeur choisi, renseigner `site.legal.host` dans `src/config/site.ts`.

## 2. Variables d'environnement (à définir chez l'hébergeur)

| Variable | Obligatoire | Exemple | Rôle |
| --- | --- | --- | --- |
| `PUBLIC_SITE_URL` | Oui | `https://www.toutoubien.fr` *(exemple)* | Canoniques, sitemap, partage |
| `PUBLIC_ALLOW_INDEXING` | Oui en production | `true` | Autorise l'indexation (robots.txt et balise meta) |
| `PUBLIC_SHOW_DRAFTS` | Non | `true` **uniquement en préproduction** | Affiche les contenus non validés, avec marquage |
| `PUBLIC_FORM_PROVIDER` | Oui | `formspree`, `web3forms` ou `custom` | Active l'envoi des formulaires |
| `PUBLIC_FORM_ENDPOINT` | Si `formspree` ou `custom` | `https://formspree.io/f/xxxxxxx` | URL de réception (HTTPS obligatoire) |
| `PUBLIC_WEB3FORMS_ACCESS_KEY` | Si `web3forms` | clé fournie par Web3Forms | Clé publique |

Ces variables sont lues **au moment du build** : toute modification nécessite un nouveau déploiement.

## 3. Configurer le formulaire

### Option A : Formspree
1. Créer un compte et un formulaire, avec l'adresse e-mail de réception de l'éducatrice.
2. Copier l'URL `https://formspree.io/f/…` dans `PUBLIC_FORM_ENDPOINT`, et mettre `PUBLIC_FORM_PROVIDER=formspree`.
3. **Vérifier que l'offre choisie accepte les envois en JSON (AJAX)** : certaines anciennes offres le réservaient aux formules payantes.
4. Activer le filtrage anti-spam dans le tableau de bord.

### Option B : Web3Forms
1. Obtenir une clé d'accès pour l'adresse de réception.
2. `PUBLIC_FORM_PROVIDER=web3forms` et `PUBLIC_WEB3FORMS_ACCESS_KEY=…`.
3. Vérifier la durée de conservation des messages chez le fournisseur.

### Option C : backend personnalisé (`custom`)
Un point de réception HTTPS qui accepte un `POST` JSON (objet plat « libellé → valeur », plus `_subject` et `_replyto`), répond en 2xx en cas de succès, et **valide les données côté serveur**, limite le débit, ne journalise pas le contenu et garde ses secrets côté serveur.

### Après configuration : test réel obligatoire
Faire une demande complète depuis le site déployé et **vérifier la réception de l'e-mail**. Les tests automatisés simulent le fournisseur ; ils ne prouvent pas la réception réelle.

La CSP autorise automatiquement l'origine du fournisseur configuré (`connect-src`, `form-action`).

## 4. Construire et publier

```bash
npm ci
npm run verify        # lint + types + tests unitaires + build
npm run test:e2e      # tests navigateur (optionnel en CI, recommandé)
npm run check:launch  # éléments bloquants : doit passer avant la mise en ligne
```

Commande de build chez l'hébergeur : `npm run build` · dossier publié : `dist` · Node ≥ 22.12.

## 5. Préproduction

Déployer une **préproduction** (sous-domaine ou URL temporaire de l'hébergeur) avec :
`PUBLIC_SHOW_DRAFTS=true`, `PUBLIC_ALLOW_INDEXING=false`.
Les éléments à valider y apparaissent en orange ; c'est la version à parcourir avec Mme Petitgand.

## 6. Mise en ligne

1. `npm run check:launch` au vert, avec les variables de production.
2. `PUBLIC_ALLOW_INDEXING=true`, `PUBLIC_SHOW_DRAFTS` absent.
3. Brancher le nom de domaine, avec HTTPS.
4. Vérifier `https://<domaine>/robots.txt` (doit contenir `Allow: /` et le sitemap) et une page inconnue (statut 404).
5. Search Console : vérifier la propriété et soumettre `sitemap-index.xml`.

## 7. Redirections

Aucune ancienne URL à rediriger (premier site). Si une URL change plus tard, ajouter une redirection 301 chez l'hébergeur (`_redirects` sur Netlify ou Cloudflare Pages).
