import database from '../config/database';
import { User, UserDTO } from '../models/UserModel.js';
import { defaultPermissions } from "../User/Permissions";
import { profileService } from "./ProfileService";
import PermissionsService from "./PermissionsService";
import {usernameFromEmail} from "../utils/UserUtils";
import {hashPassword} from "../utils/PasswordUtils.js";
import { userRepository } from "../repository/UserRepository.js";

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
   * @param {string} password - The password of the user.
   * @returns {Promise<User>} - The newly created user.
   * @throws {Error} - If the user creation fails.
   */
  async createUser(email: string, password: string): Promise<User> {
    try {
      /**
       * todo: find a better way to do this
       * maybe null this and have a secondary page to create username? or all in the same form?
       */
      const username = await usernameFromEmail(email);
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
    return await userRepository.findById(id);
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
      throw new Error(error)
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return await userRepository.findByEmail(email);
  }


}

// Export an instance of UserService for reuse
export const userService = new UserService();
