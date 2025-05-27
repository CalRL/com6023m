import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Request, Response } from 'express';
import { postsController } from '../../src/controllers/PostsController.js';
import likeController from '../../src/controllers/LikeController.js';

vi.mock('../../src/services/AuthService', () => ({
    authService: {
        fromRequest: vi.fn()
    }
}));

vi.mock('../../src/services/PermissionsService', () => ({
    default: {
        hasPermission: vi.fn()
    }
}));

vi.mock('../../src/services/PostsService', () => ({
    default: {
        create: vi.fn(),
        getById: vi.fn(),
        deleteById: vi.fn(),
        getPostsByProfileId: vi.fn(),
        getRepliesByParentId: vi.fn(),
        addLike: vi.fn(),
        removeLike: vi.fn(),
        hasLiked: vi.fn()
    }
}));

vi.mock('../../src/services/LikeService', () => ({
    default: {
        addLike: vi.fn(),
        removeLike: vi.fn(),
        isPostLiked: vi.fn(),
        getLikeCount: vi.fn()
    }
}));

vi.mock('../../src/services/ProfileService', () => ({
    profileService: {
        getProfileById: vi.fn()
    }
}));

vi.mock('../../src/utils/post/PostUtils', () => ({
    default: vi.fn()
}));

vi.mock('../../src/middleware/AuthMiddleware', () => ({
    default: {
        checkUserPermission: vi.fn()
    }
}));

import { authService } from '../../src/services/AuthService.js';
import permissionsService from '../../src/services/PermissionsService.js';
import postsService from '../../src/services/PostsService.js';
import LikeService from '../../src/services/LikeService.js';
import { profileService } from '../../src/services/ProfileService.js';
import formatPostWithCounts from '../../src/utils/post/PostUtils.js';
import authMiddleware from '../../src/middleware/AuthMiddleware.js';

const mockRes = () => {
    const res: Partial<Response> = {};
    res.status = vi.fn().mockReturnThis();
    res.json = vi.fn().mockReturnThis();
    return res as Response;
};

describe('PostsController', () => {
    afterEach(() => vi.restoreAllMocks());

    it('createPost should succeed if user and permission are valid', async () => {
        const req = { body: { post: { content: 'hi' } } } as any;
        const res = mockRes();
        (authService.fromRequest as any).mockResolvedValue({ id: 1 });
        (permissionsService.hasPermission as any).mockResolvedValue(true);
        (postsService.create as any).mockResolvedValue({ id: 1 });

        await postsController.createPost(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('deletePost should succeed if user is owner and has permission', async () => {
        const req = { params: { id: '1' } } as any;
        const res = mockRes();
        (authService.fromRequest as any).mockResolvedValue({ id: 1 });
        (postsService.getById as any).mockResolvedValue({ profileId: 1 });
        (permissionsService.hasPermission as any).mockResolvedValue(true);
        (postsService.deleteById as any).mockResolvedValue(true);

        await postsController.deletePost(req, res);
        expect(res.status).toHaveBeenCalledWith(204);
    });

    it('getPostById should return post and profile if found', async () => {
        const req = { params: { id: '1' } } as any;
        const res = mockRes();
        (authService.fromRequest as any).mockResolvedValue({ id: 1 });
        (postsService.getById as any).mockResolvedValue({ id: 1, profileId: 2 });
        (profileService.getProfileById as any).mockResolvedValue({ id: 2 });
        (formatPostWithCounts as any).mockResolvedValue({ id: 1, content: 'post' });

        await postsController.getPostById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('getStatus should return current status if admin', async () => {
        const req = {} as any;
        const res = mockRes();
        (authService.fromRequest as any).mockResolvedValue({ id: 1 });
        (permissionsService.hasPermission as any).mockResolvedValue(true);

        await postsController.getStatus(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'Alive' });
    });

    it('addLike should call postsService.addLike', async () => {
        const req = { params: { id: '1' } } as any;
        const res = mockRes();
        (authMiddleware.checkUserPermission as any).mockResolvedValue({ id: 1 });
        await postsController.addLike(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });
});

describe('LikeController', () => {
    afterEach(() => vi.restoreAllMocks());

    it('addLike should succeed with valid user and post ID', async () => {
        const req = { params: { id: '1' } } as any;
        const res = mockRes();
        (authService.fromRequest as any).mockResolvedValue({ id: 1 });
        (LikeService.addLike as any).mockResolvedValue(undefined);

        await likeController.addLike(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('deleteLike should succeed with valid user and post ID', async () => {
        const req = { params: { id: '1' } } as any;
        const res = mockRes();
        (authService.fromRequest as any).mockResolvedValue({ id: 1 });
        (LikeService.removeLike as any).mockResolvedValue(undefined);

        await likeController.deleteLike(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('hasLiked should return liked true or false', async () => {
        const req = { params: { id: '1' } } as any;
        const res = mockRes();
        (authService.fromRequest as any).mockResolvedValue({ id: 1 });
        (LikeService.isPostLiked as any).mockResolvedValue(true);

        await likeController.hasLiked(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ liked: true });
    });

    it('getLikeCount should return like count for post', async () => {
        const req = { params: { id: '1' } } as any;
        const res = mockRes();
        (LikeService.getLikeCount as any).mockResolvedValue(5);

        await likeController.getLikeCount(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ count: 5 });
    });
});
