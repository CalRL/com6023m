import { defaultPermissions } from "../User/Permissions";
import {ProfileService} from "./ProfileService";
import database from "../config/database";

class PermissionsService {
    async createDefaultPermissions(userId: number): Promise<void> {
        try {
            await database`
                INSERT INTO permissions (user_id, permissions)
                VALUES (${userId}, ARRAY['READ', 'WRITE', 'UPDATE'])
            `;
        } catch (error) {
            console.error(`Failed to set default permissions for user ${userId}:`, error);
            throw new Error('Error setting default permissions');
        }
    }

    async removePermission(userId: number, permission: string): Promise<boolean> {
        return false;
    }

    async removePermissions(userId: number): Promise<boolean> {
        return false;
    }

    async getPermissions(userId: number): Promise<string[]> {
        return [];
    }

    /**
     * Checks if a user has a permission
     * Todo: fix Perm link
     *
     * @param userId The ID of the user
     * @param string The identifier of the permission {@link Permissions}
     */
    async hasPermission(userId: number, string: string): Promise<boolean> {
        try {
            const result = await database`
                SELECT * FROM permissions WHERE user_id = ${userId} AND permission = ${permission}
            `;

            // If no permission found, return false
            if (result.length === 0) return false;

            return true;

        } catch (error) {
            console.error(`Failed to get permissions for user ${userId}:`, error);
            throw new Error('Error getting permissions');
        }
    }
}

export default new PermissionsService();