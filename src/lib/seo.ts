/**
 * Données structurées (JSON-LD). Règle : uniquement des propriétés vérifiables,
 * issues de champs `confirmed`. Aucune note, aucun avis, aucune adresse inventée.
 */
import { site } from '~/config/site';
import { confirmedValue } from './fields';

type JsonLd = Record<string, unknown>;

export function absolute(path: string, base: URL | string): string {
  return new URL(path, base).toString();
}

export function organizationLd(base: URL | string): JsonLd {
  const url = absolute('/', base);
  const phone = confirmedValue(site.contact.phoneE164);
  const email = confirmedValue(site.contact.email);
  const places = confirmedValue(site.serviceArea.places);
  const social = confirmedValue(site.social);
  // Un LocalBusiness n'a de sens que si la zone et un moyen de contact sont confirmés.
  const isLocal = Boolean(places?.length && (phone || email));
  const ld: JsonLd = {
    '@context': 'https://schema.org',
    '@type': isLocal ? 'LocalBusiness' : 'Organization',
    '@id': `${url}#organisation`,
    name: confirmedValue(site.name),
    slogan: confirmedValue(site.tagline),
    description: confirmedValue(site.activity),
    url,
    logo: absolute('/icon-512.png', base),
    image: absolute('/og-default.jpg', base),
  };
  if (phone) ld.telephone = phone;
  if (email) ld.email = email;
  if (isLocal && places) ld.areaServed = places.map((name) => ({ '@type': 'Place', name }));
  if (social?.length) ld.sameAs = social.map((s) => s.url);
  return ld;
}

export function websiteLd(base: URL | string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${absolute('/', base)}#site`,
    name: confirmedValue(site.name),
    url: absolute('/', base),
    inLanguage: 'fr-FR',
    publisher: { '@id': `${absolute('/', base)}#organisation` },
  };
}

export function articleLd(opts: { base: URL | string; path: string; title: string; description: string; published: Date; updated?: Date | undefined; image?: string | undefined }): JsonLd {
  const author = confirmedValue(site.educator.displayName);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    mainEntityOfPage: absolute(opts.path, opts.base),
    datePublished: opts.published.toISOString(),
    dateModified: (opts.updated ?? opts.published).toISOString(),
    image: opts.image ?? absolute('/og-default.jpg', opts.base),
    inLanguage: 'fr-FR',
    author: author ? { '@type': 'Person', name: author } : { '@id': `${absolute('/', opts.base)}#organisation` },
    publisher: { '@id': `${absolute('/', opts.base)}#organisation` },
  };
}

export function breadcrumbLd(base: URL | string, items: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: absolute(item.path, base) })),
  };
}
