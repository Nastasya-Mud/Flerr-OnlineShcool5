import { z } from 'zod';

export const createLessonSchema = z.object({
  courseId: z.string().min(1, 'ID курса обязателен'),
  title: z.string().min(1, 'Название обязательно'),
  slug: z.string().min(1, 'Slug обязателен'),
  description: z.string().optional(),
  durationSec: z.number().nonnegative().default(0),
  videoKey: z.string().min(1, 'Ключ видео обязателен'),
  thumbnailUrl: z.string().url().optional(),
  subtitlesUrl: z.string().url().optional(),
  materials: z
    .array(
      z.object({
        title: z.string(),
        url: z.string().url(),
        type: z.string().default('pdf'),
      })
    )
    .default([]),
  chapters: z
    .array(
      z.object({
        title: z.string(),
        timeSec: z.number().nonnegative(),
      })
    )
    .default([]),
  freePreview: z.boolean().default(false),
  order: z.number().nonnegative().default(0),
});

export const updateLessonSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  durationSec: z.number().nonnegative().optional(),
  videoKey: z.string().min(1).optional(),
  thumbnailUrl: z.string().url().optional(),
  subtitlesUrl: z.string().url().optional(),
  materials: z
    .array(
      z.object({
        title: z.string(),
        url: z.string().url(),
        type: z.string(),
      })
    )
    .optional(),
  chapters: z
    .array(
      z.object({
        title: z.string(),
        timeSec: z.number().nonnegative(),
      })
    )
    .optional(),
  freePreview: z.boolean().optional(),
  order: z.number().nonnegative().optional(),
});

export const progressSchema = z.object({
  lessonId: z.string().min(1, 'ID урока обязателен'),
  percent: z.number().min(0).max(100),
});

