import { Router } from 'express';
import { createUser, getUserById, getAllUsers, updateUser, deleteUser } from '../controllers/user.controller';
import { userController } from "../controllers/UserController.js";
import { asyncHandler } from '../utils/asyncHandler';
import {tokenMiddleware} from "../middleware/AuthMiddleware.js";

const router: Router = Router();

// router.post('/', asyncHandler(createUser));
// router.get('/:id', asyncHandler(getUserById));
// router.get('/', asyncHandler(getAllUsers));
// router.put('/:id', asyncHandler(updateUser));
// router.delete('/:id', asyncHandler(deleteUser));

router.post('/', tokenMiddleware, asyncHandler(userController.createUser));
router.get('/:id', asyncHandler(userController.getUserById));
router.get('/', asyncHandler(userController.getAllUsers));
router.put('/:id', tokenMiddleware, asyncHandler(userController.updateUser));
router.delete('/:id', tokenMiddleware, asyncHandler(userController.deleteUser));

export default router;