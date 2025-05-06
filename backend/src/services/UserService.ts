import database, { postgres } from '../config/database.js';
import { User, UserDTO } from '../models/UserModel.js';
import { defaultPermissions } from "../User/Permissions.js";
import { profileService } from "./ProfileService.js";
import PermissionsService from "./PermissionsService.js";
import {usernameFromEmail} from "../utils/UserUtils.js";
import {hashPassword} from "../utils/PasswordUtils.js";
import { userRepository } from "../repository/UserRepository.js";
import {ProfileDTO} from "../models/profile.model.js";
import {debugMode} from "../utils/DebugMode.js";

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
   * @param username - The user's username
   * @param {string} email - The user's email.
   * @param {string} password - The password of the user.
   * @returns {Promise<User>} - The newly created user.
   * @throws {Error} - If the user creation fails.
   */
  async createUser(username: string, email: string, password: string): Promise<UserDTO> {
    try {
      /**
       * todo: find a better way to do this
       * maybe null this and have a secondary page to create username? or all in the same form?
       */

      const password_hash = await hashPassword(password);

      const user: Partial<User> = {
          email: email,
          username: username,
          password_hash: password_hash
      }

      const createdUser = await userRepository.create(user);
      console.log("UserService: ", JSON.stringify(createdUser));
      /**
       * const result = await database<User[]>`
       *                     INSERT INTO users (email, username, password_hash)
       *                     VALUES (${email}, ${username}, ${password_hash})
       *                     RETURNING *;
       *                 `;
       * const createdUser = result[0];
       */

      if (!createdUser || !createdUser.id || !createdUser.username)  {
        throw new Error('User creation failed');
      }

      const profile: ProfileDTO = {
        id: createdUser.id,
        displayName: createdUser.username,
      }

      console.log('Creating defaults');
      await profileService.createProfile(profile);
      await PermissionsService.createDefaultPermissions(createdUser.id);
      console.log('Created defaults');

      const userDTO: UserDTO = {
        id: createdUser.id,
        email: createdUser.email,
        username: createdUser.username,
        created_at: createdUser.created_at,
        first_name: createdUser.first_name,
        last_name: createdUser.last_name,
        phone_ext: createdUser.phone_ext,
        phone_number: createdUser.phone_number,
        birthday: createdUser.birthday,
      }

      return userDTO;

    } catch (error: any) {
      const code = error.code;
      switch(code) {
        case '23505': {
          console.error('User already exists:', error.detail);
          throw new Error('User already exists with this email or username.');
        }
        default: {
          console.error('Error creating user:', error);
          throw new Error('User creation failed');
        }
      }
  }
  }

  /**
   * Finds a user by their ID.
   * @param {number} id - The ID of the user to find.
   * @returns {Promise<User | null>} - The user if found, otherwise null.
   */
  async findById(id: number): Promise<User | null> {
    try {
      const result = await database<User[]>`
        SELECT * FROM users WHERE id = ${id};
      `;
      return result[0] || null;
    } catch (error) {
      console.error("UserService: Error finding user:", error);
      throw error;
    }
  }

  async getUsername(id: number) {
    try {
      const result = await database`
        SELECT username FROM users WHERE id = ${id};
      `
      if(!result || result.length === 0) {
        console.error(`User with id ${id} does not exist`);
        return;
      }

      return result[0];
    } catch (error) {
      console.error("UserService: Error finding user:", error);
      throw error;
    }
  }

  /**
   * Retrieves all users from the database.
   * @returns {Promise<User[]>} - A list of users.
   */
  async findAll(): Promise<User[]> {
    return await userRepository.findAll();
  }

  /**
   * Updates an existing user by ID.
   *
   * TODO: make this safe
   * TODO: can postgres do partial updates?
   *
   * @param {number} id - The ID of the user to update.
   * @param {Partial<User>} user - The fields to update.
   * @returns {Promise<User | null>} - The updated user if successful, otherwise null.
   * @throws {Error} - If no fields are provided for update.
   */
  async update(id: number, user: Partial<User>): Promise<User | null> {
    console.log("In the service: " + JSON.stringify(user))
    const updatedUser: User | null = await userRepository.update(id, user);

    if(!updatedUser) {
      throw new Error(`User with id ${id} not found or update failed.`)
    }

    return updatedUser;
  }

  /**
   * Deletes a user by ID.
   * @param {number} id - The ID of the user to delete.
   * @returns {Promise<boolean>} - True if the user was deleted, false otherwise.
   */
  async deleteById(id: number): Promise<boolean> {
    try {
      return await userRepository.deleteById(id);
    } catch (error) {
      throw new Error((error as Error).message)
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await userRepository.findByEmail(email);''
  }

  async getFields(userId: number, fields: Record<string, boolean>) {
    // Extract field names from the input object
    const fieldNames = Object.keys(fields);
    debugMode.log("Fields: " + JSON.stringify(fieldNames));

    // Define disallowed fields
    const disallowedFields = ['password_hash', 'id'];

    // Validate field names to prevent SQL injection and apply permission checks
    const validateAndFilterFields = (name: string) => {
      // Check for disallowed fields
      if (disallowedFields.includes(name)) {
        return null;
      }

      // Validate field name format
      const validPattern = /^[a-zA-Z0-9_]+$/;
      if (!validPattern.test(name)) {
        throw new Error(`Invalid field name: ${name}`);
      }

      return name;
    };

    // Safely prepare column names
    const safeColumns = fieldNames
        .map(validateAndFilterFields)
        .filter(field => field !== null);

    // If no fields remain after filtering
    if (safeColumns.length === 0) {
      debugMode.log("No safe fields")
      return null;
    }

    // Convert array of columns to a comma-separated list for the SQL query
    const columnsStr = safeColumns.join(', ');

    // Build and execute the query using the database instance
    const query = database`
      SELECT ${database.unsafe(columnsStr)}
      FROM users
      WHERE id = ${userId}
    `;

    try {
      const result = await query;
      return result[0] || null;
    } catch(error) {
      throw error;
    }
  }

  async updateFields(userId: number, fields: Record<string, any>) {
    const disallowedFields = ['password_hash', 'email', 'id'];

    const safeEntries = Object.entries(fields).filter(
        ([key]) => !disallowedFields.includes(key)
    );

    if (safeEntries.length === 0) {
      throw new Error('No valid fields to update');
    }

    const safeFields = Object.fromEntries(safeEntries);
    const query = database`
        UPDATE users SET ${database(safeFields)} WHERE id = ${userId}
    `;

    const result = await query;
    return result[0] || null;
  }


  async setFirstName(userId: number, name: string) {
    await database`UPDATE users SET first_name = ${name} WHERE id = ${userId}`;
  }

  async setLastName(userId: number, name: string) {
    await database`UPDATE users SET last_name = ${name} WHERE id = ${userId}`;
  }

  async setPhoneExt(userId: number, ext: number) {
    await database`UPDATE users SET phone_ext = ${ext} WHERE id = ${userId}`;
  }

  async setPhoneNumber(userId: number, num: string) {
    await database`UPDATE users SET phone_number = ${num} WHERE id = ${userId}`;
  }

  async setBirthday(userId: number, birthday: Date) {
    await database`UPDATE users SET birthday = ${birthday} WHERE id = ${userId}`;
  }

  async setPassword(userId: number, passwordHash: string) {
    await database`UPDATE users SET password_hash = ${passwordHash} WHERE id = ${userId}`;
  }

  async getFirstName(userId: number): Promise<string> {
    const [user] = await database`SELECT first_name FROM users WHERE id = ${userId}`;
    return user?.first_name ?? 'Not Specified';
  }

  async getLastName(userId: number): Promise<string> {
    const [user] = await database`SELECT last_name FROM users WHERE id = ${userId}`;
    return user?.last_name ?? 'Not Specified';
  }

  async getPhoneExt(userId: number): Promise<number> {
    const [user] = await database`SELECT phone_ext FROM users WHERE id = ${userId}`;
    return user?.phone_ext ?? 0;
  }

  async getPhoneNumber(userId: number): Promise<string> {
    const [user] = await database`SELECT phone_number FROM users WHERE id = ${userId}`;
    return user?.phone_number ?? 'Not Specified';
  }

  async getBirthday(userId: number): Promise<Date | null> {
    const [user] = await database`SELECT birthday FROM users WHERE id = ${userId}`;
    return user?.birthday ?? null;
  }

  async getPassword(userId: number): Promise<string> {
    const [user] = await database`SELECT password_hash FROM users WHERE id = ${userId}`;
    return user?.password_hash;
  }

}

// Export an instance of UserService for reuse
export const userService = new UserService();
