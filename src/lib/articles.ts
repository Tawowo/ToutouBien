import { getCollection, type CollectionEntry } from 'astro:content';
import { draftsVisible } from './fields';

export type Article = CollectionEntry<'blog'>;

/** Articles visibles : publiés en production ; tous (marqués) en dev/préproduction. */
export async function visibleArticles(showDrafts: boolean = draftsVisible()): Promise<Article[]> {
  const all = await getCollection('blog', (entry) => showDrafts || entry.data.status === 'published');
  return all.sort((a, b) => (b.data.publishDate?.getTime() ?? 0) - (a.data.publishDate?.getTime() ?? 0));
}

export const isDraftArticle = (a: Article): boolean => a.data.status !== 'published';

/** Temps de lecture estimé (≈ 200 mots/minute). */
export function readingMinutes(body: string | undefined): number {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function relatedArticles(current: Article, all: Article[], max = 2): Article[] {
  const others = all.filter((a) => a.id !== current.id);
  const same = others.filter((a) => a.data.category === current.data.category);
  return [...same, ...others.filter((a) => !same.includes(a))].slice(0, max);
}

export const formatDate = (d: Date): string => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
