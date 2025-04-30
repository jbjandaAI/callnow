import express from 'express';
import { authenticate } from '../middleware/auth';
import { getCurrentUser, updateUser, getUserById } from '../controllers/users';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/me', getCurrentUser);
router.put('/me', updateUser);
router.get('/:id', getUserById);

export default router; 