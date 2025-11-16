import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { updateSiteSettingsSchema } from './schemas.js';
import { getSiteSettings, updateSiteSettings } from './controller.js';

const router = Router();

// Публичный доступ - получить настройки
router.get('/', getSiteSettings);

// Только админ - обновить настройки
router.patch('/', authenticate, validate(updateSiteSettingsSchema), updateSiteSettings);

export default router;

