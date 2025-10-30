import { z } from 'zod';

export const createTeacherSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
    photo: z.string().url('Неверный URL фото'),
    specialization: z.string().min(3, 'Укажите специализацию'),
    bio: z.string().min(10, 'Биография должна содержать минимум 10 символов'),
    experience: z.string().min(5, 'Укажите опыт работы'),
    courses: z.array(z.string()).optional(),
    order: z.number().optional(),
    active: z.boolean().optional(),
    social: z
      .object({
        instagram: z.string().optional(),
        facebook: z.string().optional(),
        website: z.string().optional(),
      })
      .optional(),
  }),
});

export const updateTeacherSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    photo: z.string().url().optional(),
    specialization: z.string().min(3).optional(),
    bio: z.string().min(10).optional(),
    experience: z.string().min(5).optional(),
    courses: z.array(z.string()).optional(),
    order: z.number().optional(),
    active: z.boolean().optional(),
    social: z
      .object({
        instagram: z.string().optional(),
        facebook: z.string().optional(),
        website: z.string().optional(),
      })
      .optional(),
  }),
});

