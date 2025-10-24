import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
});

export const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(1, 'Пароль обязателен'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Некорректный email'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Токен обязателен'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

