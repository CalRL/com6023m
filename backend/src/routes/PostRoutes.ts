import express from 'express';
import {postsController} from '../controllers/PostsController.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import authMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.get('/status', authMiddleware.tokenMiddleware, asyncHandler(postsController.getStatus));
router.put('/status', authMiddleware.tokenMiddleware, asyncHandler(postsController.updateStatus));

router.get('/:id/replies', authMiddleware.tokenMiddleware, asyncHandler(postsController.getPostReplies));

router.get('/', authMiddleware.tokenMiddleware, asyncHandler(postsController.getLatestPosts));
router.post('/', authMiddleware.tokenMiddleware, asyncHandler(postsController.createPost));
router.delete('/:id', authMiddleware.tokenMiddleware, asyncHandler(postsController.deletePost));
router.get('/:id', authMiddleware.tokenMiddleware, asyncHandler(postsController.getPostById));
router.get('/profile/:id', authMiddleware.tokenMiddleware, asyncHandler(postsController.getPostsByUserId)); // todo

export default router;