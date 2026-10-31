/**
 * Expiration de la démonstration — middleware Vercel (Routing Middleware).
 *
 * Le site est statique : ce fichier, placé à la racine du dépôt, est détecté
 * automatiquement par Vercel et s'exécute AVANT l'envoi de chaque page, quel que
 * soit le framework. Aucun réglage n'est nécessaire dans Vercel.
 *
 * - Démo active : les pages sont servies normalement ; `/lien-expire/` répond 404.
 * - Démo expirée : toutes les pages répondent 410 avec l'écran « Ce lien n'est plus
 *   disponible » ; les fichiers techniques (scripts, styles, polices, images) passent.
 *
 * Date limite : `DEFAULT_DEMO_EXPIRES_AT` ci-dessous, remplaçable par la variable
 * d'environnement facultative `DEMO_EXPIRES_AT` (« off » = pas d'expiration).
 * Voir la section « Expiration de la démonstration » du README.
 */

/** Date limite inscrite dans le code : 31 octobre 2026 à 00:00, heure de Paris. */
export const DEFAULT_DEMO_EXPIRES_AT = '2026-10-31T00:00:00+01:00';

/** Page affichée une fois la démonstration expirée. */
export const EXPIRED_PATH = '/lien-expire/';

/** En-tête des requêtes internes du middleware vers la page d'expiration. */
const INTERNAL_HEADER = 'x-demo-expired-internal';

const OFF_VALUES = new Set(['off', 'false', 'non', 'no', 'none', '0', 'desactive', 'désactivé', 'desactivee', 'désactivée']);

const PARIS_FORMAT = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Paris',
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

/** Décalage (en millisecondes) de l'heure de Paris par rapport à UTC à un instant donné. */
function parisOffset(utcMs: number): number {
  const parts = Object.fromEntries(PARIS_FORMAT.formatToParts(new Date(utcMs)).map((p) => [p.type, p.value]));
  const asUtc = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute), Number(parts.second));
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

/** Convertit une date et une heure « murales » de Paris en instant UTC (heure d'été comprise). */
function parisWallTimeToDate(y: number, mo: number, d: number, h: number, mi: number, s: number): Date | null {
  const wall = Date.UTC(y, mo - 1, d, h, mi, s);
  const check = new Date(wall);
  // Refuse les dates impossibles (31 février, 25 h…).
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== mo - 1 || check.getUTCDate() !== d || check.getUTCHours() !== h || check.getUTCMinutes() !== mi) {
    return null;
  }
  let utc = wall - parisOffset(wall);
  utc = wall - parisOffset(utc);
  return new Date(utc);
}

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;
const LOCAL_DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?$/;
const ZONED_DATE_TIME = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/i;

/**
 * Lit une date limite. Formats acceptés :
 * - `2026-12-15` → ce jour-là à 00:00, heure de Paris ;
 * - `2026-12-15T18:30` → heure de Paris ;
 * - `2026-12-15T18:30:00+01:00` ou `…Z` → instant exact.
 * Renvoie `null` si la valeur est absente ou invalide.
 */
export function parseExpiryDate(value: string | null | undefined): Date | null {
  const text = (value ?? '').trim();
  if (!text) return null;
  const dateOnly = DATE_ONLY.exec(text);
  if (dateOnly) return parisWallTimeToDate(Number(dateOnly[1]), Number(dateOnly[2]), Number(dateOnly[3]), 0, 0, 0);
  const local = LOCAL_DATE_TIME.exec(text);
  if (local) {
    return parisWallTimeToDate(Number(local[1]), Number(local[2]), Number(local[3]), Number(local[4]), Number(local[5]), Number(local[6] ?? 0));
  }
  if (ZONED_DATE_TIME.test(text)) {
    const ms = Date.parse(text.replace(' ', 'T'));
    return Number.isNaN(ms) ? null : new Date(ms);
  }
  return null;
}

/**
 * Date limite effective, ou `null` si la démonstration n'expire pas.
 * - `DEMO_EXPIRES_AT` absente ou vide → date inscrite dans le code ;
 * - `DEMO_EXPIRES_AT=off` → pas d'expiration ;
 * - `DEMO_EXPIRES_AT` = date valide → cette date (une date future rouvre la démo) ;
 * - date invalide (variable ou code) → pas d'expiration : le site n'est jamais coupé par erreur.
 */
export function resolveDemoExpiry(envValue: string | null | undefined, fallback: string = DEFAULT_DEMO_EXPIRES_AT): Date | null {
  const fromEnv = (envValue ?? '').trim();
  if (fromEnv) {
    if (OFF_VALUES.has(fromEnv.toLowerCase())) return null;
    return parseExpiryDate(fromEnv);
  }
  return parseExpiryDate(fallback);
}

/** La démonstration est-elle expirée à l'instant `now` ? */
export function isDemoExpired(now: Date, envValue: string | null | undefined, fallback: string = DEFAULT_DEMO_EXPIRES_AT): boolean {
  const expiry = resolveDemoExpiry(envValue, fallback);
  return expiry !== null && now.getTime() >= expiry.getTime();
}

/** Fichiers techniques laissés passer : tout fichier avec extension, sauf les pages HTML. */
export function isTechnicalAsset(pathname: string): boolean {
  if (pathname.startsWith('/_astro/') || pathname.startsWith('/_vercel/')) return true;
  const last = pathname.slice(pathname.lastIndexOf('/') + 1);
  const dot = last.lastIndexOf('.');
  if (dot <= 0) return false;
  const ext = last.slice(dot + 1).toLowerCase();
  return ext !== 'html' && ext !== 'htm';
}

function isExpiredPage(pathname: string): boolean {
  return pathname === '/lien-expire' || pathname.startsWith('/lien-expire/');
}

function readEnv(): string | undefined {
  return typeof process !== 'undefined' ? process.env?.['DEMO_EXPIRES_AT'] : undefined;
}

/** Laisse Vercel servir la ressource demandée normalement. */
function next(): Response {
  return new Response(null, { headers: { 'x-middleware-next': '1' } });
}

const NO_STORE = 'no-store, max-age=0';

/** Récupère une page statique du déploiement (cookies transmis pour les déploiements protégés). */
async function fetchPage(request: Request, path: string, internal: boolean): Promise<string | null> {
  const headers = new Headers({ accept: 'text/html' });
  const cookie = request.headers.get('cookie');
  if (cookie) headers.set('cookie', cookie);
  const authorization = request.headers.get('authorization');
  if (authorization) headers.set('authorization', authorization);
  if (internal) headers.set(INTERNAL_HEADER, '1');
  try {
    const res = await fetch(new URL(path, request.url), { headers, redirect: 'follow' });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

/** Écran de secours, utilisé seulement si la page d'expiration ne peut pas être lue. */
const FALLBACK_HTML = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>Ce lien n’est plus disponible · ToutouBien</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;padding:1.5rem;background:#f6faf8;color:#142120;font-family:system-ui,sans-serif;line-height:1.6}main{max-width:34rem;background:#fff;border-radius:1.8rem;padding:2.5rem 2rem;box-shadow:0 1px 0 rgb(20 33 32 / .06),0 2rem 4rem -2.5rem rgb(20 33 32 / .25)}h1{font-family:Georgia,serif;font-weight:400;font-size:2.2rem;line-height:1.05;margin:0 0 1rem}p{margin:0 0 .75rem;color:#45524f}</style></head><body><main><h1>Ce lien n’est plus disponible</h1><p>Le délai de consultation de cette démonstration a été atteint.</p><p>Pour y accéder à nouveau, contactez la personne qui vous l’a transmis.</p></main></body></html>`;

function htmlResponse(body: string, status: number): Response {
  return new Response(body, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': NO_STORE,
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}

export const config = {
  // Toutes les adresses ; le tri entre pages et fichiers techniques est fait dans le code.
  matcher: '/:path*',
};

/** Traitement d'une requête ; `now` et `envValue` sont paramétrables pour les tests. */
export async function handleDemoRequest(request: Request, now: Date = new Date(), envValue: string | undefined = readEnv()): Promise<Response> {
  const { pathname } = new URL(request.url);
  if (isTechnicalAsset(pathname)) return next();

  // Requête interne du middleware : la page d'expiration elle-même.
  if (isExpiredPage(pathname) && request.headers.get(INTERNAL_HEADER) === '1') return next();

  const expired = isDemoExpired(now, envValue);

  if (!expired) {
    if (!isExpiredPage(pathname)) return next();
    // Démo active : la page d'expiration n'existe pas pour le public.
    const notFound = await fetchPage(request, '/404.html', false);
    return htmlResponse(notFound ?? '<!doctype html><html lang="fr"><title>Page introuvable</title><h1>Page introuvable</h1></html>', 404);
  }

  const page = await fetchPage(request, EXPIRED_PATH, true);
  return htmlResponse(page ?? FALLBACK_HTML, 410);
}

export default function middleware(request: Request): Promise<Response> {
  return handleDemoRequest(request);
}
