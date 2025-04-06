import database from '../config/database';
import { User, UserDTO } from '../models/user.model';
import { defaultPermissions } from "../User/Permissions";
import { profileService } from "./ProfileService";
import PermissionsService from "./PermissionsService";
import {usernameFromEmail} from "../utils/UserUtils";
import {hashPassword} from "../utils/PasswordUtils.js";


/**
 * UserService class for managing user operations.
 */
export class UserService {

  /**
   * Creates a new user in the database with basic information.
   * Steps:
   * Start atomic operation
   * Create username
   * Insert into postgres
   * Fetch user
   * Create profile
   * Add default permissions
   * Commit to database
   *
   * @param {string} email - The user's email.
   * @param {string} password_hash - The hashed password of the user.
   * @returns {Promise<User>} - The newly created user.
   * @throws {Error} - If the user creation fails.
   */
  async createUser(email: string, password: string): Promise<User> {
    try {
      const username = await usernameFromEmail(email);

      // const user = await database.begin(async (sql) => {
      //
      // });
      const password_hash = await hashPassword(password);
      const result = await database<User[]>`
                    INSERT INTO users (email, username, password_hash)
                    VALUES (${email}, ${username}, ${password_hash})
                    RETURNING *;
                `;

      const createdUser = result[0];
      if (!createdUser) throw new Error('User creation failed');

      await profileService.createProfile(createdUser.id, createdUser.username);
      await PermissionsService.createDefaultPermissions(createdUser.id);

      return createdUser;

    } catch (error: any) {
      if (error.code === '23505') {  // Unique violation error code
        console.error('User already exists:', error.detail);
        throw new Error('User already exists with this email or username.');
      } else {
        console.error('Error creating user:', error);
        throw new Error('User creation failed');
      }
    }
  }

  /**
   * Finds a user by their ID.
   * @param {number} id - The ID of the user to find.
   * @returns {Promise<User | null>} - The user if found, otherwise null.
   */
  async findById(id: number): Promise<User | null> {
    const result = await database<User[]>`
      SELECT * FROM users WHERE id = ${id};
    `;
    return result[0] || null;
  }

  /**
   * Retrieves all users from the database.
   * @returns {Promise<User[]>} - A list of users.
   */
  async findAll(): Promise<User[]> {
    const result = await database<User[]>`
      SELECT * FROM users;
    `;
    return result;
  }

  /**
   * Updates an existing user by ID.
   * @param {number} id - The ID of the user to update.
   * @param {Partial<User>} user - The fields to update.
   * @returns {Promise<User | null>} - The updated user if successful, otherwise null.
   * @throws {Error} - If no fields are provided for update.
   */
  async update(id: number, user: Partial<User>): Promise<User | null> {
    const fields = Object.keys(user);
    const values = Object.values(user);

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const setClause = fields
        .map((field, index) => `${field} = $${index + 1}`)
        .join(', ');

    const result = await database<User[]>`
      UPDATE users
      SET ${database.unsafe(setClause)}
      WHERE id = ${id}
      RETURNING *;
    `;

    return result[0] || null;
  }

  /**
   * Deletes a user by ID.
   * @param {number} id - The ID of the user to delete.
   * @returns {Promise<boolean>} - True if the user was deleted, false otherwise.
   */
  async delete(id: number): Promise<boolean> {
    const result = await database`
      DELETE FROM users WHERE id = ${id};
    `;
    return result.count > 0;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await database<User[]>`
      SELECT * FROM users WHERE email = ${email}
    `
    return result[0] || null;
  }


}

// Export an instance of UserService for reuse
export const userService = new UserService();
