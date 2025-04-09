import { Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../utils/authenticate';
import {UserDTO} from "../models/UserModel.js";

/**
 * Express middleware to authenticate a token from the request.
 */
export function tokenMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        // console.log('Token middleware triggered');  // Check if middleware is triggered

        // Extract token from Authorization header or cookies
        const authHeader = req.headers.authorization;
        // console.log('Authorization Header:', authHeader);  // Log the auth header
        const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.cookies?.refreshToken;
        // console.log('Extracted Token:', token);  // Log the extracted token

        if (!token) {
            console.error('No token provided');
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        // Verify and decode the token using the utility function
        const decoded = authenticateToken(token);
        // console.log('Decoded Token:', decoded);  // Log the decoded token
        if (!decoded) {
            console.error('Invalid or expired token');
            return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
        };

        console.log('User attached to request:', req.user.email);  // Confirm user attachment
        next();
    } catch (error) {
        console.error('Token middleware error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function fromToken(req: Request): Promise<UserDTO | null> {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.cookies?.refreshToken;

    if(!token) {
        console.error('No token provided');
        return null;
    }

    const decoded = authenticateToken(token);

    if(!decoded) {
        console.error('Invalid or expired token');
        return null;
    }

    const user = req.user = {
        id: decoded.id
    }

    return user

}


