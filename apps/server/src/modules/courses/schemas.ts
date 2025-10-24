import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(1, 'Название обязательно'),
  slug: z.string().min(1, 'Slug обязателен'),
  description: z.string().min(1, 'Описание обязательно'),
  shortDescription: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  categories: z.array(z.string()).default([]),
  coverUrl: z.string().url('Некорректный URL обложки'),
  price: z.number().nonnegative().optional(),
  published: z.boolean().default(false),
  instructor: z.string().optional(),
});

export const updateCourseSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  shortDescription: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  categories: z.array(z.string()).optional(),
  coverUrl: z.string().url().optional(),
  price: z.number().nonnegative().optional(),
  published: z.boolean().optional(),
  instructor: z.string().optional(),
});

