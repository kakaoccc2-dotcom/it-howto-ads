import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { categoryIds } from './lib/categories';

const articles = defineCollection({
  loader: glob({
    base: './src/content/articles',
    pattern: ['**/*.{md,mdx}', '!**/_*'],
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(categoryIds),
    tags: z.array(z.string()).default([]),
    updated: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
