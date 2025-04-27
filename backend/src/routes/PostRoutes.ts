import express from "express";
import {postsController} from "../controllers/PostsController.js";
import {asyncHandler} from "../utils/asyncHandler.js";

const router = express.Router();

router.get('/status', asyncHandler(postsController.getStatus));
router.put('/status', asyncHandler(postsController.updateStatus));

export default router;