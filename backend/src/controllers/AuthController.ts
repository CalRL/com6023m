import { Request, Response } from 'express';
import { loginUser, registerUser } from '../services/AuthService';

/**
 * Handles user registration.
 */
export async function registerController(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
        // Directly call the AuthService for registration
        const { accessToken, refreshToken } = await registerUser(email, password);
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
        // Directly call the AuthService for login
        const { accessToken, refreshToken } = await loginUser(email, password);
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
        res.status(200).json({ accessToken });
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
}
