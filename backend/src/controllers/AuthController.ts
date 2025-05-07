import { Request, Response } from 'express';
import { authService } from '../services/AuthService.js';
import {generateAccessToken, verifyToken} from "../utils/jwt.js";
import authMiddleware from "../middleware/AuthMiddleware.js";
import {DecodedToken} from "../utils/authenticate.js";

/**
 * Handles user registration.
 */
export async function registerController(req: Request, res: Response) {
    const { username, email, password } = req.body;

    try {
        const { accessToken, refreshToken } = await authService.registerUser(username, email, password);
        const sevenDays: number = 7 * 24 * 60 * 60 * 1000;
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: sevenDays,
        });
        res.status(201).json({ accessToken });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

/**
 * Handles user login.
 */
export async function loginController(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
        const { accessToken, refreshToken } = await authService.loginUser(email, password);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            path: "/",
        });
        res.status(200).json({ accessToken });
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
}

class AuthController {

    async check(req: Request, res: Response) {
        const authHeader = req.headers.authorization;
        const accessToken = authHeader?.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : null;
        const refreshToken = req.cookies?.refreshToken;
        const decodedAccess: DecodedToken | null = accessToken ? verifyToken(accessToken) as DecodedToken | null : null;

        if(decodedAccess) {
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

    async logout(req: Request, res: Response) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        });

        return res.status(204).send();
    }
    async refresh(req: Request, res: Response) {
        const refreshToken = null;
        const user = await authService.fromRequest(req, res);
        const accessToken = generateAccessToken({ id: user.id, email: user.email });
    }
}

export default new AuthController();
