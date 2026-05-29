import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.string(),
    updatedDate: z.string().optional(),
    author: z.string().default('GESCO'),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    readTime: z.string(),
    image: z.string().optional(),
    seoTitle: z.string().optional(),
  }),
});

const publicaciones = defineCollection({
  loader: glob({ base: './src/content/publicaciones', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    numero: z.number(),
    mes: z.string(),
    year: z.number(),
    fecha: z.string(),
    pdf: z.string(),
    analisis: z.string(),
    autor: z.string(),
    temas: z.array(z.string()),
  }),
});

export const collections = { blog, publicaciones };
