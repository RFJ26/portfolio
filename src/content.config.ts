import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const categories = ['comercio-local', 'profissional', 'academico', 'pessoal'] as const;
export type Category = (typeof categories)[number];

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      summary: z.string().min(1).max(220),
      stack: z.array(z.string()).min(1),
      category: z.enum(categories),
      repoUrl: z.url().optional(),
      liveUrl: z.url().optional(),
      cover: image(),
      coverAlt: z.string().optional(),
      gallery: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      featured: z.boolean().default(false),
      date: z.coerce.date(),
    }),
});

/**
 * Traduções para inglês: um ficheiro com o mesmo nome em projects/en/.
 * Só os textos são traduzidos; stack, imagens, links e datas vêm do ficheiro português.
 */
const projectsEn = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects/en' }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1).max(220),
    coverAlt: z.string().optional(),
    galleryAlts: z.array(z.string()).optional(),
  }),
});

export const collections = { projects, projectsEn };
