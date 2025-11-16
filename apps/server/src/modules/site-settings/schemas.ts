import { z } from 'zod';

export const updateSiteSettingsSchema = z.object({
  heroImage1: z.string().url('Неверный URL изображения').optional(),
  heroImage2: z.string().url('Неверный URL изображения').optional(),
});

