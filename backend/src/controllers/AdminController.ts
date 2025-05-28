import adminService from '../services/AdminService.js';
import {authService} from '../services/AuthService.js';
import authMiddleware from '../middleware/AuthMiddleware.js';
import {Permissions} from '../User/Permissions.js';
import { Request, Response, NextFunction } from 'express';

class AdminController {

    /**
     * Returns dashboard metrics, including:
     * - Total user count
     * - Total post count
     * - Likes and bookmarks count for today
     * - Hourly distribution of likes and bookmarks for today
     * - Raw timestamps for likes and bookmarks for today
     *
     * Requires ADMIN permission.
     *
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @returns {Promise<Response>} JSON response with dashboard metrics
     */
    async getMetrics(req: Request, res: Response) {
        const user = authMiddleware.checkUserPermission(req, res, Permissions.ADMIN);

        if (!user) {
            return res.status(403).json({ message: 'Forbidden' });
        }

         const [metrics, likesPerHour, bookmarksPerHour] = await Promise.all([
             adminService.getDashboardMetrics(),
             adminService.getLikesPerHourToday(),
             adminService.getBookmarksPerHourToday(),
         ]);

         const [likeTimes, bookmarkTimes] = await Promise.all([
             adminService.getLikeTimestampsToday(),
             adminService.getBookmarkTimestampsToday()
         ]);

         return res.status(200).json({
             ...metrics,
             likesPerHour,
             bookmarksPerHour,
             likeTimestamps: likeTimes.map(e => e.created_at),
             bookmarkTimestamps: bookmarkTimes.map(e => e.created_at)
         });
    }


}
const adminController = new AdminController();
export default adminController;