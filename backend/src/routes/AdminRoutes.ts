import express from 'express';
import {asyncHandler} from '../utils/asyncHandler.js';
import authMiddleware from '../middleware/AuthMiddleware.js';
import adminController from '../controllers/AdminController.js';
const router = express.Router();

router.get('/metrics', authMiddleware.tokenMiddleware, asyncHandler(adminController.getMetrics));


export default router;
