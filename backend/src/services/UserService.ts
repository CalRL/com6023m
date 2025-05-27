import database from '../config/database.js';
import {User, UserDTO} from '../models/UserModel.js';
import {profileService} from './ProfileService.js';
import PermissionsService from './PermissionsService.js';
import {hashPassword} from '../utils/PasswordUtils.js';
import {ProfileDTO} from '../models/ProfileModel.js';
import {debugMode} from '../utils/DebugMode.js';

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
    const password_hash = await hashPassword(password);

    const user = {
        email: email,
        username: username,
        password_hash: password_hash
    };

    const result = await database`
                  INSERT INTO users (email, username, password_hash)
                  VALUES (${email}, ${username}, ${password_hash})
                  RETURNING *;
              `;
    if(!result || result[0] == null) {
      throw new Error('User creation failed');
    }

    const createdUser = result[0] as UserDTO;

    if (!createdUser || !createdUser.id || !createdUser.username)  {
      throw new Error('User creation failed');
    }

    const profile: ProfileDTO = {
      id: createdUser.id,
      displayName: createdUser.username,
    };

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
    };

    return userDTO;
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
      console.error('UserService: Error finding user:', error);
      throw error;
    }
  }

  async getUsername(id: number) {
    try {
      const result = await database`
        SELECT username FROM users WHERE id = ${id};
      `;
      if(!result || result.length === 0) {
        console.error(`User with id ${id} does not exist`);
        return;
      }

      return result[0];
    } catch (error) {
      console.error('UserService: Error finding user:', error);
      throw error;
    }
  }

  /**
   * Retrieves all users from the database.
   * @returns {Promise<User[]>} - A list of users.
   */
  async findAll(): Promise<UserDTO[]> {
    return await database<UserDTO[]>`
          SELECT * FROM users;
        `;
  }

  /**
   * Updates an existing user by ID.
   *
   * TODO: make this safe
   * TODO: can postgres do partial updates?
   *
   * @param {number} id - The ID of the user to update.
   * @param {Partial<User>} userDTO - The fields to update.
   * @returns {Promise<UserDTO | null>} - The updated user if successful, otherwise null.
   * @throws {Error} - If no fields are provided for update.
   */
  async update(id: number, userDTO: UserDTO): Promise<UserDTO> {
    const [existingUser] = await database`
      SELECT * FROM users WHERE id = ${id}
    `;


    if (!existingUser) {
      throw new Error(`User with id ${id} not found`);
    }

    const updatedUser = {
      ...existingUser,
      ...userDTO,
    };

    const result = await database`
    UPDATE users
    SET
      first_name = ${updatedUser.first_name ?? null},
      last_name = ${updatedUser.last_name ?? null},
      email = ${updatedUser.email ?? null},
      phone_ext = ${updatedUser.phone_ext ?? null},
      phone_number = ${updatedUser.phone_number ?? null},
      birthday = ${updatedUser.birthday ?? null}
    WHERE id = ${id}
    RETURNING *
  `;

    return result[0] as UserDTO || null;
  }

  /**
   * Deletes a user by ID.
   * @param {number} id - The ID of the user to delete.
   * @returns {Promise<boolean>} - True if the user was deleted, false otherwise.
   */
  async deleteById(id: number): Promise<boolean> {
    try {
      const result = await database`
          DELETE FROM users WHERE id = ${id};
        `;
      return result.count > 0;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async findByEmail(email: string): Promise<UserDTO | undefined> {
    try {
      const result = await database<UserDTO[]>`
              SELECT * FROM users WHERE email = ${email}
            `;
      return result[0] as UserDTO || null;
    } catch (error) {
      console.error('UserRepository: Error finding user:', error);
    }
  }

  async getFields(userId: number, fields: Record<string, boolean>) {
    // Extract field names from the input object
    const fieldNames = Object.keys(fields);
    debugMode.log('Fields: ' + JSON.stringify(fieldNames));

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
      debugMode.log('No safe fields');
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

      const result = await query;
      return result[0] || null;
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



}

// Export an instance of UserService for reuse
export const userService = new UserService();
