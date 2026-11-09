import { z } from 'zod';

// Esquemas compartidos entre las colecciones de contenido y la validación del banco.

export const nivelEnum = z.enum(['inicial', 'intermedio', 'desafio']);
export type Nivel = z.infer<typeof nivelEnum>;

/** Lección: el cuerpo en Markdown es la explicación; el frontmatter lleva los metadatos. */
export const esquemaLeccion = z.object({
  id: z.string().min(1),
  titulo: z.string().min(1),
  modulo: z.string().min(1),
  orden: z.number().int().positive(),
  objetivo: z.string().min(1),
  saberesPrevios: z.array(z.string()).default([]),
  etiquetas: z.array(z.string()).default([]),
});

/** Parte de respuesta de un ejercicio. `esperado` es laxo a propósito: según el tipo puede ser número, lista o fracción. */
export const parteRespuesta = z.object({
  id: z.string().min(1),
  tipo: z.enum(['numero', 'numeroConjunto', 'moda', 'select', 'rubrica', 'probabilidad', 'tabla', 'barras']),
  esperado: z.unknown().optional(),
  label: z.string().optional(),
  unidad: z.string().optional(),
  aceptaPorcentaje: z.boolean().optional(),
  tolerancia: z.number().optional(),
  redondeo: z.number().int().min(0).max(6).optional(),
  opciones: z.array(z.object({ valor: z.string(), etiqueta: z.string() })).optional(),
  entero: z.boolean().optional(),
  detalle: z.unknown().optional(),
});

export const esquemaEjercicio = z.object({
  id: z.string().min(1),
  titulo: z.string().min(1),
  origen: z.enum(['guia', 'nuevo', 'integrador']),
  modulo: z.string().min(1),
  nivel: nivelEnum,
  habilidades: z.array(z.string()).min(1),
  enunciado: z.string().min(1),
  datos: z.unknown().optional(),
  partes: z.array(parteRespuesta).min(1),
  pistas: z.array(z.string()),
  solucion: z.array(z.string()).min(1),
  etiquetas: z.array(z.string()).default([]),
  leccion: z.string().optional(),
  adaptacion: z.string().optional(),
  variante: z.boolean().optional(),
});

export const esquemaGlosario = z.object({
  simbolo: z.string().min(1),
  lectura: z.string().min(1),
  significado: z.string().min(1),
  ejemplo: z.string().optional(),
});
