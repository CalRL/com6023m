import {PermissionsDTO} from "../models/PermissionModel.js";
import database from "../config/database.js";


export class PermissionsRepository {
    async getPermissions(userId: number): Promise<PermissionsDTO | null> {
        const result = await database`
            SELECT * FROM permissions WHERE user_id=${userId}
        `;
        console.log("Permissions:" + JSON.stringify(result[0]));
        const permissionsDTO = result[0];

        if(permissionsDTO == null) {
            console.error(`Permissions not found for user with id ${userId}`);
            return null;
        }

        return permissionsDTO;
    }
}

export const permissionsRepository = new PermissionsRepository();