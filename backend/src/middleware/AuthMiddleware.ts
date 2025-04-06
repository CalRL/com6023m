import { Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../utils/authenticate';

/**
 * Express middleware to authenticate a token from the request.
 */
export function tokenMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1] || req.cookies?.refreshToken;

    if (!authenticateToken(token)) {
        return res.status(401).json({ message: 'Invalid or missing token' });
    }

    next();
}
