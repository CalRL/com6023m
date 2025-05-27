import { Request, Response, NextFunction } from 'express';
import {authService} from '../services/AuthService.js';
import authMiddleware, {fromToken} from '../middleware/AuthMiddleware.js';
import {debugMode} from '../utils/DebugMode.js';
import bookmarkService from '../services/BookmarkService.js';
import likeService from '../services/LikeService.js';
import {profileService} from '../services/ProfileService.js';

class BookmarkController {
    async getUserBookmarks(req: Request, res: Response) {
        const user = await authService.fromRequest(req, res);
        if (!user?.id) {
            return res.status(401).json({ message: 'User Not Found' });
        }

        const offset = parseInt(req.query.offset as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;


        //todo: put this in service
        try {
            const rawBookmarks = await bookmarkService.getBookmarks(user.id, offset, limit);

            if(!rawBookmarks || rawBookmarks.length === 0) {
                return res.status(401).json({ message: 'You have no bookmarks.. Save your first!' });
            }

            const bookmarks = await Promise.all(
                rawBookmarks.map(async (post) => {
                    const [liked, bookmarked, bookmark_count, profile] = await Promise.all([
                        likeService.isPostLiked(user.id, post.id),
                        bookmarkService.isPostBookmarked(user.id, post.id),
                        bookmarkService.getBookmarkCount(post.id),
                        profileService.getProfileById(post.profile_id)
                    ]);

                    if(!profile) {
                        return res.status(401).json({ message: 'Bookmark not found' });
                    }

                    return {
                        post: {
                            id: post.id,
                            content: post.content,
                            mediaUrl: post.media_url,
                            createdAt: post.created_at,
                            likeCount: post.like_count ?? 0,
                            bookmarkCount: bookmark_count ?? 0,
                            liked,
                            bookmarked
                        },
                        profile
                    };
                })
            );

            res.status(200).json({ bookmarks });
        } catch (err) {
            console.error('Get bookmarks error:', err);
            res.status(500).json({ error: 'Failed to get bookmarks' });
        }
    }

    async addBookmark(req: Request, res: Response) {
        const user = await authService.fromRequest(req, res);
        if (!user?.id) {
            return res.status(401).json({ message: 'User Not Found' });
        }

        const postId = parseInt(req.params.postId);

        try {
            await bookmarkService.addBookmark(user.id, postId);
            res.status(201).json({ success: true });
        } catch (err) {
            console.error('Add bookmark error:', err);
            res.status(500).json({ error: 'Failed to add bookmark' });
        }
    }

    async removeBookmark(req: Request, res: Response) {
        const user = await authService.fromRequest(req, res);
        if (!user?.id) {
            return res.status(401).json({ message: 'User Not Found' });
        }

        const postId = parseInt(req.params.postId);

        try {
            await bookmarkService.removeBookmark(user.id, postId);
            res.status(200).json({ success: true });
        } catch (err) {
            console.error('Remove bookmark error:', err);
            res.status(500).json({ error: 'Failed to remove bookmark' });
        }
    }

    async isBookmarked(req: Request, res: Response) {
        const user = await authService.fromRequest(req, res);
        if (!user?.id) {
            return res.status(401).json({ message: 'User Not Found' });
        }

        const postId = parseInt(req.params.postId);

        try {
            const bookmarked = await bookmarkService.isPostBookmarked(user.id, postId);
            res.status(200).json({ bookmarked });
        } catch (err) {
            console.error('Check bookmark error:', err);
            res.status(500).json({ error: 'Failed to check bookmark' });
        }
    }

    async getBookmarkCount(req: Request, res: Response) {
        const user = await authService.fromRequest(req, res);
        if (!user?.id) {
            return res.status(401).json({ message: 'User Not Found' });
        }

        const postId = parseInt(req.params.postId);
        if (isNaN(postId)) {
            return res.status(400).json({ error: 'Invalid post ID' });
        }

        try {
            const count = await bookmarkService.getBookmarkCount(postId);
            res.status(200).json({ count });
        } catch (err) {
            console.error('Bookmark count error:', err);
            res.status(500).json({ error: 'Failed to get bookmark count' });
        }
    }
}

const bookmarkController = new BookmarkController();
export default bookmarkController;