import { z } from 'zod';

export const createGallerySchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Название должно содержать минимум 3 символа'),
    imageUrl: z.string().url('Неверный URL изображения'),
    category: z.enum(['букеты', 'свадьбы', 'композиции', 'сезонные', 'корпоративные', 'другое']),
    description: z.string().optional(),
    order: z.number().optional(),
    featured: z.boolean().optional(),
  }),
});

export const updateGallerySchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    imageUrl: z.string().url().optional(),
    category: z.enum(['букеты', 'свадьбы', 'композиции', 'сезонные', 'корпоративные', 'другое']).optional(),
    description: z.string().optional(),
    order: z.number().optional(),
    featured: z.boolean().optional(),
  }),
});

