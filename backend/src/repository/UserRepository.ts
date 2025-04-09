import database from '../config/database';
import { sql } from 'postgres';
import { User } from '../models/UserModel.js';
class UserRepository {
    async create(user: Partial<User>): Promise<User> {
        try {
            const { email, username, password_hash } = user;

            console.log("UserRepository: " + JSON.stringify({ email, username, password_hash }));

            const result = await database<User[]>`
                    INSERT INTO users (email, username, password_hash)
                    VALUES (${email}, ${username}, ${password_hash})
                    RETURNING *;
                `;
            return result[0] || null;
        } catch (error) {
            console.log('UserRepository create error', error);
            throw error;
        }
    }

    /**
     * Updates an ID using a (in)complete User model.
     *
     * @param id
     * @param user
     */
    async update(id: number, user: Partial<User>): Promise<User | null> {
        console.log("In the repo: " + JSON.stringify(user));

        const fields = Object.keys(user);
        const values = Object.values(user);

        console.log(`FV: ${fields}, ${values}`);

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        try {
            const result = await database`
                UPDATE users
                SET ${database(user, ...fields)}
                WHERE id = ${id}
                RETURNING *;
            `;

            return result[0] || null;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }

    async findById(id: Partial<User>): Promise<User> {
        try {
            const result = await database<User[]>`
              SELECT * FROM users WHERE id = ${id};
            `;
            return result[0] || null;
        } catch (error) {
            console.error("UserRepository: Error finding user:", error);
            throw error;
        }
    }

    async findByEmail(email: string): Promise<User> {
        try {
            const result = await database<User[]>`
              SELECT * FROM users WHERE email = ${email}
            `
            return result[0] || null;
        } catch (error) {
            console.error("UserRepository: Error finding user:", error);
        }

    }

    async findAll() {
        const result = await database<User[]>`
          SELECT * FROM users;
        `;
        return result;
    }
    async existsUsername(id: string): Promise<boolean> {}

    async exists({ fieldName: fieldContent}): Promise<boolean>

    async deleteById(id: number): Promise<boolean> {
        const result = await database`
          DELETE FROM users WHERE id = ${id};
        `;
        return result.count > 0;
    }
}

export const userRepository = new UserRepository();