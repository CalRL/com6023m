import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { userService } from './UserService';
import { verifyPassword } from '../utils/PasswordUtils';

/**
 * Registers a new user using the existing UserController's createUser method.
 * @param {string} email - User email.
 * @param {string} password - User plain text password.
 * @returns {Promise<{ accessToken: string, refreshToken: string }>} - Generated tokens.
 */
export async function registerUser(email: string, password: string) {
    try {
        // Use the existing createUser function from UserController
        const user = await userService.createUser(email, password);
        if (!user) throw new Error('User creation failed');

        // Generate tokens
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
export async function loginUser(email: string, password: string) {
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
