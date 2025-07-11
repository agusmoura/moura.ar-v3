import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    order: z.number(),
    showInHome: z.boolean().optional(),
    featured: z.boolean().optional(),
    links: z
      .object({
        live: z.string().url().optional(),
        github: z.string().url().optional(),
        figma: z.string().url().optional(),
        behance: z.string().url().optional(),
        dribbble: z.string().url().optional(),
      })
      .optional(),
    category: z.string(),
    date: z.union([z.string(), z.number()]),
    client: z.string(),
    client_logo: z.string().optional(),
    partner: z.string().optional(),
    partner_logo: z.string().optional(),
    role: z.string(),
    duration: z.string(),
    aspectRatio: z.string().optional(),
    technologies: z.array(z.string()),
    theme: z
      .object({
        title_gradient: z.string().optional(),
        colors: z
          .object({
            primary: z.string().optional(),
            secondary: z.string().optional(),
            background: z.string().optional(),
            foreground: z.string().optional(),
            surface: z.string().optional(),
            border: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
    images: z.any(), // Simplified
    tags: z.array(z.string()),
    grid: z.any(), // Simplified
  }),
});

export const collections = {
  projects: projectsCollection,
};
