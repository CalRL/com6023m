import { Request, Response } from 'express';
import LikeService from '../services/LikeService.js';
import {authService} from '../services/AuthService.js';

class LikeController {
    async addLike(req: Request, res: Response) {
        const user = await authService.fromRequest(req, res);
        if (!user?.id) return res.status(401).json({ message: 'Unauthorized' });

        const postId = parseInt(req.params.id);
        if (isNaN(postId)) return res.status(400).json({ message: 'Invalid post ID' });

        await LikeService.addLike(user.id, postId);
        res.status(201).json({ success: true });
    }

    async deleteLike(req: Request, res: Response) {
        const user = await authService.fromRequest(req, res);
        if (!user?.id) return res.status(401).json({ message: 'Unauthorized' });

        const postId = parseInt(req.params.id);
        if (isNaN(postId)) return res.status(400).json({ message: 'Invalid post ID' });

        await LikeService.removeLike(user.id, postId);
        res.status(200).json({ success: true });
    }

    async hasLiked(req: Request, res: Response) {
        const user = await authService.fromRequest(req, res);
        if (!user?.id) return res.status(401).json({ message: 'Unauthorized' });

        const postId = parseInt(req.params.id);
        if (isNaN(postId)) return res.status(400).json({ message: 'Invalid post ID' });

        const liked = await LikeService.isPostLiked(user.id, postId);
        res.status(200).json({ liked });
    }

    async getLikeCount(req: Request, res: Response) {
        const postId = parseInt(req.params.id);
        if (isNaN(postId)) return res.status(400).json({ message: 'Invalid post ID' });

        const count = await LikeService.getLikeCount(postId);
        res.status(200).json({ count });
    }
}

const likeController = new LikeController();
export default likeController;
