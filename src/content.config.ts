import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { esquemaLeccion, esquemaEjercicio, esquemaGlosario } from './lib/content/esquemas';

const lecciones = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lecciones' }),
  schema: esquemaLeccion,
});

const ejercicios = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/ejercicios' }),
  schema: esquemaEjercicio,
});

const glosario = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/glosario' }),
  schema: esquemaGlosario,
});

export const collections = { lecciones, ejercicios, glosario };
