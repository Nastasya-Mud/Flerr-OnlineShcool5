import { z } from 'zod';

export const validateCodeSchema = z.object({
  code: z.string().min(1, 'Промокод обязателен'),
});

export const createPromoCodeSchema = z.object({
  code: z.string().min(1, 'Код обязателен').toUpperCase(),
  scope: z.enum(['platform', 'course']),
  courseId: z.string().optional(),
  maxUses: z.number().positive().default(1),
  expiresAt: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
  notes: z.string().optional(),
});

export const updatePromoCodeSchema = z.object({
  maxUses: z.number().positive().optional(),
  expiresAt: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
  notes: z.string().optional(),
});

