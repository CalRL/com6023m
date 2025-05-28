import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Request, Response } from 'express';
import adminController from '../../src/controllers/AdminController.js';
import adminService from '../../src/services/AdminService.js';
import permissionsService from '../../src/services/PermissionsService.js';

// Explicit import needed for mock assignment to work
import * as authMiddleware from '../../src/middleware/AuthMiddleware.js';

vi.mock('../../src/services/AdminService.js', () => ({
    default: {
        getDashboardMetrics: vi.fn(),
        getLikesPerHourToday: vi.fn(),
        getBookmarksPerHourToday: vi.fn(),
        getLikeTimestampsToday: vi.fn(),
        getBookmarkTimestampsToday: vi.fn()
    }
}));

vi.mock('../../src/middleware/AuthMiddleware.js', async () => {
    const actual = await vi.importActual('../../src/middleware/AuthMiddleware.js');
    return {
        ...actual,
        default: {
            checkUserPermission: vi.fn()
        }
    };
});

vi.mock('../../src/services/PermissionsService', async () => ({
    default: {
        hasPermission: vi.fn().mockResolvedValue(true),
    }
}));

const mockRes = (): Response => {
    const res: Partial<Response> = {};
    res.status = vi.fn().mockReturnThis();
    res.json = vi.fn().mockReturnThis();
    return res as Response;
};

describe('AdminController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => vi.restoreAllMocks());

    it('should return dashboard metrics with 200 status', async () => {
        const req = {
            headers: { authorization: 'Bearer faketoken' }
        } as unknown as Request;

        const res = mockRes();

        // Mock permission to pass
        (authMiddleware.default.checkUserPermission as any).mockResolvedValue({ id: 1 });

        // Mock metrics data
        (adminService.getDashboardMetrics as any).mockResolvedValue({
            totalUsers: 100,
            usersToday: 10,
            likesToday: 5,
            bookmarksToday: 3,
        });
        (adminService.getLikesPerHourToday as any).mockResolvedValue([]);
        (adminService.getBookmarksPerHourToday as any).mockResolvedValue([]);
        (adminService.getLikeTimestampsToday as any).mockResolvedValue([]);
        (adminService.getBookmarkTimestampsToday as any).mockResolvedValue([]);

        await adminController.getMetrics(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            totalUsers: 100,
            usersToday: 10,
            likesToday: 5,
            bookmarksToday: 3,
        }));
    });
});
