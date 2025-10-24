import { Router } from 'express';
import { getStats, getUsers, updateUser, deleteUser } from './controller.js';
import { authenticate, requireAdmin } from '../../middlewares/auth.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;

