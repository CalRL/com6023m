import database from '../config/database.js';

class AdminService {

    /**
     * Retrieves summary metrics for the admin dashboard, including:
     * - Total number of users
     * - Number of users created today
     * - Number of likes added today
     * - Number of bookmarks added today
     *
     * @returns {Promise<{ totalUsers: number, usersToday: number, likesToday: number, bookmarksToday: number }>} Aggregated metrics
     */
    async getDashboardMetrics() {
        const [totalUsers] = await database`SELECT COUNT(*)::int AS count FROM users`;
        const [usersToday] = await database`
        SELECT COUNT(*)::int AS count 
        FROM users 
        WHERE DATE(created_at AT TIME ZONE 'UTC') = CURRENT_DATE`;

        const [likesToday] = await database`
        SELECT COUNT(*)::int AS count 
        FROM likes 
        WHERE DATE(created_at AT TIME ZONE 'UTC') = CURRENT_DATE`;

        const [bookmarksToday] = await database`
        SELECT COUNT(*)::int AS count 
        FROM bookmarks 
        WHERE DATE(created_at AT TIME ZONE 'UTC') = CURRENT_DATE`;

        return {
            totalUsers: totalUsers.count,
            usersToday: usersToday.count,
            likesToday: likesToday.count,
            bookmarksToday: bookmarksToday.count,
        };
    }

    /**
     * Retrieves the count of likes grouped by hour for the current day.
     *
     * @returns {Promise<Array<{ hour: number, count: number }>>} Array of hourly like counts
     */
    async getLikesPerHourToday() {
        return await database`
            SELECT DATE_PART('hour', created_at) AS hour, COUNT(*)::int AS count
            FROM likes
            WHERE created_at::date = CURRENT_DATE
            GROUP BY hour
            ORDER BY hour;
        `;
    }

    /**
     * Retrieves the count of bookmarks grouped by hour for the current day.
     *
     * @returns {Promise<Array<{ hour: number, count: number }>>} Array of hourly bookmark counts
     */
    async getBookmarksPerHourToday() {
        return await database`
            SELECT DATE_PART('hour', created_at) AS hour, COUNT(*)::int AS count
            FROM bookmarks
            WHERE created_at::date = CURRENT_DATE
            GROUP BY hour
            ORDER BY hour;
        `;
    }

    /**
     * Retrieves all like timestamps for the current day.
     *
     * @returns {Promise<Array<{ created_at: string }>>} Array of timestamps when likes were created
     */
     async getLikeTimestampsToday() {
        return await database`
        SELECT created_at
        FROM likes
        WHERE created_at::date = CURRENT_DATE
        ORDER BY created_at ASC;
    `;
    }

    /**
     * Retrieves all bookmark timestamps for the current day.
     *
     * @returns {Promise<Array<{ created_at: string }>>} Array of timestamps when bookmarks were created
     */
     async getBookmarkTimestampsToday() {
        return await database`
        SELECT created_at
        FROM bookmarks
        WHERE created_at::date = CURRENT_DATE
        ORDER BY created_at ASC;
    `;
    }
}

const adminService = new AdminService();
export default adminService;