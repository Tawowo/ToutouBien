import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_IDS } from './lib/categories';
import { TOPICS } from './lib/wizard';

const topicIds = TOPICS.map((t) => t.value) as [string, ...string[]];

/**
 * Articles du blog. Ajouter un fichier Markdown dans src/content/blog/ suffit
 * (procédure détaillée dans le README). Seuls les articles `published` sont
 * visibles en production.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(90),
      description: z.string().min(50).max(170),
      /** `draft` : en écriture · `review` : à relire par l'éducatrice · `published` : validé. */
      status: z.enum(['draft', 'review', 'published']),
      publishDate: z.coerce.date().optional(),
      updatedDate: z.coerce.date().optional(),
      category: z.enum(CATEGORY_IDS),
      /** Format éditorial. */
      format: z.enum(['article', 'fiche', 'guide']).default('article'),
      /** Intention de recherche visée (documentation SEO, non affichée). */
      searchIntent: z.string().optional(),
      /** Sujet du parcours de contact à présélectionner dans l'appel à l'action. */
      ctaTopic: z.enum(topicIds).optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      coverCredit: z
        .object({ author: z.string(), sourceUrl: z.url(), licence: z.string() })
        .optional(),
      sources: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
      /** Points à faire valider par l'éducatrice avant publication. */
      reviewNotes: z.array(z.string()).default([]),
    }).refine((d) => d.status !== 'published' || d.publishDate, { message: 'Un article publié doit avoir une publishDate.' })
      .refine((d) => !d.cover || d.coverAlt, { message: 'Une image de couverture doit avoir un texte alternatif (coverAlt).' }),
});

export const collections = { blog };
