import { Router } from 'express';
import { search } from './controller.js';

const router = Router();

router.get('/', search);

export default router;

