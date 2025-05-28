import express, {Router} from 'express';
import { userController } from '../controllers/UserController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import authMiddleware, {tokenMiddleware} from '../middleware/AuthMiddleware.js';
import authController from '../controllers/AuthController.js';

const router: Router = express.Router();

router.get('/permissions', tokenMiddleware, asyncHandler(userController.getPermissions));

router.post('/', tokenMiddleware, asyncHandler(userController.createUser));
router.get('/:id', tokenMiddleware, asyncHandler(userController.getUserById));
router.get('/', tokenMiddleware,  asyncHandler(userController.getAllUsers));
router.put('/:id', tokenMiddleware, asyncHandler(userController.updateUser));
router.delete('/', tokenMiddleware, asyncHandler(userController.deleteUser));
router.delete('/:id', tokenMiddleware, asyncHandler(userController.deleteUserById));

router.patch('/change-password', asyncHandler(userController.changePassword));
router.post('/:id/fields', tokenMiddleware, asyncHandler(userController.getFields));
router.patch('/:id/fields', tokenMiddleware, asyncHandler(userController.updateFields));


export default router;