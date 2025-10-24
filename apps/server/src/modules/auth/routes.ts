import { Router } from 'express';
import { register, login, refresh, forgotPassword, resetPassword } from './controller.js';
import { validate } from '../../middlewares/validate.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from './schemas.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting для auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5, // 5 попыток
  message: 'Слишком много попыток, попробуйте позже',
});

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/forgot', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset', validate(resetPasswordSchema), resetPassword);

export default router;

