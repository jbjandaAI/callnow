import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  addGroupMember,
  removeGroupMember,
} from '../controllers/groups';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Group CRUD routes
router.post('/', createGroup);
router.get('/', getGroups);
router.get('/:id', getGroupById);
router.put('/:id', updateGroup);

// Group member management routes
router.post('/:groupId/members', addGroupMember);
router.delete('/:groupId/members/:userId', removeGroupMember);

export default router; 