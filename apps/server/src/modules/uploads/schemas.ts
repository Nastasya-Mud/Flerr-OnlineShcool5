import { z } from 'zod';

export const uploadSchema = z.object({
  filename: z.string().min(1, 'Имя файла обязательно'),
  contentType: z.string().min(1, 'Тип контента обязателен'),
  fileType: z.enum(['video', 'cover', 'material', 'thumbnail']),
  courseSlug: z.string().optional(),
  lessonId: z.string().optional(),
});

