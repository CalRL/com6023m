import express from 'express';
import  profileController from '../controllers/ProfileController.js';
import { tokenMiddleware } from '../middleware/AuthMiddleware.js';
import {asyncHandler} from "../utils/asyncHandler.js";

const router = express.Router();

// Protected routes through the middleware
router.get('/', tokenMiddleware, asyncHandler(profileController.getProfile));

router.get('/:id/username', tokenMiddleware, asyncHandler(profileController.getUsername));
router.get('/:id', tokenMiddleware, asyncHandler(profileController.getProfileById));

export default router;
