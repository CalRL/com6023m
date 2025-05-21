import express from "express";
import {postsController} from "../controllers/PostsController.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import authMiddleware from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get('/status', asyncHandler(postsController.getStatus));
router.put('/status', asyncHandler(postsController.updateStatus));

router.post('/', asyncHandler(postsController.createPost));
router.delete('/:id', authMiddleware.tokenMiddleware, asyncHandler(postsController.deletePost));
router.get('/:id', authMiddleware.tokenMiddleware, asyncHandler(postsController.getPostById))
router.get('/user/:id', authMiddleware.tokenMiddleware, asyncHandler(postsController.getPostsByUserId)); // todo

export default router;