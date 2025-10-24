import { Router } from 'express';
import { getUploadUrl } from './controller.js';
import { authenticate, requireAdmin } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { uploadSchema } from './schemas.js';

const router = Router();

router.post('/s3-sign', authenticate, requireAdmin, validate(uploadSchema), getUploadUrl);

export default router;

