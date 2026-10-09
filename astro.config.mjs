// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

// URL canonique : à définir dans PUBLIC_SITE_URL avant toute mise en ligne.
// La valeur par défaut est un domaine réservé (RFC 2606) pour ne jamais générer
// de canoniques pointant vers un domaine qui n'appartient pas à l'activité.
const site = env.PUBLIC_SITE_URL || 'https://toutoubien.example';

// Pages exclues du sitemap : pages techniques ou sans contenu public validé.
const EXCLUDED = ['/404'];

export default defineConfig({
  site,
  trailingSlash: 'always',
  // Les classes transmises aux composants enfants portent le scope du parent.
  scopedStyleStrategy: 'class',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !EXCLUDED.some((path) => new URL(page).pathname.startsWith(path)),
    }),
  ],
  image: {
    responsiveStyles: true,
  },
  devToolbar: { enabled: false },
});
