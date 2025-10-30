import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { createTeacherSchema, updateTeacherSchema } from './schemas.js';
import {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from './controller.js';

const router = Router();

router.get('/', getTeachers);
router.get('/:id', getTeacherById);

// Admin routes
router.post('/', authenticate, validate(createTeacherSchema), createTeacher);
router.patch('/:id', authenticate, validate(updateTeacherSchema), updateTeacher);
router.delete('/:id', authenticate, deleteTeacher);

export default router;

