import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Request, Response } from 'express';
import profileController from '../../src/controllers/ProfileController.js';

vi.mock('../../src/services/ProfileService', async () => ({
    profileService: {
        getProfileById: vi.fn(),
        updateFields: vi.fn(),
    }
}));

vi.mock('../../src/services/UserService', async () => ({
    userService: {
        getUsername: vi.fn()
    }
}));

vi.mock('../../src/services/PermissionsService', async () => ({
    default: {
        hasPermission: vi.fn()
    }
}));

vi.mock('../../src/services/AuthService', async () => ({
    authService: {
        fromRequest: vi.fn(),
        fromAccessToken: vi.fn()
    }
}));

import { profileService } from '../../src/services/ProfileService.js';
import { userService } from '../../src/services/UserService.js';
import permissionsService from '../../src/services/PermissionsService.js';
import { authService } from '../../src/services/AuthService.js';

const mockRes = () => {
    const res: Partial<Response> = {};
    res.status = vi.fn().mockReturnThis();
    res.json = vi.fn().mockReturnThis();
    return res as Response;
};

describe('ProfileController', () => {
    afterEach(() => vi.restoreAllMocks());

    describe('getProfile', () => {
        it('should return profile for authenticated user', async () => {
            const req = { user: { id: 1 } } as any;
            const res = mockRes();
            (profileService.getProfileById as any).mockResolvedValue({ id: 1, displayName: 'user1' });

            await profileController.getProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 if profile not found', async () => {
            const req = { user: { id: 1 } } as any;
            const res = mockRes();
            (profileService.getProfileById as any).mockResolvedValue(null);

            await profileController.getProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getProfileById', () => {
        it('should return target profile if permitted', async () => {
            const req = { params: { id: '2' } } as any;
            const res = mockRes();
            (authService.fromRequest as any).mockResolvedValue({ id: 1 });
            (permissionsService.hasPermission as any).mockResolvedValue(true);
            (profileService.getProfileById as any).mockResolvedValue({ id: 2, displayName: 'user2' });

            await profileController.getProfileById(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('getUsername', () => {
        it('should return username if permitted', async () => {
            const req = { params: { id: '1' } } as any;
            const res = mockRes();
            (authService.fromAccessToken as any).mockResolvedValue({ id: 1 });
            (permissionsService.hasPermission as any).mockResolvedValue(true);
            (userService.getUsername as any).mockResolvedValue({ username: 'tester' });

            await profileController.getUsername(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('createProfile', () => {
        it('should always return 403', async () => {
            const req = {} as Request;
            const res = mockRes();

            await profileController.createProfile(req, res);
            expect(res.status).toHaveBeenCalledWith(403);
        });
    });

    describe('updateProfile', () => {
        it('should update profile if authenticated', async () => {
            const req = { body: { bio: 'new bio' } } as any;
            const res = mockRes();
            (authService.fromRequest as any).mockResolvedValue({ id: 1 });
            (profileService.updateFields as any).mockResolvedValue({ id: 1, bio: 'new bio' });

            await profileController.updateProfile(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
