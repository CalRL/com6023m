import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Request, Response } from 'express';
import { postsController } from '../../src/controllers/PostsController.js';

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

    describe('createPost', () => {
        it('should create a post if authenticated and has permission', async () => {
            const req = { body: { post: { content: 'test post' } } } as any;
            const res = mockRes();
            (authService.fromRequest as any).mockResolvedValue({ id: 1 });
            (permissionsService.hasPermission as any).mockResolvedValue(true);
            (postsService.create as any).mockResolvedValue({ id: 1, content: 'test post' });

            await postsController.createPost(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('deletePost', () => {
        it('should delete a post if user is owner and has permission', async () => {
            const req = { params: { id: '1' } } as any;
            const res = mockRes();
            (authService.fromRequest as any).mockResolvedValue({ id: 1 });
            (postsService.getById as any).mockResolvedValue({ id: 1, profileId: 1 });
            (permissionsService.hasPermission as any).mockResolvedValue(true);
            (postsService.deleteById as any).mockResolvedValue(true);

            await postsController.deletePost(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
        });
    });

    describe('getStatus', () => {
        it('should return status if user is admin', async () => {
            const req = {} as any;
            const res = mockRes();
            (authService.fromRequest as any).mockResolvedValue({ id: 1 });
            (permissionsService.hasPermission as any).mockResolvedValue(true);

            await postsController.getStatus(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('getPostById', () => {
        it('should return enriched post and profile if all data exists', async () => {
            const req = { params: { id: '1' } } as any;
            const res = mockRes();
            (authService.fromRequest as any).mockResolvedValue({ id: 1 });
            (postsService.getById as any).mockResolvedValue({ id: 1, profileId: 1 });
            (profileService.getProfileById as any).mockResolvedValue({ id: 1, displayName: 'tester' });
            (formatPostWithCounts as any).mockResolvedValue({ id: 1, content: 'enriched post' });

            await postsController.getPostById(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('addLike', () => {
        it('should add a like to a post', async () => {
            const req = { params: { id: '1' } } as any;
            const res = mockRes();
            (authMiddleware.checkUserPermission as any).mockResolvedValue({ id: 1 });
            (postsService.addLike as any).mockResolvedValue(undefined);

            await postsController.addLike(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    it('updateStatus should toggle status if admin', async () => {
        const req = {} as any;
        const res = mockRes();
        (authService.fromRequest as any).mockResolvedValue({ id: 1 });
        (permissionsService.hasPermission as any).mockResolvedValue(true);

        await postsController.updateStatus(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('getPostsByUserId should return posts if permitted', async () => {
        const req = { params: { id: '1' }, query: {} } as any;
        const res = mockRes();
        (authService.fromRequest as any).mockResolvedValue({ id: 1 });
        (permissionsService.hasPermission as any).mockResolvedValue(true);
        (postsService.getPostsByProfileId as any).mockResolvedValue([{ id: 1, profile_id: 1, content: 'test' }]);
        (formatPostWithCounts as any).mockResolvedValue({ id: 1, content: 'formatted' });

        await postsController.getPostsByUserId(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('getPostReplies should return replies for valid post ID', async () => {
        const req = {
            params: { id: '1' },
            query: { offset: '0', limit: '10' }
        } as any;
        const res = mockRes();
        (authService.fromRequest as any).mockResolvedValue({ id: 1 });
        (postsService.getRepliesByParentId as any).mockResolvedValue([{ id: 2, content: 'reply' }]);

        await postsController.getPostReplies(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('deleteLike should remove like', async () => {
        const req = { params: { id: '1' } } as any;
        const res = mockRes();
        (authMiddleware.checkUserPermission as any).mockResolvedValue({ id: 1 });
        (postsService.removeLike as any).mockResolvedValue(undefined);

        await postsController.deleteLike(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('hasLiked should return like status', async () => {
        const req = { params: { id: '1' } } as any;
        const res = mockRes();
        (authMiddleware.checkUserPermission as any).mockResolvedValue({ id: 1 });
        (postsService.hasLiked as any).mockResolvedValue(true);

        await postsController.hasLiked(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ liked: true });
    });
});
