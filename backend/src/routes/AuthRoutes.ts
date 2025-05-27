import express from 'express';
import authController, { registerController, loginController } from '../controllers/AuthController.js';
import {authService} from '../services/AuthService.js';
import {asyncHandler} from '../utils/asyncHandler.js';
const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', registerController);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
router.post('/login', loginController);
router.post('/logout', asyncHandler(authController.logout));
router.post('/refresh', asyncHandler(authController.refresh));
router.get('/check', asyncHandler(authController.check));

export default router;
