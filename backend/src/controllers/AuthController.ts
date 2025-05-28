import { Request, Response } from 'express';
import { authService } from '../services/AuthService.js';
import { generateAccessToken, verifyToken } from '../utils/jwt.js';
import { DecodedToken } from '../utils/authenticate.js';
import {userService} from '../services/UserService.js';
import {hashPassword, verifyPassword} from '../utils/PasswordUtils.js';
import blacklistService from '../services/BlacklistService.js';

/**
 * Handles user registration.
 * @param {Request} req - Express request object containing username, email, and password.
 * @param {Response} res - Express response object for returning access token and setting refresh cookie.
 */
export async function registerController(req: Request, res: Response) {
    const { username, email, password } = req.body;

    try {
        const { accessToken, refreshToken } = await authService.registerUser(username, email, password);
        const sevenDays: number = 7 * 24 * 60 * 60 * 1000;
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: sevenDays,
        });
        res.status(201).json({ accessToken });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

/**
 * Handles user login.
 * @param {Request} req - Express request object with login credentials.
 * @param {Response} res - Express response object returning access token and setting refresh cookie.
 */
export async function loginController(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
        const { accessToken, refreshToken } = await authService.loginUser(email, password);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            path: '/',
        });
        res.status(200).json({ accessToken });
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
}

class AuthController {
    /**
     * Checks if the user is authenticated by verifying the access or refresh token.
     * If access token is valid, returns basic user info.
     * If only refresh token is valid, issues a new access token.
     * @param {Request} req - Express request object with auth headers and cookies.
     * @param {Response} res - Express response object returning user info and new access token if applicable.
     * @returns {Promise<Response>} JSON response with user ID, email, and optionally new access token.
     */
    async check(req: Request, res: Response): Promise<Response> {
        const authHeader = req.headers.authorization;
        const accessToken = authHeader?.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : null;
        const refreshToken = req.cookies?.refreshToken;
        const decodedAccess: DecodedToken | null = accessToken ? verifyToken(accessToken) as DecodedToken | null : null;

        if (decodedAccess) {
            return res.status(200).json({
                id: decodedAccess.id,
                email: decodedAccess.email,
            });
        }

        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token available' });
        }

        const decodedRefresh = verifyToken(refreshToken) as DecodedToken | null;

        if (!decodedRefresh) {
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }

        const newAccessToken = generateAccessToken({
            id: decodedRefresh.id,
            email: decodedRefresh.email,
        });

        return res.status(200).json({
            id: decodedRefresh.id,
            email: decodedRefresh.email,
            accessToken: newAccessToken,
        });
    }

    /**
     * Logs out the user by clearing the refresh token cookie.
     * @param {Request} req - Express request object.
     * @param {Response} res - Express response object sending 204 No Content.
     * @returns {Promise<Response>} No content response.
     */
    async logout(req: Request, res: Response): Promise<Response> {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        });

        return res.status(204).send();
    }

    /**
     * Refreshes the access token using the user context retrieved from the refresh token.
     * @param {Request} req - Express request object.
     * @param {Response} res - Express response object returning a new access token.
     * @returns {Promise<Response>} JSON response with new access token.
     */
    async refresh(req: Request, res: Response): Promise<Response> {
        const user = await authService.fromRequest(req, res);
        const accessToken = generateAccessToken({ id: user.id, email: user.email });

        return res.status(200).json({ accessToken });
    }



}

export default new AuthController();
