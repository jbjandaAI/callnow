import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  initiateCall,
  acceptCall,
  endCall,
  submitFeedback,
} from '../controllers/calls';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Call management routes
router.post('/initiate', initiateCall);
router.post('/:id/accept', acceptCall);
router.post('/:id/end', endCall);
router.post('/:id/feedback', submitFeedback);

export default router; 