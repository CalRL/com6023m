import express from 'express';
import {postsController} from '../controllers/PostsController.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import authMiddleware from '../middleware/AuthMiddleware.js';
import likeController from '../controllers/LikeController.js';

const router = express.Router();


router.post('/:id', authMiddleware.tokenMiddleware, asyncHandler(likeController.addLike));
router.delete('/:id', authMiddleware.tokenMiddleware, asyncHandler(likeController.deleteLike));
router.get('/:id', authMiddleware.tokenMiddleware, asyncHandler(likeController.hasLiked));
router.get('/:id/count', asyncHandler(likeController.getLikeCount));

export default router;