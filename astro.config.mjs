// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

// URL canonique : à définir dans PUBLIC_SITE_URL avant toute mise en ligne.
// La valeur par défaut est un domaine réservé (RFC 2606) pour ne jamais générer
// de canoniques pointant vers un domaine qui n'appartient pas à l'activité.
const site = env.PUBLIC_SITE_URL || 'https://toutoubien.example';

// Origine du service de formulaire, seule destination externe autorisée par la CSP.
const formOrigins = (() => {
  const provider = (env.PUBLIC_FORM_PROVIDER || '').toLowerCase();
  if (provider === 'web3forms') return ['https://api.web3forms.com'];
  try {
    return env.PUBLIC_FORM_ENDPOINT ? [new URL(env.PUBLIC_FORM_ENDPOINT).origin] : [];
  } catch {
    return [];
  }
})();

// Pages exclues du sitemap : pages techniques ou sans contenu public validé.
const EXCLUDED = ['/404'];

export default defineConfig({
  site,
  trailingSlash: 'always',
  // Les classes transmises aux composants enfants portent le scope du parent.
  scopedStyleStrategy: 'class',
  // CSS intégré au HTML : supprime la requête bloquante au premier affichage (site léger).
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [
    sitemap({
      filter: (page) => !EXCLUDED.some((path) => new URL(page).pathname.startsWith(path)),
    }),
  ],
  image: {
    responsiveStyles: true,
  },
  // Anciennes adresses conservées par redirection (aucun lien cassé).
  redirects: {
    '/accompagnement/': '/deroulement/',
  },
  devToolbar: { enabled: false },
  // Politique de sécurité du contenu : empreintes générées pour les scripts et styles
  // intégrés, aucune ressource tierce hormis le service de formulaire.
  security: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        /** @type {`connect-src${string}`} */ (`connect-src 'self'${formOrigins.map((o) => ` ${o}`).join('')}`),
        /** @type {`form-action${string}`} */ (`form-action 'self'${formOrigins.map((o) => ` ${o}`).join('')}`),
        "base-uri 'self'",
        "object-src 'none'",
      ],
    },
  },
});
