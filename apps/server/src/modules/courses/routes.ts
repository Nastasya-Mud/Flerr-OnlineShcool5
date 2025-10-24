import { Router } from 'express';
import {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleFavorite,
} from './controller.js';
import { authenticate, requireAdmin } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { createCourseSchema, updateCourseSchema } from './schemas.js';

const router = Router();

router.get('/', getCourses);
router.get('/:slug', getCourseBySlug);
router.post('/', authenticate, requireAdmin, validate(createCourseSchema), createCourse);
router.patch('/:id', authenticate, requireAdmin, validate(updateCourseSchema), updateCourse);
router.delete('/:id', authenticate, requireAdmin, deleteCourse);
router.post('/:id/favorite', authenticate, toggleFavorite);

export default router;

