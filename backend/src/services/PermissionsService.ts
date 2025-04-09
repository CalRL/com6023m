import {defaultPermissions, Permissions} from "../User/Permissions.js";
import database from "../config/database.js";

import {PermissionsDTO} from "../models/PermissionModel.js";
import {permissionsRepository} from "../repository/PermissionsRepository.js";
class PermissionsService {
    async createDefaultPermissions(userId: number): Promise<void> {
        try {
            await database`
                INSERT INTO permissions (user_id, permissions)
                VALUES (${userId}, ${defaultPermissions})
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

    //todo: this
    async getPermissions(userId: number): Promise<PermissionsDTO | null> {
        try {

            const permissions = permissionsRepository.getPermissions(userId);

            if(permissions == null) {
                throw new Error("Permissions returned null...");
            }

            return permissions;
        } catch (error) {
            throw error;
        }
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
                SELECT * FROM permissions WHERE user_id = ${userId}
            `;

            // If no permission found, return false
            if(result.length === 0) return false;
            const permissions = result[0]

            console.log("Permissions:" + JSON.stringify(permissions));
            console.log(typeof permissions);
            console.log("Permissions:" + JSON.stringify(permissions.permissions));
            const userPermissions = permissions.permissions;
            if(userPermissions.includes(string)) {
                console.log('Has Permission');
                return true;
            }
            return false;

        } catch (error) {
            console.error(`Failed to get permissions for user ${userId}:`, error);
            throw new Error('Error getting permissions');
        }
    }
}

export default new PermissionsService();