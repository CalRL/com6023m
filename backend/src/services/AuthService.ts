import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { userService } from './UserService.js';
import { verifyPassword } from '../utils/PasswordUtils.js';
import {UserDTO} from "../models/UserModel.js";
import permissionsService from "./PermissionsService.js";
import { Request, Response } from 'express';
import {ErrorMessages} from "../utils/errors.js";
import {authenticateToken} from "../utils/authenticate.js";
import {isDecodedToken, WithUser} from "../middleware/AuthMiddleware.js";
import {Permissions} from "../User/Permissions.js";

class AuthService {
    /**
     * Registers a new user using the existing UserController's createUser method.
     * @param {string} email - User email.
     * @param {string} password - User plain text password.
     * @returns {Promise<{ accessToken: string, refreshToken: string }>} - Generated tokens.
     */
    async registerUser(username: string, email: string, password: string) {
        try {
            const user: UserDTO = await userService.createUser(username, email, password);
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

    //todo: add res.status()
    async fromRequest(req: Request, res: Response): Promise<UserDTO> {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        if(!token) {
            res.status(401).json({ message: `Forbidden: ${ErrorMessages.NO_TOKEN}` });
            console.error('AuthMiddleware: No token provided');
            throw new Error(`Forbidden: ${ErrorMessages.NO_TOKEN}`);
        }

        const decoded = authenticateToken(token);

        if (!isDecodedToken(decoded)) {
            console.error('Invalid or expired token structure');
            throw new Error(`Forbidden: ${ErrorMessages.INVALID_TOKEN}`);
        }

        const user: UserDTO = (req as WithUser).user = {
            id: parseInt(decoded.id)
        }

        console.log('From token: ', JSON.stringify(user));

        return user;
    }

    async getTokenType() {}

    async fromAccessToken(req: Request): Promise<UserDTO> {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        if (!token) {
            console.error('No access token provided');
            throw new Error(`Forbidden: ${ErrorMessages.NO_TOKEN}`);
        }

        const decoded = authenticateToken(token);

        if (!isDecodedToken(decoded)) {
            console.error('Invalid or expired access token');
            throw new Error(`Forbidden: ${ErrorMessages.INVALID_TOKEN}`);
        }

        return {
            id: parseInt(decoded.id),
        };
    }


    /**
     * Ensures the request attached has the provided permission.
     * @param req
     * @param res
     * @param permission
     */
    async ensurePermission(req: Request, res: Response, permission: Permissions) {

        const user = await this.fromRequest(req, res);

        if (!user || typeof user.id !== 'number') {
            console.error("AuthMiddleware: User ID is undefined or invalid.");
            res.status(500).json({ error: 'User not authenticated properly.' });
            return false;
        }

        const hasPermission = await permissionsService.hasPermission(user.id, permission);

        if (!hasPermission) {
            res.status(403).json({ error: 'Forbidden' });
            return false;
        }

        return true;
    }

}

export const authService = new AuthService();
