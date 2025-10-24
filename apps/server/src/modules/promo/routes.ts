import { Router } from 'express';
import {
  validatePromoCode,
  activatePromoCode,
  getPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
} from './controller.js';
import { authenticate, requireAdmin } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { validateCodeSchema, createPromoCodeSchema, updatePromoCodeSchema } from './schemas.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting для активации промокодов
const promoLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 10, // 10 попыток
  message: 'Слишком много попыток активации, попробуйте позже',
});

router.post('/validate', authenticate, validate(validateCodeSchema), validatePromoCode);
router.post('/activate', authenticate, promoLimiter, validate(validateCodeSchema), activatePromoCode);
router.get('/', authenticate, requireAdmin, getPromoCodes);
router.post('/', authenticate, requireAdmin, validate(createPromoCodeSchema), createPromoCode);
router.patch('/:id', authenticate, requireAdmin, validate(updatePromoCodeSchema), updatePromoCode);
router.delete('/:id', authenticate, requireAdmin, deletePromoCode);

export default router;

