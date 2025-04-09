import database from "../config/database";
import {User} from "../models/UserModel.js";

export default class UserWrapper {
    private userId: number;
    private user: User
    constructor(userId: number) {
        this.userId = userId;
    }

    async setUser(userId: number): Promise<void> {
        try {
            const result = await database`
                SELECT * FROM users WHERE id = ${userId}
            `
            this.user = result[0];
        } catch(error) {
            throw new Error(`Error: Couldn't set user: ${error.message}`);
        }
    }


    async setFirstName(name: string): Promise<boolean> {}
    async setLastName(name: string): Promise<boolean> {}
    async setPhoneExt(ext: number): Promise<boolean> {}
    async setPhoneNumber(num: number): Promise<boolean> {}
    async setBirthday(birthday: date): Promise<boolean> {}
    async setPassword(password: string): Promise<boolean> {
    }

    async getFirstName() {}
    async getLastName() {}
    async getPhoneNumber() {}
    async getPhoneEct() {}
    async getBirthday() {}
    async getPassword(): Promise<boolean> {}

    async addPermission(permission: string): Promise<void> {}
    async removePermission(permission: string): Promise<boolean> {}
    async clearPermissions(permission: string): Promise<boolean> {}
    async hasPermission(permission: string): Promise<boolean> {T
        try {
            const result = await pool.query(
                'SELECT permissions FROM roles r JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = $1',
                [this.userId]
            );
            if (result.rows.length) {
                const permissions = result.rows[0].permissions;
                return permissions.includes(permission);
            }
            return false;
        } catch (error) {
            console.error('Error checking permission:', error);
            return false;
        }
    }

    async getApiKey(): Promise<string | null> {

    }

    async hasApiKey(): Promise<boolean> {

    }

    async setApiKey(): Promise<void> {}

    async save(): Promise<void> {

    }






}