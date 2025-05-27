import { describe, it, expect, vi, afterEach } from 'vitest';
import { Request, Response } from 'express';
import bookmarkController from '../../src/controllers/BookmarkController.js';

vi.mock('../../src/services/AuthService', () => ({
    authService: {
        fromRequest: vi.fn()
    }
}));

vi.mock('../../src/services/BookmarkService', () => ({
    default: {
        getBookmarks: vi.fn(),
        addBookmark: vi.fn(),
        removeBookmark: vi.fn(),
        isPostBookmarked: vi.fn(),
        getBookmarkCount: vi.fn()
    }
}));

vi.mock('../../src/services/LikeService', () => ({
    default: {
        isPostLiked: vi.fn()
    }
}));

vi.mock('../../src/services/ProfileService', () => ({
    profileService: {
        getProfileById: vi.fn()
    }
}));

import { authService } from '../../src/services/AuthService.js';
import bookmarkService from '../../src/services/BookmarkService.js';
import likeService from '../../src/services/LikeService.js';
import { profileService } from '../../src/services/ProfileService.js';

const mockRes = () => {
    const res: Partial<Response> = {};
    res.status = vi.fn().mockReturnThis();
    res.json = vi.fn().mockReturnThis();
    return res as Response;
};

describe('BookmarkController', () => {
    afterEach(() => vi.restoreAllMocks());

    it('addBookmark should add a bookmark successfully', async () => {
        const req = { params: { postId: '1' } } as any;
        const res = mockRes();
        (authService.fromRequest as any).mockResolvedValue({ id: 1 });
        (bookmarkService.addBookmark as any).mockResolvedValue(undefined);

        await bookmarkController.addBookmark(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('removeBookmark should remove bookmark successfully', async () => {
        const req = { params: { postId: '1' } } as any;
        const res = mockRes();
        (authService.fromRequest as any).mockResolvedValue({ id: 1 });
        (bookmarkService.removeBookmark as any).mockResolvedValue(undefined);

        await bookmarkController.removeBookmark(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('isBookmarked should return true/false for post', async () => {
        const req = { params: { postId: '1' } } as any;
        const res = mockRes();
        (authService.fromRequest as any).mockResolvedValue({ id: 1 });
        (bookmarkService.isPostBookmarked as any).mockResolvedValue(true);

        await bookmarkController.isBookmarked(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ bookmarked: true });
    });

    it('getBookmarkCount should return count for valid post ID', async () => {
        const req = { params: { postId: '1' } } as any;
        const res = mockRes();
        (authService.fromRequest as any).mockResolvedValue({ id: 1 });
        (bookmarkService.getBookmarkCount as any).mockResolvedValue(3);

        await bookmarkController.getBookmarkCount(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ count: 3 });
    });

    it('getUserBookmarks should return list of enriched bookmarks', async () => {
        const req = { query: {}, user: { id: 1 } } as any;
        const res = mockRes();

        const mockPost = {
            id: 1,
            content: 'Hello',
            media_url: '',
            created_at: '2023-01-01',
            like_count: 0,
            profile_id: 1
        };

        (authService.fromRequest as any).mockResolvedValue({ id: 1 });
        (bookmarkService.getBookmarks as any).mockResolvedValue([mockPost]);
        (likeService.isPostLiked as any).mockResolvedValue(true);
        (bookmarkService.isPostBookmarked as any).mockResolvedValue(true);
        (bookmarkService.getBookmarkCount as any).mockResolvedValue(2);
        (profileService.getProfileById as any).mockResolvedValue({ id: 1, displayName: 'user' });

        await bookmarkController.getUserBookmarks(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            bookmarks: [
                {
                    post: {
                        id: 1,
                        content: 'Hello',
                        mediaUrl: '',
                        createdAt: '2023-01-01',
                        likeCount: 0,
                        bookmarkCount: 2,
                        liked: true,
                        bookmarked: true
                    },
                    profile: { id: 1, displayName: 'user' }
                }
            ]
        });
    });

    it('addBookmark should return 401 if user is not authenticated', async () => {
        const req = {} as any;
        const res = mockRes();
        (authService.fromRequest as any).mockResolvedValue(null);
        await bookmarkController.addBookmark(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('removeBookmark should return 401 if user is not authenticated', async () => {
        const req = {} as any;
        const res = mockRes();
        (authService.fromRequest as any).mockResolvedValue(null);
        await bookmarkController.removeBookmark(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('isBookmarked should return 401 if user is not authenticated', async () => {
        const req = {} as any;
        const res = mockRes();
        (authService.fromRequest as any).mockResolvedValue(null);
        await bookmarkController.isBookmarked(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('getBookmarkCount should return 400 if postId is invalid', async () => {
        const req = { params: { postId: 'abc' } } as any;
        const res = mockRes();
        (authService.fromRequest as any).mockResolvedValue({ id: 1 });
        await bookmarkController.getBookmarkCount(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

});
