import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { createGallerySchema, updateGallerySchema } from './schemas.js';
import {
  getGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from './controller.js';

const router = Router();

router.get('/', getGalleryItems);
router.get('/:id', getGalleryItemById);

// Admin routes
router.post('/', authenticate, validate(createGallerySchema), createGalleryItem);
router.patch('/:id', authenticate, validate(updateGallerySchema), updateGalleryItem);
router.delete('/:id', authenticate, deleteGalleryItem);

export default router;

