import { Request, Response } from 'express';
import { authService } from '../services/AuthService.js';

/**
 * Handles user registration.
 */
export async function registerController(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
        const { accessToken, refreshToken } = await authService.registerUser(email, password);
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
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
            sameSite: 'none'
        });
        res.status(200).json({ accessToken });
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
}
