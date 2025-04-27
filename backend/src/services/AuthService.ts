import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { userService } from './UserService.js';
import { verifyPassword } from '../utils/PasswordUtils.js';
import {UserDTO} from "../models/UserModel.js";

class AuthService {
    /**
     * Registers a new user using the existing UserController's createUser method.
     * @param {string} email - User email.
     * @param {string} password - User plain text password.
     * @returns {Promise<{ accessToken: string, refreshToken: string }>} - Generated tokens.
     */
    async registerUser(email: string, password: string) {
        try {
            const user: UserDTO = await userService.createUser(email, password);
            if (!user) throw new Error('User creation failed');

            const accessToken = generateAccessToken({ id: user.id, email: user.email });
            const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

            return { accessToken, refreshToken };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * Logs in a user using the UserService and returns tokens.
     * @param {string} email - User email.
     * @param {string} password - User plain text password.
     * @returns {Promise<{ accessToken: string, refreshToken: string }>} - Generated tokens.
     */
    async loginUser(email: string, password: string) {
        try {
            // Find the user by email
            const user = await userService.findByEmail(email);
            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Verify the password
            const isMatch = await verifyPassword(password, user.password_hash);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }

            // Generate tokens
            const accessToken = generateAccessToken({ id: user.id, email: user.email });
            const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

            return { accessToken, refreshToken };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export const authService = new AuthService();
