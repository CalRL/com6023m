import express from 'express';
import { getProfile } from '../controllers/ProfileController.js';
import { tokenMiddleware } from '../middleware/AuthMiddleware.js';

const router = express.Router();

// Protected routes through the middleware
router.get('/', tokenMiddleware, getProfile);

export default router;
