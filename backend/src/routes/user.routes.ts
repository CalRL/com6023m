import { Router } from 'express';
import { createUser, getUserById, getAllUsers, updateUser, deleteUser } from '../controllers/user.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router: Router = Router();

router.post('/', asyncHandler(createUser));
router.get('/:id', asyncHandler(getUserById));
router.get('/', asyncHandler(getAllUsers));
router.put('/:id', asyncHandler(updateUser));
router.delete('/:id', asyncHandler(deleteUser));

export default router;