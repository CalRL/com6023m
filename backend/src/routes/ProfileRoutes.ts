import express from 'express';
import { getProfile } from '../controllers/ProfileController';
import { tokenMiddleware } from '../middleware/AuthMiddleware';

const router = express.Router();

// Protected routes through the middleware
router.get('/', tokenMiddleware, getProfile);

export default router;
