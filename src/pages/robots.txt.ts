import type { APIRoute } from 'astro';

/**
 * robots.txt généré au build. L'indexation n'est autorisée que si
 * PUBLIC_ALLOW_INDEXING=true (et que les brouillons sont masqués).
 */
export const GET: APIRoute = ({ site }) => {
  const allow = import.meta.env.PUBLIC_ALLOW_INDEXING === 'true' && import.meta.env.PUBLIC_SHOW_DRAFTS !== 'true';
  const sitemap = new URL('/sitemap-index.xml', site ?? 'https://toutoubien.example').toString();
  const body = allow
    ? `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`
    : `# Indexation désactivée (préproduction). Voir docs/DEPLOYMENT.md.\nUser-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
