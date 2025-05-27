import express from 'express';
import {postsController} from '../controllers/PostsController.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import authMiddleware from '../middleware/AuthMiddleware.js';
import bookmarkController from '../controllers/BookmarkController.js';

const router = express.Router();

router.get('/:postId/count', authMiddleware.tokenMiddleware, asyncHandler(bookmarkController.getBookmarkCount));
router.get('/:postId', authMiddleware.tokenMiddleware, asyncHandler(bookmarkController.isBookmarked));
router.post('/:postId', authMiddleware.tokenMiddleware, asyncHandler(bookmarkController.addBookmark));
router.delete('/:postId', authMiddleware.tokenMiddleware, asyncHandler(bookmarkController.removeBookmark));
router.get('/', authMiddleware.tokenMiddleware, asyncHandler(bookmarkController.getUserBookmarks));

export default router;