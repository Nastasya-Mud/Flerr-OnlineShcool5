import { Router } from 'express';
import {
  getLessonsByCourse,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  saveProgress,
} from './controller.js';
import { authenticate, requireAdmin } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { createLessonSchema, updateLessonSchema, progressSchema } from './schemas.js';

const router = Router();

router.get('/course/:courseSlug', getLessonsByCourse);
router.get('/:id', authenticate, getLessonById);
router.post('/', authenticate, requireAdmin, validate(createLessonSchema), createLesson);
router.patch('/:id', authenticate, requireAdmin, validate(updateLessonSchema), updateLesson);
router.delete('/:id', authenticate, requireAdmin, deleteLesson);
router.post('/progress', authenticate, validate(progressSchema), saveProgress);

export default router;

